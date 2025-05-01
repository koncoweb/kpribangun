
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getCurrentUser, hasRole } from "@/services/authService";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const currentUser = getCurrentUser();
  
  // If user is not authenticated, redirect to login
  if (!isAuth || !currentUser) {
    // Redirect to appropriate login page
    if (location.pathname.includes('/anggota/') && !location.pathname.includes('/anggota/new')) {
      return <Navigate to="/anggota-login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If allowedRoles is specified, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(role => {
      if (role === "anggota" && currentUser.anggotaId) return true;
      return hasRole(role);
    });
    
    if (!hasAllowedRole) {
      // Redirect to appropriate page based on role
      if (currentUser.anggotaId) {
        return <Navigate to={`/anggota/${currentUser.anggotaId}`} replace />;
      }
      return <Navigate to="/" replace />;
    }
  }
  
  // If everything is fine, show the protected content
  return <>{children}</>;
}

export function AnggotaGuard({ children }: { children: ReactNode }) {
  const currentUser = getCurrentUser();
  const location = useLocation();
  const anggotaIdFromUrl = location.pathname.split("/").pop();
  
  if (!currentUser) {
    return <Navigate to="/anggota-login" replace />;
  }
  
  // Super admin and admin can access all anggota pages
  if (hasRole("role_superadmin") || hasRole("role_admin")) {
    return <>{children}</>;
  }
  
  // Anggota can only access their own page
  if (currentUser.anggotaId && currentUser.anggotaId === anggotaIdFromUrl) {
    return <>{children}</>;
  }
  
  // Redirect to appropriate page
  return <Navigate to={`/anggota/${currentUser.anggotaId}`} replace />;
}
