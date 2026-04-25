import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ProgressBar } from "@/components/StepIndicator";
import { Wordmark } from "@/components/AppShell";
import { clearSession } from "@/integrations/agnic/session";
import { useAgnicSession } from "@/integrations/agnic/useAgnicSession";

const STEPS = [
  { path: "/onboarding/name", label: "Name your agent" },
  { path: "/onboarding/substance", label: "Substance" },
  { path: "/onboarding/gallery", label: "Voice gallery" },
  { path: "/onboarding/mix", label: "Mix the voice" },
  { path: "/onboarding/dna", label: "Voice DNA" },
  { path: "/onboarding/wow", label: "First draft" },
];

export default function OnboardingLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const session = useAgnicSession();
  const idx = Math.max(
    0,
    STEPS.findIndex((s) => pathname.startsWith(s.path)),
  );
  const stepNumber = idx + 1;
  const label = STEPS[idx]?.label ?? "";
  const signOut = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Wordmark />
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/")}
              className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Save & exit
            </button>
            {session && (
              <button
                onClick={signOut}
                className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-10 pb-4">
        <div className="flex items-end justify-between gap-6 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              The Voice Creator
            </p>
            <h1 className="font-serif text-2xl text-foreground">
              {label}
              <span className="text-muted-foreground"> — step {stepNumber} of 6</span>
            </h1>
          </div>
        </div>
        <ProgressBar step={stepNumber} total={6} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Outlet />
      </div>
    </div>
  );
}
