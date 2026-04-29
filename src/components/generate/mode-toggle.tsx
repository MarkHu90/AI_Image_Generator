"use client";

import clsx from "clsx";

interface ModeToggleProps {
  value: "sync" | "async";
  onChange: (value: "sync" | "async") => void;
}

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-semibold text-text-secondary">
        Mode
      </span>
      <div className="inline-flex rounded-lg border border-border overflow-hidden">
        {(["sync", "async"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={clsx(
              "px-3 py-1.5 text-xs font-semibold transition-all duration-200 capitalize",
              value === mode
                ? "text-primary-foreground"
                : "text-text-secondary hover:text-foreground hover:bg-surface-hover"
            )}
            style={value === mode ? { background: "var(--chrome-accent)" } : undefined}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
