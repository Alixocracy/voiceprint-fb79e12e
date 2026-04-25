import { supabase } from "@/integrations/supabase/client";
import { AGNIC_CALLBACK_PATH, AGNIC_STORAGE } from "./config";
import { createPkceChallenge, randomState, saveSession } from "./session";

export async function startAgnicLogin() {
  const { verifier, challenge } = await createPkceChallenge();
  const state = randomState();
  localStorage.setItem(AGNIC_STORAGE.pkceVerifier, verifier);
  localStorage.setItem(AGNIC_STORAGE.pkceState, state);

  const redirect_uri = `${window.location.origin}${AGNIC_CALLBACK_PATH}`;

  const { data, error } = await supabase.functions.invoke("agnic-oauth-init", {
    body: { state, code_challenge: challenge, redirect_uri },
  });
  if (error || !data?.authorize_url) {
    throw new Error(error?.message ?? data?.error ?? "could not start Agnic login");
  }
  window.location.href = data.authorize_url as string;
}

export async function completeAgnicLogin(params: URLSearchParams) {
  const code = params.get("code");
  const state = params.get("state");
  const err = params.get("error");
  if (err) throw new Error(params.get("error_description") ?? err);
  if (!code || !state) throw new Error("missing code or state");

  const expectedState = localStorage.getItem(AGNIC_STORAGE.pkceState);
  if (state !== expectedState) throw new Error("state mismatch");
  const verifier = localStorage.getItem(AGNIC_STORAGE.pkceVerifier);
  if (!verifier) throw new Error("missing PKCE verifier");

  const redirect_uri = `${window.location.origin}${AGNIC_CALLBACK_PATH}`;

  const { data, error } = await supabase.functions.invoke("agnic-oauth-exchange", {
    body: { code, code_verifier: verifier, redirect_uri },
  });
  if (error || !data?.access_token) {
    throw new Error(error?.message ?? data?.error ?? "token exchange failed");
  }

  saveSession({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
    sub: data.sub,
    agentId: data.agent_id,
    agentEmailAlias: data.agent_email_alias,
    kyaStatus: data.kya_status ?? "none",
  });

  localStorage.removeItem(AGNIC_STORAGE.pkceVerifier);
  localStorage.removeItem(AGNIC_STORAGE.pkceState);
}
