export const homeMetadata = {
  title: "Syntropic | Revenue operations",
  description: "Revenue operations run by AI agents for B2B firms that sell through a sales team.",
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
  hero: {
    eyebrow: string
    title: string
    description: string
    primaryAction: string
    secondaryAction: string
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
  paths: {
    eyebrow: string
    title: string
    description: string
    cards: {
      id: string
      path: PathName
      pain: string
      work: string
      offer: string
      price: string
      timing: string
      scope: string
    }[]
  }
  proof: {
    eyebrow: string
    title: string
    description: string
    projects: {
      id: string
      name: string
      path: string
      claim: string
      flowTitle: string
      steps: string[]
      flowDescription: string
    }[]
    placeholder: {
      title: string
      description: string
    }
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
    replyRule: string
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
    steps: {
      name: string
      description: string
    }[]
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
    auditAction: string
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
    bookCall: "Book a call",
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
  hero: {
    eyebrow: "Fix · Generate · Run",
    title: "Revenue operations, run by AI agents.",
    description:
      "Three ways in. Fix the data your pipeline runs on. Generate qualified meetings. Run the follow-up that keeps deals moving. A person approves defined decisions and outreach at the right gates, in accounts you own.",
    primaryAction: "Run the free Revenue Leak Audit",
    secondaryAction: "Book a call",
  },
  revenueFlow: {
    imageAlt:
      "Data sources flow into the Syntropic revenue system, which supports qualified opportunities, reliable CRM records, follow-up and customer handoffs.",
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
        title: "Syntropic revenue system",
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
    ariaLabel: "How the Syntropic revenue system works",
    segments: [
      {
        type: "text",
        value: "We run your revenue pipeline end to end—from licensed signals ",
      },
      { type: "visual", id: "signals" },
      {
        type: "text",
        value: "through qualification, approved outreach, reply handling, and customer handoffs. ",
      },
      { type: "visual", id: "review" },
      {
        type: "text",
        value:
          " AI agents handle defined work under a senior operator's supervision. Your CRM and campaign assets remain yours; third-party tools are licensed directly to you.",
        tone: "accent",
      },
    ],
  },
  paths: {
    eyebrow: "Three ways in",
    title: "Three ways in.",
    description:
      "Diagnosis decides the path. Each offer addresses a different constraint; none is a mandatory step before the next.",
    cards: [
      {
        id: "fix",
        path: "Fix",
        pain: "“We don't trust our CRM or our numbers.”",
        work: "Clean, enrich and score your CRM, and route each new lead on arrival.",
        offer: "Revenue Data Foundation",
        price: "$2.5k",
        timing: "Fixed scope · 2–3 weeks",
        scope: "Sold standalone when CRM quality blocks outreach or reporting.",
      },
      {
        id: "generate",
        path: "Generate",
        pain: "“We don't have enough qualified meetings.”",
        work: "Find accounts with buying signals, write outreach from your material, and book meetings with your closer.",
        offer: "Outbound Engine",
        price: "$3k/mo",
        timing: "3-month minimum · plus tools",
        scope:
          "Email outbound with a human approval process. The most common entry when the meetings gap is the leak.",
      },
      {
        id: "run",
        path: "Run",
        pain: "“Leads and lost deals go cold after the first touch.”",
        work: "Reactivate lost deals, draft follow-ups and prepare a brief before every call.",
        offer: "Always-On Revenue Agents",
        price: "$1.5k/mo",
        timing: "Monthly",
        scope: "Offered only after a live engagement, or when follow-up is the leak.",
      },
    ],
  },
  proof: {
    eyebrow: "Selected work",
    title: "Built and running in production.",
    description:
      "Examples of systems built for live operations. No performance results are implied.",
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
        name: "Codeninjas",
        path: "Fix and Run",
        claim:
          "Built lead intake end to end for a Meta lead campaign: qualification, CRM integration and a central database update.",
        flowTitle: "Codeninjas project flow",
        steps: ["Meta lead campaign", "Qualification", "CRM integration", "Database update"],
        flowDescription:
          "For Codeninjas: Meta campaign leads move through qualification and CRM integration into a central database update.",
      },
    ],
    placeholder: {
      title: "Case study #1, your own engine.",
      description: "Results publish after [X] weeks of running.",
    },
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
    eyebrow: "Control and ownership",
    title: "People approve the audience, templates and campaign gates.",
    description:
      "Approval is explicit and repeats at defined points. After the first 30 days, message review moves to a weekly sample; flagged messages are pulled.",
    gates: [
      {
        name: "ICP and signals",
        approval: "Target definition and signal list.",
        repeats: "Once per segment, and on material change.",
      },
      {
        name: "Templates",
        approval: "Every new email template before its first send.",
        repeats: "For every new template.",
      },
      {
        name: "Campaign launch",
        approval: "Each new list and its messages.",
        repeats: "Every message is reviewed for the first 30 days of each campaign.",
      },
      {
        name: "Ongoing",
        approval: "A sample of sent messages and any flagged message.",
        repeats: "Weekly after day 30; flagged messages are pulled.",
      },
    ],
    replyRule:
      "Replies follow the same logic. A person approves any AI-drafted response before it sends. Pricing, complaints, legal terms and unsubscribes go to a person.",
    ownershipTitle: "Ownership is split into three clear tiers.",
    ownership: [
      {
        name: "Owned by you",
        items: [
          "Domains registered in your name",
          "Sending inboxes",
          "CRM records",
          "Campaign copy and client-specific prompts",
        ],
        detail: "These remain in your accounts.",
      },
      {
        name: "Licensed to you directly",
        items: ["Clay", "Sending platforms", "Data providers"],
        detail: "Their licence, credit and export terms apply.",
      },
      {
        name: "Retained by Syntropic",
        items: ["Internal agent code", "Reusable templates and playbooks", "Internal tooling"],
        detail:
          "We provide a 30-day handover with documentation and a walkthrough. The system stops working after handover unless your team can run it.",
      },
    ],
  },
  process: {
    eyebrow: "How an engagement works",
    title: "Diagnose, build, run and hand over.",
    steps: [
      {
        name: "Diagnose",
        description: "We map your pipeline and identify where it leaks.",
      },
      {
        name: "Build",
        description:
          "We set up your data, targeting, outreach and reply handling in your accounts.",
      },
      {
        name: "Run and hand over",
        description:
          "We review the work weekly, then provide a 30-day handover if you take it in-house.",
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
    eyebrow: "Published prices",
    title: "A clear starting price for each path.",
    description: "The diagnosis determines which offer fits. No path is a required prerequisite.",
    boundary: "We run the operations. Your team still closes the deals.",
    offers: [
      {
        id: "foundation",
        name: "Revenue Data Foundation",
        price: "$2.5k",
        summary: "Fixed scope · 2–3 weeks",
        scope:
          "CRM and data clean-up: address duplicates and missing owners, establish trusted pipeline fields, and route new leads. Sold standalone when CRM quality blocks outreach or reporting.",
      },
      {
        id: "outbound",
        name: "Outbound Engine",
        price: "$3k/mo",
        summary: "3-month minimum · plus tools",
        scope:
          "Signal-driven email outbound: agree the ICP and signals, prepare outreach from your material, run approved campaigns and handle replies. Third-party tools are billed to your account.",
      },
      {
        id: "always-on",
        name: "Always-On Revenue Agents",
        price: "$1.5k/mo",
        summary: "Monthly · after a live engagement",
        scope:
          "Ongoing follow-up and pipeline operations, including agreed CRM updates, reply classification and next-step reporting. Offered only after a live engagement.",
      },
    ],
  },
  fit: {
    eyebrow: "Fit and boundaries",
    title: "The system needs a closer and a real pipeline to work on.",
    bestFitTitle: "Best fit",
    notFitTitle: "Not a fit",
    bestFit: [
      "B2B firms with 10–50 staff.",
      "A named person who takes sales meetings.",
      "A CRM, or willingness to adopt one.",
      "Deals worth well over $10k lifetime.",
      "US contacts only.",
    ],
    notFit: [
      "No one to take meetings.",
      "B2C sales.",
      "Very small target markets.",
      "Non-US contacts.",
      "Anyone expecting guaranteed revenue.",
    ],
    boundary:
      "LinkedIn, paid ads, cold calling, websites and apps are not part of the launch offer.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Before you decide.",
    boundary: "We run the operations. Your team still closes the deals.",
    items: [
      {
        id: "what-buying",
        question: "What exactly are we buying?",
        answer:
          "A working pipeline engine and the operator supervising it, not a licence or a block of hours.",
      },
      {
        id: "different-agency",
        question: "How is this different from an agency?",
        answer: "You own the systems, the scope is fixed and the prices are published.",
      },
      {
        id: "brand-risk",
        question: "Will AI outreach hurt my brand?",
        answer:
          "Every new email template is approved by a person before it sends. For the first 30 days of each campaign, every message is reviewed before it goes out. After that, a weekly sample and any flagged message are reviewed.",
      },
      {
        id: "salesperson",
        question: "Do I still need a salesperson?",
        answer: "Yes. Someone has to take the meetings.",
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
    eyebrow: "Start with the leak",
    title: "Find where your pipeline leaks.",
    description:
      "Answer five questions in about two minutes. Get an indicative leak category and a path to discuss.",
    auditAction: "Run the free audit",
    callAction: "Book a call",
  },
  footer: {
    description: "AI-run revenue operations for B2B firms.",
    links: [
      { label: "AI and data policy", path: "/policy" },
      { label: "Privacy", path: "/privacy", pending: true },
      { label: "Terms", path: "/terms", pending: true },
    ],
    boundary: "Not a full-service agency, AI strategy firm or software product.",
  },
} satisfies HomeContent
