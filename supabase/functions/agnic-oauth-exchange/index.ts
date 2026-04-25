// Exchanges an OAuth authorization code for an access token.
// Body: { code, code_verifier, redirect_uri }
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AGNIC, AGNIC_CLIENT_ID, corsHeaders, jsonResponse, requireConfig } from "../_shared/agnic.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const cfgErr = requireConfig();
  if (cfgErr) return jsonResponse({ error: cfgErr }, 500);

  try {
    const { code, code_verifier, redirect_uri } = await req.json();
    if (!code || !code_verifier || !redirect_uri) {
      return jsonResponse({ error: "missing code, code_verifier, or redirect_uri" }, 400);
    }

    const form = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri,
      client_id: AGNIC_CLIENT_ID,
      code_verifier,
    });

    const resp = await fetch(AGNIC.token(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error("agnic token exchange failed", resp.status, data);
      return jsonResponse({ error: data?.error_description ?? data?.error ?? "token exchange failed" }, resp.status);
    }

    // Expected fields: access_token, refresh_token, expires_in, sub, agent_id, agent_email_alias, kya_status
    return jsonResponse({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      sub: data.sub,
      agent_id: data.agent_id,
      agent_email_alias: data.agent_email_alias,
      kya_status: data.kya_status ?? "none",
    });
  } catch (e) {
    console.error("agnic-oauth-exchange error", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "unknown error" }, 500);
  }
});
