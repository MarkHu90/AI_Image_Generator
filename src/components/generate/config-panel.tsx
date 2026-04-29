"use client";

import clsx from "clsx";

const ratios = [
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
];

const counts = [1, 2, 4];

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-border overflow-hidden">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          onClick={() => onChange(opt.value)}
          className={clsx(
            "px-3 py-1.5 text-xs font-semibold transition-all duration-200",
            value === opt.value
              ? "text-primary-foreground"
              : "text-text-secondary hover:text-foreground hover:bg-surface-hover"
          )}
          style={value === opt.value ? { background: "var(--chrome-accent)" } : undefined}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function ConfigPanel({
  aspectRatio,
  onAspectRatioChange,
  imageCount,
  onImageCountChange,
}: {
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  imageCount: number;
  onImageCountChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-text-secondary">
          Aspect Ratio
        </span>
        <SegmentedControl
          options={ratios}
          value={aspectRatio}
          onChange={onAspectRatioChange}
        />
      </div>
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-text-secondary">
          Images
        </span>
        <SegmentedControl
          options={counts.map((c) => ({ value: c, label: String(c) }))}
          value={imageCount}
          onChange={onImageCountChange}
        />
      </div>
    </div>
  );
}
