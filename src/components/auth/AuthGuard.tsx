
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "@/services/auth";
import { getRoleById } from "@/services/userManagementService";
import { User } from "@/types";
// Import the Spinner component with relative path to avoid module resolution issues
import { Spinner } from "../../components/ui/spinner";

interface AuthGuardProps {
  children: ReactNode;
  requiredPermission?: string;
}

export function AuthGuard({ children, requiredPermission }: AuthGuardProps) {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check authentication status using Supabase Auth
        const authStatus = await isAuthenticated();
        setIsAuth(authStatus);
        
        if (authStatus) {
          // Get current user if authenticated
          const user = await getCurrentUser();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [location]);
  
  useEffect(() => {
    // Log authentication status for debugging
    console.log("Auth status:", isAuth);
    console.log("Current user:", currentUser);
    console.log("Current location:", location.pathname);
  }, [isAuth, currentUser, location]);
  
  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
        <span className="ml-2">Memeriksa autentikasi...</span>
      </div>
    );
  }
  
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
