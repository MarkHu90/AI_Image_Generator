import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkCredits } from "@/lib/credits";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { provider, type, prompt } = body;

  const hasCredits = await checkCredits(session.user.id, provider);
  if (!hasCredits)
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

  const task = await db.task.create({
    data: {
      userId: session.user.id,
      type: type ?? "text_to_image",
      mode: "async",
      status: "pending",
      provider,
      input: body,
    },
  });

  if (typeof globalThis !== "undefined") {
    fetch(`${req.nextUrl.origin}/api/generate/async/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: task.id }),
    }).catch(console.error);
  }

  return NextResponse.json({ taskId: task.id, status: "pending" });
}
