import { useMemo, useState } from "react";
import { SKILLS, type Skill } from "@/data/skills";
import { SYSTEMS, SYSTEM_ORDER, type SystemKey } from "@/data/systems";
import { useAgency } from "@/state/agencyStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, BellRing, Bell, Bot, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MyAgents() {
  const { installedSkillSlugs, notifySkillSlugs, toggleNotify } = useAgency();
  const [filter, setFilter] = useState<SystemKey | "all">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return SKILLS.filter((s) => {
      if (filter !== "all" && s.system !== filter) return false;
      if (q.trim() && !`${s.name} ${s.description}`.toLowerCase().includes(q.trim().toLowerCase())) return false;
      return true;
    });
  }, [filter, q]);

  return (
    <div className="max-w-7xl mx-auto px-8 pt-10 pb-20">
      <header className="mb-8">
        <h1 className="font-serif text-4xl text-foreground">My Agents</h1>
        <p className="font-serif italic text-muted-foreground mt-2">
          skills you can install to extend your agency
        </p>
      </header>

      <section className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-xl border border-border bg-surface-elevated p-5">
          <div className="flex items-start gap-3">
            <Bot className="size-4 mt-1 text-primary shrink-0" />
            <div>
              <h2 className="font-serif text-xl text-foreground">Install skills for your agent</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Use this page to install skills for your Voiceprint agent so it can manage repeat workflows
                across your 7 Systems. The same skill logic can also travel with you into agentic tools that
                support reusable instructions or skill files, such as Claude Code, OpenCode, Codex, Cursor,
                or Windsurf.
              </p>
            </div>
          </div>
        </div>

        <aside className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-start gap-3">
            <Terminal className="size-4 mt-1 text-muted-foreground shrink-0" />
            <div>
              <h2 className="font-serif text-lg text-foreground">About Perplexity</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Perplexity is strongest as a research and answer engine. Its agent products can take action,
                but treat these skills as prompts or context there unless direct skill installation is supported.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <div className="flex flex-wrap gap-2 mb-4">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>All</Chip>
        {SYSTEM_ORDER.map((k) => (
          <Chip
            key={k}
            active={filter === k}
            onClick={() => setFilter(k)}
            tint={SYSTEMS[k].hsl}
            fg={SYSTEMS[k].fg}
          >
            {SYSTEMS[k].label}
          </Chip>
        ))}
      </div>

      <div className="mb-6 max-w-md">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search skills…" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((skill) => (
          <SkillCard
            key={skill.slug}
            skill={skill}
            installed={installedSkillSlugs.includes(skill.slug)}
            notifying={notifySkillSlugs.includes(skill.slug)}
            onNotify={() => toggleNotify(skill.slug)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground italic font-serif">No skills match.</p>
        )}
      </div>
    </div>
  );
}

const Chip = ({
  active, onClick, children, tint, fg,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode; tint?: string; fg?: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "text-xs px-3 py-1.5 rounded-full border transition-colors",
      active ? "border-foreground/40 text-foreground bg-foreground/5" : "border-border text-muted-foreground hover:text-foreground",
    )}
    style={active && tint ? { backgroundColor: `hsl(${tint})`, color: fg ? `hsl(${fg})` : undefined, borderColor: `hsl(${tint})` } : undefined}
  >
    {children}
  </button>
);

const SkillCard = ({
  skill, installed, notifying, onNotify,
}: { skill: Skill; installed: boolean; notifying: boolean; onNotify: () => void }) => {
  const sys = SYSTEMS[skill.system];
  const status = installed ? "installed" : skill.status;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(skill.install_command);
      toast.success("Copied install command.");
    } catch {
      toast.error("Copy failed.");
    }
  };
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-serif text-lg text-foreground leading-tight">{skill.name}</h3>
        <StatusBadge status={status} />
      </div>
      <span
        className="inline-flex self-start text-[0.68rem] uppercase tracking-wider px-2 py-0.5 rounded-full mb-3"
        style={{ backgroundColor: `hsl(${sys.hsl})`, color: `hsl(${sys.fg})` }}
      >
        {sys.label}
      </span>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{skill.description}</p>
      <div className="rounded-md bg-background border border-border px-3 py-2 flex items-center gap-2 mb-3">
        <code className="text-[0.72rem] font-mono text-foreground/80 truncate flex-1">{skill.install_command}</code>
        <button onClick={copy} className="text-muted-foreground hover:text-foreground" aria-label="Copy">
          <Copy className="size-3.5" />
        </button>
      </div>
      {!installed && skill.status === "coming_soon" && (
        <Button
          size="sm"
          variant={notifying ? "quiet" : "outline"}
          onClick={onNotify}
          className="self-start"
        >
          {notifying ? <BellRing className="size-3.5" /> : <Bell className="size-3.5" />}
          {notifying ? "We will notify you" : "Notify me"}
        </Button>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    installed: { label: "Installed", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    coming_soon: { label: "Coming soon", cls: "bg-muted text-muted-foreground border-border" },
    available: { label: "Available", cls: "bg-blue-100 text-blue-800 border-blue-200" },
  };
  const m = map[status] ?? map.coming_soon;
  return (
    <span className={cn("text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded-full border whitespace-nowrap", m.cls)}>
      {m.label === "Installed" && <Check className="size-2.5 inline mr-0.5" />}
      {m.label}
    </span>
  );
};
