// Polls Agnic email inbox, dedupes via processed_emails, writes edit_requests.
// Body: { agnic_access_token }
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { AGNIC, corsHeaders, jsonResponse, requireConfig } from "../_shared/agnic.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const cfgErr = requireConfig();
  if (cfgErr) return jsonResponse({ error: cfgErr }, 500);

  try {
    const { agnic_access_token } = await req.json().catch(() => ({}));
    if (!agnic_access_token) return jsonResponse({ error: "not authenticated with Agnic" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const resp = await fetch(`${AGNIC.emailInbox()}?limit=50`, {
      headers: { "Authorization": `Bearer ${agnic_access_token}` },
    });
    const data = await resp.json();
    if (!resp.ok) {
      console.error("agnic inbox fetch error", resp.status, data);
      return jsonResponse({ error: data?.error ?? "inbox fetch failed" }, resp.status);
    }

    const messages: Array<{
      id: string;
      from?: string;
      body?: string;
      text?: string;
      subject?: string;
      in_reply_to?: { metadata?: { draft_id?: string } };
      metadata?: { draft_id?: string };
    }> = data.messages ?? data ?? [];

    const edits: Array<{ draft_id: string; instruction: string }> = [];
    let processed = 0;

    for (const msg of messages) {
      // Dedupe.
      const { data: existing } = await supabase
        .from("processed_emails")
        .select("id")
        .eq("agnic_message_id", msg.id)
        .maybeSingle();
      if (existing) continue;

      const draftId = msg.in_reply_to?.metadata?.draft_id ?? msg.metadata?.draft_id;
      const instruction = (msg.body ?? msg.text ?? "").trim();

      if (draftId && instruction) {
        // Resolve owning user via the draft.
        const { data: draftRow } = await supabase
          .from("drafts")
          .select("user_id")
          .eq("id", draftId)
          .maybeSingle();
        if (draftRow?.user_id) {
          await supabase.from("edit_requests").insert({
            user_id: draftRow.user_id,
            draft_id: draftId,
            instruction_text: instruction,
            agnic_message_id: msg.id,
          });
          edits.push({ draft_id: draftId, instruction });
        }
      }

      await supabase.from("processed_emails").insert({ agnic_message_id: msg.id });
      processed++;
    }

    return jsonResponse({ processed, edits });
  } catch (e) {
    console.error("agnic-email-poll error", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "unknown error" }, 500);
  }
});
