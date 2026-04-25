import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthed } from "@/integrations/agnic/session";

export function RequireAgnicAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [authed, setAuthed] = useState<boolean>(() => isAuthed());

  useEffect(() => {
    const handler = () => setAuthed(isAuthed());
    window.addEventListener("agnic-session-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("agnic-session-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  if (!authed) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return <>{children}</>;
}
