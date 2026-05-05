import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductList from './user/ProductList';
import ProductPage from './user/ProductPage';
import Cart from './user/Cart';
import Products from './user/Products';
import Login from './pages/Login';          // ← unique page login
import Register from './pages/Register';
import Orders from './user/Orders';
import OrderDetail from './user/OrderDetail';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminProducts from './admin/Products';
import AdminOrders from './admin/Orders';
import AdminUsers from './admin/Users';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminProvider>
          <Router>
            <style>{`
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { background: #09090f; }
              @keyframes spin { to { transform: rotate(360deg); } }
              input::placeholder { color: rgba(255,255,255,0.2); }
              select option { background: #1a1a2e; color: #fff; }
              a:hover { opacity: 0.85; }
            `}</style>
            <Routes>

              {/* ── ADMIN routes (own layout, no Navbar) ── */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              {/* ── SHOP routes (with Navbar) ── */}
              <Route path="/" element={<><Navbar /><Home /></>} />
              <Route path="/catalogue" element={<><Navbar /><ProductList /></>} />
              <Route path="/product/:id" element={<><Navbar /><ProductPage /></>} />
              <Route path="/cart" element={<><Navbar /><Cart /></>} />
              <Route path="/login" element={<><Navbar /><Login /></>} />
              <Route path="/register" element={<><Navbar /><Register /></>} />
              <Route path="/orders" element={<><Navbar /><PrivateRoute><Orders /></PrivateRoute></>} />
              <Route path="/orders/:id" element={<><Navbar /><PrivateRoute><OrderDetail /></PrivateRoute></>} />

            </Routes>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px' },
                success: { iconTheme: { primary: '#FFD700', secondary: '#000' } },
              }}
            />
          </Router>
        </AdminProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;