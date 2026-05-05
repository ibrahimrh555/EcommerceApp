import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
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
import Payment from './user/Payment';
import Favorites from './user/Favorites';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
 
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <AdminProvider>
              <Router>
                <style>{`
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  @keyframes spin { to { transform: rotate(360deg); } }
                  a:hover { opacity: 0.85; }
                `}</style>
                <Routes>
 
              {/* ── ADMIN routes ── */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
 
              {/* ── SHOP routes ── */}
              <Route path="/" element={<><Navbar /><Home /></>} />
              <Route path="/catalogue" element={<><Navbar /><ProductList /></>} />
              <Route path="/product/:id" element={<><Navbar /><ProductPage /></>} />
              <Route path="/cart" element={<><Navbar /><Cart /></>} />
              <Route path="/login" element={<><Navbar /><Login /></>} />
              <Route path="/register" element={<><Navbar /><Register /></>} />
              <Route path="/favorites" element={<><Navbar /><Favorites /></>} />
              <Route path="/orders" element={<><Navbar /><PrivateRoute><Orders /></PrivateRoute></>} />
              <Route path="/orders/:id" element={<><Navbar /><PrivateRoute><OrderDetail /></PrivateRoute></>} />
              <Route path="/payment/:orderId" element={<><Navbar /><PrivateRoute><Payment /></PrivateRoute></>} />
 
                </Routes>
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      background: 'var(--image-bg)',
                      color: 'var(--text)',
                      border: '1px solid var(--accent-border)',
                      borderRadius: '8px',
                    },
                    success: { iconTheme: { primary: 'var(--accent)', secondary: '#000' } },
                  }}
                />
              </Router>
            </AdminProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
 
export default App;
 