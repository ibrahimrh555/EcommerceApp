import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_LABELS = { pending: 'En attente', processing: 'En traitement', shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé' };

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`);
        setOrder(data);
      } catch {
        toast.error('Commande introuvable');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div style={styles.loading}><div style={styles.spinner}></div></div>;
  if (!order) return null;

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button onClick={() => navigate('/orders')} style={styles.back}>
          <ArrowLeft size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} aria-hidden="true" />
          Mes commandes
        </button>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Commande #{order._id.slice(-8).toUpperCase()}</h1>
            <p style={styles.date}>Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Progress tracker */}
        {order.status !== 'cancelled' && (
          <div style={styles.tracker}>
            {STATUS_STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div style={styles.trackStep}>
                  <div style={{ ...styles.trackDot, background: i <= stepIndex ? '#FFD700' : 'rgba(255,255,255,0.1)', border: i === stepIndex ? '3px solid #FFD700' : 'none', boxShadow: i === stepIndex ? '0 0 12px rgba(255,215,0,0.5)' : 'none' }}></div>
                  <span style={{ ...styles.trackLabel, color: i <= stepIndex ? '#fff' : 'rgba(255,255,255,0.3)' }}>{STATUS_LABELS[s]}</span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div style={{ ...styles.trackLine, background: i < stepIndex ? '#FFD700' : 'rgba(255,255,255,0.1)' }}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div style={styles.grid}>
          {/* Items */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Articles</h2>
            {order.items.map((item, i) => (
              <div key={i} style={styles.item}>
                <img src={item.image} alt={item.name} style={styles.itemImg} />
                <div style={styles.itemInfo}>
                  <p style={styles.itemName}>{item.name}</p>
                  <p style={styles.itemQty}>Quantité : {item.quantity}</p>
                </div>
                <p style={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} €</p>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div>
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Livraison</h2>
              <p style={styles.addrLine}>{order.shippingAddress.street}</p>
              <p style={styles.addrLine}>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
              <p style={styles.addrLine}>{order.shippingAddress.country}</p>
            </div>

            <div style={{ ...styles.section, marginTop: '1rem' }}>
              <h2 style={styles.sectionTitle}>Résumé</h2>
              <div style={styles.summaryRow}><span>Sous-total</span><span>{order.itemsPrice.toFixed(2)} €</span></div>
              <div style={styles.summaryRow}><span>Livraison</span><span>{order.shippingPrice === 0 ? 'Gratuite' : `${order.shippingPrice.toFixed(2)} €`}</span></div>
              <div style={styles.divider}></div>
              <div style={{ ...styles.summaryRow, ...styles.totalRow }}><span>Total</span><span>{order.totalPrice.toFixed(2)} €</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#09090f', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' },
  spinner: { width: '40px', height: '40px', border: '3px solid rgba(255,215,0,0.2)', borderTop: '3px solid #FFD700', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 2rem' },
  back: { background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.9rem' },
  header: { marginBottom: '2rem' },
  title: { fontSize: '1.6rem', fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '0.4rem' },
  date: { color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' },
  tracker: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem 2rem', marginBottom: '2rem' },
  trackStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  trackDot: { width: '16px', height: '16px', borderRadius: '50%', transition: 'all 0.3s' },
  trackLabel: { fontSize: '0.78rem', textAlign: 'center', whiteSpace: 'nowrap' },
  trackLine: { flex: 1, height: '2px', margin: '0 8px', marginBottom: '22px', transition: 'background 0.3s' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' },
  section: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#FFD700' },
  item: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  itemImg: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 600, marginBottom: '4px' },
  itemQty: { color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' },
  itemPrice: { fontWeight: 700, color: '#FFD700' },
  addrLine: { color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: '4px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' },
  totalRow: { color: '#FFD700', fontSize: '1rem', fontWeight: 700 },
  divider: { height: '1px', background: 'rgba(255,255,255,0.08)', margin: '1rem 0' },
};