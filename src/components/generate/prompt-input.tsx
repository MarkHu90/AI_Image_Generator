"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  negativePrompt?: string;
  onNegativePromptChange?: (value: string) => void;
}

export function PromptInput({
  prompt,
  onPromptChange,
  negativePrompt,
  onNegativePromptChange,
}: PromptInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-text-secondary">
        Prompt
      </label>
      <Textarea
        placeholder="Describe the image you want to generate..."
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      <span className="text-xs text-text-tertiary">
        {prompt.length} characters
      </span>
      {onNegativePromptChange && (
        <Input
          placeholder="What to avoid (optional)"
          value={negativePrompt ?? ""}
          onChange={(e) => onNegativePromptChange(e.target.value)}
        />
      )}
    </div>
  );
}
