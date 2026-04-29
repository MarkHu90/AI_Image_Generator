"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface GenerationPreviewProps {
  result: {
    images: Array<{ url: string }>;
    metadata: {
      provider: string;
      model: string;
      durationMs: number;
      revisedPrompt?: string;
    };
    remainingCredits: number;
  } | null;
  loading: boolean;
}

export function GenerationPreview({ result, loading }: GenerationPreviewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full aspect-square rounded-lg" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] border border-dashed border-border-primary rounded-lg text-text-secondary">
        Generated images will appear here
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        {result.images.map((img, i) => (
          <div key={i} className="relative group rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={`Generated ${i + 1}`}
              className="w-full rounded-lg"
            />
            <a
              href={img.url}
              download
              className="absolute top-2 right-2 px-3 py-1 bg-bg-tertiary/80 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Download
            </a>
          </div>
        ))}
      </div>
      <div className="text-sm text-text-secondary space-y-1">
        <p>
          Model: {result.metadata.model} —{" "}
          {(result.metadata.durationMs / 1000).toFixed(1)}s
        </p>
        {result.metadata.revisedPrompt && (
          <p>Revised prompt: {result.metadata.revisedPrompt}</p>
        )}
        <p>Remaining credits: {result.remainingCredits}</p>
      </div>
    </div>
  );
}
