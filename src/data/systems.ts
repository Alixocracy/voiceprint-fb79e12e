// Color tokens for the 7 Systems. Used across My Agents, 7 Systems, and elsewhere.
// HSL strings consumed via inline style="background-color:hsl(...)" or via Tailwind arbitrary values.

export type SystemKey =
  | "executive_brand"
  | "content"
  | "lead_gen"
  | "sales"
  | "product"
  | "partnership"
  | "orchestration";

export interface SystemMeta {
  key: SystemKey;
  label: string;
  hsl: string; // background tint
  hslSolid: string; // chip fill
  fg: string; // chip text
}

export const SYSTEMS: Record<SystemKey, SystemMeta> = {
  executive_brand: { key: "executive_brand", label: "Executive Brand", hsl: "210 65% 92%", hslSolid: "210 65% 45%", fg: "210 65% 18%" },
  content:         { key: "content",         label: "Content",         hsl: "175 55% 90%", hslSolid: "175 55% 38%", fg: "175 55% 16%" },
  lead_gen:        { key: "lead_gen",        label: "Lead Gen Engine", hsl: "38 80% 88%",  hslSolid: "38 80% 50%",  fg: "30 60% 22%"  },
  sales:           { key: "sales",           label: "Sales",           hsl: "10 70% 90%",  hslSolid: "10 70% 55%",  fg: "10 70% 22%"  },
  product:         { key: "product",         label: "Product",         hsl: "270 45% 90%", hslSolid: "270 45% 50%", fg: "270 45% 22%" },
  partnership:     { key: "partnership",     label: "Partnership",     hsl: "330 55% 91%", hslSolid: "330 55% 55%", fg: "330 55% 22%" },
  orchestration:   { key: "orchestration",   label: "Orchestration",   hsl: "210 8% 88%",  hslSolid: "210 8% 40%",  fg: "210 8% 18%"  },
};

export const SYSTEM_ORDER: SystemKey[] = [
  "executive_brand",
  "content",
  "lead_gen",
  "sales",
  "product",
  "partnership",
  "orchestration",
];
