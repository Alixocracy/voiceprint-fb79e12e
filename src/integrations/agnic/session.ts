import { AGNIC_STORAGE } from "./config";

// ---------- token storage ----------
export interface AgnicSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number; // epoch ms
  sub?: string;
  email?: string;
  name?: string;
  agentId?: number;
  agentEmailAlias?: string;
  kyaStatus?: "none" | "pending" | "active";
}

export function saveSession(s: AgnicSession) {
  localStorage.setItem(AGNIC_STORAGE.accessToken, s.accessToken);
  if (s.refreshToken) localStorage.setItem(AGNIC_STORAGE.refreshToken, s.refreshToken);
  if (s.expiresAt) localStorage.setItem(AGNIC_STORAGE.expiresAt, String(s.expiresAt));
  if (s.sub) localStorage.setItem(AGNIC_STORAGE.agnicSub, s.sub);
  if (s.email) localStorage.setItem(AGNIC_STORAGE.agnicEmail, s.email);
  if (s.name) localStorage.setItem(AGNIC_STORAGE.agnicName, s.name);
  if (s.agentId !== undefined) localStorage.setItem(AGNIC_STORAGE.agnicAgentId, String(s.agentId));
  if (s.agentEmailAlias) localStorage.setItem(AGNIC_STORAGE.agentEmailAlias, s.agentEmailAlias);
  if (s.kyaStatus) localStorage.setItem(AGNIC_STORAGE.kyaStatus, s.kyaStatus);
  window.dispatchEvent(new Event("agnic-session-changed"));
}

export function loadSession(): AgnicSession | null {
  const accessToken = localStorage.getItem(AGNIC_STORAGE.accessToken);
  if (!accessToken) return null;
  const expiresAtRaw = localStorage.getItem(AGNIC_STORAGE.expiresAt);
  const agentIdRaw = localStorage.getItem(AGNIC_STORAGE.agnicAgentId);
  return {
    accessToken,
    refreshToken: localStorage.getItem(AGNIC_STORAGE.refreshToken) ?? undefined,
    expiresAt: expiresAtRaw ? Number(expiresAtRaw) : undefined,
    sub: localStorage.getItem(AGNIC_STORAGE.agnicSub) ?? undefined,
    email: localStorage.getItem(AGNIC_STORAGE.agnicEmail) ?? undefined,
    name: localStorage.getItem(AGNIC_STORAGE.agnicName) ?? undefined,
    agentId: agentIdRaw ? Number(agentIdRaw) : undefined,
    agentEmailAlias: localStorage.getItem(AGNIC_STORAGE.agentEmailAlias) ?? undefined,
    kyaStatus: (localStorage.getItem(AGNIC_STORAGE.kyaStatus) as AgnicSession["kyaStatus"]) ?? undefined,
  };
}

export function clearSession() {
  Object.values(AGNIC_STORAGE).forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new Event("agnic-session-changed"));
}

export function isAuthed(): boolean {
  const s = loadSession();
  if (!s?.accessToken) return false;
  if (s.expiresAt && Date.now() > s.expiresAt) return false;
  return true;
}

// ---------- PKCE helpers ----------
function base64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createPkceChallenge() {
  const verifierBytes = crypto.getRandomValues(new Uint8Array(32));
  const verifier = base64url(verifierBytes.buffer);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const challenge = base64url(digest);
  return { verifier, challenge };
}

export function randomState(): string {
  return base64url(crypto.getRandomValues(new Uint8Array(16)).buffer);
}
