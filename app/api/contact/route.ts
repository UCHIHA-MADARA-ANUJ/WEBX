import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = { name?: string; email?: string; intent?: string; message?: string };

/** Bounded in-memory inbox — enough to prove the path works without a database. */
const inbox: Array<{ at: string; name: string; email: string; intent: string; message: string }> = [];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, message: "Malformed request body." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const intent = (body.intent ?? "General").trim();
  const message = (body.message ?? "").trim();

  const errors: string[] = [];
  if (name.length < 2) errors.push("name");
  if (!EMAIL_RE.test(email)) errors.push("email");
  if (message.length < 10) errors.push("message");

  if (errors.length) {
    return NextResponse.json(
      { ok: false, message: `Check these fields: ${errors.join(", ")}.` },
      { status: 422 },
    );
  }

  const record = { at: new Date().toISOString(), name, email, intent, message };
  inbox.push(record);
  if (inbox.length > 50) inbox.shift();
  console.info(`[verde] contact message from ${name} <${email}> · ${intent}`);

  const provider = process.env.RESEND_API_KEY;
  if (provider) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${provider}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM ?? "verde@resend.dev",
          to: process.env.CONTACT_TO ?? record.email,
          subject: `[Verde] ${intent} — ${name}`,
          text: `${message}\n\n— ${name} <${email}>`,
        }),
      });
      if (!response.ok) throw new Error(`provider ${response.status}`);
      return NextResponse.json({ ok: true, message: "Delivered. You will hear back within 48 hours." });
    } catch {
      return NextResponse.json(
        { ok: false, message: "The mail provider rejected the message" },
        { status: 502 },
      );
    }
  }

  // No provider configured — say so plainly rather than pretending.
  return NextResponse.json({
    ok: true,
    message:
      "Message received and logged. This deployment has no mail provider configured, so nothing was emailed — use the direct address for a guaranteed reply.",
  });
}

export async function GET() {
  return NextResponse.json({ ok: true, queued: inbox.length, provider: Boolean(process.env.RESEND_API_KEY) });
}
