import { supabase } from "@/integrations/supabase/client";
import { loadSession, saveSession, clearSession } from "./session";

async function call<T = any>(fn: string, body: Record<string, unknown> = {}) {
  const session = loadSession();
  const { data, error } = await supabase.functions.invoke(fn, {
    body: { ...body, agnic_access_token: session?.accessToken },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export interface DraftSet {
  bodyLong: string;
  bodyShort1: string;
  bodyShort2: string;
  hookCarousel: string;
}

export async function generateDraft(args: {
  topic: string;
  voiceDna: unknown;
}): Promise<DraftSet> {
  return await call<DraftSet>("agnic-generate", args);
}

export async function sendEmail(args: {
  to: string;
  subject: string;
  body: string;
  draft_id: string;
}): Promise<{ message_id: string }> {
  return await call("agnic-email-send", args);
}

export async function pollInbox(): Promise<{
  processed: number;
  edits: Array<{ draft_id: string; instruction: string }>;
}> {
  return await call("agnic-email-poll", {});
}

export async function fetchKyaStatus(): Promise<"none" | "pending" | "active"> {
  const data = await call<{ status: "none" | "pending" | "active" }>("agnic-kya-status", {});
  if (data?.status) {
    const session = loadSession();
    if (session) saveSession({ ...session, kyaStatus: data.status });
  }
  return data?.status ?? "none";
}

export interface IngestedLink {
  title: string;
  text: string;
  truncated: boolean;
  source_url: string;
}

export async function ingestLink(url: string): Promise<IngestedLink> {
  return await call<IngestedLink>("agnic-ingest-link", { url });
}

export interface ChatStreamArgs {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  voiceDna: unknown;
  referenceDocs?: Array<{ name: string; text: string }>;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}

export async function streamChat(args: ChatStreamArgs): Promise<void> {
  const session = loadSession();
  if (!session?.accessToken) {
    args.onError("Not connected to Agnic.");
    return;
  }
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agnic-chat`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({
      messages: args.messages,
      voiceDna: args.voiceDna,
      referenceDocs: args.referenceDocs,
      agnic_access_token: session.accessToken,
    }),
  });
  if (!resp.ok || !resp.body) {
    let msg = `Chat failed (${resp.status})`;
    try { const j = await resp.json(); if (j?.error) msg = j.error; } catch { /* ignore */ }
    args.onError(msg);
    return;
  }
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = false;
  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, nl);
      buffer = buffer.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed?.choices?.[0]?.delta?.content;
        if (content) args.onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  args.onDone();
}

export { clearSession as agnicLogout, loadSession as getAgnicSession };
