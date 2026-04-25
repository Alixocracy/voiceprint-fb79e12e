// Agnic endpoint configuration.
// Hostname is set as a Lovable Cloud secret (AGNIC_HOSTNAME) for the
// edge functions. The frontend reads it indirectly via the auth-init
// edge function, which returns the authorize URL fully formed.
//
// In the browser we only need:
//   - a known callback path (must match what's registered in Agnic)
//   - the storage keys for the bearer token & PKCE verifier
export const AGNIC_CALLBACK_PATH = "/auth/callback";

export const AGNIC_STORAGE = {
  accessToken: "agnic.access_token",
  refreshToken: "agnic.refresh_token",
  expiresAt: "agnic.expires_at",
  pkceVerifier: "agnic.pkce_verifier",
  pkceState: "agnic.pkce_state",
  // Mirror of non-secret identity fields. profiles table will hold these
  // once Supabase auth lands; for now they live in the browser only.
  agnicSub: "agnic.sub",
  agnicEmail: "agnic.email",
  agnicName: "agnic.name",
  agnicAgentId: "agnic.agent_id",
  agentEmailAlias: "agnic.agent_email_alias",
  kyaStatus: "agnic.kya_status",
} as const;

// Server-side path derivation (used by edge functions only).
// Exported here for documentation; the edge functions duplicate this
// because they cannot import from src/.
//
// OAuth host (AGNIC_HOSTNAME, e.g. https://app.agnic.ai):
//   AUTHORIZE   = `${hostname}/oauth/authorize`
//   TOKEN       = `${hostname}/oauth/token`
//
// API host (AGNIC_API_HOST, default https://api.agnic.ai per docs):
//   AI          = `${apiHost}/v1/chat/completions`     (OpenAI-compatible)
//   AGENTS      = `${apiHost}/v1/agents`
//   EMAIL_SEND  = `${apiHost}/v1/email/send`           (not in public docs yet)
//   EMAIL_INBOX = `${apiHost}/v1/email/inbox`          (not in public docs yet)
//   KYA         = `${apiHost}/v1/kya/status`           (not in public docs yet)
