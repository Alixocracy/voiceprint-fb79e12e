import type { SystemKey } from "./systems";

export type SkillStatus = "installed" | "coming_soon" | "available";

export interface Skill {
  slug: string;
  name: string;
  system: SystemKey;
  description: string;
  install_command: string;
  status: SkillStatus;
}

const cmd = (slug: string) => `npx skills add seamless/7systems --skill ${slug}`;

export const SKILLS: Skill[] = [
  { slug: "voice-dna",                name: "Voice DNA",                 system: "executive_brand", status: "installed",   description: "Captures your written voice as evidence and grounds every draft.",            install_command: cmd("voice-dna") },
  { slug: "long-form-writer",         name: "Long-form Writer",          system: "content",         status: "installed",   description: "Generates full long-form posts in your voice from a topic.",                  install_command: cmd("long-form-writer") },
  { slug: "short-form-derivatives",   name: "Short-form Derivatives",    system: "content",         status: "installed",   description: "Spins long-form into shorts, hooks, and carousel lines.",                     install_command: cmd("short-form-derivatives") },
  { slug: "positioning-finder",       name: "Positioning Finder",        system: "executive_brand", status: "coming_soon", description: "Finds the one-sentence positioning that lets buyers self-select.",            install_command: cmd("positioning-finder") },
  { slug: "icp-mapper",               name: "ICP Mapper",                system: "executive_brand", status: "coming_soon", description: "Maps your ideal client profile and the rooms they live in.",                  install_command: cmd("icp-mapper") },
  { slug: "brand-narrative-builder",  name: "Brand Narrative Builder",   system: "executive_brand", status: "coming_soon", description: "Builds your origin, point of view, and proof into a coherent narrative.",     install_command: cmd("brand-narrative-builder") },
  { slug: "newsletter-gen",           name: "Newsletter Generator",      system: "content",         status: "coming_soon", description: "Drafts a weekly newsletter from your latest posts and notes.",                install_command: cmd("newsletter-gen") },
  { slug: "carousel-gen",             name: "Carousel Generator",        system: "content",         status: "coming_soon", description: "Turns a single insight into a swipeable carousel script.",                    install_command: cmd("carousel-gen") },
  { slug: "video-script",             name: "Video Script Writer",       system: "content",         status: "coming_soon", description: "Writes short video scripts in your voice with hook, body, and ask.",          install_command: cmd("video-script") },
  { slug: "podcast-show-notes",       name: "Podcast Show Notes",        system: "content",         status: "coming_soon", description: "Generates clean show notes, chapters, and quote graphics from an episode.",   install_command: cmd("podcast-show-notes") },
  { slug: "prospect-finder",          name: "Prospect Finder",           system: "lead_gen",        status: "coming_soon", description: "Surfaces ICP-fit accounts and the right contact at each.",                    install_command: cmd("prospect-finder") },
  { slug: "comment-engine",           name: "Comment Engine",            system: "lead_gen",        status: "coming_soon", description: "Suggests on-voice replies to your ICP's posts every morning.",                install_command: cmd("comment-engine") },
  { slug: "dm-drafter",               name: "DM Drafter",                system: "lead_gen",        status: "coming_soon", description: "Drafts warm, specific DMs from a prospect's recent activity.",                install_command: cmd("dm-drafter") },
  { slug: "list-builder",             name: "List Builder",              system: "lead_gen",        status: "coming_soon", description: "Builds and enriches outreach lists from any seed criteria.",                  install_command: cmd("list-builder") },
  { slug: "proposal-drafter",         name: "Proposal Drafter",          system: "sales",           status: "coming_soon", description: "Drafts proposals from discovery notes in your voice.",                        install_command: cmd("proposal-drafter") },
  { slug: "follow-up-sequencer",      name: "Follow-up Sequencer",       system: "sales",           status: "coming_soon", description: "Sequences follow-ups across email and DM with the right cadence.",            install_command: cmd("follow-up-sequencer") },
  { slug: "objection-handler",        name: "Objection Handler",         system: "sales",           status: "coming_soon", description: "Surfaces likely objections and on-voice rebuttals before the call.",          install_command: cmd("objection-handler") },
  { slug: "demo-prep",                name: "Demo Prep",                 system: "sales",           status: "coming_soon", description: "Prepares a per-prospect demo plan with their context baked in.",              install_command: cmd("demo-prep") },
  { slug: "offer-architect",          name: "Offer Architect",           system: "product",         status: "coming_soon", description: "Architects signature packages from your strengths and ICP needs.",            install_command: cmd("offer-architect") },
  { slug: "pricing-experimenter",     name: "Pricing Experimenter",      system: "product",         status: "coming_soon", description: "Tests price points and packaging structures on real conversations.",          install_command: cmd("pricing-experimenter") },
  { slug: "package-designer",         name: "Package Designer",          system: "product",         status: "coming_soon", description: "Designs scope, deliverables, and timelines for each offer.",                  install_command: cmd("package-designer") },
  { slug: "partnership-outreach",     name: "Partnership Outreach",      system: "partnership",     status: "coming_soon", description: "Drafts partnership intros for audiences that overlap with yours.",            install_command: cmd("partnership-outreach") },
  { slug: "podcast-pitcher",          name: "Podcast Pitcher",           system: "partnership",     status: "coming_soon", description: "Pitches you to podcasts where your ICP already listens.",                     install_command: cmd("podcast-pitcher") },
  { slug: "collab-finder",            name: "Collab Finder",             system: "partnership",     status: "coming_soon", description: "Finds creators and operators worth a real collaboration.",                    install_command: cmd("collab-finder") },
  { slug: "weekly-planner",           name: "Weekly Planner",            system: "orchestration",   status: "coming_soon", description: "Plans your week across content, outbound, and offers.",                       install_command: cmd("weekly-planner") },
  { slug: "kpi-tracker",              name: "KPI Tracker",               system: "orchestration",   status: "coming_soon", description: "Tracks the three numbers that actually move your agency.",                    install_command: cmd("kpi-tracker") },
  { slug: "agent-coordinator",        name: "Agent Coordinator",         system: "orchestration",   status: "coming_soon", description: "Coordinates handoffs between your installed skills.",                         install_command: cmd("agent-coordinator") },
];

export const SKILL_BY_SLUG: Record<string, Skill> = Object.fromEntries(
  SKILLS.map((s) => [s.slug, s]),
);
