import type { SystemKey } from "./systems";

export interface WeekPlan {
  week_number: number;
  focus_system: SystemKey;
  title: string;
  guide: string;
  tasks: string[];
  suggested_skill_slugs: string[];
  suggested_tool_slugs: string[];
}

export const WEEKLY_PLAN: WeekPlan[] = [
  { week_number: 1,  focus_system: "executive_brand", title: "Land your voice",
    guide: "Start with the trust-builder system. Define the leadership viewpoint, expertise, and voice DNA that all future content, offers, and agents must stay aligned to.",
    tasks: ["Complete Voice DNA onboarding", "Answer 11 leadership viewpoint prompts", "Add three writing samples"],
    suggested_skill_slugs: ["voice-dna"], suggested_tool_slugs: [] },
  { week_number: 2,  focus_system: "executive_brand", title: "Sharpen your positioning",
    guide: "Decide what kind of consulting business you are building: lifestyle, agency-style, or deliberately hybrid. This prevents vague goals and overbuilt operations later.",
    tasks: ["Draft a one-paragraph positioning statement", "Choose lifestyle or agency-style model", "Map your ICP"],
    suggested_skill_slugs: [], suggested_tool_slugs: [] },
  { week_number: 3,  focus_system: "content",         title: "Ship your first long-form post",
    guide: "Digital presence is your shopfront. Publish from your real expertise rather than outsourcing your thinking to a writing agent.",
    tasks: ["Ask an ideation agent for topics", "Dictate an unpolished draft", "Polish with Voice DNA and publish"],
    suggested_skill_slugs: ["long-form-writer", "short-form-derivatives"], suggested_tool_slugs: ["typefully", "buffer"] },
  { week_number: 4,  focus_system: "content",         title: "Build a weekly cadence",
    guide: "Presence compounds over time. Pick a cadence you can keep for a year, then use agents for ideation, proofreading, and repurposing.",
    tasks: ["Schedule one long-form per week", "Repurpose into two shorts", "Keep an ideas backlog by domain"],
    suggested_skill_slugs: ["short-form-derivatives"], suggested_tool_slugs: ["buffer"] },
  { week_number: 5,  focus_system: "product",         title: "Architect your offers",
    guide: "Your offer is not just the service. It is the service plus a clear promise, grounded in your intellect and packaged so clients can understand the outcome.",
    tasks: ["Write one offer as product/service plus promise", "Sketch three signature packages", "Flag any IP terms to protect"],
    suggested_skill_slugs: [], suggested_tool_slugs: [] },
  { week_number: 6,  focus_system: "product",         title: "Pressure-test your pricing",
    guide: "Turn experience into a productised service: defined method, reusable process, light customisation. Validate before building too much.",
    tasks: ["Set a draft price for each package", "Show pricing to two existing peers", "Capture their gut reactions verbatim"],
    suggested_skill_slugs: [], suggested_tool_slugs: [] },
  { week_number: 7,  focus_system: "lead_gen",        title: "Build your prospect list",
    guide: "Go beyond your existing network. A senior network is not the same as a buyer pipeline, so build a real list of potential clients.",
    tasks: ["Identify 50 ICP companies", "Find the right person at each", "Mark who is outside your current network"],
    suggested_skill_slugs: [], suggested_tool_slugs: ["sales-navigator", "apollo", "clay"] },
  { week_number: 8,  focus_system: "lead_gen",        title: "Start the comment loop",
    guide: "Lead generation is working when the right people notice, reply, book, or join a waitlist. Track signals instead of just activity.",
    tasks: ["Comment thoughtfully on five ICP posts per day", "Track who responds", "Record inbound questions and buying signals"],
    suggested_skill_slugs: ["comment-engine", "prospect-finder"], suggested_tool_slugs: ["sales-navigator"] },
  { week_number: 9,  focus_system: "sales",           title: "Open your first conversations",
    guide: "The sales system has to move prospects smoothly through their decision process. Make the next step obvious and low-friction.",
    tasks: ["DM the warmest five from week 8", "Book three discovery calls", "Create a clean call-to-proposal flow"],
    suggested_skill_slugs: ["dm-drafter"], suggested_tool_slugs: ["calcom", "calendly"] },
  { week_number: 10, focus_system: "sales",           title: "Close one",
    guide: "Use your experience to keep sales simple: clear diagnosis, clear promise, clear next step. Avoid customising every proposal from scratch.",
    tasks: ["Run discovery calls", "Send one proposal using your offer promise", "Get one verbal yes"],
    suggested_skill_slugs: ["proposal-drafter", "objection-handler"], suggested_tool_slugs: [] },
  { week_number: 11, focus_system: "partnership",     title: "Identify your top five partners",
    guide: "Partnerships reuse the lead generation engine with a different audience and offer. Test beyond the partners that look logical on paper.",
    tasks: ["List five people whose audience overlaps with yours", "Draft a partner offer they would value", "Test one non-obvious partner category"],
    suggested_skill_slugs: ["partnership-outreach"], suggested_tool_slugs: ["clay"] },
  { week_number: 12, focus_system: "orchestration",   title: "Make it weekly",
    guide: "Orchestration is the COO layer: agents, calendar, review rhythm, and continuous improvement. Keep it lean before adding more automation.",
    tasks: ["Set up your weekly planner", "Choose three KPIs", "Review agents and tools by system"],
    suggested_skill_slugs: ["weekly-planner", "kpi-tracker"], suggested_tool_slugs: ["n8n"] },
];
