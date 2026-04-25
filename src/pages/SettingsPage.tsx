import { Link } from "react-router-dom";
import { useVoiceprint } from "@/state/store";
import { useAgnicSession } from "@/integrations/agnic/useAgnicSession";

export default function SettingsPage() {
  const { agentName, agentEmailAlias, primaryEmail } = useVoiceprint();
  const session = useAgnicSession();

  return (
    <div className="max-w-2xl mx-auto px-8 pt-12 pb-20">
      <h1 className="font-serif text-4xl text-foreground mb-2">Settings</h1>
      <p className="font-serif italic text-muted-foreground mb-10">a quiet corner for the basics</p>

      <section className="space-y-6">
        <Field label="Agent name" value={agentName || "—"} />
        <Field label="Agent email alias" value={agentEmailAlias || "—"} mono />
        <Field label="Primary email" value={primaryEmail || "—"} />
        <Field
          label="Agnic connection"
          value={session ? `Connected${session.email ? ` as ${session.email}` : ""}` : "Not connected"}
        />
        <Field label="KYA status" value={session?.kyaStatus ?? "—"} />
      </section>

      <div className="mt-12 border-t border-border pt-6 space-y-3 text-sm">
        <p>
          <Link to="/voice" className="text-primary hover:underline">
            Edit your Voice DNA →
          </Link>
        </p>
        <p>
          <Link to="/onboarding/name" className="text-primary hover:underline">
            Re-run onboarding →
          </Link>
        </p>
      </div>
    </div>
  );
}

const Field = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
    <p className={mono ? "font-mono text-sm text-foreground" : "text-foreground"}>{value}</p>
  </div>
);
