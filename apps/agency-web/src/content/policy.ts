export const policy = {
  title: "Policies and outbound standards",
  description:
    "How campaigns are controlled, how data is handled and what each side is responsible for.",
  introduction:
    "These are our operating standards for outbound engagements. They describe our process, not a guarantee of legal compliance or deliverability. Clients remain responsible for legal review of claims made to their prospects.",
  sections: [
    {
      id: "scope",
      heading: "Geography, data and channels",
      items: [
        "We target US-based contacts only. EU and UK contacts are excluded at launch, and country is checked before a list is loaded.",
        "Contact data comes only from licensed providers. We do not scrape personal websites or automate LinkedIn.",
        "At launch, we offer email outbound, not LinkedIn, paid ads, cold calling, websites, or software and mobile app builds.",
      ],
    },
    {
      id: "approval",
      heading: "Human approval gates",
      summary:
        "Every new email template is approved by a person before it sends. For the first 30 days of each campaign, every message is reviewed before it goes out. After that, we review a weekly sample and any flagged message.",
      items: [
        "ICP and signals: approved once per segment and again after a material change.",
        "Templates: every new email template is approved before its first send.",
        "Campaign launch: each new list and its messages are approved; every message is reviewed during the campaign's first 30 days.",
        "Ongoing: after day 30, a weekly sample is reviewed and any flagged message is pulled.",
        "Replies: AI-drafted replies require human approval before sending. Pricing, complaints, legal terms and unsubscribe requests are routed to a person.",
      ],
    },
    {
      id: "sending",
      heading: "Sending safeguards",
      items: [
        "Dedicated sending domains are configured with SPF, DKIM and DMARC before sending begins.",
        "Domains warm up for 2–4 weeks before volume; each inbox has a daily send cap.",
        "Sending pauses automatically if bounce rate exceeds 3% or spam complaint rate exceeds 0.1%.",
        "Unsubscribes are honored within 24 hours. Every email includes a physical mailing address and a working opt-out.",
      ],
    },
    {
      id: "monitoring",
      heading: "Monitoring and support",
      items: [
        "Deliverability, bounce and complaint rates are checked daily; clients receive a weekly report.",
        "If a sending domain has an issue, sending is paused the same business day, the client is notified within one business day, and the incident is logged.",
        "Support is provided during business hours by a named operator. There is no uptime SLA.",
      ],
    },
    {
      id: "client",
      heading: "Client responsibilities",
      items: [
        "Provide CRM and tool access and name a closer who responds to meetings the same business day.",
        "Approve the ICP, offer and claims used in outreach.",
        "Obtain their own legal review of claims made to prospects.",
      ],
    },
    {
      id: "ai-data",
      heading: "AI data processing",
      summary:
        "We use LLM API tiers that do not train on customer data. The provider and applicable data terms will be named here after they have been verified.",
      items: [],
    },
    {
      id: "handover",
      heading: "Ownership and handover",
      summary:
        "Your domains, inboxes, CRM records and campaign copy are yours. Third-party tools and data are licensed to you directly, subject to their terms. Our internal agent code, reusable templates and playbooks, and internal tooling remain ours. Handover includes 30 days for documentation and a walkthrough. Automation stops after handover unless your team can operate it.",
      items: [],
    },
  ],
} as const
