"use client";

import { useState } from "react";
import { FeatureTabs } from "@/components/generate/feature-tabs";
import { GenerateForm } from "@/components/generate/generate-form";
import type { TaskType } from "@/lib/providers/types";

export default function GeneratePage() {
  const [activeType, setActiveType] = useState<TaskType>("text_to_image");

  return (
    <div className="space-y-4">
      <FeatureTabs value={activeType} onChange={setActiveType} />
      <GenerateForm type={activeType} />
    </div>
  );
}
