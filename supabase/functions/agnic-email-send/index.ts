// Sends an email via Agnic Agent Email API (POST /api/agent/email/send).
// Plain text only per docs. The draft_id correlation is stored locally only —
// Agnic's send endpoint does not accept arbitrary metadata today.
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

    // Tag draft_id into the subject so inbound replies can be correlated back
    // (Agnic doesn't support custom metadata on send yet).
    const taggedSubject = subject.includes(`[draft:${draft_id}]`)
      ? subject
      : `${subject} [draft:${draft_id}]`;

    const resp = await fetch(AGNIC.emailSend(), {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${agnic_access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject: taggedSubject,
        body,
      }),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error("agnic email send error", resp.status, data);
      return jsonResponse({ error: data?.error ?? "email send failed" }, resp.status);
    }

    return jsonResponse({
      message_id: data.messageId,
      from: data.from,
      to: data.to,
    });
  } catch (e) {
    console.error("agnic-email-send error", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "unknown error" }, 500);
  }
});
