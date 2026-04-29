"use client";

import Link from "next/link";
import { TaskCard } from "./task-card";

interface Task {
  id: string;
  type: string;
  status: string;
  provider: string;
  createdAt: string;
  output?: { urls?: string[] } | null;
}

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 text-text-secondary">
        <p className="font-display text-lg mb-2">No generations yet</p>
        <p className="text-xs text-text-tertiary mb-4">
          Your generated images will appear here.
        </p>
        <Link
          href="/generate"
          className="text-xs font-semibold text-primary hover:underline"
        >
          Create your first image
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
