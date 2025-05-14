
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
    console.log("Current location:", location.pathname);
  }, [isAuth, currentUser, location]);
  
  // If user is not authenticated, redirect to login
  if (!isAuth) {
    console.log("User is not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If permission is required, check if user has it
  if (requiredPermission && currentUser) {
    // Check if user has required permission via role
    const userRoleId = currentUser.roleId;
    const userRole = userRoleId ? getRoleById(userRoleId) : undefined;
                     
    if (!userRole || !userRole.permissions?.includes(requiredPermission)) {
      console.log("User doesn't have required permission:", requiredPermission);
      // Redirect to home or unauthorized page
      return <Navigate to="/" replace />;
    }
  }
  
  // If everything is fine, show the protected content
  console.log("Auth check passed, showing protected content");
  return <>{children}</>;
}
