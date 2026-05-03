import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: '#FF9800',
  processing: '#2196F3',
  shipped: '#9C27B0',
  delivered: '#4CAF50',
  cancelled: '#f44336',
};

const STATUS_LABELS = {
  pending: 'En attente',
  processing: 'En traitement',
  shipped: 'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders');
        setOrders(data);
      } catch (err) {
        toast.error('Erreur lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div style={styles.loading}><div style={styles.spinner}></div></div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Mes Commandes</h1>
        {orders.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: '3rem' }}>📦</span>
            <p>Vous n'avez pas encore de commandes.</p>
            <Link to="/" style={styles.shopLink}>Commencer mes achats</Link>
          </div>
        ) : (
          <div style={styles.list}>
            {orders.map(order => (
              <Link to={`/orders/${order._id}`} key={order._id} style={styles.orderCard}>
                <div style={styles.orderTop}>
                  <div>
                    <span style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                    <span style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <span style={{ ...styles.statusBadge, background: `${STATUS_COLORS[order.status]}25`, color: STATUS_COLORS[order.status] }}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
                <div style={styles.orderItems}>
                  {order.items.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.image} alt={item.name} style={styles.orderThumb} title={item.name} />
                  ))}
                  {order.items.length > 3 && <span style={styles.moreItems}>+{order.items.length - 3}</span>}
                </div>
                <div style={styles.orderBottom}>
                  <span style={styles.orderCount}>{order.items.reduce((a, i) => a + i.quantity, 0)} article{order.items.reduce((a, i) => a + i.quantity, 0) > 1 ? 's' : ''}</span>
                  <span style={styles.orderTotal}>{order.totalPrice.toFixed(2)} €</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#09090f', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' },
  spinner: { width: '40px', height: '40px', border: '3px solid rgba(255,215,0,0.2)', borderTop: '3px solid #FFD700', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '2.5rem 2rem' },
  title: { fontSize: '1.8rem', fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '2rem' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' },
  shopLink: { padding: '10px 24px', background: '#FFD700', color: '#000', borderRadius: '6px', textDecoration: 'none', fontWeight: 700 },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  orderCard: { display: 'block', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s' },
  orderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  orderId: { fontWeight: 700, color: '#FFD700', marginRight: '12px', fontSize: '0.95rem' },
  orderDate: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 },
  orderItems: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1rem' },
  orderThumb: { width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' },
  moreItems: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' },
  orderBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  orderCount: { color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' },
  orderTotal: { fontSize: '1.1rem', fontWeight: 700, color: '#FFD700' },
};