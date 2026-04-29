"use client";

import { useState } from "react";

interface GenerateParams {
  provider: string;
  type: string;
  mode: "sync" | "async";
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  imageCount?: number;
  referenceImage?: string;
  strength?: number;
}

interface GenerationResult {
  taskId: string;
  images: Array<{ url: string }>;
  metadata: {
    provider: string;
    model: string;
    durationMs: number;
    revisedPrompt?: string;
  };
  remainingCredits: number;
}

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate(params: GenerateParams) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return { generate, loading, result, error };
}
