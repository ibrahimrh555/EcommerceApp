import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Gem, Heart, ShoppingCart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { totalFavorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLight, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <Gem size={16} color="#FFD700" aria-hidden="true" />
          LUXE<span style={styles.logoAccent}>SHOP</span>
        </Link>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>Accueil</Link>
          <Link to="/catalogue" style={styles.link}>Catalogue</Link>
          {user ? (
            <>
              <Link to="/orders" style={styles.link}>Mes Commandes</Link>
              <span style={styles.userName}>{user.name}</span>
              <button onClick={handleLogout} style={styles.btnLogout}>Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Connexion</Link>
              <Link to="/register" style={styles.btnRegister}>S'inscrire</Link>
            </>
          )}
          {/* Favorites icon */}
          <Link to="/favorites" style={styles.cartBtn} title="Mes favoris">
            <Heart size={20} size={22} aria-hidden="true"  />
            {totalFavorites > 0 && <span style={{ ...styles.badge, background: '#ff6b6b' }}>{totalFavorites}</span>}
          </Link>

          <Link to="/cart" style={styles.cartBtn}>
            <ShoppingCart size={22} aria-hidden="true" />
            {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            style={styles.themeBtn}
            title={isLight ? 'Mode sombre' : 'Mode clair'}
            aria-label={isLight ? 'Activer le mode sombre' : 'Activer le mode clair'}
          >
            {isLight ? <FaMoon aria-hidden="true" /> : <FaSun aria-hidden="true" />}
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'var(--nav-bg)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--nav-border)',
    padding: '0',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  logo: {
    textDecoration: 'none',
    color: 'var(--text)',
    fontSize: '1.3rem',
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: 700,
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: { color: '#FFD700', fontSize: '0.9rem' },
  logoAccent: { color: 'var(--accent)' },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    letterSpacing: '0.05em',
    fontFamily: 'system-ui, sans-serif',
    transition: 'color 0.2s',
  },
  userName: {
    color: 'var(--accent)',
    fontSize: '0.9rem',
    fontFamily: 'system-ui, sans-serif',
  },
  btnLogout: {
    background: 'none',
    border: '1px solid var(--border-2)',
    color: 'var(--text-subtle)',
    padding: '6px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  },
  btnRegister: {
    background: 'var(--accent)',
    color: '#000',
    padding: '7px 16px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.03em',
  },
  cartBtn: {
    position: 'relative',
    color: 'var(--text)',
    textDecoration: 'none',
    fontSize: '1.3rem',
    display: 'flex',
    alignItems: 'center',
  },
  themeBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: '0px solid var(--border)',
    background: 'var(--surface-3)',
    color: 'var(--text)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
  },
  iconBtn: {
    position: 'relative',
    color: '#ff6b6b',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.03)',
  },
  cartIcon: { fontSize: '1.4rem' },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-10px',
    background: 'var(--accent)',
    color: '#000',
    fontSize: '0.7rem',
    fontWeight: 700,
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};