import { useState } from "react";
import "./EngagementOS.css";

type Status = "done" | "prog" | "todo";

interface StationDetail {
  title: string;
  sub: string;
  pct: string;
  count: string;
  items: [Status, string, string][];
}

interface StationSvg {
  id: string;
  status: Status;
  cx: number;
  cy: number;
  num: string;
  name: string;
  meta: string;
  inFocus?: boolean;
}

const STATION_DATA: Record<string, StationDetail> = {
  s1: {
    title: "01 · Engagement setup",
    sub: "Kickoff, tools, weekly cadence",
    pct: "100%",
    count: "7 of 7 items",
    items: [
      ["done", "Hold kick off meeting", "Calendly"],
      ["done", "Finalise onboarding", "Notion"],
      ["done", "Agree roles and responsibilities", "Notion"],
      ["done", "Lock in project timeline", "Notion"],
      ["done", "Set up tools", "—"],
      ["done", "Create bookmarks file", "Notion"],
      ["done", "Book weekly meetings", "Calendly"],
    ],
  },
  s2: {
    title: "02 · Leadership HQ",
    sub: "Lock the model, publish viewpoint articles",
    pct: "60%",
    count: "3 of 5 items",
    items: [
      ["done", "Complete Elevate modules", "Elevate"],
      ["done", "Lock in business model · agency, B2B", "Notion"],
      ["done", "Launch one page personal website", "GHL"],
      ["prog", "Publish 5 leadership viewpoint articles · 2 of 5", "LinkedIn"],
      ["todo", "Lock what you take to market", "Notion"],
    ],
  },
  s3: {
    title: "03 · Presence system",
    sub: "Landing page, LinkedIn, content distribution",
    pct: "42%",
    count: "3 of 7 items",
    items: [
      ["done", "Publish landing page", "GHL"],
      ["done", "Prime LinkedIn profile · hero, banners, header", "Canva"],
      ["done", "Lock 3 pillars of content", "Notion"],
      ["prog", "Build content distribution plan", "Notion"],
      ["todo", "Setup content distribution calendar", "Notion"],
      ["todo", "Build content repurposing system", "—"],
      ["todo", "Setup reporting dashboard", "—"],
    ],
  },
  s4: {
    title: "04 · Lead gen system",
    sub: "TAM, scoring, LinkedIn and email outreach",
    pct: "8%",
    count: "1 of 8 items",
    items: [
      ["prog", "Analyse TAM", "Clay"],
      ["todo", "Lock in lead scoring system", "Notion"],
      ["todo", "Setup LinkedIn messaging sequences", "Instantly"],
      ["todo", "Setup LinkedIn ad", "LinkedIn"],
      ["todo", "Register domains and emails", "Cloudflare"],
      ["todo", "Lock in email outreach campaigns", "Instantly"],
      ["todo", "Create prospect list", "Clay"],
      ["todo", "Launch campaigns and weekly reports", "—"],
    ],
  },
  s5: {
    title: "05 · Sales system",
    sub: "Map the lead experience, build the funnel, lock the scripts",
    pct: "50%",
    count: "3 of 6 items",
    items: [
      ["done", "Map lead experience end to end", "Notion"],
      ["prog", "Build sales funnel · landing, form, calendar", "GHL"],
      ["done", "Lock screening call script", "Notion"],
      ["prog", "Lock diagnosis call script and canvas", "Notion"],
      ["done", "Build payment pages", "Stripe"],
      ["todo", "Build welcome sequence", "Instantly"],
    ],
  },
  s6: {
    title: "06 · Product system",
    sub: "ICP, offers, pricing, lead magnets, productised service",
    pct: "33%",
    count: "2 of 6 items",
    items: [
      ["done", "Lock in ICP and persona", "Notion"],
      ["done", "Lock in core and intro offers", "Notion"],
      ["prog", "Lock in pricing and financial model", "Excel"],
      ["todo", "Create lead magnets · checklist, framework, diagnostic", "Canva"],
      ["todo", "Productise service · master plan, playbooks", "Notion"],
      ["todo", "Register IP and create case study template", "—"],
    ],
  },
  s7: {
    title: "07 · Orchestration",
    sub: "Legal, team, cadence at every layer",
    pct: "0%",
    count: "0 of 5 items",
    items: [
      ["todo", "Check company legal documents", "Drive"],
      ["todo", "Create team structure", "Notion"],
      ["todo", "Create quarterly and monthly cadence", "Notion"],
      ["todo", "Create weekly cadence", "Notion"],
      ["todo", "Create daily cadence", "Notion"],
    ],
  },
  s8: {
    title: "08 · Partnership",
    sub: "Partner ICP, campaigns, reporting",
    pct: "0%",
    count: "0 of 6 items",
    items: [
      ["todo", "Create partner ICP", "Notion"],
      ["todo", "Create partner campaign", "Notion"],
      ["todo", "Create partner prospect list", "Clay"],
      ["todo", "Setup campaigns in tool", "Instantly"],
      ["todo", "Launch the campaigns", "Instantly"],
      ["todo", "Report campaigns weekly", "—"],
    ],
  },
  s9: {
    title: "09 · Project handover",
    sub: "Testimonial, handover, feedback, credentials",
    pct: "0%",
    count: "0 of 7 items",
    items: [
      ["todo", "Capture testimonial", "—"],
      ["todo", "Hold next step meeting", "Calendly"],
      ["todo", "Handover all documents and folders", "Drive"],
      ["todo", "Finalise all payments", "Stripe"],
      ["todo", "Finalise all trainings and recordings", "Drive"],
      ["todo", "Capture feedback · form, interview", "Notion"],
      ["todo", "Handover all credentials", "—"],
    ],
  },
};

const STATIONS_SVG: StationSvg[] = [
  { id: "s1", status: "done", cx: 175, cy: 95,  num: "01", name: "Engagement setup", meta: "100% · 7 of 7" },
  { id: "s2", status: "prog", cx: 450, cy: 95,  num: "02", name: "Leadership HQ",    meta: "60% · 3 of 5" },
  { id: "s3", status: "prog", cx: 725, cy: 95,  num: "03", name: "Presence system",  meta: "42% · 3 of 7" },
  { id: "s4", status: "prog", cx: 725, cy: 255, num: "04", name: "Lead gen system",  meta: "8% · 1 of 8" },
  { id: "s5", status: "prog", cx: 450, cy: 255, num: "05", name: "Sales system",     meta: "50% · 3 of 6", inFocus: true },
  { id: "s6", status: "prog", cx: 175, cy: 255, num: "06", name: "Product system",   meta: "33% · 2 of 6" },
  { id: "s7", status: "todo", cx: 175, cy: 415, num: "07", name: "Orchestration",    meta: "0% · 0 of 5" },
  { id: "s8", status: "todo", cx: 450, cy: 415, num: "08", name: "Partnership",      meta: "0% · 0 of 6" },
  { id: "s9", status: "todo", cx: 725, cy: 415, num: "09", name: "Project handover", meta: "0% · 0 of 7" },
];

const STATUS_STYLE: Record<Status, { fill: string; stroke: string; numFill: string }> = {
  done: { fill: "#e6f3ec", stroke: "#1a7a4a",          numFill: "#1a7a4a" },
  prog: { fill: "#fbefd1", stroke: "#a86700",          numFill: "#a86700" },
  todo: { fill: "#ebe9e3", stroke: "rgba(0,0,0,0.16)", numFill: "#9a9a9a" },
};

const DOT_CLASS: Record<Status, string> = {
  done: "eos-dot eos-dot-done",
  prog: "eos-dot eos-dot-prog",
  todo: "eos-dot eos-dot-todo",
};

export default function EngagementOS() {
  const [selected, setSelected] = useState("s5");
  const s = STATION_DATA[selected];

  return (
    <div className="max-w-5xl mx-auto px-8 pt-10 pb-20">
      <header className="mb-8">
        <h1 className="font-serif text-4xl text-foreground">Engagement OS</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
          Track client engagements from kickoff to handover across nine milestone stations.
        </p>
      </header>

      <div className="eos-root">
        {/* Client header */}
        <div className="eos-header-bar">
          <div>
            <div className="eos-lbl">Active engagement</div>
            <div className="eos-header-title">Sarah Chen · Exit to advisor</div>
            <div className="eos-header-sub">Started 18 March · Wraps 8 September · Weekly cadence on Tuesdays</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="eos-lbl">Overall</div>
            <div className="eos-header-pct">38%</div>
            <div className="eos-header-week">Week 6 of 24</div>
          </div>
        </div>

        {/* Legend */}
        <div className="eos-legend">
          <span className="eos-legend-item"><span className="eos-dot eos-dot-done" />Done</span>
          <span className="eos-legend-item"><span className="eos-dot eos-dot-prog" />In progress</span>
          <span className="eos-legend-item"><span className="eos-dot eos-dot-todo" />Not started</span>
          <span className="eos-legend-hint">Click any station for the checklist</span>
        </div>

        {/* Journey map */}
        <div className="eos-canvas">
          <svg viewBox="0 0 900 520" style={{ display: "block", width: "100%", height: "auto" }}>
            {/* Row bands */}
            <rect x="0" y="14"  width="900" height="142" rx="14" fill="#f4f2ec" opacity="0.7" />
            <rect x="0" y="174" width="900" height="142" rx="14" fill="#f4f2ec" opacity="0.7" />
            <rect x="0" y="334" width="900" height="142" rx="14" fill="#f4f2ec" opacity="0.7" />

            {/* Row labels */}
            <text fill="#9a9a9a" fontSize="11" fontWeight="600" letterSpacing="0.7" x="22" y="34">FOUNDATION</text>
            <text fill="#9a9a9a" fontSize="11" fontWeight="600" letterSpacing="0.7" x="22" y="194">GROWTH ENGINE</text>
            <text fill="#9a9a9a" fontSize="11" fontWeight="600" letterSpacing="0.7" x="22" y="354">SCALE AND HANDOVER</text>

            {/* Full journey path (dashed) */}
            <path
              d="M 175 95 L 730 95 C 810 95 810 255 730 255 L 175 255 C 95 255 95 415 175 415 L 730 415"
              stroke="#9a9a9a" strokeWidth="2" fill="none"
              strokeDasharray="3 7" opacity="0.45" strokeLinecap="round"
            />

            {/* Progress path (amber) */}
            <path
              d="M 175 95 L 730 95 C 810 95 810 255 730 255 L 450 255"
              stroke="#a86700" strokeWidth="3" fill="none"
              opacity="0.7" strokeLinecap="round"
            />

            {/* Stations */}
            {STATIONS_SVG.map((st) => {
              const ss = STATUS_STYLE[st.status];
              return (
                <g key={st.id} className="eos-station" onClick={() => setSelected(st.id)}>
                  {st.inFocus && (
                    <>
                      <circle cx={st.cx} cy={st.cy} r={44} fill="none" stroke="#a86700" strokeWidth="1" opacity="0.5" strokeDasharray="2 3" />
                      <rect x={st.cx - 40} y={st.cy - 57} width={80} height={22} rx={11} fill="#fbefd1" stroke="#a86700" strokeWidth="0.5" />
                      <text x={st.cx} y={st.cy - 46} textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="600" fill="#a86700">In focus</text>
                    </>
                  )}
                  <circle cx={st.cx} cy={st.cy} r={34} fill={ss.fill} stroke={ss.stroke} strokeWidth={st.inFocus ? 2.2 : 1.5} />
                  <text x={st.cx} y={st.cy} textAnchor="middle" dominantBaseline="central" fontSize="16" fontWeight="500" fill={ss.numFill}>{st.num}</text>
                  <text x={st.cx} y={st.cy + 55} textAnchor="middle" fontSize="14" fontWeight="500" fill="#1a1a1a">{st.name}</text>
                  <text x={st.cx} y={st.cy + 73} textAnchor="middle" fontSize="11" fill="#5a5a5a">{st.meta}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="eos-detail">
          <div className="eos-detail-head">
            <div>
              <div className="eos-lbl">Now viewing</div>
              <div className="eos-detail-title">{s.title}</div>
              <div className="eos-detail-sub">{s.sub}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="eos-detail-pct">{s.pct}</div>
              <div className="eos-detail-count">{s.count}</div>
            </div>
          </div>
          <div>
            {s.items.map(([status, name, tool], i) => (
              <div key={i} className="eos-row">
                <span className={DOT_CLASS[status]} />
                <span className="eos-row-name">{name}</span>
                <span className="eos-badge" style={tool === "—" ? { opacity: 0.45 } : undefined}>{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
