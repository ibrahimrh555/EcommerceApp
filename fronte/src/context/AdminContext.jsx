import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('adminUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (admin?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`;
    }
  }, [admin]);

  const loginAdmin = (userData) => {
    setAdmin(userData);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('adminUser');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AdminContext.Provider value={{ admin, loginAdmin, logoutAdmin, sidebarOpen, setSidebarOpen }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);