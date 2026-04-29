"use client";

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
      <div className="text-center py-16 text-text-secondary">
        <p className="text-lg mb-1">No generations yet</p>
        <p className="text-sm">Your generated images will appear here.</p>
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
