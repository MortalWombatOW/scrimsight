import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const CallbackPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 dark:text-red-400">
          Authentication Error: {auth.error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
};

export default CallbackPage;
