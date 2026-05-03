import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('cart'); // cart | shipping | confirm
  const [shipping, setShipping] = useState({ street: '', city: '', postalCode: '', country: '' });
  const [placing, setPlacing] = useState(false);

  const shippingCost = totalPrice > 100 ? 0 : 10;
  const grandTotal = totalPrice + shippingCost;

  const handleCheckout = () => {
    if (!user) { toast.error('Connectez-vous pour passer commande'); navigate('/login'); return; }
    setStep('shipping');
  };

  const handlePlaceOrder = async () => {
    if (!shipping.street || !shipping.city || !shipping.postalCode || !shipping.country) {
      toast.error('Remplissez tous les champs de livraison');
      return;
    }
    setPlacing(true);
    try {
      const items = cart.items.map(i => ({
        product: i.product,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
      }));
      const { data } = await axios.post('/api/orders', {
        items,
        shippingAddress: shipping,
        paymentMethod: 'Cash on Delivery',
      });
      clearCart();
      toast.success('Commande passée avec succès ! 🎉');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyCart}>
          <span style={{ fontSize: '5rem' }}>🛒</span>
          <h2 style={styles.emptyTitle}>Votre panier est vide</h2>
          <p style={styles.emptySub}>Découvrez notre catalogue pour trouver vos produits préférés.</p>
          <Link to="/" style={styles.shopLink}>Commencer mes achats</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Mon Panier <span style={styles.count}>({totalItems} article{totalItems > 1 ? 's' : ''})</span></h1>

        {/* Steps */}
        <div style={styles.steps}>
          {['Panier', 'Livraison', 'Confirmation'].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ ...styles.step, ...(i === ['cart','shipping','confirm'].indexOf(step) ? styles.stepActive : {}) }}>
                <span style={styles.stepNum}>{i + 1}</span>
                <span style={styles.stepLabel}>{s}</span>
              </div>
              {i < 2 && <div style={styles.stepLine}></div>}
            </React.Fragment>
          ))}
        </div>

        <div style={styles.layout}>
          {/* Left: items or shipping */}
          <div style={styles.left}>
            {step === 'cart' && cart.items.map(item => (
              <div key={item.product} style={styles.item}>
                <img src={item.image} alt={item.name} style={styles.itemImg} />
                <div style={styles.itemInfo}>
                  <p style={styles.itemName}>{item.name}</p>
                  <p style={styles.itemUnit}>{item.price.toFixed(2)} € / unité</p>
                </div>
                <div style={styles.qtyControl}>
                  <button onClick={() => item.quantity > 1 ? updateQty(item.product, item.quantity - 1) : removeFromCart(item.product)} style={styles.qtyBtn}>−</button>
                  <span style={styles.qtyNum}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.product, Math.min(item.stock, item.quantity + 1))} style={styles.qtyBtn}>+</button>
                </div>
                <p style={styles.itemTotal}>{(item.price * item.quantity).toFixed(2)} €</p>
                <button onClick={() => removeFromCart(item.product)} style={styles.removeBtn}>✕</button>
              </div>
            ))}

            {step === 'shipping' && (
              <div style={styles.shippingForm}>
                <h2 style={styles.formTitle}>Adresse de livraison</h2>
                {[['street', 'Rue et numéro'], ['city', 'Ville'], ['postalCode', 'Code postal'], ['country', 'Pays']].map(([field, label]) => (
                  <div key={field} style={styles.fieldGroup}>
                    <label style={styles.label}>{label}</label>
                    <input
                      type="text"
                      value={shipping[field]}
                      onChange={e => setShipping({ ...shipping, [field]: e.target.value })}
                      style={styles.input}
                      placeholder={label}
                    />
                  </div>
                ))}
              </div>
            )}

            {step === 'confirm' && (
              <div style={styles.confirmSection}>
                <h2 style={styles.formTitle}>Récapitulatif</h2>
                {cart.items.map(item => (
                  <div key={item.product} style={styles.confirmItem}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ color: '#FFD700' }}>{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
                <div style={styles.divider}></div>
                <p style={styles.addressPreview}>
                  📍 {shipping.street}, {shipping.city} {shipping.postalCode}, {shipping.country}
                </p>
              </div>
            )}
          </div>

          {/* Right: summary */}
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Résumé</h2>
            <div style={styles.summaryRow}><span>Sous-total</span><span>{totalPrice.toFixed(2)} €</span></div>
            <div style={styles.summaryRow}>
              <span>Livraison</span>
              <span style={{ color: shippingCost === 0 ? '#4CAF50' : '#fff' }}>
                {shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} €`}
              </span>
            </div>
            {totalPrice <= 100 && <p style={styles.freeShipHint}>Encore {(100 - totalPrice).toFixed(2)} € pour la livraison gratuite !</p>}
            <div style={styles.divider}></div>
            <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
              <span>Total</span><span>{grandTotal.toFixed(2)} €</span>
            </div>

            {step === 'cart' && (
              <button onClick={handleCheckout} style={styles.checkoutBtn}>Commander →</button>
            )}
            {step === 'shipping' && (
              <>
                <button onClick={() => setStep('confirm')} style={styles.checkoutBtn}>Continuer →</button>
                <button onClick={() => setStep('cart')} style={styles.backBtn}>← Retour</button>
              </>
            )}
            {step === 'confirm' && (
              <>
                <button onClick={handlePlaceOrder} disabled={placing} style={styles.checkoutBtn}>
                  {placing ? 'Traitement...' : '✓ Passer la commande'}
                </button>
                <button onClick={() => setStep('shipping')} style={styles.backBtn}>← Modifier</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#09090f', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' },
  emptyCart: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '1rem', textAlign: 'center' },
  emptyTitle: { fontSize: '1.8rem', fontFamily: '"Playfair Display", Georgia, serif' },
  emptySub: { color: 'rgba(255,255,255,0.5)' },
  shopLink: { padding: '12px 28px', background: '#FFD700', color: '#000', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem' },
  title: { fontSize: '1.8rem', fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '2rem' },
  count: { fontSize: '1rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'system-ui, sans-serif', fontWeight: 400 },
  steps: { display: 'flex', alignItems: 'center', marginBottom: '2.5rem' },
  step: { display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.35 },
  stepActive: { opacity: 1 },
  stepNum: { width: '28px', height: '28px', borderRadius: '50%', background: '#FFD700', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' },
  stepLabel: { fontSize: '0.85rem', fontWeight: 600 },
  stepLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 16px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' },
  left: { display: 'flex', flexDirection: 'column', gap: '1rem' },
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
  shippingForm: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '2rem' },
  formTitle: { fontSize: '1.2rem', marginBottom: '1.5rem', fontFamily: '"Playfair Display", Georgia, serif' },
  fieldGroup: { marginBottom: '1.2rem' },
  label: { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' },
  confirmSection: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px', padding: '2rem' },
  confirmItem: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' },
  addressPreview: { color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', marginTop: '0.5rem' },
  summary: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.75rem', position: 'sticky', top: '80px' },
  summaryTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem' },
  totalRow: { color: '#FFD700', fontSize: '1.1rem', fontWeight: 700 },
  freeShipHint: { fontSize: '0.78rem', color: '#4CAF50', marginBottom: '0.75rem' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.08)', margin: '1rem 0' },
  checkoutBtn: { width: '100%', padding: '14px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' },
  backBtn: { width: '100%', padding: '11px', background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.75rem' },
};