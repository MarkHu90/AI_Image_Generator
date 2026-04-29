"use client";

import clsx from "clsx";

interface ModeToggleProps {
  value: "sync" | "async";
  onChange: (value: "sync" | "async") => void;
}

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Mode
      </span>
      <div className="inline-flex rounded-md border border-border overflow-hidden">
        {(["sync", "async"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={clsx(
              "px-3 py-1.5 text-xs font-medium transition-colors capitalize",
              value === mode
                ? "bg-accent text-foreground"
                : "text-text-secondary hover:text-foreground hover:bg-surface-hover"
            )}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
