// Sends an email via Agnic.
// Body: { to, subject, body, draft_id, agnic_access_token }
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AGNIC, corsHeaders, jsonResponse, requireConfig } from "../_shared/agnic.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const cfgErr = requireConfig();
  if (cfgErr) return jsonResponse({ error: cfgErr }, 500);

  try {
    const { to, subject, body, draft_id, agnic_access_token } = await req.json();
    if (!agnic_access_token) return jsonResponse({ error: "not authenticated with Agnic" }, 401);
    if (!to || !subject || !body || !draft_id) {
      return jsonResponse({ error: "missing to, subject, body, or draft_id" }, 400);
    }

    const resp = await fetch(AGNIC.emailSend(), {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${agnic_access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        body,
        // metadata used to correlate inbound replies back to the draft
        metadata: { draft_id },
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error("agnic email send error", resp.status, data);
      return jsonResponse({ error: data?.error ?? "email send failed" }, resp.status);
    }

    return jsonResponse({ message_id: data.message_id ?? data.id });
  } catch (e) {
    console.error("agnic-email-send error", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "unknown error" }, 500);
  }
});
