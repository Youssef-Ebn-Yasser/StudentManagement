import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import NoAccess from './NoAccess/NoAccess';
const userRole = localStorage.getItem('userRole');
const ProtectedRoutes = ({ isAuth, accessRole }) => {
  if (!isAuth) {
    return <Navigate to="/auth/login" />;
  }

  const hasAccess = 
    accessRole === 'all' || userRole === accessRole;

  if (!hasAccess) {
    return <NoAccess />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
