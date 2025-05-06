
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "@/services/authService";
import { getRoleById } from "@/services/userManagementService";

interface AuthGuardProps {
  children: ReactNode;
  requiredPermission?: string;
}

export function AuthGuard({ children, requiredPermission }: AuthGuardProps) {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const currentUser = getCurrentUser();
  
  useEffect(() => {
    // Log authentication status for debugging
    console.log("Auth status:", isAuth);
    console.log("Current user:", currentUser);
  }, [isAuth, currentUser]);
  
  // If user is not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If permission is required, check if user has it
  if (requiredPermission && currentUser) {
    const role = getRoleById(currentUser.roleId);
    if (!role || !role.permissions?.includes(requiredPermission)) {
      // Redirect to home or unauthorized page
      return <Navigate to="/" replace />;
    }
  }
  
  // If everything is fine, show the protected content
  return <>{children}</>;
}
