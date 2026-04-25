// Fetches KYA status from Agnic via /api/agent/identity.
// Body: { agnic_access_token }
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AGNIC, corsHeaders, jsonResponse, requireConfig } from "../_shared/agnic.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const cfgErr = requireConfig();
  if (cfgErr) return jsonResponse({ error: cfgErr }, 500);

  try {
    const { agnic_access_token } = await req.json().catch(() => ({}));
    if (!agnic_access_token) return jsonResponse({ error: "not authenticated with Agnic" }, 401);

    const resp = await fetch(AGNIC.identity(), {
      headers: { "Authorization": `Bearer ${agnic_access_token}` },
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error("agnic identity error", resp.status, data);
      return jsonResponse({ error: data?.error ?? "identity fetch failed" }, resp.status);
    }

    // Per docs: { hasAgent: boolean, status?: "active"|..., agentId?, ... }
    let status: "none" | "pending" | "active" = "none";
    if (data.hasAgent) {
      status = data.status === "active" ? "active" : "pending";
    }

    return jsonResponse({
      status,
      agent_id: data.agentId,
      email: data.email,
      trust_score: data.trustScore,
      wallet_address: data.walletAddress,
    });
  } catch (e) {
    console.error("agnic-kya-status error", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "unknown error" }, 500);
  }
});
