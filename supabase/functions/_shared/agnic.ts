// Shared Agnic constants for edge functions.
// AGNIC_HOSTNAME = the OAuth/app host (e.g. https://app.agnic.ai or https://agnic.ai).
// AGNIC_API_HOST = the REST API host. Per Agnic docs the API lives on https://api.agnic.ai.
//   Override with the AGNIC_API_HOST secret if Agnic ever moves it.
export const AGNIC_HOSTNAME = (Deno.env.get("AGNIC_HOSTNAME") ?? "").replace(/\/$/, "");
export const AGNIC_API_HOST = (Deno.env.get("AGNIC_API_HOST") ?? "https://api.agnic.ai").replace(/\/$/, "");
export const AGNIC_CLIENT_ID = Deno.env.get("AGNIC_CLIENT_ID") ?? "";

export const AGNIC = {
  // OAuth lives on the app host.
  authorize: () => `${AGNIC_HOSTNAME}/oauth/authorize`,
  token: () => `${AGNIC_HOSTNAME}/oauth/token`,
  // AI Gateway + REST API live on api.agnic.ai per docs.
  ai: () => `${AGNIC_API_HOST}/v1/chat/completions`,
  agents: () => `${AGNIC_API_HOST}/v1/agents`,
  // NOTE: email/* and kya/* are not in the public Agnic docs (Apr 2026).
  // Kept here for the existing scaffolding; calls will likely 404 until Agnic ships them.
  emailSend: () => `${AGNIC_API_HOST}/v1/email/send`,
  emailInbox: () => `${AGNIC_API_HOST}/v1/email/inbox`,
  kya: () => `${AGNIC_API_HOST}/v1/kya/status`,
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
