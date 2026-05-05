const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');

// Stripe est initialisé dynamiquement pour éviter une erreur si la clé est absente
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('VOTRE_CLE')) {
    throw new Error('STRIPE_SECRET_KEY non configurée dans .env');
  }
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
};

// ─────────────────────────────────────────────────────────────
// POST /api/payment/create-intent
// Crée un PaymentIntent Stripe et retourne le client_secret
// ─────────────────────────────────────────────────────────────
router.post('/create-intent', protect, async (req, res) => {
  try {
    const stripe = getStripe();
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    if (order.isPaid) {
      return res.status(400).json({ message: 'Commande déjà payée' });
    }

    const amountInCents = Math.round(order.totalPrice * 100); // Stripe travaille en centimes

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amountInCents,
    });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/payment/confirm/:orderId
// Appelé après paiement réussi côté frontend pour marquer l'ordre payé
// ─────────────────────────────────────────────────────────────
router.post('/confirm/:orderId', protect, async (req, res) => {
  try {
    const stripe = getStripe();
    const { paymentIntentId } = req.body;

    // Vérifier le statut réel du PaymentIntent auprès de Stripe
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Paiement non confirmé par Stripe' });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = 'Stripe';
    order.paymentResult = {
      id: intent.id,
      status: intent.status,
      update_time: new Date().toISOString(),
      email_address: intent.receipt_email || '',
    };
    order.status = 'processing';

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    console.error('Confirm error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/payment/webhook
// Webhook Stripe (écoute les événements côté serveur)
// ─────────────────────────────────────────────────────────────
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).json({ message: `Webhook error: ${err.message}` });
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      const orderId = intent.metadata?.orderId;
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          paidAt: Date.now(),
          paymentMethod: 'Stripe',
          status: 'processing',
          paymentResult: { id: intent.id, status: intent.status },
        });
        console.log(`✅ Order ${orderId} marked as paid via webhook`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;