"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProviderInfo {
  id: string;
  name: string;
  creditCost: number;
}

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);

  useEffect(() => {
    fetch("/api/providers")
      .then((r) => r.json())
      .then(setProviders)
      .catch(console.error);
  }, []);

  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger>
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {providers.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name} — {p.creditCost} credits
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
