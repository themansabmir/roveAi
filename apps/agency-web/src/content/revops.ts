/**
 * Homepage narrative. Every claim here is drawn from existing approved copy in home.ts;
 * do not add metrics, clients or integrations that have not been verified.
 */

export type StageId = "marketing" | "leads" | "sales" | "pipeline" | "revenue" | "retention"

export const revenueStages: {
  id: StageId
  name: string
  work: string
  gate?: string
  team?: boolean
}[] = [
  {
    id: "marketing",
    name: "Marketing",
    work: "Accounts found from licensed data and agreed buying signals",
    gate: "You approve the ICP and signal list",
  },
  {
    id: "leads",
    name: "Leads",
    work: "Outreach drafted from your offer, voice and material",
    gate: "You approve every new template",
  },
  {
    id: "sales",
    name: "Sales",
    work: "Replies read, qualified and routed to your closer",
    gate: "A person handles sensitive replies",
  },
  {
    id: "pipeline",
    name: "Pipeline",
    work: "Every conversation logged in your CRM with a next step",
  },
  {
    id: "revenue",
    name: "Revenue",
    work: "Your team takes the meetings and closes",
    team: true,
  },
  {
    id: "retention",
    name: "Retention",
    work: "Follow-up, reactivation and handoffs on schedule",
  },
]

export const hero = {
  audience: "Revenue operations for B2B firms that sell through a sales team",
  title: "Your pipeline runs every day. Your team closes.",
  description:
    "We build and run the outbound system that finds your buyers, the CRM that holds every conversation, and the operations behind both. Agents do the work. A senior operator supervises it, and a person approves every step that matters.",
  primaryAction: "Book a 30-minute review",
  secondaryAction: "See how it works",
}

export const commitments = [
  {
    title: "Built once, yours to keep",
    detail: "A one-time build that keeps running after handover.",
  },
  { title: "Accounts in your name", detail: "Domains, inboxes, CRM records and copy stay yours." },
  { title: "A person approves", detail: "Every template, and every message for 30 days." },
  { title: "30-day handover", detail: "Your team can run the system without us." },
]

export const problem = {
  title: "The problem isn't your team. It's the work between the tools.",
  description:
    "Outbound runs when someone remembers it. Replies wait in an inbox. CRM records drift. An SDR and an ops hire fix these one at a time, and you pay for them before the first meeting arrives.",
  before: [
    "Outbound stops whenever the person running it is busy",
    "Replies wait in an inbox nobody owns",
    "CRM records drift after the work is done",
    "Follow-up timing depends on individual habit",
    'Pipeline reviews start with "let me check"',
  ],
  after: [
    "Accounts checked against an approved ICP and signals",
    "Every reply classified; sensitive ones go to a person",
    "Agreed records and next steps kept in your CRM",
    "Follow-up queued with a named review point",
    "A weekly report from a named operator",
  ],
  // Index-aligned with `before` and `after`.
  areas: ["Outbound", "Inbox", "CRM", "Follow-up", "Reporting"],
}

export const services = {
  title: "Three systems. Built once, yours to keep.",
  description:
    "Each system covers part of your revenue line. We build it inside your own accounts, run it alongside your team, then hand it over. After that it keeps running on autopilot, so it's a one-time build, not a permanent retainer.",
  ownership: [
    "Built in your own accounts",
    "Documented and handed over in 30 days",
    "Keeps running after our contract ends",
  ],
  items: [
    {
      id: "pipeline",
      name: "Pipeline generation",
      stages: ["marketing", "leads"],
      promise: "The right accounts, found and contacted every day, without hiring an SDR.",
      builds: [
        "An ICP and buying-signal list agreed with you",
        "Account research and enrichment from licensed data",
        "Outbound sending set up in your own domains and inboxes",
        "Campaigns drafted from your offer, voice and material",
      ],
      decide: "You approve the ICP, the signals and every new template.",
      keeps: "Signals refresh and campaigns keep sending from your accounts.",
    },
    {
      id: "sales-crm",
      name: "Sales and CRM system",
      stages: ["sales", "pipeline"],
      promise: "Every reply handled, every deal recorded, and a CRM your team finally trusts.",
      builds: [
        "Reply triage that routes interested buyers to your closer",
        "Lead qualification against your ICP",
        "CRM clean-up: duplicates, owners and trusted pipeline fields",
        "Lead routing and automatic record updates",
      ],
      decide: "A person handles sensitive replies. Your team owns every sales decision.",
      keeps: "Replies are sorted and CRM records stay current, automatically.",
    },
    {
      id: "revenue-ops",
      name: "Revenue operations",
      stages: ["revenue", "retention"],
      promise:
        "Follow-up, reactivation and reporting on schedule, so won and lost deals keep paying back.",
      builds: [
        "Follow-up sequences with a named review point",
        "Lost-deal and past-customer reactivation",
        "Sales-to-delivery handoffs",
        "A weekly next-step report",
      ],
      decide: "Your team takes the meetings and closes.",
      keeps: "Follow-ups, reactivation and reports keep going after handover.",
    },
  ] satisfies {
    id: string
    name: string
    stages: StageId[]
    promise: string
    builds: string[]
    decide: string
    keeps: string
  }[],
}

export type ToolId =
  | "apollo"
  | "clay"
  | "n8n"
  | "make"
  | "claude"
  | "openai"
  | "instantly"
  | "hubspot"
  | "pipedrive"
  | "slack"

/** Add `logo: "/logos/<id>.svg"` to show a real logo instead of the monogram. */
export const tools: Record<ToolId, { name: string; mono: string; logo?: string }> = {
  apollo: { name: "Apollo", mono: "Ap" },
  clay: { name: "Clay", mono: "Cl" },
  n8n: { name: "n8n", mono: "n8" },
  make: { name: "Make", mono: "Mk" },
  claude: { name: "Claude", mono: "Cd" },
  openai: { name: "OpenAI", mono: "AI" },
  instantly: { name: "Instantly", mono: "In" },
  hubspot: { name: "HubSpot", mono: "Hs" },
  pipedrive: { name: "Pipedrive", mono: "Pd" },
  slack: { name: "Slack", mono: "Sl" },
}

export type FlowNode = { tool: ToolId; role: string }

export const integrations = {
  title: "Wired into the tools you already use.",
  description:
    "Each system is built from tools licensed in your name and connected so data moves on its own. Pick a system to see how it's wired.",
  flows: [
    {
      serviceId: "pipeline",
      caption:
        "Licensed data is enriched, checked against your ICP and turned into approved campaigns.",
      inputs: [
        { tool: "apollo", role: "Account data" },
        { tool: "clay", role: "Enrichment" },
      ],
      engine: [
        { tool: "n8n", role: "Orchestration" },
        { tool: "claude", role: "Research and drafts" },
      ],
      outputs: [
        { tool: "instantly", role: "Sending" },
        { tool: "hubspot", role: "Activity log" },
      ],
    },
    {
      serviceId: "sales-crm",
      caption: "Every reply is classified, routed to the right person and recorded in your CRM.",
      inputs: [{ tool: "instantly", role: "Replies" }],
      engine: [
        { tool: "make", role: "Routing" },
        { tool: "claude", role: "Reply triage" },
      ],
      outputs: [
        { tool: "hubspot", role: "CRM" },
        { tool: "pipedrive", role: "CRM" },
        { tool: "slack", role: "Closer alerts" },
      ],
    },
    {
      serviceId: "revenue-ops",
      caption: "Your CRM drives follow-up, reactivation and a weekly report, on schedule.",
      inputs: [
        { tool: "hubspot", role: "Deals" },
        { tool: "pipedrive", role: "Deals" },
      ],
      engine: [
        { tool: "n8n", role: "Scheduling" },
        { tool: "openai", role: "Summaries" },
      ],
      outputs: [
        { tool: "instantly", role: "Follow-up" },
        { tool: "slack", role: "Weekly report" },
      ],
    },
  ] satisfies {
    serviceId: string
    caption: string
    inputs: FlowNode[]
    engine: FlowNode[]
    outputs: FlowNode[]
  }[],
}

export const caseStudyServices: Record<string, string> = {
  roister: "Pipeline generation",
  codeninjas: "Sales and CRM system",
  syntropic: "Pipeline generation",
}

export const comparison = {
  title: "The other ways to fix your pipeline, side by side.",
  description:
    "Most teams weigh three options: hire, outsource to an agency, or build a system they own. Here's how they compare.",
  columns: ["Hire in-house", "Typical agency", "Syntropic"],
  rows: [
    {
      label: "What you end up with",
      values: ["One person's time", "Access while you pay", "A connected system you own"],
    },
    {
      label: "Covers outbound, CRM and follow-up",
      values: ["One role, one part", "Usually outbound only", "All three, connected"],
    },
    {
      label: "Accounts, data and copy",
      values: ["In your accounts", "Often in theirs", "Always in yours"],
    },
    {
      label: "Quality control",
      values: [
        "Depends on the person",
        "Depends on the account manager",
        "A person approves templates and sensitive replies",
      ],
    },
    {
      label: "When it ends",
      values: [
        "Knowledge leaves with them",
        "Pipeline stops",
        "System keeps running after handover",
      ],
    },
    {
      label: "Cost model",
      values: ["Salary and tools, ongoing", "Monthly retainer", "One-time build"],
    },
  ],
}

export const engagementProcess = {
  title: "Diagnose, build, run. Each step ends with something in writing.",
  description:
    "A senior operator supervises the agents, with specialist teams for outbound, Meta and CRM work.",
  steps: [
    {
      name: "Diagnose",
      description: "A 30-minute review of your pipeline.",
      outcome: "A written map of where it breaks and which part we'd fix first.",
    },
    {
      name: "Build",
      description:
        "A fixed-scope setup in your accounts: data, targeting, sending, reply handling and CRM records.",
      outcome: "You see the scope in writing before work starts.",
    },
    {
      name: "Run",
      description:
        "Agents do the daily work. A named operator reviews it with you every week, and a person approves what matters.",
      outcome: "A weekly report on what moved, what was approved and what's next.",
    },
    {
      name: "Hand over",
      description: "A 30-day handover with documentation for everything we built.",
      outcome: "Your team can run the system without us.",
    },
  ],
}
