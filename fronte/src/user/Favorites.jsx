import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { Heart,ShoppingCart } from 'lucide-react';

export default function Favorites() {
  const { favorites, removeFavorite, clearFavorites, totalFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    if (product.stock === 0) { toast.error('Produit en rupture de stock'); return; }
    addToCart(product, 1);
    toast.success(`${product.name} ajouté au panier !`);
  };

  const handleRemove = (product) => {
    removeFavorite(product._id);
    toast('Retiré des favoris', { icon: '💔' });
  };

  if (favorites.length === 0) {
    return (
      <div style={s.page}>
        <div style={s.empty}>
          <div style={s.emptyHeart}>
            <Heart size={72} stroke="currentColor" fill="none" aria-hidden="true" />
          </div>
          <h2 style={s.emptyTitle}>Aucun favori pour l'instant</h2>
          <p style={s.emptySub}>Explorez notre catalogue et ajoutez vos produits préférés ici.</p>
          <Link to="/catalogue" style={s.browseBtn}>Découvrir le catalogue →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Header */}
        <div style={s.header}>
          <div>
            <p style={s.eyebrow}>✦ Mes coups de cœur</p>
            <h1 style={s.title}>Favoris</h1>
            <p style={s.sub}>{totalFavorites} produit{totalFavorites > 1 ? 's' : ''} sauvegardé{totalFavorites > 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => { clearFavorites(); toast('Favoris effacés', { icon: '🗑' }); }} style={s.clearBtn}>
            Tout effacer
          </button>
        </div>

        {/* Grid */}
        <div style={s.grid}>
          {favorites.map(product => (
            <div key={product._id} style={s.card}>
              {/* Image */}
              <Link to={`/product/${product._id}`} style={s.imageLink}>
                <div style={s.imageWrap}>
                  <img src={product.image} alt={product.name} style={s.img} />
                  <span style={s.catBadge}>{product.category}</span>
                  {product.stock === 0 && <span style={s.outBadge}>Rupture</span>}
                </div>
              </Link>

              {/* Body */}
              <div style={s.body}>
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={s.name}>{product.name}</h3>
                </Link>

                <div style={s.ratingRow}>
                  <span style={s.stars}>{'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}</span>
                  <span style={s.reviews}>({product.numReviews || 0})</span>
                </div>

                <p style={s.desc}>{product.description?.slice(0, 80)}...</p>

                <div style={s.footer}>
                  <span style={s.price}>{product.price?.toFixed(2)} €</span>
                  <div style={s.actions}>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      style={{ ...s.cartBtn, ...(product.stock === 0 ? s.cartBtnDisabled : {}) }}
                    >
                      <ShoppingCart size={16} stroke="currentColor" fill="currentColor" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleRemove(product)}
                      style={s.heartBtn}
                      title="Retirer des favoris"
                    >
                      <Heart size={16} stroke="currentColor" fill="currentColor" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={s.cta}>
          <Link to="/catalogue" style={s.ctaLink}>← Continuer mes achats</Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#09090f', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' },

  // Empty state
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '1.25rem', textAlign: 'center', padding: '2rem' },
  emptyHeart: { fontSize: '5rem', color: 'rgba(255,100,100,0.3)', lineHeight: 1 },
  emptyTitle: { fontSize: '1.8rem', fontFamily: '"Playfair Display", Georgia, serif', color: '#fff' },
  emptySub: { color: 'rgba(255,255,255,0.4)', maxWidth: '380px', lineHeight: 1.6 },
  browseBtn: { padding: '13px 28px', background: '#FFD700', color: '#000', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' },

  // Page
  container: { maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' },
  eyebrow: { color: '#ff6b6b', fontSize: '0.78rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  title: { fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 900, marginBottom: '0.3rem' },
  sub: { color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem' },
  clearBtn: { padding: '9px 18px', background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.25)', color: '#ff6b6b', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' },

  // Grid
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' },

  // Card
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s, transform 0.2s' },
  imageLink: { display: 'block' },
  imageWrap: { position: 'relative', paddingBottom: '60%', overflow: 'hidden', background: '#1a1a2e' },
  img: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
  catBadge: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: '#FFD700', padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', letterSpacing: '0.04em' },
  outBadge: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(220,50,50,0.85)', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem' },

  body: { padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 },
  name: { fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, color: '#fff' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '6px' },
  stars: { color: '#FFD700', fontSize: '0.78rem' },
  reviews: { color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' },
  desc: { color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', lineHeight: 1.5, flex: 1 },

  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
  price: { fontSize: '1.2rem', fontWeight: 800, color: '#FFD700' },
  actions: { display: 'flex', gap: '6px', alignItems: 'center' },
  cartBtn: { width: '34px', height: '34px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' },
  cartBtnDisabled: { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', cursor: 'not-allowed' },
  heartBtn: { width: '34px', height: '34px', background: 'rgba(220,50,50,0.15)', border: '1px solid rgba(220,50,50,0.3)', color: '#ff6b6b', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  // CTA bottom
  cta: { borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem', textAlign: 'center' },
  ctaLink: { color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.9rem' },
};