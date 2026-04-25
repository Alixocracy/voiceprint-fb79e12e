import { useState } from "react";
import { Button } from "@/components/ui/button";
import { startAgnicLogin } from "@/integrations/agnic/oauth";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";

export function ConnectAgnicButton({
  variant = "default",
  label = "Connect Agnic",
}: {
  variant?: "default" | "studio" | "outline";
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    setLoading(true);
    try {
      await startAgnicLogin();
    } catch (e) {
      setLoading(false);
      toast.error(e instanceof Error ? e.message : "Could not start sign-in");
    }
  };
  return (
    <Button onClick={onClick} disabled={loading} variant={variant as any}>
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : <KeyRound className="size-3.5" />}
      {label}
    </Button>
  );
}
