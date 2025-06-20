import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAtom, ScrimsightUser } from "../atoms/auth";
import { useSetAtom } from "jotai";

export const CallbackPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const setAuthAtom = useSetAtom(authAtom);

  useEffect(() => {
    const parseAuthResponse = async (): Promise<void> => {
      if (!auth.user) {
        console.error("No user in auth response");
        return;
      }
      if (!auth.isAuthenticated) {
        console.error("User is not authenticated");
        return;
      }
      try {
        const userInfo = await fetch("https://discord.com/api/users/@me", {
          headers: {
            Authorization: `${auth.user.token_type} ${auth.user.access_token}`,
          },
        });
        if (!userInfo.ok) {
          console.error("Failed to fetch user info:", userInfo.statusText);
          return;
        }
        const userInfoJson = await userInfo.json();
        console.log("User info:", userInfoJson);
        const scrimsightUser: ScrimsightUser = {
          username: userInfoJson.global_name,
          avatar: `https://cdn.discordapp.com/avatars/${userInfoJson.id}/${userInfoJson.avatar}.png?size=64`,
          plan: "pro", // Default plan, can be updated based on your logic
        };
        console.log("Scrimsight user:", scrimsightUser);
        setAuthAtom({
          authenticatedUser: scrimsightUser,
        });
        navigate("/app");
        return;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
      navigate("/");
    };
    parseAuthResponse();
  }, [auth.isAuthenticated, navigate, auth.user]);

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
