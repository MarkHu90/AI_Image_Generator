"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TaskType } from "@/lib/providers/types";

const tabs: Array<{ value: TaskType; label: string }> = [
  { value: "text_to_image", label: "Text to Image" },
  { value: "image_to_image", label: "Image to Image" },
  { value: "edit", label: "Edit" },
  { value: "remove_bg", label: "Remove BG" },
];

interface FeatureTabsProps {
  value: TaskType;
  onChange: (value: TaskType) => void;
}

export function FeatureTabs({ value, onChange }: FeatureTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as TaskType)}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
