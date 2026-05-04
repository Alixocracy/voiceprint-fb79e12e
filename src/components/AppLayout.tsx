import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Mic, FolderOpen, Sparkles, LayoutGrid, Wrench, Settings, ChevronsLeft, ChevronsRight, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { clearSession } from "@/integrations/agnic/session";
import { useAgnicSession } from "@/integrations/agnic/useAgnicSession";
import { useVoiceprint } from "@/state/store";

const NAV = [
  { to: "/my-voice",     label: "My Voice",     icon: Mic,        sub: "Create content with your voice DNA." },
  { to: "/my-documents", label: "My Documents", icon: FolderOpen, sub: "Your knowledge base for source material." },
  { to: "/my-agents",    label: "My Agent Skills", icon: Sparkles, sub: "Build assistants for repeat workflows." },
  { to: "/7-systems",    label: "7 Systems",    icon: LayoutGrid, sub: "Turn expertise into operating systems." },
  { to: "/tools",        label: "Tools",        icon: Wrench,     sub: "Explore apps that extend your agency." },
  { to: "/engagement-os", label: "Engagement OS", icon: Target,   sub: "Track client engagements end to end." },
];

const STORAGE_KEY = "voiceprint.sidebarCollapsed";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const nav = useNavigate();
  const session = useAgnicSession();
  const { agentName, agentEmailAlias } = useVoiceprint();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  const signOut = () => {
    clearSession();
    nav("/", { replace: true });
  };

  // Don't show sidebar on onboarding/marketing/auth.
  const hideSidebar =
    location.pathname === "/" ||
    location.pathname.startsWith("/onboarding") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/auth");

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 h-dvh shrink-0 border-r border-border bg-surface flex flex-col transition-[width] duration-200",
          collapsed ? "w-16" : "w-60",
        )}
      >
        {/* Brand */}
        <div className={cn("px-4 pt-5 pb-4 border-b border-border", collapsed && "px-2 text-center")}>
          <Link to="/my-voice" className="font-serif text-foreground inline-flex items-baseline gap-1.5">
            <span className={cn("tracking-tight", collapsed ? "text-base" : "text-[1.3rem]")}>
              {collapsed ? "V" : "Voiceprint"}
            </span>
            {!collapsed && <span className="text-primary text-sm leading-none">·</span>}
          </Link>
          {!collapsed && (
            <p className="font-serif italic text-xs text-muted-foreground mt-1.5 leading-snug">
              your AI-powered consulting agency
            </p>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-2 py-4 space-y-0.5">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Agent footer + Settings */}
        <div className="shrink-0 border-t border-border px-2 py-3 space-y-1">
          {!collapsed && (agentName || agentEmailAlias) && (
            <div className="px-3 pb-2">
              <p className="text-[0.78rem] font-serif text-foreground truncate">
                {agentName || "Your agent"}
              </p>
              <p className="text-[0.7rem] text-muted-foreground font-mono truncate">
                {agentEmailAlias || ""}
              </p>
            </div>
          )}
          <NavItem to="/settings" label="Settings" icon={Settings} collapsed={collapsed} />
          {session && (
            <button
              onClick={signOut}
              className={cn(
                "w-full text-left text-xs text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5",
                collapsed && "text-center px-0",
              )}
              title="Sign out"
            >
              {collapsed ? "↩" : "Sign out"}
            </button>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "w-full inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5",
              collapsed && "justify-center px-0",
            )}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronsRight className="size-3.5" /> : (
              <>
                <ChevronsLeft className="size-3.5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      <main className={cn("min-w-0 transition-[margin-left] duration-200", collapsed ? "ml-16" : "ml-60")}>
        {children}
      </main>
    </div>
  );
};

const NavItem = ({
  to,
  label,
  icon: Icon,
  sub,
  collapsed,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  sub?: string;
  collapsed: boolean;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "group flex items-start gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        "hover:bg-primary-soft/60 hover:text-foreground",
        isActive ? "bg-primary-soft text-primary" : "text-muted-foreground",
        collapsed && "justify-center px-0 py-2.5",
      )
    }
    title={collapsed ? label : undefined}
  >
    <Icon className={cn("size-4 mt-px shrink-0", "text-current")} />
    {!collapsed && (
      <span className="flex-1 min-w-0">
        <span className="block leading-none">{label}</span>
        {sub && (
          <span className="block text-[0.68rem] text-muted-foreground/80 mt-1 italic font-serif">
            {sub}
          </span>
        )}
      </span>
    )}
  </NavLink>
);
