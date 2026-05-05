import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaMoneyCheckAlt,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
} from 'react-icons/fa';


const STEPS = ['Panier', 'Livraison', 'Paiement'];

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=cart 1=shipping 2=payment
  const [shipping, setShipping] = useState({ street: '', city: '', postalCode: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' | 'cod'
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [placing, setPlacing] = useState(false);

  const shippingCost = totalPrice > 100 ? 0 : 10;
  const grandTotal = totalPrice + shippingCost;

  const handleCheckout = () => {
    if (!user) { toast.error('Connectez-vous pour passer commande'); navigate('/login'); return; }
    setStep(1);
  };

  const CARD_ICONS = {
    'VISA': FaCcVisa,
    'MC': FaCcMastercard,
    'AMEX': FaCcAmex,
  };

  const handleShippingNext = () => {
    const { street, city, postalCode, country } = shipping;
    if (!street || !city || !postalCode || !country) {
      toast.error('Remplissez tous les champs de livraison');
      return;
    }
    setStep(2);
  };

  // Créer la commande en base PUIS rediriger vers la page de paiement
  const handleGoToPayment = async () => {
    setPlacing(true);
    try {
      const items = cart.items.map(i => ({
        product: i.product, name: i.name, image: i.image, price: i.price, quantity: i.quantity,
      }));
      const { data: order } = await axios.post('/api/orders', {
        items, shippingAddress: shipping,
        paymentMethod: paymentMethod === 'stripe' ? 'Stripe' : 'Cash on Delivery',
      });

      if (paymentMethod === 'cod') {
        clearCart();
        toast.success('Commande confirmée ! Paiement à la livraison 🎉');
        navigate(`/orders/${order._id}`);
      } else {
        // Rediriger vers page de paiement Stripe
        clearCart();
        navigate(`/payment/${order._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div style={s.page}>
        <div style={s.emptyCart}>
          <span style={{ fontSize: '5rem' }}><FaShoppingCart size={72} color="#FFD700" /></span>
          <h2 style={s.emptyTitle}>Votre panier est vide</h2>
          <p style={s.emptySub}>Découvrez notre catalogue pour trouver vos produits préférés.</p>
          <Link to="/catalogue" style={s.shopLink}>Commencer mes achats</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        <h1 style={s.title}>Mon Panier <span style={s.count}>({totalItems} article{totalItems > 1 ? 's' : ''})</span></h1>

        {/* Stepper */}
        <div style={s.steps}>
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div style={{ ...s.step, ...(i === step ? s.stepActive : i < step ? s.stepDone : {}) }}>
                <div style={{ ...s.stepNum, ...(i === step ? s.stepNumActive : i < step ? s.stepNumDone : {}) }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={s.stepLabel}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ ...s.stepLine, ...(i < step ? s.stepLineDone : {}) }}></div>}
            </React.Fragment>
          ))}
        </div>

        <div style={s.layout}>
          <div style={s.left}>

            {/* STEP 0 — CART ITEMS */}
            {step === 0 && cart.items.map(item => (
              <div key={item.product} style={s.item}>
                <img src={item.image} alt={item.name} style={s.itemImg} />
                <div style={s.itemInfo}>
                  <p style={s.itemName}>{item.name}</p>
                  <p style={s.itemUnit}>{item.price.toFixed(2)} € / unité</p>
                </div>
                <div style={s.qtyControl}>
                  <button onClick={() => item.quantity > 1 ? updateQty(item.product, item.quantity - 1) : removeFromCart(item.product)} style={s.qtyBtn}>−</button>
                  <span style={s.qtyNum}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.product, Math.min(item.stock || 99, item.quantity + 1))} style={s.qtyBtn}>+</button>
                </div>
                <p style={s.itemTotal}>{(item.price * item.quantity).toFixed(2)} €</p>
                <button onClick={() => removeFromCart(item.product)} style={s.removeBtn}>✕</button>
              </div>
            ))}

            {/* STEP 1 — SHIPPING */}
            {step === 1 && (
              <div style={s.card}>
                <h2 style={s.cardTitle}><FaMapMarkerAlt size={16} color="#FFD700" /> Adresse de livraison</h2>
                <div style={s.formGrid}>
                  {[['street', 'Rue et numéro', 'col-span'], ['city', 'Ville', ''], ['postalCode', 'Code postal', ''], ['country', 'Pays', '']].map(([field, label, span]) => (
                    <div key={field} style={{ ...s.fieldGroup, ...(span === 'col-span' ? { gridColumn: '1 / -1' } : {}) }}>
                      <label style={s.label}>{label}</label>
                      <input
                        type="text"
                        value={shipping[field]}
                        onChange={e => setShipping({ ...shipping, [field]: e.target.value })}
                        style={s.input}
                        placeholder={label}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — PAYMENT METHOD */}
            {step === 2 && (
              <div style={s.card}>
                <h2 style={s.cardTitle}><FaCreditCard size={16} color="#FFD700" /> Mode de paiement</h2>
                <div style={s.methodGrid}>
                  {/* Stripe Card */}
                  <button
                    onClick={() => setPaymentMethod('stripe')}
                    style={{ ...s.methodBtn, ...(paymentMethod === 'stripe' ? s.methodBtnActive : {}) }}
                  >
                    <div style={s.methodIcon}>
                      <svg width="38" height="16" viewBox="0 0 60 25" fill="none">
                        <text x="0" y="19" fontFamily="Arial" fontWeight="800" fontSize="20" fill={paymentMethod === 'stripe' ? '#FFD700' : 'rgba(255,255,255,0.4)'}>stripe</text>
                      </svg>
                    </div>
                    <p style={s.methodName}>Carte bancaire</p>
                    <p style={s.methodSub}>Visa, Mastercard, Amex — sécurisé par Stripe</p>
                    <div style={s.cardLogos}>
                      {['VISA', 'MC', 'AMEX'].map(c => {
                        const IconComponent = CARD_ICONS[c]; // Get the component for this key
                        return (
                          <span 
                            key={c} 
                            style={{ ...s.cardLogo, ...(paymentMethod === 'stripe' ? s.cardLogoActive : {}) }}
                          >
                            <IconComponent size={24} /> 
                          </span>
                        );
                      })}
                    </div>
                    {paymentMethod === 'stripe' && <div style={s.selectedCheck}>✓ Sélectionné</div>}
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    style={{ ...s.methodBtn, ...(paymentMethod === 'cod' ? s.methodBtnActive : {}) }}
                  >
                    <div style={s.methodIcon}><FaMoneyCheckAlt size={32} color= '#FFD700' /></div>
                    <p style={s.methodName}>Paiement à la livraison</p>
                    <p style={s.methodSub}>Payez en espèces à la réception de votre colis</p>
                    {paymentMethod === 'cod' && <div style={s.selectedCheck}>✓ Sélectionné</div>}
                  </button>
                </div>

                {/* Order recap */}
                <div style={s.recap}>
                  <h3 style={s.recapTitle}>Récapitulatif de la commande</h3>
                  {cart.items.map(item => (
                    <div key={item.product} style={s.recapItem}>
                      <img src={item.image} alt={item.name} style={s.recapImg} />
                      <span style={{ flex: 1, fontSize: '0.88rem' }}>{item.name} × {item.quantity}</span>
                      <span style={{ color: '#FFD700', fontWeight: 700, fontSize: '0.88rem' }}>{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                  <div style={s.recapAddr}>
                    <FaMapMarkerAlt style={{ marginRight: 8 }} />
                    {shipping.street}, {shipping.city} {shipping.postalCode}, {shipping.country}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ORDER SUMMARY sidebar */}
          <div style={s.summary}>
            <h2 style={s.summaryTitle}>Résumé</h2>
            <div style={s.summaryRow}><span>Sous-total</span><span>{totalPrice.toFixed(2)} €</span></div>
            <div style={s.summaryRow}>
              <span>Livraison</span>
              <span style={{ color: shippingCost === 0 ? '#4CAF50' : '#fff' }}>
                {shippingCost === 0 ? 'Gratuite ✓' : `${shippingCost.toFixed(2)} €`}
              </span>
            </div>
            {totalPrice <= 100 && (
              <p style={s.freeHint}>+ {(100 - totalPrice).toFixed(2)} € pour la livraison gratuite</p>
            )}
            <div style={s.divider}></div>
            <div style={{ ...s.summaryRow, ...s.totalRow }}>
              <span>Total</span><span>{grandTotal.toFixed(2)} €</span>
            </div>

            {step === 0 && <button onClick={handleCheckout} style={s.checkoutBtn}>Commander →</button>}
            {step === 1 && (
              <>
                <button onClick={handleShippingNext} style={s.checkoutBtn}>Continuer →</button>
                <button onClick={() => setStep(0)} style={s.backBtn}>← Retour</button>
              </>
            )}
            {step === 2 && (
              <>
                <button onClick={handleGoToPayment} disabled={placing} style={s.checkoutBtn}>
                  {placing ? (
                    'Traitement...'
                  ) : paymentMethod === 'stripe' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <FaCreditCard /> Payer maintenant
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <FaCheckCircle /> Confirmer la commande
                    </span>
                  )}
                </button>
                <button onClick={() => setStep(1)} style={s.backBtn}>← Modifier livraison</button>
              </>
            )}

            {/* Security badges */}
            <div style={s.securityRow}>
              <span style={s.secBadge}><FaLock style={{ marginRight: 6 }} />SSL</span>
              <span style={s.secBadge}><FaCheckCircle style={{ marginRight: 6 }} />Stripe Secure</span>
              <span style={s.secBadge}><FaShieldAlt style={{ marginRight: 6 }} />3D Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#09090f', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' },
  emptyCart: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '1rem', textAlign: 'center' },
  emptyTitle: { fontSize: '1.8rem', fontFamily: '"Playfair Display", Georgia, serif' },
  emptySub: { color: 'rgba(255,255,255,0.5)' },
  shopLink: { padding: '12px 28px', background: '#FFD700', color: '#000', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem' },
  title: { fontSize: '1.8rem', fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '2rem' },
  count: { fontSize: '1rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'system-ui, sans-serif', fontWeight: 400 },

  // Stepper
  steps: { display: 'flex', alignItems: 'center', marginBottom: '2.5rem' },
  step: { display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.35, transition: 'opacity 0.2s' },
  stepActive: { opacity: 1 },
  stepDone: { opacity: 0.7 },
  stepNum: { width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 },
  stepNumActive: { background: '#FFD700', color: '#000' },
  stepNumDone: { background: '#4CAF50', color: '#fff' },
  stepLabel: { fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' },
  stepLine: { flex: 1, height: '2px', background: 'rgba(255,255,255,0.08)', margin: '0 12px', transition: 'background 0.3s' },
  stepLineDone: { background: '#4CAF50' },

  // Layout
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' },
  left: { display: 'flex', flexDirection: 'column', gap: '1rem' },

  // Cart items
  item: { display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1rem' },
  itemImg: { width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 600, marginBottom: '4px' },
  itemUnit: { color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' },
  qtyControl: { display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', overflow: 'hidden' },
  qtyBtn: { background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', width: '34px', height: '34px', cursor: 'pointer', fontSize: '1.1rem' },
  qtyNum: { width: '34px', textAlign: 'center', fontSize: '0.95rem' },
  itemTotal: { fontWeight: 700, color: '#FFD700', minWidth: '80px', textAlign: 'right' },
  removeBtn: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1rem', padding: '4px 8px' },

  // Cards
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.75rem' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' },

  // Shipping form
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  fieldGroup: {},
  label: { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },

  // Payment methods
  methodGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  methodBtn: { padding: '1.25rem', background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.08)', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', color: '#fff', transition: 'all 0.2s', position: 'relative' },
  methodBtnActive: { border: '2px solid #FFD700', background: 'rgba(255,215,0,0.06)' },
  methodIcon: { fontSize: '1.8rem', marginBottom: '0.75rem' },
  methodName: { fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' },
  methodSub: { color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', lineHeight: 1.4, marginBottom: '0.75rem' },
  cardLogos: { display: 'flex', gap: '6px' },
  cardLogo: { padding: '2px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' },
  cardLogoActive: { border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', background: 'rgba(255,215,0,0.08)' },
  selectedCheck: { position: 'absolute', top: '10px', right: '12px', color: '#FFD700', fontSize: '0.75rem', fontWeight: 700 },

  // Recap
  recap: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1.25rem' },
  recapTitle: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1rem', letterSpacing: '0.05em' },
  recapItem: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' },
  recapImg: { width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' },
  recapAddr: { marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' },

  // Summary sidebar
  summary: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.75rem', position: 'sticky', top: '80px' },
  summaryTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem' },
  totalRow: { color: '#FFD700', fontSize: '1.15rem', fontWeight: 800 },
  freeHint: { fontSize: '0.75rem', color: '#4CAF50', marginBottom: '0.75rem' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.08)', margin: '1rem 0' },
  checkoutBtn: { width: '100%', padding: '14px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' },
  backBtn: { width: '100%', padding: '11px', background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.75rem' },
  securityRow: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '1.25rem', justifyContent: 'center' },
  secBadge: { fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.07)' },
};