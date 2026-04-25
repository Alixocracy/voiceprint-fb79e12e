// Fetches KYA status from Agnic.
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

    const resp = await fetch(AGNIC.kya(), {
      headers: { "Authorization": `Bearer ${agnic_access_token}` },
    });
    const data = await resp.json();
    if (!resp.ok) {
      console.error("agnic kya error", resp.status, data);
      return jsonResponse({ error: data?.error ?? "kya fetch failed" }, resp.status);
    }

    const status: "none" | "pending" | "active" =
      data.status === "active" || data.status === "pending" ? data.status : "none";

    return jsonResponse({ status });
  } catch (e) {
    console.error("agnic-kya-status error", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "unknown error" }, 500);
  }
});
