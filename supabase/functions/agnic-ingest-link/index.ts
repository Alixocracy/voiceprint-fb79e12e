// Fetches a URL with a 10s timeout and runs a Readability-style extraction
// to return clean main text. Pure Deno; no external NPM dependencies needed —
// we do conservative HTML cleanup + main-content heuristics ourselves.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse } from "../_shared/agnic.ts";

const MAX_CHARS = 200_000;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") return jsonResponse({ error: "missing url" }, 400);
    let parsed: URL;
    try { parsed = new URL(url); } catch { return jsonResponse({ error: "invalid url" }, 400); }
    if (!/^https?:$/.test(parsed.protocol)) return jsonResponse({ error: "only http(s) allowed" }, 400);

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10_000);
    let resp: Response;
    try {
      resp = await fetch(parsed.toString(), {
        signal: ctrl.signal,
        headers: { "User-Agent": "VoiceprintBot/1.0 (+ingest)" },
        redirect: "follow",
      });
    } catch (e) {
      clearTimeout(t);
      return jsonResponse({ error: e instanceof Error ? e.message : "fetch failed" }, 502);
    }
    clearTimeout(t);

    if (!resp.ok) return jsonResponse({ error: `Source returned ${resp.status}` }, 502);
    const ct = resp.headers.get("content-type") ?? "";
    if (!ct.includes("text/html") && !ct.includes("application/xhtml")) {
      return jsonResponse({ error: `Unsupported content-type: ${ct || "unknown"}` }, 415);
    }

    const html = await resp.text();
    const { title, text } = extractMain(html);
    const trimmed = text.trim();
    if (trimmed.length === 0) return jsonResponse({ error: "Could not find readable text on the page." }, 422);

    const truncated = trimmed.length > MAX_CHARS;
    return jsonResponse({
      title: title || parsed.hostname,
      text: truncated ? trimmed.slice(0, MAX_CHARS) : trimmed,
      truncated,
      source_url: parsed.toString(),
    });
  } catch (e) {
    console.error("agnic-ingest-link error", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "unknown error" }, 500);
  }
});

// Conservative readability-style extractor.
function extractMain(html: string): { title: string; text: string } {
  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(stripTags(titleMatch[1])).trim() : "";

  // Drop script/style/nav/footer/aside/header/form/svg/iframe/noscript wholesale.
  let body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<form[\s\S]*?<\/form>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<aside[\s\S]*?<\/aside>/gi, " ");

  // Prefer <article> or <main> if present.
  const articleMatch = body.match(/<article[\s\S]*?<\/article>/i);
  const mainMatch = body.match(/<main[\s\S]*?<\/main>/i);
  if (articleMatch) body = articleMatch[0];
  else if (mainMatch) body = mainMatch[0];

  // Convert block boundaries to newlines so paragraph structure survives.
  body = body
    .replace(/<\/(p|div|section|article|li|h[1-6]|blockquote|tr|br)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ");

  const text = decodeEntities(stripTags(body))
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 1)
    .join("\n");

  return { title, text };
}

function stripTags(s: string): string { return s.replace(/<[^>]+>/g, " "); }
function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}
