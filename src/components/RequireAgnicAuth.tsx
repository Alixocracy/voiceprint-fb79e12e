import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthed } from "@/integrations/agnic/session";
import { useVoiceprint } from "@/state/store";

export function RequireAgnicAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [authed, setAuthed] = useState<boolean>(() => isAuthed());
  const onboardingComplete = useVoiceprint((s) => s.onboardingComplete);

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

  // Authed but no Voice DNA yet → send into onboarding.
  const inOnboarding = location.pathname.startsWith("/onboarding");
  if (!onboardingComplete && !inOnboarding) {
    return <Navigate to="/onboarding/name" replace />;
  }

  return <>{children}</>;
}
