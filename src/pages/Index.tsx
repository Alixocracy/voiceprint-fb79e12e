import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/AppShell";
import { useVoiceprint } from "@/state/store";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-voiceprint.jpg";

export default function Index() {
  const nav = useNavigate();
  const { onboardingComplete, dna, reset } = useVoiceprint();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/70">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Wordmark />
          <nav className="flex items-center gap-5 text-sm">
            {onboardingComplete && (
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                Studio
              </Link>
            )}
            <Button
              size="sm"
              variant={onboardingComplete ? "outline" : "default"}
              onClick={() => nav(onboardingComplete ? "/dashboard" : "/onboarding/name")}
            >
              {onboardingComplete ? "Open studio" : "Begin"}
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Hero background */}
          <div className="absolute inset-0 -z-10">
            <img
              src={heroBg}
              alt=""
              width={1920}
              height={1280}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            {/* Veil to keep text legible on the left */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
          </div>

          <div className="max-w-5xl mx-auto px-6 pt-28 pb-32">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-6">
              Voiceprint · for leaders who'd rather be themselves than prompt
            </p>
            <h1 className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight text-foreground max-w-4xl">
              Your voice.
              <br />
              <span className="italic text-primary">In writing.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-xl">
              A private studio that learns your voice once — then writes from it,
              forever. Drafts arrive in your inbox. You reply in plain English.
              No new app to live in.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                size="xl"
                variant="studio"
                onClick={() => nav(onboardingComplete ? "/dashboard" : "/onboarding/name")}
              >
                {onboardingComplete ? "Open the studio" : "Build my voice"}
                <ArrowRight className="size-4" />
              </Button>
              {dna && (
                <button
                  onClick={() => {
                    if (confirm("Reset the demo? This clears all local data.")) reset();
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Reset demo
                </button>
              )}
              <span className="text-sm text-muted-foreground font-serif italic">
                About 20 minutes. Once.
              </span>
            </div>
          </div>
        </section>

        {/* Three quiet promises */}
        <section className="border-t border-border/70 bg-surface">
          <div className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-12">
            <Promise
              kicker="Voice, not prompts"
              title="Be yourself once."
              body="A guided onboarding captures your hooks, rhythm, themes, and never-says. Every draft pulls from it."
            />
            <Promise
              kicker="Inbox-native"
              title="Edit by replying."
              body="Drafts land in your email from your own agent. Reply in plain English. No dashboard required."
            />
            <Promise
              kicker="Quiet by design"
              title="No streaks. No theater."
              body="No analytics dopamine, no gamification. A studio for people who write because they have something to say."
            />
          </div>
        </section>

        {/* Sample voice line */}
        <section className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-6">
            A voice match, not a clone
          </p>
          <blockquote className="font-serif italic text-2xl md:text-3xl text-foreground leading-snug">
            "Most strategy decisions are staffing decisions in better clothes.
            Once you see it, you can't unsee it."
          </blockquote>
          <p className="text-sm text-muted-foreground mt-6">
            Generated from a Voice DNA. Sounds like the person, not the tool.
          </p>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>Voiceprint · your voice, in writing.</span>
          <span className="font-serif italic">A private studio.</span>
        </div>
      </footer>
    </div>
  );
}

const Promise = ({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) => (
  <div>
    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
      {kicker}
    </p>
    <p className="font-serif text-2xl text-foreground mb-3 leading-snug">
      {title}
    </p>
    <p className="text-muted-foreground leading-relaxed">{body}</p>
  </div>
);
