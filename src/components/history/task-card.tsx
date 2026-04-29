"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface TaskCardProps {
  task: {
    id: string;
    type: string;
    status: string;
    provider: string;
    createdAt: string;
    output?: { urls?: string[] } | null;
  };
}

const typeLabels: Record<string, string> = {
  text_to_image: "Text to Image",
  image_to_image: "Image to Image",
  edit: "Edit",
  remove_bg: "Remove BG",
};

export function TaskCard({ task }: TaskCardProps) {
  const thumbnail = task.output?.urls?.[0];

  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-square bg-bg-tertiary flex items-center justify-center">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-text-secondary text-sm">
            {task.status === "processing" ? "Processing..." : "No preview"}
          </span>
        )}
      </div>
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-1 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {typeLabels[task.type] ?? task.type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {task.provider}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          <Badge
            variant={
              task.status === "completed"
                ? "default"
                : task.status === "failed"
                  ? "destructive"
                  : "secondary"
            }
            className="text-xs"
          >
            {task.status}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
