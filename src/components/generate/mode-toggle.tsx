"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface ModeToggleProps {
  value: "sync" | "async";
  onChange: (value: "sync" | "async") => void;
}

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant={value === "sync" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("sync")}
        className="flex-1"
      >
        Sync
      </Button>
      <Button
        variant={value === "async" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("async")}
        className="flex-1"
      >
        Async
      </Button>
    </div>
  );
}
