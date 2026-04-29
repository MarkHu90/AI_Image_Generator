"use client";

import { useState } from "react";
import { PromptInput } from "./prompt-input";
import { ModelSelector } from "./model-selector";
import { ConfigPanel } from "./config-panel";
import { ModeToggle } from "./mode-toggle";
import { useGenerate } from "@/lib/hooks/use-generate";
import { Button } from "@/components/ui/button";
import { GenerationPreview } from "./generation-preview";

interface GenerateFormProps {
  type: "text_to_image" | "image_to_image" | "edit" | "remove_bg";
}

export function GenerateForm({ type }: GenerateFormProps) {
  const [provider, setProvider] = useState("gemini");
  const [mode, setMode] = useState<"sync" | "async">("sync");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageCount, setImageCount] = useState(1);

  const { generate, loading, result, error } = useGenerate();

  async function handleSubmit() {
    await generate({
      provider,
      type,
      mode,
      prompt,
      negativePrompt,
      aspectRatio,
      imageCount,
    });
  }

  return (
    <div className="flex gap-6">
      <div className="w-[480px] space-y-4">
        <PromptInput
          prompt={prompt}
          onPromptChange={setPrompt}
          negativePrompt={negativePrompt}
          onNegativePromptChange={setNegativePrompt}
        />
        <ModelSelector value={provider} onChange={setProvider} />
        <ConfigPanel
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          imageCount={imageCount}
          onImageCountChange={setImageCount}
        />
        <ModeToggle value={mode} onChange={setMode} />
        <Button
          onClick={handleSubmit}
          disabled={loading || !prompt}
          className="w-full"
        >
          {loading ? "Generating..." : "Generate"}
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="flex-1">
        <GenerationPreview result={result} loading={loading} />
      </div>
    </div>
  );
}
