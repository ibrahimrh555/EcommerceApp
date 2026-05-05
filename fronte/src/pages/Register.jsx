import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Gem } from 'lucide-react';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Les mots de passe ne correspondent pas'); return; }
    if (form.password.length < 6) { toast.error('Mot de passe trop court (min. 6 caractères)'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', {
        name: form.name, email: form.email, password: form.password,
      });
      login(data);
      toast.success(`Bienvenue, ${data.name} !`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <Gem size={18} color="#FFD700" aria-hidden="true" />
          <h1 style={styles.title}>LUXE<span style={styles.accent}>SHOP</span></h1>
        </div>
        <h2 style={styles.subtitle}>Créer un compte</h2>
        <p style={styles.hint}>Déjà inscrit ? <Link to="/login" style={styles.link}>Se connecter</Link></p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { key: 'name', label: 'Nom complet', type: 'text', placeholder: 'Jean Dupont' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'votre@email.com' },
            { key: 'password', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
            { key: 'confirm', label: 'Confirmer le mot de passe', type: 'password', placeholder: '••••••••' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                required
                style={styles.input}
                placeholder={placeholder}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '2rem', color: 'var(--text)' },
  card: { background: 'var(--surface)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '16px', padding: '3rem', width: '100%', maxWidth: '420px' },
  logoSection: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', justifyContent: 'center' },
  logoIcon: { color: '#FFD700', fontSize: '1.1rem' },
  title: { color: 'var(--text)', fontSize: '1.4rem', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '0.05em' },
  accent: { color: '#FFD700' },
  subtitle: { fontSize: '1.3rem', color: 'var(--text)', marginBottom: '0.5rem', fontFamily: '"Playfair Display", Georgia, serif' },
  hint: { color: 'var(--text-subtle)', fontSize: '0.9rem', marginBottom: '2rem' },
  link: { color: '#FFD700', textDecoration: 'none' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  field: {},
  label: { display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' },
  btn: { padding: '14px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem' },
};