import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { ConnectAgnicButton } from "@/components/ConnectAgnicButton";
import { isAuthed } from "@/integrations/agnic/session";
import { useVoiceprint } from "@/state/store";

export default function Login() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const onboardingComplete = useVoiceprint((s) => s.onboardingComplete);
  const redirect = params.get("redirect") ?? (onboardingComplete ? "/dashboard" : "/onboarding/name");

  useEffect(() => {
    if (isAuthed()) nav(redirect, { replace: true });
  }, [nav, redirect]);

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-6 pt-24 text-center space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Sign in
          </p>
          <h1 className="font-serif text-4xl text-foreground leading-tight">
            Your voice,
            <br />
            <span className="italic text-primary">your account.</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed pt-2">
            Voiceprint signs you in through Agnic — the same identity that powers
            your agent's email and AI gateway. One connection, end to end.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <ConnectAgnicButton variant="studio" label="Continue with Agnic" />
          <p className="text-xs text-muted-foreground font-serif italic">
            You'll come back here when it's done.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
