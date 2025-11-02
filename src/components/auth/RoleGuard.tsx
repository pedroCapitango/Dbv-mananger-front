import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasAnyRole, normalizeRole, type AppRole } from '../../utils/roles';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AppRole[]; // when empty, anyone authenticated can access
  redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles, redirectTo = '/' }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles provided, enforce access; otherwise allow any authenticated user
  if (allowedRoles && allowedRoles.length > 0) {
    const role = normalizeRole(user?.role);
    const ok = hasAnyRole(role, allowedRoles);
    if (!ok) {
      // Optionally, could render a 403 component; for now redirect home
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
};
