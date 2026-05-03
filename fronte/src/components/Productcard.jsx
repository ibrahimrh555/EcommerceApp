import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} ajouté au panier !`);
  };

  return (
    <div style={styles.card}>
      <Link to={`/product/${product._id}`} style={styles.cardLink}>
        <div style={styles.imageWrap}>
          <img src={product.image} alt={product.name} style={styles.cardImg} />
          <span style={styles.categoryBadge}>{product.category}</span>
          {product.stock === 0 && <span style={styles.outOfStock}>Rupture</span>}
        </div>
        <div style={styles.cardBody}>
          <h3 style={styles.cardName}>{product.name}</h3>
          <div style={styles.cardMeta}>
            <span style={styles.stars}>
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span style={styles.reviews}>({product.numReviews})</span>
          </div>
          <div style={styles.cardFooter}>
            <span style={styles.price}>{product.price.toFixed(2)} €</span>
            <button
              onClick={handleAdd}
              style={{ ...styles.addBtn, ...(product.stock === 0 ? styles.addBtnDisabled : {}) }}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Indispo' : '+ Panier'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', overflow: 'hidden',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  cardLink: { textDecoration: 'none', color: 'inherit', display: 'block' },
  imageWrap: { position: 'relative', paddingBottom: '66%', overflow: 'hidden', background: '#1a1a2e' },
  cardImg: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' },
  categoryBadge: {
    position: 'absolute', top: '12px', left: '12px',
    background: 'rgba(0,0,0,0.7)', color: '#FFD700',
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', letterSpacing: '0.05em',
  },
  outOfStock: {
    position: 'absolute', top: '12px', right: '12px',
    background: 'rgba(220,50,50,0.85)', color: '#fff',
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem',
  },
  cardBody: { padding: '1.2rem' },
  cardName: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 },
  cardMeta: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' },
  stars: { color: '#FFD700', fontSize: '0.8rem' },
  reviews: { color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' },
  cardFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: '1.25rem', fontWeight: 700, color: '#FFD700' },
  addBtn: {
    padding: '8px 16px', background: '#FFD700', color: '#000',
    border: 'none', borderRadius: '6px', fontWeight: 700,
    cursor: 'pointer', fontSize: '0.85rem',
  },
  addBtnDisabled: {
    background: 'rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.3)',
    cursor: 'not-allowed',
  },
};