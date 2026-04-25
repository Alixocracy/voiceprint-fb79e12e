import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { clearSession } from "@/integrations/agnic/session";
import { useAgnicSession } from "@/integrations/agnic/useAgnicSession";

export const Wordmark = ({ className }: { className?: string }) => (
  <Link
    to="/"
    className={cn(
      "font-serif text-[1.35rem] tracking-tight text-foreground inline-flex items-baseline gap-1.5",
      className,
    )}
  >
    <span>Voiceprint</span>
    <span className="text-primary text-base leading-none">·</span>
  </Link>
);

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNav = location.pathname.startsWith("/onboarding");
  const session = useAgnicSession();
  const nav = useNavigate();
  const signOut = () => {
    clearSession();
    nav("/", { replace: true });
  };
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/70">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Wordmark />
          {!hideNav && (
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <NavItem to="/dashboard">Studio</NavItem>
              <NavItem to="/voice">Voice</NavItem>
              {session && (
                <button
                  onClick={signOut}
                  className="transition-colors hover:text-foreground"
                >
                  Sign out
                </button>
              )}
            </nav>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/70 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>Voiceprint · your voice, in writing.</span>
          <span className="font-serif italic">A private studio.</span>
        </div>
      </footer>
    </div>
  );
};

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const active = pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={cn(
        "transition-colors hover:text-foreground",
        active && "text-foreground",
      )}
    >
      {children}
    </Link>
  );
};
