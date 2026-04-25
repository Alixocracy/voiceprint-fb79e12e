import type { SystemKey } from "./systems";

export interface WeekPlan {
  week_number: number;
  focus_system: SystemKey;
  title: string;
  tasks: string[];
  suggested_skill_slugs: string[];
  suggested_tool_slugs: string[];
}

export const WEEKLY_PLAN: WeekPlan[] = [
  { week_number: 1,  focus_system: "executive_brand", title: "Land your voice",
    tasks: ["Complete Voice DNA onboarding", "Add three writing samples", "Review Black List"],
    suggested_skill_slugs: ["voice-dna"], suggested_tool_slugs: [] },
  { week_number: 2,  focus_system: "executive_brand", title: "Sharpen your positioning",
    tasks: ["Draft a one-paragraph positioning statement", "Map your ICP"],
    suggested_skill_slugs: [], suggested_tool_slugs: [] },
  { week_number: 3,  focus_system: "content",         title: "Ship your first long-form post",
    tasks: ["Generate first long-form draft via My Voice", "Edit by email reply", "Publish"],
    suggested_skill_slugs: ["long-form-writer", "short-form-derivatives"], suggested_tool_slugs: ["typefully", "buffer"] },
  { week_number: 4,  focus_system: "content",         title: "Build a weekly cadence",
    tasks: ["Schedule one long-form per week", "Repurpose into two shorts"],
    suggested_skill_slugs: ["short-form-derivatives"], suggested_tool_slugs: ["buffer"] },
  { week_number: 5,  focus_system: "product",         title: "Architect your offers",
    tasks: ["Sketch three signature packages", "Set a draft price for each"],
    suggested_skill_slugs: [], suggested_tool_slugs: [] },
  { week_number: 6,  focus_system: "product",         title: "Pressure-test your pricing",
    tasks: ["Show pricing to two existing peers", "Capture their gut reactions verbatim"],
    suggested_skill_slugs: [], suggested_tool_slugs: [] },
  { week_number: 7,  focus_system: "lead_gen",        title: "Build your prospect list",
    tasks: ["Identify 50 ICP companies", "Find the right person at each"],
    suggested_skill_slugs: [], suggested_tool_slugs: ["sales-navigator", "apollo", "clay"] },
  { week_number: 8,  focus_system: "lead_gen",        title: "Start the comment loop",
    tasks: ["Comment thoughtfully on five ICP posts per day", "Track who responds"],
    suggested_skill_slugs: ["comment-engine", "prospect-finder"], suggested_tool_slugs: ["sales-navigator"] },
  { week_number: 9,  focus_system: "sales",           title: "Open your first conversations",
    tasks: ["DM the warmest five from week 8", "Book three discovery calls"],
    suggested_skill_slugs: ["dm-drafter"], suggested_tool_slugs: ["calcom", "calendly"] },
  { week_number: 10, focus_system: "sales",           title: "Close one",
    tasks: ["Run discovery calls", "Send one proposal", "Get one verbal yes"],
    suggested_skill_slugs: ["proposal-drafter", "objection-handler"], suggested_tool_slugs: [] },
  { week_number: 11, focus_system: "partnership",     title: "Identify your top five partners",
    tasks: ["List five people whose audience overlaps with yours", "Draft outreach"],
    suggested_skill_slugs: ["partnership-outreach"], suggested_tool_slugs: ["clay"] },
  { week_number: 12, focus_system: "orchestration",   title: "Make it weekly",
    tasks: ["Set up your weekly planner", "Choose three KPIs", "Review with a peer"],
    suggested_skill_slugs: ["weekly-planner", "kpi-tracker"], suggested_tool_slugs: ["n8n"] },
];
