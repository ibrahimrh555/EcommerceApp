import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Home as HomeIcon, Laptop, Lock, RotateCcw, Shirt, Star, Truck } from 'lucide-react';

const FEATURES = [
  { icon: Truck, title: 'Livraison gratuite', desc: "Dès 100€ d'achat, livraison offerte partout en Maroc." },
  { icon: RotateCcw, title: 'Retours faciles', desc: '30 jours pour changer d\'avis, sans frais.' },
  { icon: Lock, title: 'Paiement sécurisé', desc: 'Vos données bancaires sont protégées à 100%.' },
  { icon: Star, title: 'Qualité garantie', desc: 'Chaque produit est soigneusement sélectionné.' },
];

const CATEGORIES = [
  { name: 'Electronics', icon: Laptop, color: 'rgba(33,150,243,0.15)', border: 'rgba(33,150,243,0.3)' },
  { name: 'Fashion', icon: Shirt, color: 'rgba(233,30,99,0.15)', border: 'rgba(233,30,99,0.3)' },
  { name: 'Home & Kitchen', icon: HomeIcon, color: 'rgba(76,175,80,0.15)', border: 'rgba(76,175,80,0.3)' },
  { name: 'Sports', icon: Dumbbell, color: 'rgba(255,152,0,0.15)', border: 'rgba(255,152,0,0.3)' },
];

export default function Home() {
  return (
    <div style={styles.page}>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.eyebrow}>✦ Collection 2026</p>
          <h1 style={styles.heroTitle}>
            L'Excellence<br />
            <span style={styles.heroAccent}>au Quotidien</span>
          </h1>
          <p style={styles.heroSub}>
            Des produits soigneusement sélectionnés pour ceux qui n'acceptent que le meilleur.
          </p>
          <div style={styles.heroCta}>
            <Link to="/catalogue" style={styles.btnPrimary}>Découvrir le catalogue →</Link>
            <Link to="/login" style={styles.btnSecondary}>Se connecter</Link>
          </div>
          <div style={styles.heroStats}>
            {[['500+', 'Produits'], ['4.8★', 'Note moyenne'], ['12k+', 'Clients']].map(([val, label]) => (
              <div key={label} style={styles.stat}>
                <span style={styles.statVal}>{val}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={styles.section}>
        <div style={styles.container}>
          <p style={styles.sectionEyebrow}>Parcourir par</p>
          <h2 style={styles.sectionTitle}>Nos Catégories</h2>
          <div style={styles.catGrid}>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={"/catalogue?category=" + cat.name}
                  style={{ ...styles.catCard, background: cat.color, border: "1px solid " + cat.border }}
                >
                  <span style={styles.catIcon}><Icon size={32} aria-hidden="true" /></span>
                  <span style={styles.catName}>{cat.name}</span>
                  <span style={styles.catArrow}>→</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ ...styles.section, background: 'var(--surface-3)' }}>
        <div style={styles.container}>
          <p style={styles.sectionEyebrow}>Pourquoi nous choisir</p>
          <h2 style={styles.sectionTitle}>L'expérience LuxeShop</h2>
          <div style={styles.featGrid}>
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} style={styles.featCard}>
                  <span style={styles.featIcon}><Icon size={32} aria-hidden="true" /></span>
                  <h3 style={styles.featTitle}>{f.title}</h3>
                  <p style={styles.featDesc}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BANNER CTA */}
      <section style={styles.banner}>
        <div style={styles.bannerGlow}></div>
        <div style={styles.container}>
          <div style={styles.bannerInner}>
            <div>
              <h2 style={styles.bannerTitle}>Prêt à commencer ?</h2>
              <p style={styles.bannerSub}>Rejoignez des milliers de clients satisfaits.</p>
            </div>
            <Link to="/catalogue" style={styles.btnPrimary}>Voir tous les produits →</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

const styles = {
  page: {
    background: 'var(--bg)',
    minHeight: '100vh',
    width: '100%',
    overflowX: 'hidden',
    color: 'var(--text)',
    fontFamily: 'system-ui, sans-serif',
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: `
      linear-gradient(
        135deg,
        rgba(9, 9, 15, 0.7),
        rgba(18, 16, 26, 0.7)
      ),
      url('./bg.jpg')
    `,
    
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '7rem 2rem 5rem',
    borderBottom: '1px solid rgba(255,215,0,0.1)',
  },
  heroGlow: {
    position: 'absolute', top: '-20%', right: '-5%',
    width: '55vw', height: '55vw', maxWidth: '700px', maxHeight: '700px',
    background: 'radial-gradient(circle, rgba(255,215,0,0.07) 0%, transparent 65%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  heroContent: { maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 },
  eyebrow: { color: '#FFD700', fontSize: '0.8rem', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '1.5rem' },
  heroTitle: {
    fontSize: 'clamp(2.8rem, 7vw, 5rem)',
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: 900, lineHeight: 1.08, marginBottom: '1.5rem',
    color: '#ffffff',
  },
  heroAccent: { color: '#FFD700' },
  heroSub: { color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem' },
  heroCta: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' },
  btnPrimary: {
    padding: '14px 28px', background: '#FFD700', color: '#000',
    borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
  },
  btnSecondary: {
    padding: '14px 28px', background: 'transparent',
    border: '1px solid rgba(255,215,0,0.4)', color: '#FFD700',
    borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
  },
  heroStats: { display: 'flex', gap: '3rem', flexWrap: 'wrap' },
  stat: { display: 'flex', flexDirection: 'column', gap: '4px' },
  statVal: { fontSize: '1.8rem', fontWeight: 800, color: '#FFD700', fontFamily: '"Playfair Display", serif' },
  statLabel: { color: 'var(--text-subtle)', fontSize: '0.8rem', letterSpacing: '0.1em' },
  section: { padding: '5rem 2rem' },
  container: { maxWidth: '1280px', margin: '0 auto' },
  sectionEyebrow: { color: '#FFD700', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' },
  sectionTitle: { fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '2.5rem' },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' },
  catCard: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '1.5rem', borderRadius: '12px', textDecoration: 'none', color: 'var(--text)',
  },
  catIcon: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  catName: { flex: 1, fontWeight: 600, fontSize: '1rem' },
  catArrow: { color: 'var(--text-faint)', fontSize: '1.1rem' },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' },
  featCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '2rem',
  },
  featIcon: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
  featTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' },
  featDesc: { color: 'var(--text-subtle)', fontSize: '0.88rem', lineHeight: 1.6 },
  banner: {
    padding: '5rem 2rem', position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, var(--bg) 100%)',
    borderTop: '1px solid rgba(255,215,0,0.1)',
  },
  bannerGlow: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bannerInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', position: 'relative', zIndex: 1 },
  bannerTitle: { fontSize: '2rem', fontFamily: '"Playfair Display", serif', marginBottom: '0.5rem' },
  bannerSub: { color: 'var(--text-subtle)', fontSize: '0.95rem' },
};