import { useEffect, useState } from "react";
import { loadSession, type AgnicSession } from "@/integrations/agnic/session";

export function useAgnicSession(): AgnicSession | null {
  const [s, setS] = useState<AgnicSession | null>(() => loadSession());
  useEffect(() => {
    const handler = () => setS(loadSession());
    window.addEventListener("agnic-session-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("agnic-session-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return s;
}
