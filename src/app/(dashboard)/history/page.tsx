"use client";

import { useEffect, useState } from "react";
import { TaskList } from "@/components/history/task-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetch("/api/tasks?limit=20")
      .then((r) => r.json())
      .then((data) => {
        setTasks(data);
        setHasMore(data.length === 20);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">History</h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <TaskList tasks={tasks} />
          {hasMore && (
            <div className="text-center">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
