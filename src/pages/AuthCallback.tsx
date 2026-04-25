import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeAgnicLogin } from "@/integrations/agnic/oauth";
import { fetchKyaStatus } from "@/integrations/agnic/client";
import { AppShell } from "@/components/AppShell";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthCallback() {
  const nav = useNavigate();
  const [status, setStatus] = useState<"working" | "error">("working");
  const [message, setMessage] = useState("Connecting your agent…");

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        await completeAgnicLogin(params);
        // best-effort KYA refresh; failure is non-blocking
        try {
          await fetchKyaStatus();
        } catch (e) {
          console.warn("kya fetch failed", e);
        }
        toast.success("Connected to Agnic.");
        nav("/dashboard", { replace: true });
      } catch (e) {
        console.error(e);
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Could not connect.");
      }
    })();
  }, [nav]);

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-6 pt-24 text-center space-y-4">
        {status === "working" ? (
          <>
            <Loader2 className="size-6 animate-spin mx-auto text-primary" />
            <p className="font-serif text-foreground">{message}</p>
          </>
        ) : (
          <>
            <p className="font-serif text-xl text-foreground">Something went wrong</p>
            <p className="text-sm text-muted-foreground">{message}</p>
            <button
              onClick={() => nav("/", { replace: true })}
              className="text-sm text-primary hover:underline"
            >
              Back to start
            </button>
          </>
        )}
      </div>
    </AppShell>
  );
}
