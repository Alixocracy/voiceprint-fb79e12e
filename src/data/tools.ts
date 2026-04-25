export type ToolPricing = "free" | "freemium" | "paid";
export type ToolCategory =
  | "AI tools"
  | "Outbound"
  | "Content"
  | "Design"
  | "Lead intel"
  | "Analytics"
  | "Automation"
  | "Voice and podcast"
  | "CRM"
  | "Scheduling";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  url: string;
  shirin_uses: boolean;
  pricing_hint: ToolPricing;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  "AI tools",
  "Outbound",
  "Content",
  "Design",
  "Lead intel",
  "Analytics",
  "Automation",
  "Voice and podcast",
  "CRM",
  "Scheduling",
];

// Muted accent palette for category chips. Deliberately distinct from SYSTEMS palette.
export const CATEGORY_HSL: Record<ToolCategory, { tint: string; solid: string; fg: string }> = {
  "AI tools":          { tint: "150 35% 90%", solid: "150 35% 38%", fg: "150 35% 18%" },
  "Outbound":          { tint: "20 35% 90%",  solid: "20 35% 45%",  fg: "20 35% 20%"  },
  "Content":           { tint: "200 30% 90%", solid: "200 30% 42%", fg: "200 30% 18%" },
  "Design":            { tint: "295 25% 90%", solid: "295 25% 50%", fg: "295 25% 22%" },
  "Lead intel":        { tint: "50 35% 88%",  solid: "50 45% 42%",  fg: "50 35% 18%"  },
  "Analytics":         { tint: "230 25% 90%", solid: "230 25% 48%", fg: "230 25% 22%" },
  "Automation":        { tint: "100 25% 88%", solid: "100 25% 38%", fg: "100 25% 18%" },
  "Voice and podcast": { tint: "350 25% 91%", solid: "350 30% 50%", fg: "350 30% 22%" },
  "CRM":               { tint: "260 20% 90%", solid: "260 20% 48%", fg: "260 20% 22%" },
  "Scheduling":        { tint: "180 20% 89%", solid: "180 25% 38%", fg: "180 25% 18%" },
};

export const TOOLS: Tool[] = [
  { slug: "claude",          name: "Claude",                    category: "AI tools",          url: "https://claude.ai",          pricing_hint: "freemium", shirin_uses: true,  description: "Anthropic's assistant; strong at long-form writing and reasoning." },
  { slug: "chatgpt",         name: "ChatGPT",                   category: "AI tools",          url: "https://chatgpt.com",        pricing_hint: "freemium", shirin_uses: false, description: "OpenAI's general-purpose assistant for writing, code, and analysis." },
  { slug: "cursor",          name: "Cursor",                    category: "AI tools",          url: "https://cursor.sh",          pricing_hint: "paid",     shirin_uses: false, description: "AI-first code editor that pairs with your repo." },
  { slug: "perplexity",      name: "Perplexity",                category: "AI tools",          url: "https://perplexity.ai",      pricing_hint: "freemium", shirin_uses: false, description: "Answer engine that cites sources for fast research." },
  { slug: "elevenlabs",      name: "ElevenLabs",                category: "AI tools",          url: "https://elevenlabs.io",      pricing_hint: "freemium", shirin_uses: false, description: "Realistic AI voice generation and cloning." },
  { slug: "smartlead",       name: "Smartlead",                 category: "Outbound",          url: "https://smartlead.ai",       pricing_hint: "paid",     shirin_uses: false, description: "Cold email infrastructure with deliverability tooling." },
  { slug: "instantly",       name: "Instantly",                 category: "Outbound",          url: "https://instantly.ai",       pricing_hint: "paid",     shirin_uses: false, description: "Cold email at scale with warmup and inbox rotation." },
  { slug: "apollo",          name: "Apollo",                    category: "Outbound",          url: "https://apollo.io",          pricing_hint: "freemium", shirin_uses: false, description: "Prospect database and sequencer in one." },
  { slug: "clay",            name: "Clay",                      category: "Outbound",          url: "https://clay.com",           pricing_hint: "paid",     shirin_uses: true,  description: "Spreadsheet-style enrichment and outbound workflows." },
  { slug: "lemlist",         name: "Lemlist",                   category: "Outbound",          url: "https://lemlist.com",        pricing_hint: "paid",     shirin_uses: false, description: "Personalized cold outreach with images and video." },
  { slug: "buffer",          name: "Buffer",                    category: "Content",           url: "https://buffer.com",         pricing_hint: "freemium", shirin_uses: false, description: "Schedule and manage social posts across channels." },
  { slug: "typefully",       name: "Typefully",                 category: "Content",           url: "https://typefully.com",      pricing_hint: "freemium", shirin_uses: true,  description: "Calm writing and scheduling for X and LinkedIn." },
  { slug: "substack",        name: "Substack",                  category: "Content",           url: "https://substack.com",       pricing_hint: "free",     shirin_uses: false, description: "Newsletter hosting with built-in subscriptions." },
  { slug: "beehiiv",         name: "Beehiiv",                   category: "Content",           url: "https://beehiiv.com",        pricing_hint: "freemium", shirin_uses: false, description: "Newsletter platform built for serious operators." },
  { slug: "canva",           name: "Canva",                     category: "Design",            url: "https://canva.com",          pricing_hint: "freemium", shirin_uses: true,  description: "Drag-and-drop design for everything visual." },
  { slug: "figma",           name: "Figma",                     category: "Design",            url: "https://figma.com",          pricing_hint: "freemium", shirin_uses: false, description: "Collaborative interface design and prototyping." },
  { slug: "tella",           name: "Tella",                     category: "Design",            url: "https://tella.tv",           pricing_hint: "paid",     shirin_uses: false, description: "Beautiful screen and camera recording for the web." },
  { slug: "loom",            name: "Loom",                      category: "Design",            url: "https://loom.com",           pricing_hint: "freemium", shirin_uses: false, description: "Quick async video messages for teams and prospects." },
  { slug: "sales-navigator", name: "LinkedIn Sales Navigator",  category: "Lead intel",        url: "https://linkedin.com/sales", pricing_hint: "paid",     shirin_uses: true,  description: "Advanced LinkedIn search for prospect research." },
  { slug: "zoominfo",        name: "ZoomInfo",                  category: "Lead intel",        url: "https://zoominfo.com",       pricing_hint: "paid",     shirin_uses: false, description: "B2B contact database and intent signals." },
  { slug: "rb2b",            name: "RB2B",                      category: "Lead intel",        url: "https://rb2b.com",           pricing_hint: "freemium", shirin_uses: false, description: "Identifies the people visiting your site." },
  { slug: "plausible",       name: "Plausible",                 category: "Analytics",         url: "https://plausible.io",       pricing_hint: "paid",     shirin_uses: false, description: "Privacy-first website analytics that stay simple." },
  { slug: "hotjar",          name: "Hotjar",                    category: "Analytics",         url: "https://hotjar.com",         pricing_hint: "freemium", shirin_uses: false, description: "Heatmaps and session recordings for UX." },
  { slug: "posthog",         name: "PostHog",                   category: "Analytics",         url: "https://posthog.com",        pricing_hint: "freemium", shirin_uses: false, description: "Product analytics, session replay, and feature flags." },
  { slug: "n8n",             name: "n8n",                       category: "Automation",        url: "https://n8n.io",             pricing_hint: "freemium", shirin_uses: true,  description: "Open-source workflow automation you can self-host." },
  { slug: "zapier",          name: "Zapier",                    category: "Automation",        url: "https://zapier.com",         pricing_hint: "freemium", shirin_uses: false, description: "Connect apps and automate the boring parts." },
  { slug: "make",            name: "Make",                      category: "Automation",        url: "https://make.com",           pricing_hint: "freemium", shirin_uses: false, description: "Visual automation for multi-step workflows." },
  { slug: "riverside",       name: "Riverside",                 category: "Voice and podcast", url: "https://riverside.fm",       pricing_hint: "paid",     shirin_uses: false, description: "Studio-quality remote podcast and video recording." },
  { slug: "descript",        name: "Descript",                  category: "Voice and podcast", url: "https://descript.com",       pricing_hint: "freemium", shirin_uses: false, description: "Edit audio and video by editing the transcript." },
  { slug: "hubspot",         name: "HubSpot",                   category: "CRM",               url: "https://hubspot.com",        pricing_hint: "freemium", shirin_uses: false, description: "All-in-one CRM with marketing and sales tooling." },
  { slug: "pipedrive",       name: "Pipedrive",                 category: "CRM",               url: "https://pipedrive.com",      pricing_hint: "paid",     shirin_uses: false, description: "Visual sales pipeline built for closers." },
  { slug: "attio",           name: "Attio",                     category: "CRM",               url: "https://attio.com",          pricing_hint: "paid",     shirin_uses: false, description: "Modern, flexible CRM with strong data primitives." },
  { slug: "folk",            name: "Folk",                      category: "CRM",               url: "https://folk.app",           pricing_hint: "paid",     shirin_uses: false, description: "Lightweight CRM for relationship-led businesses." },
  { slug: "calcom",          name: "Cal.com",                   category: "Scheduling",        url: "https://cal.com",            pricing_hint: "freemium", shirin_uses: true,  description: "Open-source scheduling that fits any workflow." },
  { slug: "calendly",        name: "Calendly",                  category: "Scheduling",        url: "https://calendly.com",       pricing_hint: "freemium", shirin_uses: false, description: "The classic scheduling link for teams and individuals." },
  { slug: "savvycal",        name: "SavvyCal",                  category: "Scheduling",        url: "https://savvycal.com",       pricing_hint: "paid",     shirin_uses: false, description: "Polite scheduling with overlay calendars and ranked times." },
];

export const TOOL_BY_SLUG: Record<string, Tool> = Object.fromEntries(TOOLS.map((t) => [t.slug, t]));
