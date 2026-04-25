// Shared Agnic constants for edge functions.
// Hostname is set as a Lovable Cloud secret.
export const AGNIC_HOSTNAME = (Deno.env.get("AGNIC_HOSTNAME") ?? "").replace(/\/$/, "");
export const AGNIC_CLIENT_ID = Deno.env.get("AGNIC_CLIENT_ID") ?? "";

export const AGNIC = {
  authorize: () => `${AGNIC_HOSTNAME}/oauth/authorize`,
  token: () => `${AGNIC_HOSTNAME}/oauth/token`,
  ai: () => `${AGNIC_HOSTNAME}/v1/ai/chat/completions`,
  agents: () => `${AGNIC_HOSTNAME}/v1/agents`,
  emailSend: () => `${AGNIC_HOSTNAME}/v1/email/send`,
  emailInbox: () => `${AGNIC_HOSTNAME}/v1/email/inbox`,
  kya: () => `${AGNIC_HOSTNAME}/v1/kya/status`,
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function requireConfig(): string | null {
  if (!AGNIC_HOSTNAME) return "AGNIC_HOSTNAME is not configured";
  if (!AGNIC_CLIENT_ID) return "AGNIC_CLIENT_ID is not configured";
  return null;
}
