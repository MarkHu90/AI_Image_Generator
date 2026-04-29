"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";

const ratios = [
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
];

const counts = [1, 2, 4];

interface ConfigPanelProps {
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  imageCount: number;
  onImageCountChange: (value: number) => void;
}

export function ConfigPanel({
  aspectRatio,
  onAspectRatioChange,
  imageCount,
  onImageCountChange,
}: ConfigPanelProps) {
  return (
    <div className="space-y-3">
      <div>
        <span className="text-sm text-text-secondary mb-1 block">
          Aspect Ratio
        </span>
        <div className="flex gap-1">
          {ratios.map((r) => (
            <Button
              key={r.value}
              variant={aspectRatio === r.value ? "default" : "outline"}
              size="sm"
              onClick={() => onAspectRatioChange(r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <span className="text-sm text-text-secondary mb-1 block">
          Image Count
        </span>
        <div className="flex gap-1">
          {counts.map((c) => (
            <Button
              key={c}
              variant={imageCount === c ? "default" : "outline"}
              size="sm"
              onClick={() => onImageCountChange(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
