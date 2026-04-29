import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const tasks = await db.task.findMany({
    where: { userId: session.user.id, ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(tasks);
}
