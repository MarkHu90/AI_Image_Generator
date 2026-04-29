"use client";

import { Badge } from "@/components/ui/badge";

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
    <div className="group rounded-xl overflow-hidden glass transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30">
      <div className="aspect-square bg-surface flex items-center justify-center">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-text-secondary text-xs font-medium">
            {task.status === "processing" ? "Processing..." : "No preview"}
          </span>
        )}
      </div>
      <div className="p-2.5 space-y-1.5">
        <Badge variant="secondary" className="text-[10px]">
          {typeLabels[task.type] ?? task.type}
        </Badge>
        <div className="flex items-center justify-between text-[11px] text-text-secondary">
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          <span className={task.status === "failed" ? "text-red-400" : task.status === "completed" ? "text-primary font-semibold" : ""}>
            {task.status}
          </span>
        </div>
      </div>
    </div>
  );
}
