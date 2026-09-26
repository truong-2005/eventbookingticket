import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loading from './Loading';

/**
 * ProtectedRoute - bảo vệ route theo role
 * @param {string[]} allowedRoles - danh sách roles được phép
 * @param {string} redirectTo - redirect nếu không đủ quyền
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const userRoles = user?.roles || [];
    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasPermission) {
      if (userRoles.includes('ADMIN')) return <Navigate to="/admin" replace />;
      if (userRoles.includes('STAFF')) return <Navigate to="/staff" replace />;
      return <Navigate to="/" replace />;
    }
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
