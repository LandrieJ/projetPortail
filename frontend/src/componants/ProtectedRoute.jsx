import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isExpired } from 'react-jwt';

const ProtectedRoute = ({ jwt_access }) => {
  if (!jwt_access || isExpired(jwt_access)) {
    // Si l'utilisateur n'a pas de token ou si le token a expiré, redirige vers /login
    return <Navigate to="/login" />;
  }
  
  return <Outlet />; // Permet de rendre la route enfant si l'utilisateur est authentifié
};

export default ProtectedRoute;
