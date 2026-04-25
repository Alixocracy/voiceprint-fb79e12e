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
  agnicAgentId: "agnic.agent_id",
  agentEmailAlias: "agnic.agent_email_alias",
  kyaStatus: "agnic.kya_status",
} as const;

// Server-side path derivation (used by edge functions only).
// Exported here for documentation; the edge functions duplicate this
// because they cannot import from src/.
//
//   AUTHORIZE   = `${hostname}/oauth/authorize`
//   TOKEN       = `${hostname}/oauth/token`
//   AI          = `${hostname}/v1/ai/chat/completions`
//   AGENTS      = `${hostname}/v1/agents`
//   EMAIL_SEND  = `${hostname}/v1/email/send`
//   EMAIL_INBOX = `${hostname}/v1/email/inbox`
//   KYA         = `${hostname}/v1/kya/status`
