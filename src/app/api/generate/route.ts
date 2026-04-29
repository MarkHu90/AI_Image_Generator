import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getProvider } from "@/lib/providers/registry";
import { checkCredits, deductCredits } from "@/lib/credits";
import { saveGeneratedImages } from "@/lib/storage";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { provider: providerId, type, prompt, ...params } = body;

  const hasCredits = await checkCredits(session.user.id, providerId);
  if (!hasCredits) {
    return NextResponse.json(
      { error: "Insufficient credits" },
      { status: 402 }
    );
  }

  try {
    const envKey = `${providerId.toUpperCase()}_API_KEY`;
    const apiKey = process.env[envKey] ?? "";

    const provider = getProvider(providerId, apiKey);
    const result = await provider.generate({ prompt, ...params });

    const task = await db.task.create({
      data: {
        userId: session.user.id,
        type: type ?? "text_to_image",
        mode: "sync",
        status: "completed",
        provider: providerId,
        input: body,
        output: { urls: [] },
      },
    });

    const urls = await saveGeneratedImages(
      session.user.id,
      task.id,
      result.images
    );

    await db.task.update({
      where: { id: task.id },
      data: {
        output: { urls, metadata: result.metadata },
        completedAt: new Date(),
      },
    });

    const remainingCredits = await deductCredits(session.user.id, providerId);

    return NextResponse.json({
      taskId: task.id,
      images: urls.map((url) => ({ url })),
      metadata: result.metadata,
      remainingCredits,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
