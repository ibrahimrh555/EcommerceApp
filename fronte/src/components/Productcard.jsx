import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import toast from 'react-hot-toast';
import { Heart, HeartOff } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const fav = isFavorite(product._id);

  const handleAdd = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} ajouté au panier !`);
  };

  const handleFav = (e) => {
    e.preventDefault();
    toggleFavorite(product);
    toast(fav ? 'Retiré des favoris' : 'Ajouté aux favoris !', {
      icon: fav ? (
        <HeartOff size={16} color="#FFD700" aria-hidden="true" />
      ) : (
        <Heart size={16} color="#FFD700" fill="#FFD700" aria-hidden="true" />
      ),
    });
  };

  return (
    <div style={s.card}>
      <Link to={`/product/${product._id}`} style={s.cardLink}>
        <div style={s.imageWrap}>
          <img src={product.image} alt={product.name} style={s.cardImg} />
          <span style={s.categoryBadge}>{product.category}</span>
          {product.stock === 0 && <span style={s.outOfStock}>Rupture</span>}
          {/* Heart button */}
          <button onClick={handleFav} style={{ ...s.heartBtn, ...(fav ? s.heartBtnActive : {}) }} title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
            <Heart size={16} stroke="currentColor" fill={fav ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
        </div>
        <div style={s.cardBody}>
          <h3 style={s.cardName}>{product.name}</h3>
          <div style={s.cardMeta}>
            <span style={s.stars}>
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span style={s.reviews}>({product.numReviews})</span>
          </div>
          <div style={s.cardFooter}>
            <span style={s.price}>{product.price.toFixed(2)} €</span>
            <button
              onClick={handleAdd}
              style={{ ...s.addBtn, ...(product.stock === 0 ? s.addBtnDisabled : {}) }}
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

const s = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px', overflow: 'hidden',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  cardLink: { textDecoration: 'none', color: 'inherit', display: 'block' },
  imageWrap: { position: 'relative', paddingBottom: '66%', overflow: 'hidden', background: 'var(--image-bg)' },
  cardImg: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' },
  categoryBadge: {
    position: 'absolute', top: '10px', left: '10px',
    background: 'rgba(0,0,0,0.7)', color: '#FFD700',
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', letterSpacing: '0.05em',
  },
  outOfStock: {
    position: 'absolute', top: '10px', right: '44px',
    background: 'rgba(220,50,50,0.85)', color: '#fff',
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem',
  },
  heartBtn: {
    position: 'absolute', top: '8px', right: '8px',
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.7)', fontSize: '1rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s', zIndex: 2,
  },
  heartBtnActive: {
    background: 'rgba(220,50,50,0.25)',
    border: '1px solid rgba(220,50,50,0.5)',
    color: '#FFD700',
  },
  cardBody: { padding: '1.2rem' },
  cardName: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 },
  cardMeta: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' },
  stars: { color: '#FFD700', fontSize: '0.8rem' },
  reviews: { color: 'var(--text-subtle)', fontSize: '0.78rem' },
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