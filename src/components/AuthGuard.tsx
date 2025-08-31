import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useScrimsightNavigation } from "../hooks/useScrimsightNavigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const auth = useAuth();
  const { navigate } = useScrimsightNavigation();

  useEffect(() => {
    console.log("AuthGuard mounted, checking authentication status");
    if (!auth.isAuthenticated && !auth.isLoading) {
      console.warn("User is not authenticated, redirecting to login");
      navigate("/");
    }
    console.log("AuthGuard authentication status is", auth.isAuthenticated);
  }, [auth.isAuthenticated, auth.isLoading, navigate]);

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
