import { NextResponse } from "next/server"

const MAX = {
  name: 120,
  email: 200,
  company: 160,
  website: 200,
  crm: 40,
  problem: 60,
  message: 2000,
}
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Field = keyof typeof MAX

function read(body: Record<string, unknown>, field: Field) {
  const value = body[field]
  return typeof value === "string" ? value.trim().slice(0, MAX[field]) : ""
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.company_url === "string" && body.company_url.length > 0) {
    return NextResponse.json({ ok: true })
  }

  const lead = {
    name: read(body, "name"),
    email: read(body, "email"),
    company: read(body, "company"),
    website: read(body, "website"),
    crm: read(body, "crm"),
    problem: read(body, "problem"),
    message: read(body, "message"),
  }

  if (!lead.name || !lead.company || !EMAIL.test(lead.email)) {
    return NextResponse.json(
      { error: "Add your name, a valid work email and your company." },
      { status: 422 },
    )
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL
  if (!webhook) {
    return NextResponse.json(
      { error: "Booking isn't available right now. Please try again shortly." },
      { status: 503 },
    )
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        source: "elqoralabs-website",
        receivedAt: new Date().toISOString(),
      }),
    })
    if (!response.ok) throw new Error(`Webhook responded ${response.status}`)
  } catch {
    return NextResponse.json(
      { error: "We couldn't send your request. Please try again in a minute." },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
