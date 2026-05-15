# Voiceprint

Voiceprint is an agentic personal publishing and operating system for founders, creators, and agency builders. It captures a user's written voice as structured evidence, uses that profile to generate and revise content, and connects the workflow to an authenticated agent layer for AI generation, email handoff, document grounding, and reusable skills.

The product is built around a simple idea: high-quality AI writing should not depend on repeatedly prompting a model to "sound like me." Voiceprint turns voice into a persistent context architecture called **Voice DNA**, then lets agents use that DNA across drafting, chat, documents, and workflow skills.

## What It Does

- Builds a structured Voice DNA profile from onboarding inputs, writing samples, archetypes, and quality constraints.
- Generates long-form LinkedIn posts, short-form variants, and carousel hooks from plain-English topics.
- Enforces a hard Black List for phrases, framing, tone, and punctuation patterns the user never wants.
- Provides a streaming "My Voice" chat agent that responds in the user's style.
- Grounds agent responses with selected document folders containing PDFs, DOCX files, text files, Markdown, notes, and ingested links.
- Sends generated drafts through Agnic Agent Email when authenticated.
- Polls inbound agent email replies and correlates edit requests back to draft IDs.
- Exposes a "My Agent Skills" system for installing and managing reusable agent workflows across the 7 Systems.
- Tracks execution through a 12-week 7 Systems operating plan.

## Agentic Architecture

Voiceprint is not just a content generator. It models an agent workflow with memory, identity, tools, and human approval.

### 1. Voice DNA as Durable Agent Memory

Voice DNA stores the user's operating context in a structured schema:

- core identity
- writing voice
- rhythm and register
- sample-derived style evidence
- Black List constraints
- quality-control rules
- evolution log

The agent does not rely on a single prompt. It receives evidence about the user, then uses that evidence as durable context across generation, chat, and revision loops.

### 2. Human-in-the-Loop Draft Flow

The draft lifecycle is intentionally collaborative:

1. The user sends a topic, link, angle, or rough observation.
2. The agent generates a full draft package.
3. The draft is saved locally and optionally emailed to the user.
4. The user can reply with edits or approve the draft.
5. The system stores thread history and draft state for revision.

This keeps the agent useful without removing editorial control from the person whose voice is being represented.

### 3. Retrieval-Grounded Voice Chat

The `My Documents` area creates a lightweight knowledge base. Users can upload files, add notes, or ingest URLs. A selected folder can be pinned into the chat context so the My Voice agent can answer from project-specific source material while still matching the user's Voice DNA.

The chat edge function streams responses from the Agnic AI Gateway and injects:

- Voice DNA system context
- optional reference documents
- current conversation history
- explicit citation guidance when documents are used

### 4. Authenticated Agent Services

Voiceprint integrates with Agnic for agent identity, AI, email, and verification:

- OAuth with PKCE
- Agnic AI Gateway for model-backed draft generation and streaming chat
- Agent Email send and inbox polling
- KYA status checks for verification-aware features
- token handling through Supabase Edge Functions

The browser never needs to know the Agnic OAuth host or client configuration directly. Sensitive service calls are routed through Supabase functions.

### 5. Skill-Based Agent Extensibility

The `My Agent Skills` system models agent capabilities as installable skills. Installed skills can extend the user's agent beyond writing into repeatable agency workflows:

- executive brand
- content
- lead generation
- sales
- product
- partnerships
- orchestration

The installed defaults are `Voice DNA`, `Long-form Writer`, and `Short-form Derivatives`. The catalog also includes future skill surfaces such as prospect finding, proposal drafting, weekly planning, and agent coordination.

## Product Surface

- `/` - public entry point
- `/login` - Agnic connection flow
- `/auth/callback` - OAuth callback
- `/onboarding/*` - Voice DNA setup
- `/my-voice` - main agent studio, chat, and draft generation
- `/my-documents` - document knowledge base
- `/my-agents` - agent skill catalog
- `/7-systems` - operating system and weekly progress
- `/tools` - tools workspace
- `/engagement-os` - engagement operating view
- `/voice` - Voice DNA editor
- `/draft/:id` - draft review and revision detail
- `/settings` - account and configuration

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Routing:** React Router
- **State:** Zustand with local persistence
- **Server state:** TanStack Query
- **UI:** Tailwind CSS, shadcn-style Radix primitives, lucide-react
- **Documents:** pdfjs-dist, mammoth, text/Markdown ingestion
- **Backend:** Supabase client and Edge Functions
- **Agent services:** Agnic OAuth, AI Gateway, Agent Email, KYA identity status
- **Testing:** Vitest, Testing Library, jsdom

## Repository Structure

```text
src/
  components/              Shared app and UI components
  data/                    Voice, systems, skills, and generation logic
  hooks/                   Client hooks
  integrations/
    agnic/                 Agnic OAuth/session/client helpers
    supabase/              Supabase client and generated types
  lib/                     Utilities and document text extraction
  pages/                   Product routes
  state/                   Persisted Voiceprint and agency stores
  test/                    Test setup and examples

supabase/
  functions/
    _shared/               Shared Agnic configuration helpers
    agnic-chat/            Streaming voice agent chat
    agnic-generate/        Voice DNA grounded draft generation
    agnic-email-send/      Agent Email outbound draft delivery
    agnic-email-poll/      Inbound reply polling and edit correlation
    agnic-ingest-link/     URL text extraction for knowledge base
    agnic-kya-status/      Agent identity / verification status
    agnic-oauth-init/      PKCE authorization URL creation
    agnic-oauth-exchange/  OAuth code exchange
  migrations/              Database schema migrations
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

Run linting:

```bash
npm run lint
```

## Environment Configuration

The frontend expects Supabase variables:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Supabase Edge Functions expect server-side secrets:

```bash
AGNIC_HOSTNAME=
AGNIC_CLIENT_ID=
AGNIC_API_HOST=https://api.agnic.ai
AGNIC_AI_URL=
AGNIC_MODEL=anthropic/claude-sonnet-4.5
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

`AGNIC_AI_URL` is optional. If omitted, the shared Agnic helper resolves the default OpenAI-compatible chat completions endpoint from `AGNIC_API_HOST`.

## Security and Privacy Model

- OAuth uses PKCE with state verification.
- Agnic access tokens are stored client-side for the current app session.
- Server-side Agnic host/client configuration stays inside Supabase Edge Functions.
- Draft generation runs Black List enforcement after AI output as a client-side safety net.
- Document extraction is capped to prevent runaway context size.
- Agent chat reference documents are truncated before being sent upstream.
- Email reply polling deduplicates processed messages before inserting edit requests.

## Why This Is Different

Most AI writing tools treat style as a prompt. Voiceprint treats style as an evolving profile with constraints, examples, memory, and approval loops.

The result is a system that behaves less like a blank text box and more like a personal agent workspace: it knows the user's voice, can work from their source material, can communicate through agent email, and can be extended through reusable skills.

## Status

Voiceprint currently supports local persisted state, Voice DNA generation, AI-backed draft generation, streaming voice chat, document grounding, Agnic authentication, agent email send/poll flows, and a skill catalog. Some skill workflows are intentionally marked as coming soon while the app-level surfaces and installation model are already in place.
