import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProductCard from '../components/Productcard';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports'];

const SORT_OPTIONS = [
  { value: 'default', label: 'Par défaut' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
];

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');

  const category = searchParams.get('category') || 'All';

  const fetchProducts = async (keyword = '') => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (category !== 'All') params.category = category;
      const { data } = await axios.get('/api/products', { params });
      setProducts(data);
    } catch {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleCategory = (cat) => {
    setSearch('');
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div style={styles.page}>

      {/* Page header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <p style={styles.eyebrow}>✦ LuxeShop</p>
          <h1 style={styles.title}>
            {category === 'All' ? 'Tout le Catalogue' : category}
          </h1>
          <p style={styles.subtitle}>
            {loading ? '...' : `${products.length} produit${products.length !== 1 ? 's' : ''} disponible${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div style={styles.container}>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          {/* Search */}
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchBtn}>🔍</button>
          </form>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={styles.select}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Category pills */}
        <div style={styles.categories}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              style={{ ...styles.catBtn, ...(category === cat ? styles.catBtnActive : {}) }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Chargement des produits...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: '3.5rem' }}>🔍</span>
            <h3 style={styles.emptyTitle}>Aucun produit trouvé</h3>
            <p style={styles.emptySub}>Essayez une autre recherche ou catégorie.</p>
            <button onClick={() => { setSearch(''); handleCategory('All'); }} style={styles.resetBtn}>
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {sortedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#09090f', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' },
  header: {
    background: 'linear-gradient(135deg, #0f0d18 0%, #09090f 100%)',
    borderBottom: '1px solid rgba(255,215,0,0.1)',
    padding: '3.5rem 2rem 2.5rem',
  },
  headerContent: { maxWidth: '1280px', margin: '0 auto' },
  eyebrow: { color: '#FFD700', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' },
  title: { fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 900, marginBottom: '0.5rem' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 4rem' },
  toolbar: { display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' },
  searchForm: { display: 'flex', flex: 1, minWidth: '240px', gap: '0' },
  searchInput: {
    flex: 1, padding: '0.7rem 1rem',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRight: 'none',
    borderRadius: '8px 0 0 8px',
    color: '#fff', fontSize: '0.9rem', outline: 'none',
  },
  searchBtn: {
    padding: '0.7rem 1rem', background: '#FFD700', color: '#000',
    border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontSize: '1rem',
  },
  select: {
    padding: '0.7rem 1rem', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
    color: '#fff', fontSize: '0.9rem', cursor: 'pointer', outline: 'none',
  },
  categories: { display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2.5rem' },
  catBtn: {
    padding: '0.45rem 1.1rem', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '30px',
    color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s',
  },
  catBtnActive: { background: 'rgba(255,215,0,0.15)', border: '1px solid #FFD700', color: '#FFD700' },
  loading: { textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.4)' },
  spinner: {
    width: '36px', height: '36px',
    border: '3px solid rgba(255,215,0,0.2)', borderTop: '3px solid #FFD700',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
  },
  empty: { textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.4)' },
  emptyTitle: { fontSize: '1.2rem', color: '#fff', margin: '1rem 0 0.5rem' },
  emptySub: { marginBottom: '1.5rem', fontSize: '0.9rem' },
  resetBtn: {
    padding: '10px 22px', background: '#FFD700', color: '#000',
    border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
};