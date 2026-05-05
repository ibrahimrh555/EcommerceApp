import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

/*
  Cette page charge dynamiquement Stripe.js depuis le CDN Stripe officiel.
  Elle gère :
    1. Création du PaymentIntent (clientSecret) via /api/payment/create-intent
    2. Affichage du formulaire Stripe Elements
    3. Confirmation du paiement et redirection
*/

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51TTXPPFtlS5uJXJz71lsRiBkar7K9G3N2NQPFF9VNTPAF9X5BRXse50VdpMvDFzb3kzghr7IyncVdKJQwyBDlOwB00fJ674BKR';

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const cardRef = useRef(null);
  const cardElement = useRef(null);

  // 1. Charger Stripe.js dynamiquement
  useEffect(() => {
    if (window.Stripe) { setStripeLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = () => setStripeLoaded(true);
    document.head.appendChild(script);
  }, []);

  // 2. Charger la commande + créer le PaymentIntent
  useEffect(() => {
    const init = async () => {
      try {
        const { data: orderData } = await axios.get(`/api/orders/${orderId}`);
        setOrder(orderData);

        if (orderData.isPaid) {
          toast.success('Cette commande est déjà payée !');
          navigate(`/orders/${orderId}`);
          return;
        }

        if (orderData.paymentMethod !== 'Stripe') {
          navigate(`/orders/${orderId}`);
          return;
        }

        const { data } = await axios.post('/api/payment/create-intent', { orderId });
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [orderId]);

  // 3. Monter Stripe Elements une fois que tout est prêt
  useEffect(() => {
    if (!stripeLoaded || !clientSecret || !cardRef.current) return;
    if (!window.Stripe || STRIPE_PUBLISHABLE_KEY.includes('VOTRE_CLE')) {
      setError('Clé Stripe non configurée. Voir les instructions ci-dessous.');
      return;
    }

    const stripeInstance = window.Stripe(STRIPE_PUBLISHABLE_KEY);
    const elementsInstance = stripeInstance.elements();

    const card = elementsInstance.create('card', {
      style: {
        base: {
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '16px',
          '::placeholder': { color: 'rgba(255,255,255,0.3)' },
        },
        invalid: { color: '#ff6b6b' },
      },
    });

    card.mount(cardRef.current);
    cardElement.current = card;
    setStripe(stripeInstance);
    setElements(elementsInstance);

    card.on('change', ({ error }) => {
      setError(error ? error.message : '');
    });

    return () => card.unmount();
  }, [stripeLoaded, clientSecret]);

  // 4. Confirmer le paiement
  const handlePay = async () => {
    if (!stripe || !cardElement.current) return;
    setPaying(true);
    setError('');

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement.current },
      });

      if (stripeError) {
        setError(stripeError.message);
        setPaying(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirmer côté backend
        await axios.post(`/api/payment/confirm/${orderId}`, {
          paymentIntentId: paymentIntent.id,
        });
        toast.success('Paiement réussi ! 🎉');
        navigate(`/orders/${orderId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return (
    <div style={s.page}>
      <div style={s.center}>
        <div style={s.spinner}></div>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '1rem' }}>Préparation du paiement...</p>
      </div>
    </div>
  );

  const needsConfig = STRIPE_PUBLISHABLE_KEY.includes('VOTRE_CLE');

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Header */}
        <div style={s.header}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>← Retour</button>
          <div>
            <h1 style={s.title}>Paiement sécurisé</h1>
            <p style={s.sub}>Commande #{orderId?.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        <div style={s.layout}>
          {/* LEFT: Payment form */}
          <div style={s.formSection}>

            {/* Config warning */}
            {needsConfig && (
              <div style={s.configWarning}>
                <h3 style={s.warnTitle}>⚙️ Configuration Stripe requise</h3>
                <p style={s.warnText}>Pour activer les paiements réels :</p>
                <ol style={s.warnList}>
                  <li>Créer un compte sur <strong>stripe.com</strong></li>
                  <li>Récupérer vos clés API dans le dashboard</li>
                  <li>Dans <code style={s.code}>frontend/src/pages/Payment.jsx</code> ligne 17 :<br />
                    <code style={s.code}>const STRIPE_PUBLISHABLE_KEY = 'pk_test_...'</code>
                  </li>
                  <li>Dans <code style={s.code}>backend/.env</code> :<br />
                    <code style={s.code}>STRIPE_SECRET_KEY=sk_test_...</code>
                  </li>
                  <li>Installer Stripe backend : <code style={s.code}>npm install stripe</code></li>
                </ol>
                <p style={{ ...s.warnText, marginTop: '0.75rem' }}>
                  🧪 En mode test, utilisez la carte : <strong style={{ color: '#FFD700' }}>4242 4242 4242 4242</strong>
                </p>
              </div>
            )}

            {/* Stripe Card Element */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <h2 style={s.cardTitle}>💳 Informations de paiement</h2>
                <div style={s.stripeBadge}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Sécurisé par</span>
                  <svg width="40" height="16" viewBox="0 0 60 25"><text x="0" y="19" fontFamily="Arial" fontWeight="800" fontSize="20" fill="rgba(255,255,255,0.4)">stripe</text></svg>
                </div>
              </div>

              <div style={s.cardElementWrap}>
                <label style={s.label}>Numéro de carte</label>
                <div ref={cardRef} style={s.stripeInput}></div>
              </div>

              {error && <div style={s.errorBox}>⚠ {error}</div>}

              <button
                onClick={handlePay}
                disabled={paying || needsConfig || !stripe}
                style={{ ...s.payBtn, ...(paying || needsConfig || !stripe ? s.payBtnDisabled : {}) }}
              >
                {paying ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                    <span style={s.smallSpinner}></span> Traitement en cours...
                  </span>
                ) : (
                  `🔒 Payer ${order?.totalPrice?.toFixed(2)} €`
                )}
              </button>
            </div>

            {/* Security info */}
            <div style={s.secInfo}>
              <div style={s.secItem}><span>🔒</span><span>Chiffrement SSL 256-bit</span></div>
              <div style={s.secItem}><span>🛡</span><span>Authentification 3D Secure</span></div>
              <div style={s.secItem}><span>✓</span><span>Données jamais stockées</span></div>
            </div>
          </div>

          {/* RIGHT: Order summary */}
          {order && (
            <div style={s.summary}>
              <h2 style={s.summaryTitle}>Votre commande</h2>

              {order.items?.map((item, i) => (
                <div key={i} style={s.summaryItem}>
                  <img src={item.image} alt={item.name} style={s.summaryImg} />
                  <div style={{ flex: 1 }}>
                    <p style={s.itemName}>{item.name}</p>
                    <p style={s.itemQty}>× {item.quantity}</p>
                  </div>
                  <span style={s.itemPrice}>{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}

              <div style={s.divider}></div>

              <div style={s.summaryRow}><span>Sous-total</span><span>{order.itemsPrice?.toFixed(2)} €</span></div>
              <div style={s.summaryRow}>
                <span>Livraison</span>
                <span style={{ color: order.shippingPrice === 0 ? '#4CAF50' : '#fff' }}>
                  {order.shippingPrice === 0 ? 'Gratuite' : `${order.shippingPrice?.toFixed(2)} €`}
                </span>
              </div>

              <div style={s.divider}></div>

              <div style={{ ...s.summaryRow, ...s.totalRow }}>
                <span>Total à payer</span>
                <span>{order.totalPrice?.toFixed(2)} €</span>
              </div>

              <div style={s.addressBox}>
                <p style={s.addressLabel}>Livraison à</p>
                <p style={s.addressText}>{order.shippingAddress?.street}</p>
                <p style={s.addressText}>{order.shippingAddress?.postalCode} {order.shippingAddress?.city}</p>
                <p style={s.addressText}>{order.shippingAddress?.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#09090f', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' },
  spinner: { width: '40px', height: '40px', border: '3px solid rgba(255,215,0,0.2)', borderTop: '3px solid #FFD700', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' },
  header: { display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2.5rem' },
  backBtn: { background: 'none', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap', marginTop: '4px' },
  title: { fontSize: '1.8rem', fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '0.3rem' },
  sub: { color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' },
  formSection: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },

  // Config warning
  configWarning: { background: 'rgba(255,152,0,0.08)', border: '1px solid rgba(255,152,0,0.3)', borderRadius: '12px', padding: '1.5rem' },
  warnTitle: { color: '#FF9800', fontSize: '1rem', marginBottom: '0.75rem' },
  warnText: { color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginBottom: '0.5rem' },
  warnList: { color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 2, paddingLeft: '1.25rem' },
  code: { background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace', color: '#FFD700' },

  // Card form
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '2rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 700 },
  stripeBadge: { display: 'flex', alignItems: 'center', gap: '6px' },
  cardElementWrap: { marginBottom: '1.5rem' },
  label: { display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginBottom: '8px', letterSpacing: '0.04em' },
  stripeInput: { padding: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', minHeight: '48px' },
  errorBox: { background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', color: '#ff6b6b', padding: '12px', borderRadius: '8px', fontSize: '0.87rem', marginBottom: '1rem' },
  payBtn: { width: '100%', padding: '15px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '1.05rem', letterSpacing: '0.02em' },
  payBtnDisabled: { background: 'rgba(255,215,0,0.3)', cursor: 'not-allowed', color: 'rgba(0,0,0,0.4)' },
  smallSpinner: { display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(0,0,0,0.3)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 0.7s linear infinite' },

  // Security info
  secInfo: { display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' },
  secItem: { display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' },

  // Summary
  summary: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.75rem', position: 'sticky', top: '80px' },
  summaryTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'rgba(255,255,255,0.8)' },
  summaryItem: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.9rem' },
  summaryImg: { width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px' },
  itemName: { fontWeight: 600, fontSize: '0.87rem', marginBottom: '2px' },
  itemQty: { color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' },
  itemPrice: { color: '#FFD700', fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '1rem 0' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', marginBottom: '0.5rem' },
  totalRow: { color: '#FFD700', fontSize: '1.1rem', fontWeight: 800, marginTop: '0.25rem' },
  addressBox: { marginTop: '1.25rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' },
  addressLabel: { color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  addressText: { color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6 },
};