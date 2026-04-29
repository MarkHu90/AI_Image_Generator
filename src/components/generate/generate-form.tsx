"use client";

import { useState } from "react";
import { PromptInput } from "./prompt-input";
import { ModelSelector } from "./model-selector";
import { ConfigPanel } from "./config-panel";
import { ModeToggle } from "./mode-toggle";
import { useGenerate } from "@/lib/hooks/use-generate";
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
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    <div className="flex gap-8">
      <div className="w-[380px] shrink-0 space-y-4">
        <div className="glass-strong rounded-xl p-4 space-y-4">
          <PromptInput
            prompt={prompt}
            onPromptChange={setPrompt}
            negativePrompt={negativePrompt}
            onNegativePromptChange={setNegativePrompt}
          />
        </div>

        <div className="glass rounded-xl p-4 space-y-4">
          <ModelSelector value={provider} onChange={setProvider} />
          <ConfigPanel
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            imageCount={imageCount}
            onImageCountChange={setImageCount}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-text-secondary hover:text-foreground transition-colors font-medium"
        >
          {showAdvanced ? "Hide" : "Show"} advanced options
        </button>

        {showAdvanced && (
          <div className="glass rounded-xl p-4">
            <ModeToggle value={mode} onChange={setMode} />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !prompt}
          className="w-full h-10 rounded-xl text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "var(--chrome-accent)" }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      <div className="flex-1">
        <GenerationPreview result={result} loading={loading} />
      </div>
    </div>
  );
}
