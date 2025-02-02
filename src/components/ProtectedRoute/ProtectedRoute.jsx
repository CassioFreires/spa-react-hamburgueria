import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { user } = useUser(); // Obtém o usuário do contexto

  // Verifica se o usuário está autenticado e se ele tem o perfil adequado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(user.name)) {
    // Redireciona para uma página de acesso negado ou outra de sua escolha
    return <Navigate to="/" replace />;
  }

  // Se o usuário está autenticado e tem o perfil correto, renderiza a rota protegida
  return <Outlet />;
};

export default ProtectedRoute;
