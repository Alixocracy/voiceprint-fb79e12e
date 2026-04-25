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

export { clearSession as agnicLogout, loadSession as getAgnicSession };
