export const homeMetadata = {
  title: "Revenue operations for B2B sales teams",
  description:
    "Rivet builds and runs outbound, CRM and pipeline operations for B2B firms that sell through a sales team. Agents do the work; a person approves what matters.",
} as const

type PathName = "Fix" | "Generate" | "Run"

type HomeContent = {
  labels: {
    bookCall: string
    discussPath: string
    input: string
    output: string
    humanCheckpoint: string
    path: string
    condition: string
    scopeDetails: string
    pendingLegalReview: string
    defaultEntry: string
  }
  chapters: { id: string; label: string }[]
  hero: {
    eyebrow: string
    title: string
    accent: string
    description: string
    primaryAction: string
    secondaryAction: string
    note: string
  }
  revenueFlow: {
    imageAlt: string
    ariaLabel: string
    stages: {
      id: string
      label: string
      title: string
      description: string
    }[]
  }
  clientMarquee: {
    ariaLabel: string
    label: string
    brands: {
      id: string
      name: string
      /** Optional logo path (e.g. /logos/acme.svg); the name is shown as a wordmark when absent. */
      logo?: string
    }[]
  }
  positioningStatement: {
    eyebrow: string
    ariaLabel: string
    segments: (
      | {
          type: "text"
          value: string
          tone?: "default" | "accent"
        }
      | {
          type: "visual"
          id: "signals" | "review"
        }
    )[]
  }
  startingPoints: {
    eyebrow: string
    title: string
    items: { id: string; text: string }[]
  }
  threeParts: {
    eyebrow: string
    title: string
    description: string
    items: { id: string; title: string; description: string; link: string; href: string }[]
    note: string
  }
  buildProcess: {
    eyebrow: string
    title: string
    description: string
    startingPoint: string
    aiLabel: string
    peopleLabel: string
    steps: {
      id: "signals" | "outbound" | "crm"
      name: string
      description: string
      aiWork: string
      checkpoint: string
    }[]
  }
  proof: {
    eyebrow: string
    title: string
    description: string
    imagePlaceholder: string
    flowLabel: string
    caseLabel: string
    note: string
    projects: {
      id: string
      name: string
      path: string
      claim: string
      flowTitle: string
      steps: string[]
      flowDescription: string
    }[]
  }
  pipelineUpgrade: {
    eyebrow: string
    title: string
    description: string
    issues: {
      id: string
      title: string
      description: string
    }[]
  }
  agents: {
    eyebrow: string
    title: string
    description: string
    items: {
      id: string
      name: string
      job: string
      input: string
      output: string
      checkpoint: string
    }[]
  }
  control: {
    eyebrow: string
    title: string
    description: string
    gates: {
      name: string
      approval: string
      repeats: string
    }[]
    ownershipTitle: string
    ownership: {
      name: string
      items: string[]
      detail: string
    }[]
  }
  process: {
    eyebrow: string
    title: string
    description: string
    steps: { name: string; description: string; outcome: string }[]
  }
  tools: {
    eyebrow: string
    title: string
    description: string
    groups: {
      name: string
      tools: string[]
      note?: string
    }[]
    note: string
  }
  comparison: {
    eyebrow: string
    title: string
    description: string
    rowHeading: string
    leftHeading: string
    rightHeading: string
    rows: {
      name: string
      manual: string
      engine: string
    }[]
    note: string
  }
  pricing: {
    eyebrow: string
    title: string
    description: string
    boundary: string
    notOffered: string
    offers: {
      id: string
      name: string
      price: string
      summary: string
      scope: string
    }[]
  }
  fit: {
    eyebrow: string
    title: string
    bestFitTitle: string
    notFitTitle: string
    bestFit: string[]
    notFit: string[]
    boundary: string
  }
  faq: {
    eyebrow: string
    title: string
    boundary: string
    items: {
      id: string
      question: string
      answer: string
    }[]
  }
  audit: {
    eyebrow: string
    title: string
    description: string
    questions: {
      id: "closer" | "crm" | "signals" | "meetings" | "followUp"
      question: string
      options: {
        value: string
        label: string
      }[]
    }[]
    submit: string
    resultHeading: string
    resultTitleSuffix: string
    pathResults: Record<PathName, string>
    noCloser: string
    noClearLeak: string
    resultNote: string
    runOfferNote: string
    reset: string
  }
  finalCta: {
    eyebrow: string
    title: string
    description: string
    buildAction: string
    callAction: string
  }
  footer: {
    description: string
    links: {
      label: string
      path: string
      pending?: boolean
    }[]
    boundary: string
  }
}

export const homeContent = {
  labels: {
    bookCall: "Book a 30-minute review",
    discussPath: "Discuss this path",
    input: "Input",
    output: "Output",
    humanCheckpoint: "Human checkpoint",
    path: "Path",
    condition: "Condition",
    scopeDetails: "Offer scope",
    pendingLegalReview: "Pending legal review",
    defaultEntry: "Default entry",
  },
  chapters: [
    { id: "who-its-for", label: "Who it's for" },
    { id: "the-problem", label: "The problem" },
    { id: "three-parts", label: "Three parts" },
    { id: "how-it-works", label: "How it works" },
    { id: "proof", label: "Proof" },
    { id: "control", label: "Control" },
    { id: "pricing", label: "Price & fit" },
  ],
  hero: {
    eyebrow: "Revenue operations, run by AI agents",
    title: "Your pipeline runs every day. Your team closes.",
    accent: "Your team closes.",
    description:
      "We build and run the outbound system that finds your buyers, the CRM that holds every conversation, and the operations behind both. Agents do the work. A senior operator supervises it, and a person approves every step that matters.",
    primaryAction: "Book a 30-minute review",
    secondaryAction: "See how it works",
    note: "Published prices. Accounts in your name. Three-month minimum on outbound.",
  },
  revenueFlow: {
    imageAlt:
      "Data sources flow into the Rivet revenue system, which supports qualified opportunities, reliable CRM records, follow-up and customer handoffs.",
    ariaLabel: "Revenue workflow inputs, operating system and outputs",
    stages: [
      {
        id: "inputs",
        label: "INPUTS",
        title: "Your data sources",
        description: "CRM · licensed data · approved buying signals",
      },
      {
        id: "system",
        label: "OPERATING SYSTEM",
        title: "Rivet revenue system",
        description: "AI agents · connected workflows · human review",
      },
      {
        id: "outputs",
        label: "OUTPUTS",
        title: "Clear next steps",
        description:
          "Qualified opportunities · reliable CRM · timely follow-up · customer handoffs",
      },
    ],
  },
  clientMarquee: {
    ariaLabel: "Selected client work",
    label: "Worked With",
    brands: [
      { id: "roister", name: "Roister" },
      { id: "codeninjas", name: "CodeNinjas" },
    ],
  },
  positioningStatement: {
    eyebrow: "Why teams choose us",
    ariaLabel: "How the Rivet revenue system works",
    segments: [
      {
        type: "text",
        value: "We build the system behind your pipeline. ",
      },
      { type: "visual", id: "signals" },
      {
        type: "text",
        value:
          "Find the right accounts, start relevant conversations, and get every reply to the right next step. ",
      },
      { type: "visual", id: "review" },
      {
        type: "text",
        value: "We keep your CRM and follow-up moving, so your team can focus on selling.",
      },
    ],
  },
  startingPoints: {
    eyebrow: "01 / 07 · Who it's for",
    title: "Built for B2B firms that sell through a team.",
    items: [
      { id: "outbound-owner", text: "We have a sales team, but nobody owns outbound." },
      { id: "crm-trust", text: "Our CRM exists, but nobody trusts what's in it." },
      {
        id: "manual-operations",
        text: "Our operations depend on people doing the same work by hand.",
      },
    ],
  },
  threeParts: {
    eyebrow: "03 / 07 · Three parts, run for you",
    title: "Three parts, run for you.",
    description:
      "We cover the work from first contact through to the operations behind the business.",
    items: [
      {
        id: "leads",
        title: "Get leads.",
        description:
          "We build the outbound system. It finds accounts with buying signals, writes outreach from your material and books meetings with your closer.",
        link: "See outbound",
        href: "#pricing",
      },
      {
        id: "qualify",
        title: "Qualify and fill the CRM.",
        description:
          "Every reply is read, qualified against your ICP and logged in your CRM. No conversation gets lost, and every deal has a record.",
        link: "See the CRM pipeline",
        href: "#control",
      },
      {
        id: "operations",
        title: "Run operations.",
        description:
          "The repeatable work behind the business runs on schedule: follow-ups, reactivation, reporting and handoffs. Your team does the work that makes money.",
        link: "See operations",
        href: "#how-it-works",
      },
    ],
    note: "Revenue Data Foundation, a one-time CRM clean-up, is available when messy data blocks outreach.",
  },
  buildProcess: {
    eyebrow: "How the pipeline works",
    title: "A connected system, built around your team.",
    description:
      "Starting from scratch or fixing a system that has outgrown its setup, we connect the work from targeting through follow-up.",
    startingPoint:
      "Your CRM and sending accounts stay yours. We work in the tools you already use.",
    aiLabel: "AI assists",
    peopleLabel: "People decide",
    steps: [
      {
        id: "signals",
        name: "Signal Engineering",
        description: "Find the right accounts and give your team a useful reason to reach out.",
        aiWork: "Research, enrichment and prioritization",
        checkpoint: "You approve target criteria and sources",
      },
      {
        id: "outbound",
        name: "Outbound System",
        description: "Build a steady outbound motion using your offer, voice and account context.",
        aiWork: "Prepare drafts and sort incoming replies",
        checkpoint: "You approve campaigns; people handle sensitive replies",
      },
      {
        id: "crm",
        name: "CRM Automation",
        description: "Connect lead capture, campaign activity and next steps to your CRM.",
        aiWork: "Classify leads and prepare record updates",
        checkpoint: "Your team owns the CRM and sales decisions",
      },
    ],
  },
  proof: {
    eyebrow: "05 / 07 · Proof",
    title: "Built and running, not described.",
    description: "",
    imagePlaceholder: "Case study visual",
    flowLabel: "Project flow",
    caseLabel: "Case",
    note: "We don't show results we haven't measured.",
    projects: [
      {
        id: "roister",
        name: "Roister",
        path: "Generate",
        claim:
          "Built the outbound SDR agents, plus the lead generation and reply agents, behind a live sales operation.",
        flowTitle: "Roister project flow",
        steps: ["Lead generation", "Outbound", "Reply agents", "Live sales operation"],
        flowDescription:
          "For Roister: lead generation flows into outbound, then reply agents support a live sales operation.",
      },
      {
        id: "codeninjas",
        name: "CodeNinjas",
        path: "Fix and Run",
        claim:
          "Built lead intake end to end for a Meta lead campaign: qualification, CRM integration and a central database update.",
        flowTitle: "Codeninjas project flow",
        steps: ["Meta lead campaign", "Qualification", "CRM integration", "Database update"],
        flowDescription:
          "For Codeninjas: Meta campaign leads move through qualification and CRM integration into a central database update.",
      },
      {
        id: "syntropic",
        name: "Our own outbound engine",
        path: "In progress",
        claim: "We publish the numbers when they're measured.",
        flowTitle: "Our own outbound engine",
        steps: ["Target accounts", "Outbound", "Qualified replies"],
        flowDescription:
          "Our own outbound engine: target accounts move through outbound to qualified replies.",
      },
    ],
  },
  pipelineUpgrade: {
    eyebrow: "02 / 07 · The problem",
    title: "The problem isn't your team. It's work nobody has time to do.",
    description:
      "Outbound runs when someone remembers it. Replies wait in an inbox. CRM records drift. Follow-ups depend on habit. An SDR and an ops hire fix these one at a time, slowly, and you pay for them before the first meeting arrives.",
    issues: [
      {
        id: "slow-response",
        title: "What's breaking",
        description: "Outbound stops whenever the person running it is busy.",
      },
      {
        id: "manual-admin",
        title: "How it feels",
        description: 'Pipeline reviews start with "let me check."',
      },
      {
        id: "disconnected-tools",
        title: "Why it matters",
        description: "Every unanswered reply is a meeting your closer never saw.",
      },
    ],
  },
  agents: {
    eyebrow: "Agent roles",
    title: "Every agent has one job and one human checkpoint.",
    description: "Open a role to see its inputs, outputs and review point.",
    items: [
      {
        id: "research",
        name: "Research",
        job: "Find relevant account context from licensed sources and agreed signals.",
        input: "Approved ICP, signal list and licensed provider data.",
        output: "Account context for qualification.",
        checkpoint: "You approve the signal list.",
      },
      {
        id: "qualification",
        name: "Qualification",
        job: "Compare accounts with the agreed target definition.",
        input: "Target definition and account context.",
        output: "A qualified or excluded account with a recorded reason.",
        checkpoint: "You approve the ICP.",
      },
      {
        id: "drafting",
        name: "Drafting",
        job: "Prepare email drafts using your approved material.",
        input: "Approved account context, claims and templates.",
        output: "A draft for the approved campaign.",
        checkpoint:
          "Templates are approved before first use; each message is reviewed for the first 30 days, then a weekly sample is reviewed.",
      },
      {
        id: "reply-triage",
        name: "Reply triage",
        job: "Classify replies and route exceptions.",
        input: "Incoming replies and your escalation rules.",
        output: "A reply category and a suggested next step.",
        checkpoint:
          "A person reviews sensitive replies and approves any AI-drafted response before sending.",
      },
      {
        id: "ops",
        name: "Ops",
        job: "Keep agreed records and next steps current.",
        input: "Campaign activity, replies and CRM records.",
        output: "Updated client records and a weekly report.",
        checkpoint: "Weekly review with a named operator.",
      },
    ],
  },
  control: {
    eyebrow: "06 / 07 · Control and ownership",
    title: "A person approves what matters, and you keep what we build.",
    description: "",
    gates: [
      {
        name: "ICP and signal list",
        approval: "Your ICP and signal list are approved once per segment.",
        repeats: "Approved once per segment.",
      },
      {
        name: "New templates",
        approval: "Every new template is approved before its first send.",
        repeats: "Before first use.",
      },
      {
        name: "First 30 days",
        approval: "Every message in a campaign's first 30 days is reviewed before it goes out.",
        repeats: "Every message, for 30 days.",
      },
      {
        name: "After day 30",
        approval: "A weekly sample is reviewed. Any flagged message is pulled.",
        repeats: "Weekly sample; flagged messages are pulled.",
      },
    ],
    ownershipTitle: "What you own and what stays with us.",
    ownership: [
      {
        name: "You keep",
        items: [
          "Domains",
          "Sending inboxes",
          "CRM records",
          "Campaign copy",
          "Client-specific prompts",
        ],
        detail: "These stay in your accounts.",
      },
      {
        name: "Licensed to you directly",
        items: ["Clay", "The sending platform", "Data providers"],
        detail: "Their terms apply.",
      },
      {
        name: "We keep",
        items: ["Internal agent code", "Reusable templates", "Playbooks"],
        detail: "These are our reusable systems.",
      },
    ],
  },
  process: {
    eyebrow: "04 / 07 · How it works",
    title: "Diagnose, build, run. Each step has a written outcome.",
    description:
      "A senior operator supervises the agents, with specialist teams for outbound, Meta and CRM work.",
    steps: [
      {
        name: "Diagnose",
        description: "A 30-minute review of your pipeline.",
        outcome: "You get a written map of where it breaks and which part we'd fix first.",
      },
      {
        name: "Build",
        description:
          "A fixed-scope setup in your accounts: data, targeting, sending, reply handling and CRM records.",
        outcome: "You see the scope in writing before work starts.",
      },
      {
        name: "Run and hand over",
        description: "Weekly reviews with a named operator.",
        outcome: "Then a 30-day handover so your team can run the system without us.",
      },
    ],
  },
  tools: {
    eyebrow: "Works with",
    title: "Works with the tools you already use.",
    description: "The exact stack depends on your accounts, requirements and provider terms.",
    groups: [
      { name: "Orchestration", tools: ["Make", "n8n"], note: "Self-hosted option: n8n." },
      { name: "Data", tools: ["Clay", "Apollo"], note: "Licensed sources." },
      { name: "CRM", tools: ["HubSpot", "Pipedrive"] },
      { name: "AI", tools: ["Claude API", "OpenAI"] },
      { name: "Sending", tools: ["Instantly"] },
      { name: "Alerts", tools: ["Slack"] },
    ],
    note: "Third-party tools and data are licensed to you directly, so their terms apply.",
  },
  comparison: {
    eyebrow: "The operating change",
    title: "A clearer operating model for pipeline work.",
    description: "A process comparison, not a promise of performance.",
    rowHeading: "Pipeline area",
    leftHeading: "Manual pipeline",
    rightHeading: "With the engine",
    rows: [
      {
        name: "Lead handling",
        manual: "Ownership and next steps depend on separate reminders.",
        engine: "Agreed routing rules record each new lead in the client CRM.",
      },
      {
        name: "List building",
        manual: "Account research happens across separate workflows.",
        engine: "Accounts are checked against the approved ICP and signals using licensed data.",
      },
      {
        name: "Follow-ups",
        manual: "Follow-up timing depends on individual habits.",
        engine: "Agreed follow-up is queued with a named review point.",
      },
      {
        name: "CRM updates",
        manual: "Records may be updated after the work is done.",
        engine: "Agreed records and next steps are kept in the client CRM.",
      },
      {
        name: "Reply handling",
        manual: "Replies are checked and routed by the team.",
        engine: "Replies are classified; sensitive cases and drafted responses go to a person.",
      },
    ],
    note: "Your team still takes and closes the meetings.",
  },
  pricing: {
    eyebrow: "07 / 07 · Price and fit",
    title: "Published prices. Fixed scope.",
    description: "",
    boundary:
      "Tools are billed to your accounts. We don't guarantee revenue. We run the work, and your team still closes.",
    notOffered: "Not offered at launch: LinkedIn, paid ads, cold calling, websites, apps.",
    offers: [
      {
        id: "foundation",
        name: "CRM clean-up",
        price: "From $2.5k",
        summary: "Fixed scope · 2–3 weeks",
        scope:
          "CRM and data clean-up: address duplicates and missing owners, establish trusted pipeline fields, and route new leads. Sold standalone when CRM quality blocks outreach or reporting.",
      },
      {
        id: "outbound",
        name: "Outbound system",
        price: "From $3k/month",
        summary: "3-month minimum · plus tools",
        scope:
          "Signal-driven email outbound: agree the ICP and signals, prepare outreach from your material, run approved campaigns and handle replies. Third-party tools are billed to your account.",
      },
      {
        id: "always-on",
        name: "Operations add-on",
        price: "From $1.5k/month",
        summary: "After a live engagement",
        scope:
          "Ongoing follow-up and pipeline operations, including agreed CRM updates, reply classification and next-step reporting. Offered only after a live engagement.",
      },
      {
        id: "custom",
        name: "Custom internal builds",
        price: "Quoted as projects",
        summary: "Scoped to the work",
        scope: "Custom internal builds are quoted as projects.",
      },
    ],
  },
  fit: {
    eyebrow: "Fit and boundaries",
    title: "Built for a team that can take the meetings.",
    bestFitTitle: "Best fit",
    notFitTitle: "Not a fit",
    bestFit: [
      "B2B firms with 10–50 staff.",
      "A named person who takes sales meetings.",
      "A CRM, or willingness to adopt one.",
      "Deals worth well over $10k.",
      "US contacts only.",
    ],
    notFit: ["No one to take meetings.", "B2C sales.", "Anyone expecting guaranteed revenue."],
    boundary: "A named person needs to take meetings. US contacts only.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions we hear on every first call.",
    boundary: "US contacts only. See our AI and data policy for details.",
    items: [
      {
        id: "what-buying",
        question: "What exactly do we get?",
        answer:
          "A working revenue system built inside your own accounts: outbound, reply handling, CRM and follow-up, connected end to end. You also get documentation for every workflow and a 30-day handover, so your team can run it without us.",
      },
      {
        id: "one-time",
        question: "Is this a one-time project or an ongoing retainer?",
        answer:
          "A one-time build. We scope it, build it, run it alongside your team and hand it over. If you'd like us to keep operating it afterwards we can, but the system doesn't depend on us to keep working.",
      },
      {
        id: "cost",
        question: "How much does it cost?",
        answer:
          "It depends on which systems you need and the state of your CRM and data. We scope it together on a 30-minute call and confirm a fixed price in writing before any work starts. Tools are billed to your own accounts, so there's no markup.",
      },
      {
        id: "fit",
        question: "Who is this built for?",
        answer:
          "B2B firms of roughly 10–50 people, with a named person who takes sales meetings and deals worth well over $10k. We aren't a fit for B2C, or for anyone expecting guaranteed revenue.",
      },
      {
        id: "timing",
        question: "How long until it's live?",
        answer:
          "Your written scope includes the timeline. New domains and inboxes need a 2–4 week warm-up before sending starts, and we run that in parallel with the rest of the build.",
      },
      {
        id: "salesperson",
        question: "Do we still need a salesperson?",
        answer:
          "Yes. The system finds the accounts, starts the conversations and books the meetings. Your team takes those meetings and closes the deals.",
      },
      {
        id: "brand-risk",
        question: "Will AI-written outreach hurt our brand?",
        answer:
          "Not without a person seeing it first. You approve every new template before it sends, every message is reviewed for the first 30 days, and after that a weekly sample is checked. Any flagged message is pulled.",
      },
      {
        id: "ownership",
        question: "Who owns the accounts, data and workflows?",
        answer:
          "You do. Domains, inboxes, CRM records, campaign copy and the workflows we build all live in your accounts. Tools such as Clay and your sending platform are licensed to you directly.",
      },
      {
        id: "after-handover",
        question: "What happens after the handover?",
        answer:
          "The system keeps running in your accounts. Your team has the documentation and the walkthrough to adjust targeting, templates and reports on their own.",
      },
      {
        id: "tools",
        question: "Which tools do you work with?",
        answer:
          "HubSpot and Pipedrive for CRM, Clay and Apollo for data, Instantly for sending, n8n or Make for automation, Claude or OpenAI for AI, and Slack for alerts. If you already run something else, we'll tell you on the call whether it fits.",
      },
      {
        id: "compliance",
        question: "Is the outreach compliant?",
        answer:
          "We contact US recipients only. Every email has a working opt-out and a physical address, and unsubscribes are honoured within 24 hours. Our AI and data policy has the full detail.",
      },
    ],
  },
  audit: {
    eyebrow: "Free Revenue Leak Audit",
    title: "Find the likely leak in your pipeline.",
    description:
      "Answer five questions in about two minutes. Get an indicative leak category and a path to discuss. This is not a financial forecast.",
    questions: [
      {
        id: "closer",
        question: "Is there a named person who takes sales meetings?",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "crm",
        question: "How much do you trust your CRM data and pipeline numbers?",
        options: [
          { value: "trust", label: "We trust them" },
          { value: "gaps", label: "There are some gaps" },
          { value: "blocking", label: "The data is a blocker" },
        ],
      },
      {
        id: "signals",
        question: "Can you identify the right accounts and why now is a good time to contact them?",
        options: [
          { value: "clear", label: "Yes, with agreed signals" },
          { value: "partial", label: "Partly" },
          { value: "unclear", label: "Not reliably" },
        ],
      },
      {
        id: "meetings",
        question: "Are qualified sales meetings arriving consistently?",
        options: [
          { value: "enough", label: "Yes" },
          { value: "inconsistent", label: "Not consistently" },
          { value: "few", label: "No, there are too few" },
        ],
      },
      {
        id: "followUp",
        question: "Are leads and lost deals followed up consistently?",
        options: [
          { value: "consistent", label: "Yes" },
          { value: "inconsistent", label: "No, follow-up is uneven" },
        ],
      },
    ],
    submit: "Show my result",
    resultHeading: "Your indicative result",
    resultTitleSuffix: "is the clearest area to investigate.",
    pathResults: {
      Fix: "Your answers point first to CRM reliability. Check whether the records and pipeline fields are dependable enough for outreach and reporting.",
      Generate:
        "Your answers point first to account selection and qualified meetings. Review the target definition, buying signals and outreach process.",
      Run: "Your answers point first to follow-up consistency. Review how leads and lost deals are routed, revisited and recorded.",
    },
    noCloser: "A pipeline engine is not a fit until someone can take and close the meetings.",
    noClearLeak:
      "These answers do not show one clear constraint. A conversation is a better next step than guessing at an offer.",
    resultNote:
      "This identifies an area to investigate from your answers. It does not estimate revenue or guarantee an outcome.",
    runOfferNote:
      "Always-On Revenue Agents are offered only after a live engagement. Book a call to check whether that condition is met.",
    reset: "Start again",
  },
  finalCta: {
    eyebrow: "Start with a 30-minute review",
    title: "Stop chasing the pipeline. Start with a 30-minute review.",
    description:
      "We'll map where your pipeline breaks and tell you honestly whether we're the right fit.",
    buildAction: "Book the review",
    callAction: "See how it works",
  },
  footer: {
    description: "Outbound systems, automation and revenue operations for B2B teams.",
    links: [
      { label: "AI and data policy", path: "/policy" },
      { label: "Privacy", path: "/privacy", pending: true },
      { label: "Terms", path: "/terms", pending: true },
    ],
    boundary: "Not a full-service agency, AI strategy firm or software product.",
  },
} satisfies HomeContent
