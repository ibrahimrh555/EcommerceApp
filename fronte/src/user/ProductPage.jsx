import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, Check, ShoppingCart, X as XIcon } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch {
        toast.error('Produit introuvable');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${qty}x ${product.name} ajouté au panier !`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Connectez-vous pour laisser un avis'); return; }
    setSubmitting(true);
    try {
      await axios.post(`/api/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
      toast.success('Avis publié !');
      setReviewComment('');
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={styles.loading}><div style={styles.spinner}></div></div>;
  if (!product) return null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.back}>
          <ArrowLeft size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} aria-hidden="true" />
          Retour
        </button>

        <div style={styles.product}>
          <div style={styles.imageSection}>
            <img src={product.image} alt={product.name} style={styles.image} />
          </div>
          <div style={styles.info}>
            <span style={styles.category}>{product.category}</span>
            <h1 style={styles.name}>{product.name}</h1>
            <div style={styles.ratingRow}>
              <span style={styles.stars}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
              <span style={styles.ratingText}>{product.rating.toFixed(1)} ({product.numReviews} avis)</span>
            </div>
            <p style={styles.price}>{product.price.toFixed(2)} €</p>
            <p style={styles.description}>{product.description}</p>

            <div style={styles.stockRow}>
              <span style={{ ...styles.stockBadge, background: product.stock > 0 ? 'rgba(50,200,100,0.15)' : 'rgba(200,50,50,0.15)', color: product.stock > 0 ? '#4CAF50' : '#f44336' }}>
                {product.stock > 0 ? (
                  <><Check size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} aria-hidden="true" />En stock ({product.stock})</>
                ) : (
                  <><XIcon size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} aria-hidden="true" />Rupture de stock</>
                )}
              </span>
            </div>

            {product.stock > 0 && (
              <div style={styles.cartRow}>
                <div style={styles.qtyControl}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}>−</button>
                  <span style={styles.qtyNum}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={styles.qtyBtn}>+</button>
                </div>
                <button onClick={handleAddToCart} style={styles.addBtn}>
                  <ShoppingCart size={18} style={{ marginRight: '10px', verticalAlign: 'middle' }} aria-hidden="true" />
                  Ajouter au panier
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div style={styles.reviewSection}>
          <h2 style={styles.sectionTitle}>Avis clients</h2>

          {product.reviews.length === 0 ? (
            <p style={styles.noReviews}>Aucun avis pour l'instant. Soyez le premier !</p>
          ) : (
            <div style={styles.reviewList}>
              {product.reviews.map((r, i) => (
                <div key={i} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <span style={styles.reviewName}>{r.name}</span>
                    <span style={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    <span style={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p style={styles.reviewComment}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {user && (
            <form onSubmit={handleReview} style={styles.reviewForm}>
              <h3 style={styles.formTitle}>Laisser un avis</h3>
              <div style={styles.ratingSelect}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setReviewRating(n)}
                    style={{ ...styles.starBtn, color: n <= reviewRating ? '#FFD700' : 'rgba(255,255,255,0.2)' }}>
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Partagez votre expérience..."
                required
                style={styles.textarea}
                rows={4}
              />
              <button type="submit" disabled={submitting} style={styles.submitBtn}>
                {submitting ? 'Envoi...' : 'Publier l\'avis'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', fontFamily: 'system-ui, sans-serif' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' },
  spinner: { width: '40px', height: '40px', border: '3px solid rgba(255,215,0,0.2)', borderTop: '3px solid #FFD700', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem' },
  back: { background: 'none', border: '1px solid var(--border-2)', color: 'var(--text-muted)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.9rem' },
  product: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' },
  imageSection: { borderRadius: '16px', overflow: 'hidden', background: 'var(--image-bg)', aspectRatio: '1' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  info: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  category: { color: '#FFD700', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' },
  name: { fontSize: '2rem', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, lineHeight: 1.2 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  stars: { color: '#FFD700', fontSize: '1.1rem' },
  ratingText: { color: 'var(--text-subtle)', fontSize: '0.9rem' },
  price: { fontSize: '2rem', fontWeight: 800, color: '#FFD700' },
  description: { color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' },
  stockRow: { display: 'flex' },
  stockBadge: { padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 },
  cartRow: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '0', border: '1px solid var(--border-2)', borderRadius: '8px', overflow: 'hidden' },
  qtyBtn: { background: 'var(--surface-2)', border: 'none', color: 'var(--text)', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem' },
  qtyNum: { width: '40px', textAlign: 'center', fontSize: '1rem' },
  addBtn: { flex: 1, padding: '12px 24px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' },
  reviewSection: { borderTop: '1px solid var(--border)', paddingTop: '3rem' },
  sectionTitle: { fontSize: '1.5rem', fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '2rem' },
  noReviews: { color: 'var(--text-subtle)', fontStyle: 'italic' },
  reviewList: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' },
  reviewCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.2rem' },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem', flexWrap: 'wrap' },
  reviewName: { fontWeight: 600, color: 'var(--text)' },
  reviewStars: { color: '#FFD700' },
  reviewDate: { color: 'var(--text-faint)', fontSize: '0.8rem', marginLeft: 'auto' },
  reviewComment: { color: 'var(--text-muted)', lineHeight: 1.6 },
  reviewForm: { background: 'var(--surface)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px', padding: '2rem' },
  formTitle: { marginBottom: '1rem', color: '#FFD700' },
  ratingSelect: { display: 'flex', gap: '4px', marginBottom: '1rem' },
  starBtn: { background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', padding: '0', transition: 'transform 0.1s' },
  textarea: { width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: '8px', color: 'var(--text)', padding: '12px', fontSize: '0.95rem', resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
  submitBtn: { marginTop: '1rem', padding: '12px 24px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' },
};