"use client";

import { useEffect, useState } from "react";
import { TaskList } from "@/components/history/task-list";
import { Skeleton } from "@/components/ui/skeleton";

interface Task {
  id: string;
  type: string;
  status: string;
  provider: string;
  createdAt: string;
  output?: { urls?: string[] } | null;
}

export default function HistoryPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks?limit=50")
      .then((r) => r.json())
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-foreground">History</h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : (
        <TaskList tasks={tasks} />
      )}
    </div>
  );
}
