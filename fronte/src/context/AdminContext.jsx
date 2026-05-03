import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Stats
  const fetchStats = () => request(async () => {
    const { data } = await axios.get('/api/admin/stats');
    setStats(data);
    return data;
  });

  // Products
  const fetchProducts = () => request(async () => {
    const { data } = await axios.get('/api/admin/products');
    setProducts(data);
    return data;
  });
  const createProduct = (body) => request(async () => {
    const { data } = await axios.post('/api/admin/products', body);
    setProducts(prev => [data, ...prev]);
    return data;
  });
  const updateProduct = (id, body) => request(async () => {
    const { data } = await axios.put(`/api/admin/products/${id}`, body);
    setProducts(prev => prev.map(p => p._id === id ? data : p));
    return data;
  });
  const deleteProduct = (id) => request(async () => {
    await axios.delete(`/api/admin/products/${id}`);
    setProducts(prev => prev.filter(p => p._id !== id));
  });

  // Orders
  const fetchOrders = () => request(async () => {
    const { data } = await axios.get('/api/admin/orders');
    setOrders(data);
    return data;
  });
  const updateOrderStatus = (id, status) => request(async () => {
    const { data } = await axios.put(`/api/admin/orders/${id}`, { status });
    setOrders(prev => prev.map(o => o._id === id ? data : o));
    return data;
  });

  // Users
  const fetchUsers = () => request(async () => {
    const { data } = await axios.get('/api/admin/users');
    setUsers(data);
    return data;
  });
  const deleteUser = (id) => request(async () => {
    await axios.delete(`/api/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u._id !== id));
  });
  const updateUserRole = (id, role) => request(async () => {
    const { data } = await axios.put(`/api/admin/users/${id}/role`, { role });
    setUsers(prev => prev.map(u => u._id === id ? data : u));
    return data;
  });

  return (
    <AdminContext.Provider value={{
      stats, products, orders, users, loading, error,
      fetchStats, fetchProducts, createProduct, updateProduct, deleteProduct,
      fetchOrders, updateOrderStatus,
      fetchUsers, deleteUser, updateUserRole,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);