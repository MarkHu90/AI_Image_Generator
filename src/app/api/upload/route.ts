import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/storage";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  const task = await db.task.create({
    data: {
      userId: session.user.id,
      type: "text_to_image",
      mode: "sync",
      provider: "upload",
      input: {},
    },
  });

  const url = await saveUploadedImage(
    session.user.id,
    task.id,
    buffer,
    file.name
  );
  return NextResponse.json({ taskId: task.id, url });
}
