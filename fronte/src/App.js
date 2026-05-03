import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductPage from './filtres/ProductPage';
import Cart from './filtres/Cart';
import Login from './filtres/Login';
import Register from './filtres/Register';
import Orders from './filtres/Orders';
import OrderDetail from './filtres/OrderDetail';
import ProductList from './filtres/ProductList';
import Products from './filtres/Products';


function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <style>{`
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #09090f; }
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
            @keyframes spin { to { transform: rotate(360deg); } }
            input::placeholder { color: rgba(255,255,255,0.2); }
            a:hover { opacity: 0.85; }
          `}</style>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
          </Routes>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1a1a2e',
                color: '#fff',
                border: '1px solid rgba(255,215,0,0.2)',
                borderRadius: '8px',
              },
              success: { iconTheme: { primary: '#FFD700', secondary: '#000' } },
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;