import { useEffect } from "react";
import { Link } from "react-router-dom";
import { WEEKLY_PLAN } from "@/data/weeklyPlan";
import { SYSTEMS } from "@/data/systems";
import { SKILL_BY_SLUG } from "@/data/skills";
import { TOOL_BY_SLUG } from "@/data/tools";
import { useAgency, currentWeek } from "@/state/agencyStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const SYSTEMS_IMAGE_URL =
  "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/341jCwjFdXQzsNWcQyDJ/media/69c60ca58d47be55801a7258.png";

export default function SevenSystems() {
  const { ensureSignup, signupAt, taskCompletion, toggleTask, checkins, setCheckin, weeksWithProgress } = useAgency();
  useEffect(() => { ensureSignup(); }, [ensureSignup]);

  const cw = currentWeek(signupAt);
  const progressPct = Math.round((weeksWithProgress() / 12) * 100);

  return (
    <div className="max-w-5xl mx-auto px-8 pt-10 pb-20">
      <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl text-foreground">7 Systems</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            A guided 12-week build plan for turning your expertise into a lean, AI-powered
            consulting business. Each week focuses on one business system, with practical
            tasks, agent skills, tools, and a check-in to keep momentum visible.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="group relative w-full max-w-xs overflow-hidden rounded-lg border border-border bg-surface-elevated p-2 md:w-64"
              aria-label="Zoom seven systems overview image"
            >
              <img
                src={SYSTEMS_IMAGE_URL}
                alt="Seven systems overview"
                className="max-h-36 w-full object-contain"
              />
              <span className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Search className="size-4" />
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl p-4">
            <img
              src={SYSTEMS_IMAGE_URL}
              alt="Seven systems overview enlarged"
              className="max-h-[80vh] w-full object-contain"
            />
          </DialogContent>
        </Dialog>
      </header>

      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{weeksWithProgress()} of 12 weeks started</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="space-y-5">
        {WEEKLY_PLAN.map((week) => {
          const sys = SYSTEMS[week.focus_system];
          const isCurrent = week.week_number === cw;
          const isFuture = week.week_number > cw;
          const prevCheckinFilled = week.week_number === 1 || Boolean(checkins[week.week_number - 1]?.text?.trim());
          const disabled = isFuture && !prevCheckinFilled;
          return (
            <div
              key={week.week_number}
              className={cn(
                "rounded-xl border bg-surface-elevated p-6",
                isCurrent ? "border-primary/40 shadow-sm" : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                    Week {week.week_number}
                  </div>
                  <span
                    className="text-[0.68rem] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `hsl(${sys.hsl})`, color: `hsl(${sys.fg})` }}
                  >
                    {sys.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[0.68rem] uppercase tracking-wider text-primary font-medium">
                      current week
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-serif text-xl text-foreground mb-4">{week.title}</h3>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] mb-5">
                <ul className="space-y-2">
                  {week.tasks.map((task, idx) => {
                    const checked = Boolean(taskCompletion[`${week.week_number}:${idx}`]);
                    return (
                      <li key={idx} className="flex items-start gap-3">
                        <Checkbox
                          id={`task-${week.week_number}-${idx}`}
                          checked={checked}
                          onCheckedChange={() => toggleTask(week.week_number, idx)}
                          disabled={disabled}
                          className="mt-0.5"
                        />
                        <label
                          htmlFor={`task-${week.week_number}-${idx}`}
                          className={cn(
                            "text-sm leading-relaxed cursor-pointer",
                            checked ? "text-muted-foreground line-through" : "text-foreground",
                            disabled && "opacity-60 cursor-not-allowed",
                          )}
                          title={disabled ? "Fill in the previous week's check-in to unlock" : undefined}
                        >
                          {task}
                        </label>
                      </li>
                    );
                  })}
                </ul>

                <aside
                  className="rounded-lg border border-border bg-background px-4 py-3"
                  style={{ boxShadow: `inset 3px 0 0 hsl(${sys.hslSolid})` }}
                >
                  <p className="text-[0.68rem] uppercase tracking-wider text-muted-foreground mb-1.5">
                    Guide
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">
                    {week.guide}
                  </p>
                </aside>
              </div>

              {week.week_number === 1 && (
                <div className="mb-5 overflow-hidden rounded-lg border border-border bg-background">
                  <iframe
                    className="aspect-video w-full"
                    src="https://www.youtube.com/embed/2-lmDOEfPx4"
                    title="7 Systems introduction"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              )}

              {(week.suggested_skill_slugs.length > 0 || week.suggested_tool_slugs.length > 0) && (
                <div className="flex flex-wrap items-center gap-1.5 mb-5">
                  {week.suggested_skill_slugs.map((slug) => {
                    const s = SKILL_BY_SLUG[slug];
                    if (!s) return null;
                    return (
                      <Link
                        key={slug}
                        to="/my-agents"
                        className="text-[0.68rem] px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary/15 hover:bg-primary/10"
                      >
                        skill · {s.name}
                      </Link>
                    );
                  })}
                  {week.suggested_tool_slugs.map((slug) => {
                    const t = TOOL_BY_SLUG[slug];
                    if (!t) return null;
                    return (
                      <Link
                        key={slug}
                        to="/tools"
                        className="text-[0.68rem] px-2 py-0.5 rounded-full bg-accent text-accent-foreground border border-border hover:bg-accent/80"
                      >
                        tool · {t.name}
                      </Link>
                    );
                  })}
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  How did this week go?
                </p>
                <Textarea
                  rows={2}
                  defaultValue={checkins[week.week_number]?.text ?? ""}
                  onBlur={(e) => setCheckin(week.week_number, e.target.value)}
                  placeholder="A line or two for future you."
                  className="text-sm bg-background"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
