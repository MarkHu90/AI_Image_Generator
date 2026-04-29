import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const task = await db.task.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!task)
    return NextResponse.json({ error: "Task not found" }, { status: 404 });

  return NextResponse.json(task);
}
