import { useMemo, useState } from "react";
import { TOOLS, TOOL_CATEGORIES, CATEGORY_HSL, type ToolCategory, type Tool } from "@/data/tools";
import { Input } from "@/components/ui/input";
import { ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ToolsPage() {
  const [filter, setFilter] = useState<ToolCategory | "all" | "shirin">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      if (filter === "shirin" && !t.shirin_uses) return false;
      if (filter !== "all" && filter !== "shirin" && t.category !== filter) return false;
      if (q.trim() && !`${t.name} ${t.description}`.toLowerCase().includes(q.trim().toLowerCase())) return false;
      return true;
    });
  }, [filter, q]);

  return (
    <div className="max-w-7xl mx-auto px-8 pt-10 pb-20">
      <header className="mb-8">
        <h1 className="font-serif text-4xl text-foreground">Tools</h1>
        <p className="font-serif italic text-muted-foreground mt-2">the rest of the stack we recommend</p>
      </header>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>All</Chip>
        {TOOL_CATEGORIES.map((c) => {
          const tone = CATEGORY_HSL[c];
          return (
            <Chip
              key={c}
              active={filter === c}
              onClick={() => setFilter(c)}
              tint={tone.tint}
              fg={tone.fg}
            >
              {c}
            </Chip>
          );
        })}
        <div className="ml-auto">
          <Chip active={filter === "shirin"} onClick={() => setFilter("shirin")}>
            <Sparkles className="size-3 inline mr-1" />
            Shirin uses
          </Chip>
        </div>
      </div>

      <div className="mb-6 max-w-md">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools…" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((t) => <ToolCard key={t.slug} tool={t} />)}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground italic font-serif">No tools match.</p>
        )}
      </div>
    </div>
  );
}

const Chip = ({
  active, onClick, children, tint, fg,
}: { active: boolean; onClick: () => void; children: React.ReactNode; tint?: string; fg?: string }) => (
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

const ToolCard = ({ tool }: { tool: Tool }) => {
  const tone = CATEGORY_HSL[tool.category];
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-border bg-surface-elevated p-5 hover:border-primary/30 hover:shadow-sm transition-all flex flex-col group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-serif text-lg text-foreground leading-tight">{tool.name}</h3>
        <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-foreground" />
      </div>
      <span
        className="inline-flex self-start text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded-full mb-3"
        style={{ backgroundColor: `hsl(${tone.tint})`, color: `hsl(${tone.fg})` }}
      >
        {tool.category}
      </span>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-3">{tool.description}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {tool.shirin_uses && (
          <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary/20 inline-flex items-center gap-1">
            <Sparkles className="size-2.5" /> Shirin uses this
          </span>
        )}
        <span className="text-[0.65rem] px-2 py-0.5 rounded-full border border-border text-muted-foreground capitalize">
          {tool.pricing_hint}
        </span>
      </div>
    </a>
  );
};
