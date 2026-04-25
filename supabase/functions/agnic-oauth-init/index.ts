// Returns the Agnic OAuth authorize URL for a given PKCE challenge.
// Keeps AGNIC_HOSTNAME server-side.
// Body: { state, code_challenge, redirect_uri, scope? }
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AGNIC, AGNIC_CLIENT_ID, corsHeaders, jsonResponse, requireConfig } from "../_shared/agnic.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const cfgErr = requireConfig();
  if (cfgErr) return jsonResponse({ error: cfgErr }, 500);

  try {
    const { state, code_challenge, redirect_uri, scope } = await req.json();
    if (!state || !code_challenge || !redirect_uri) {
      return jsonResponse({ error: "missing state, code_challenge, or redirect_uri" }, 400);
    }

    const params = new URLSearchParams({
      response_type: "code",
      client_id: AGNIC_CLIENT_ID,
      redirect_uri,
      state,
      code_challenge,
      code_challenge_method: "S256",
      // Per Agnic Agent Email + KYA reference: payments:sign for AI Gateway,
      // balance:read for wallet, email:read for /api/agent/email/*, agent:read
      // for /api/agent/identity + /api/agent/credential.
      scope: scope ?? "payments:sign balance:read email:read agent:read",
    });

    return jsonResponse({ authorize_url: `${AGNIC.authorize()}?${params.toString()}` });
  } catch (e) {
    console.error("agnic-oauth-init error", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "unknown error" }, 500);
  }
});
