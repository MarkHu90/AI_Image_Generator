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
      <Textarea
        placeholder="Describe the image you want to generate..."
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      {onNegativePromptChange && (
        <Input
          placeholder="Negative prompt (optional)"
          value={negativePrompt ?? ""}
          onChange={(e) => onNegativePromptChange(e.target.value)}
        />
      )}
    </div>
  );
}
