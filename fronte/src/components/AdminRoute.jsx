import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function AdminRoute({ children }) {
  const { admin } = useAdmin();
  if (!admin || admin.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}