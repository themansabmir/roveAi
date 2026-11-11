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
      slug: "pipeline-generation",
      problem: {
        title: "Outbound only runs when someone has time for it.",
        points: [
          "Lists are built by hand, then go stale",
          "Messages stay generic because research takes too long",
          "Sending stops whenever the person running it is busy",
        ],
      },
      impact:
        "Your closer waits for meetings that never get booked, and an SDR hire costs you months before the first one arrives.",
      approach: [
        {
          name: "Agree the target",
          detail:
            "We define your ICP and the buying signals that make an account worth contacting now. You approve both.",
        },
        {
          name: "Build the data flow",
          detail:
            "Accounts come from licensed sources, get enriched and are checked against your ICP, each with a recorded reason.",
        },
        {
          name: "Set up sending",
          detail:
            "Domains and inboxes in your name, configured with SPF, DKIM and DMARC and warmed for 2–4 weeks before volume.",
        },
        {
          name: "Launch approved campaigns",
          detail:
            "Messages are drafted from your offer and voice. Every new template is approved, and every message is reviewed for the first 30 days.",
        },
      ],
      caseStudy: "roister",
      run: {
        title: "One account, from signal to meeting.",
        intro:
          "Agents do the research and the sending. A person approves the wording before anything goes out.",
        steps: [
          {
            actor: "agent",
            label: "Signal spotted",
            detail: "Northwind Freight posts three sales roles this week.",
          },
          {
            actor: "agent",
            label: "Checked against your ICP",
            detail: "B2B, 50–200 staff, in a region you sell to. Reason recorded.",
          },
          {
            actor: "agent",
            label: "Researched",
            detail: "Recent expansion into a new market noted for the opening line.",
          },
          {
            actor: "person",
            label: "Template approved",
            detail: "Your team signed off the wording before the first send.",
          },
          {
            actor: "agent",
            label: "Sent from your outreach domain",
            detail: "Warmed inbox in your name, away from your main domain.",
          },
          {
            actor: "person",
            label: "Meeting with your closer",
            detail: "Reply routed with the account context attached.",
          },
        ],
      },
      startingPoints: [
        {
          title: "No outbound yet",
          detail:
            "Every meeting comes from referrals or the founder's network. Nobody owns finding new accounts.",
        },
        {
          title: "Outbound that stalls",
          detail:
            "Someone sends when they have time. Lists go stale and the campaign stops every time they get busy.",
        },
        {
          title: "Tools, but no system",
          detail:
            "You pay for data and sending tools, but nobody has wired them into a routine that runs every day.",
        },
      ],
      teams: [
        {
          team: "Founders",
          detail:
            "You stop being the only source of new meetings. Accounts are found and contacted while you run the business.",
        },
        {
          team: "Marketing",
          detail:
            "Your ICP and offer turn into live campaigns, and every account contacted has a recorded reason.",
        },
        {
          team: "Sales",
          detail:
            "Your closer gets meetings with accounts that match the ICP, instead of spending mornings building lists.",
        },
        {
          team: "Leadership",
          detail:
            "A weekly report shows who was contacted, who replied and what was approved, so pipeline isn't a guess.",
        },
      ],
      stalls: {
        feels:
          "Pipeline reviews turn into guesses. The closer prospects instead of selling, and every quiet week feels like a market problem.",
        wrong:
          "Finding and contacting the right accounts is repeatable work. It shouldn't depend on one person's calendar, or on a new hire to keep it going.",
        villain: {
          name: "The SDR hire.",
          detail:
            "Months to recruit and ramp, a salary from day one, and the whole routine walks out the door when they leave.",
        },
      },
      atStake: [
        {
          title: "Your closer prospects instead of closing",
          detail: "Hours that should go to buyers go to building lists by hand.",
        },
        {
          title: "Lists go stale",
          detail: "People change jobs and companies change direction. Old lists quietly bounce.",
        },
        {
          title: "Your main domain takes the risk",
          detail:
            "Sending volume without separate, warmed domains puts your everyday email at risk.",
        },
        {
          title: "Messages stay generic",
          detail: "Without research, every account gets the same email, and replies stay low.",
        },
        {
          title: "Pipeline depends on one person",
          detail: "When they're busy, on leave or gone, new meetings stop.",
        },
        {
          title: "Spend without a record",
          detail: "Tools bill every month with no record of who was contacted, or why.",
        },
      ],
      outcomes: [
        {
          title: "Accounts found every day",
          detail:
            "New accounts that match your ICP are checked and added, each with a recorded reason.",
        },
        {
          title: "Research on every account",
          detail: "Messages start from what the account is doing now, not a generic template.",
        },
        {
          title: "Sending you own",
          detail:
            "Domains and inboxes in your name, configured and warmed, away from your main domain.",
        },
        {
          title: "Templates you approved",
          detail: "Every campaign runs on wording your team signed off.",
        },
        {
          title: "Your closer sells",
          detail: "Meetings land with the person who closes, with the account context attached.",
        },
        {
          title: "A record of everything",
          detail: "Who was contacted, when and why, kept where your team can check it.",
        },
      ],
      faq: [
        {
          question: "Do we need our own data and sending tools?",
          answer:
            "We build in accounts in your name. If you already pay for tools, we use them. If not, we recommend what fits and you own the subscriptions.",
        },
        {
          question: "Will outbound hurt our main domain?",
          answer:
            "Sending runs from separate domains in your name, configured with SPF, DKIM and DMARC and warmed for 2–4 weeks before any volume.",
        },
        {
          question: "Who writes the messages?",
          answer:
            "We draft from your offer, voice and material. You approve every new template, and every message is reviewed for the first 30 days.",
        },
        {
          question: "How do you choose which accounts to contact?",
          answer:
            "From an ICP and buying signals you approve. Every account gets a recorded reason for being contacted.",
        },
        {
          question: "What happens after handover?",
          answer:
            "Signals refresh and campaigns keep sending from your accounts. Your team approves new templates and reads the weekly report.",
        },
      ],
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
      slug: "sales-crm-system",
      problem: {
        title: "Replies wait in an inbox, and the CRM drifts.",
        points: [
          "Interested buyers wait hours for a response",
          "Duplicates and missing owners hide real deals",
          'Pipeline reviews start with "let me check"',
        ],
      },
      impact:
        "Every unanswered reply is a meeting your closer never saw, and every forecast rests on numbers nobody trusts.",
      approach: [
        {
          name: "Clean the CRM",
          detail:
            "Resolve duplicates and missing owners, and agree the pipeline fields your team will trust.",
        },
        {
          name: "Classify every reply",
          detail:
            "Replies are sorted as they arrive. Pricing, complaints, legal terms and unsubscribes go straight to a person.",
        },
        {
          name: "Route and record",
          detail:
            "Interested buyers reach your closer with context, and every conversation is logged with a next step.",
        },
        {
          name: "Keep it current",
          detail: "Records update automatically as activity happens, so reviews start from facts.",
        },
      ],
      caseStudy: "codeninjas",
      run: {
        title: "Every reply sorted, and routed to the right place.",
        intro:
          "Agents read and classify each reply as it arrives. Anything sensitive goes to a person, never to an automated answer.",
        steps: [
          {
            actor: "agent",
            label: "Interested",
            detail:
              '"Yes, can we talk Thursday?" Sent to your closer with the thread and account notes.',
          },
          {
            actor: "person",
            label: "Pricing question",
            detail: '"What would this cost us?" Goes straight to a person.',
          },
          {
            actor: "agent",
            label: "Out of office",
            detail: '"Back on Monday." Follow-up moved to the return date.',
          },
          {
            actor: "agent",
            label: "Referral",
            detail: '"Not me, try Sam in ops." New contact created and linked to the account.',
          },
          {
            actor: "person",
            label: "Unsubscribe",
            detail: '"Please remove me." A person confirms, and the contact is suppressed.',
          },
          {
            actor: "agent",
            label: "Not now",
            detail: '"We\'re locked in until next year." Logged with a date to revisit.',
          },
        ],
      },
      startingPoints: [
        {
          title: "Replies pile up",
          detail:
            "Interested buyers, out-of-office notes and unsubscribes land in the same inbox, and nobody owns it.",
        },
        {
          title: "A CRM nobody trusts",
          detail: "Duplicates, missing owners and old stages. Reps keep their own notes instead.",
        },
        {
          title: "Leads without a route",
          detail:
            "Leads arrive from forms, outbound and referrals, and who picks them up depends on who notices.",
        },
      ],
      teams: [
        {
          team: "Sales",
          detail: "Interested buyers reach your closer with the conversation and context attached.",
        },
        {
          team: "Sales managers",
          detail: 'Pipeline reviews start from records that are current, not from "let me check".',
        },
        {
          team: "Marketing",
          detail: "Every lead has an owner and a source, so you can see what turned into pipeline.",
        },
        {
          team: "Leadership",
          detail: "Forecasts rest on fields your team agreed on and that stay up to date.",
        },
      ],
      stalls: {
        feels:
          "Reps double-handle leads, buyers wait for answers, and every forecast meeting starts with fixing the data.",
        wrong:
          "Sorting replies and updating records is rule-based work. Your team should be selling, not filing.",
        villain: {
          name: "The CRM clean-up project.",
          detail:
            "A one-off spring clean that looks good for a month, then drifts back because nothing keeps it current.",
        },
      },
      atStake: [
        {
          title: "Hot replies go cold",
          detail: "A buyer who said yes waits hours, then books with someone else.",
        },
        {
          title: "Sensitive replies get the wrong answer",
          detail: "Pricing, complaints and legal terms get handled without a person seeing them.",
        },
        {
          title: "Duplicates hide deals",
          detail:
            "Two records for one account split the history, and nobody sees the full picture.",
        },
        {
          title: "Leads sit without an owner",
          detail: "Nobody picks them up until someone stumbles on them.",
        },
        {
          title: "Forecasts become guesses",
          detail: "When fields are stale, every number in the pipeline review needs checking.",
        },
        {
          title: "Reps keep side spreadsheets",
          detail: "If the CRM slows them down, they work around it, and the data gets worse.",
        },
      ],
      outcomes: [
        {
          title: "Every reply sorted",
          detail: "Replies are classified as they arrive, and interested buyers reach your closer.",
        },
        {
          title: "A person on sensitive replies",
          detail: "Pricing, complaints, legal terms and unsubscribes always go to a person.",
        },
        {
          title: "One record per account",
          detail: "Duplicates resolved, with rules in place so new ones don't build up.",
        },
        {
          title: "Every lead has an owner",
          detail: "Routing rules assign leads the moment they arrive.",
        },
        {
          title: "Records that update themselves",
          detail: "Activity, stage and next step update as the work happens.",
        },
        {
          title: "Reviews that start from facts",
          detail: "Pipeline fields your team agreed on, kept current without chasing.",
        },
      ],
      faq: [
        {
          question: "Which CRMs do you work with?",
          answer:
            "Mostly HubSpot and Pipedrive. If you use something else, we'll tell you on the review whether we can build in it.",
        },
        {
          question: "Do you move us to a new CRM?",
          answer:
            "We clean up and automate the CRM you have. If a move is genuinely needed, we'll say so and scope it separately.",
        },
        {
          question: "Which replies does a person handle?",
          answer:
            "Pricing, complaints, legal terms, unsubscribes and anything the classifier isn't sure about.",
        },
        {
          question: "Will our reps have to change how they work?",
          answer:
            "Less than they do now. Records update automatically, so there's less to log by hand. We walk your team through it before handover.",
        },
        {
          question: "What happens after handover?",
          answer:
            "Replies keep being sorted and records stay current. Your team owns every sales decision.",
        },
      ],
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
      slug: "revenue-operations",
      problem: {
        title: "Follow-up depends on habit, so revenue leaks after the first call.",
        points: [
          "Lost deals are never revisited",
          "Past customers only hear from you when they call",
          "Sales-to-delivery handoffs live in someone's inbox",
        ],
      },
      impact:
        "Deals you already paid to win go cold, and nobody can say where next quarter's revenue will come from.",
      approach: [
        {
          name: "Map the follow-up rules",
          detail: "Which deals get which follow-up, when, and who reviews it. Agreed in writing.",
        },
        {
          name: "Automate follow-up and reactivation",
          detail:
            "Open deals, lost deals and past customers get the right touch on schedule, from your accounts.",
        },
        {
          name: "Connect sales to delivery",
          detail: "Won deals hand over with their full context, so nothing is retyped or lost.",
        },
        {
          name: "Report weekly",
          detail: "One report on what moved, what stalled and what happens next.",
        },
      ],
      caseStudy: undefined,
      run: {
        title: "What happens after the proposal goes out.",
        intro:
          "Follow-up runs on agreed rules, from your accounts. A person reviews every deal at a set point, so nothing is left to memory.",
        steps: [
          {
            actor: "person",
            label: "Day 0",
            detail: "Proposal sent by your team.",
          },
          {
            actor: "agent",
            label: "Day 3",
            detail: "Check-in drafted from the call notes, using an approved template.",
          },
          {
            actor: "agent",
            label: "Day 10",
            detail: "Relevant case study sent, with a single question.",
          },
          {
            actor: "person",
            label: "Day 21",
            detail: "Deal owner reviews: keep going, call, or close it out.",
          },
          {
            actor: "agent",
            label: "Won",
            detail: "Delivery gets the deal with its full context. Nothing retyped.",
          },
          {
            actor: "agent",
            label: "Lost on timing",
            detail: "Reactivation queued for the quarter the buyer named.",
          },
        ],
      },
      startingPoints: [
        {
          title: "Follow-up by memory",
          detail:
            "Whether a deal gets a second email depends on who owns it and how busy their week is.",
        },
        {
          title: "Lost deals forgotten",
          detail: "Deals marked lost are never revisited, even when the reason was timing.",
        },
        {
          title: "Handoffs in inboxes",
          detail:
            "Won deals move to delivery through forwarded emails, and details get retyped or lost.",
        },
      ],
      teams: [
        {
          team: "Sales",
          detail:
            "Open deals get follow-up on schedule, with a named point where someone reviews it.",
        },
        {
          team: "Delivery",
          detail: "Won deals arrive with their full context, so kickoff starts from facts.",
        },
        {
          team: "Account management",
          detail: "Past customers hear from you before they start thinking about switching.",
        },
        {
          team: "Leadership",
          detail: "One weekly report on what moved, what stalled and what happens next.",
        },
      ],
      stalls: {
        feels:
          "Quarter-end turns into a scramble through old deals, and nobody can say where next quarter's revenue will come from.",
        wrong:
          "Revenue you already paid to win shouldn't depend on someone remembering to send an email.",
        villain: {
          name: "The reminder in someone's calendar.",
          detail:
            "It works until they're on leave, change role or have a busy week. Then the deal quietly goes cold.",
        },
      },
      atStake: [
        {
          title: "Open deals go quiet",
          detail: "No reply after the proposal, and no second follow-up.",
        },
        {
          title: "Lost deals stay lost",
          detail: "Timing changes and budgets reopen, but nobody gets back in touch.",
        },
        {
          title: "Past customers drift",
          detail: "They only hear from you when they call, often to cancel.",
        },
        {
          title: "Handoffs lose details",
          detail: "Delivery asks the client questions sales already answered.",
        },
        {
          title: "Reporting takes a day",
          detail: "Someone pulls numbers by hand every week, and they still don't match.",
        },
        {
          title: "Next quarter is a guess",
          detail: "Without a view of follow-up and reactivation, every forecast starts from zero.",
        },
      ],
      outcomes: [
        {
          title: "Follow-up on schedule",
          detail: "Open deals get the right touch at the right time, with a named review point.",
        },
        {
          title: "Lost deals revisited",
          detail: "Deals lost on timing or budget come back up when it makes sense.",
        },
        {
          title: "Past customers contacted",
          detail: "Reactivation runs from your accounts, in your voice.",
        },
        {
          title: "Clean handoffs",
          detail: "Won deals reach delivery with their full context attached.",
        },
        {
          title: "One weekly report",
          detail: "What moved, what stalled and what happens next, every week.",
        },
        {
          title: "A view of next quarter",
          detail: "Follow-up and reactivation activity you can plan around.",
        },
      ],
      faq: [
        {
          question: "Is this a reporting dashboard project?",
          answer:
            "No. Reporting is one part. The core is the follow-up, reactivation and handoffs that keep revenue moving.",
        },
        {
          question: "Who sends the follow-ups?",
          answer: "They go from your accounts, in your voice, using templates you approved.",
        },
        {
          question: "Can you connect to our delivery or project tool?",
          answer: "Usually. We confirm your tools on the review and scope the handoff in writing.",
        },
        {
          question: "Do we need the other two systems first?",
          answer:
            "No. Each system works on its own. Most teams start with the part that hurts most.",
        },
        {
          question: "What happens after handover?",
          answer:
            "Follow-ups, reactivation and reports keep running. Your team takes the meetings and closes.",
        },
      ],
    },
  ] satisfies {
    id: string
    name: string
    stages: StageId[]
    promise: string
    builds: string[]
    decide: string
    keeps: string
    slug: string
    problem: { title: string; points: string[] }
    impact: string
    approach: { name: string; detail: string }[]
    caseStudy?: string
    run: {
      title: string
      intro: string
      steps: { actor: "agent" | "person"; label: string; detail: string }[]
    }
    startingPoints: { title: string; detail: string }[]
    teams: { team: string; detail: string }[]
    stalls: { feels: string; wrong: string; villain: { name: string; detail: string } }
    atStake: { title: string; detail: string }[]
    outcomes: { title: string; detail: string }[]
    faq: { question: string; answer: string }[]
  }[],
}

export const writtenCommitments = {
  title: "Six commitments, in writing before we start.",
  description:
    "Every engagement runs on the same promises. They're in the scope you sign, not on a sales slide.",
  items: [
    "A fixed scope, agreed before any work begins",
    "Everything built in accounts in your name",
    "No new template goes live without your approval",
    "A person handles every sensitive reply",
    "A weekly report from a named operator",
    "An honest answer if we're not the right fit",
  ],
  facts: [
    { value: "30 days", label: "Handover overlap while your team takes over" },
    { value: "2–4 wks", label: "Domain warm-up before any sending volume" },
    { value: "4", label: "Approval gates before anything reaches a buyer" },
    { value: "0", label: "Accounts held in our name" },
  ],
}

export const startSteps = [
  {
    name: "Book a 30-minute review",
    detail:
      "We map your revenue line and the places it breaks most. You get an honest answer on whether we're the right fit.",
  },
  {
    name: "Get a written scope",
    detail:
      "Which system, which accounts, what you approve and how success is reviewed. Fixed before any work starts.",
  },
  {
    name: "Build, run, hand over",
    detail:
      "We build in your accounts, review it with you weekly, then hand it over across 30 days.",
  },
]

export const teamRoles = [
  {
    role: "Lead operator",
    detail: "Owns your scope, runs the weekly review and is the name you call.",
    you: false,
  },
  {
    role: "Systems engineer",
    detail: "Builds the data flows, sending setup, CRM rules and automations in your accounts.",
    you: false,
  },
  {
    role: "Agent operator",
    detail:
      "Tunes the agents that research, draft, sort replies and update records, and checks their output.",
    you: false,
  },
  {
    role: "You",
    detail: "Approve the ICP, templates and anything that reaches a buyer. You own every account.",
    you: true,
  },
]

export const agentRules = {
  title: "What the agents do, and what they never do.",
  description:
    "Agents handle the repeatable work inside your accounts. Rules set what they can touch, and a person decides anything that reaches a buyer.",
  does: [
    "Find accounts and check them against your approved ICP",
    "Research each account before anything is written",
    "Draft messages from templates you approved",
    "Sort replies and route them to the right person",
    "Update CRM records as the work happens",
    "Put together the weekly report",
  ],
  never: [
    "Send wording you haven't approved",
    "Answer pricing, complaints or legal questions",
    "Contact anyone who has opted out",
    "Change your pipeline rules on their own",
    "Keep your data in accounts we own",
    "Make a sales decision for your team",
  ],
  note: "Agent work is recorded where your team can review it, and the weekly report shows what was done and what was approved.",
}

export const hireInstead = {
  title: "The roles you'd otherwise hire for.",
  description:
    "Most teams try to fix the revenue line one hire at a time. Each system takes on the repeatable part of a role, so your people spend their time with buyers.",
  roles: [
    {
      role: "An SDR",
      serviceId: "pipeline",
      work: ["Building lists", "Researching accounts", "Sending first touches"],
      keep: "Your closer takes the meetings.",
    },
    {
      role: "A CRM admin",
      serviceId: "sales-crm",
      work: ["Sorting replies", "Routing new leads", "Fixing duplicates and owners"],
      keep: "Your team owns every sales decision.",
    },
    {
      role: "A RevOps analyst",
      serviceId: "revenue-ops",
      work: ["Chasing follow-ups", "Reactivating old deals", "Building the weekly report"],
      keep: "Leadership reads the report and decides.",
    },
  ],
  note: "A hire takes months to recruit and ramp, and leaves with what they know. A build is scoped once, documented, and stays in your accounts.",
}

export const notReadyLinks = [
  { label: "Read how an engagement works", href: "/how-it-works" },
  { label: "Read our case studies", href: "/case-studies" },
  { label: "Read our outbound standards", href: "/policy" },
]

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
  columns: ["Hire in-house", "Typical agency", "ElqoraLabs"],
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
