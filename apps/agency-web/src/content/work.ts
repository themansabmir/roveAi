/**
 * Case studies. Facts come from the approved project claims in home.ts (`proof.projects`);
 * the brief wording is a light paraphrase and should be confirmed with each client.
 */
export type CaseStudy = {
  slug: string
  client: string
  serviceId: string
  status: "live" | "measuring"
  headline: string
  summary: string
  brief: string
  insteadOf: string
  built: { name: string; detail: string }[]
  result: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "roister",
    client: "Roister",
    serviceId: "pipeline",
    status: "live",
    headline: "Outbound and reply agents behind a live sales operation.",
    summary:
      "Built the outbound SDR agents, plus the lead generation and reply agents, behind a live sales operation.",
    brief:
      "Roister needed a steady flow of new sales conversations, and a way to handle replies as that volume grew, without building an SDR team first.",
    insteadOf: "Building an SDR team before the first conversations came in.",
    built: [
      {
        name: "Lead generation",
        detail: "Agents that find and prepare target accounts for outreach.",
      },
      {
        name: "Outbound",
        detail: "SDR agents that run outbound from approved material.",
      },
      {
        name: "Reply agents",
        detail: "Agents that read and sort replies so the right ones reach a person.",
      },
      {
        name: "Live sales operation",
        detail: "All three connected and running behind Roister's sales team.",
      },
    ],
    result: "Live and running behind Roister's sales operation.",
  },
  {
    slug: "codeninjas",
    client: "CodeNinjas",
    serviceId: "sales-crm",
    status: "live",
    headline: "Lead intake built end to end for a Meta lead campaign.",
    summary:
      "Built lead intake end to end for a Meta lead campaign: qualification, CRM integration and a central database update.",
    brief:
      "Leads from a Meta campaign needed to be qualified, recorded in the CRM and kept in sync with a central database, without anyone copying data by hand.",
    insteadOf: "Copying every campaign lead by hand into the CRM and the central database.",
    built: [
      {
        name: "Meta lead campaign",
        detail: "Campaign leads captured the moment they arrive.",
      },
      {
        name: "Qualification",
        detail: "Each lead checked against agreed criteria.",
      },
      {
        name: "CRM integration",
        detail: "Qualified leads recorded in the CRM with their details.",
      },
      {
        name: "Database update",
        detail: "A central database kept in step with the CRM.",
      },
    ],
    result: "Lead intake runs end to end, from campaign form to CRM and database.",
  },
  {
    slug: "rivet-outbound",
    client: "Rivet",
    serviceId: "pipeline",
    status: "measuring",
    headline: "Our own outbound engine, built on the same system we sell.",
    summary: "We run the same pipeline generation system on ourselves.",
    brief: "Before asking clients to trust the system, we use it to find our own buyers.",
    insteadOf: "Hiring an outbound rep to find our own buyers.",
    built: [
      { name: "Target accounts", detail: "An agreed ICP and signal list for our own market." },
      { name: "Outbound", detail: "Approved campaigns sent from our own domains and inboxes." },
      { name: "Qualified replies", detail: "Replies sorted and routed to the right person." },
    ],
    result: "Live and measuring. We'll publish the numbers once they're measured.",
  },
]

/** What we track per system, so results can be reported honestly once measured. */
export const measures: { serviceId: string; metrics: string[] }[] = [
  {
    serviceId: "pipeline",
    metrics: ["Accounts contacted", "Reply rate", "Meetings booked"],
  },
  {
    serviceId: "sales-crm",
    metrics: ["Time to first response", "Deals with a next step", "Record completeness"],
  },
  {
    serviceId: "revenue-ops",
    metrics: ["Follow-ups sent on schedule", "Deals reactivated", "Weekly report delivered"],
  },
]
