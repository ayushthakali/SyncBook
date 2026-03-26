"use client";

import { useGetTasksQuery } from "@/lib/features/api/apiSlice";
import { CheckCircle2, ListTodo } from "lucide-react";
import { useMemo } from "react";

export default function StatsHeader() {
  const { data = { todo: [], inProgress: [], done: [] } } = useGetTasksQuery();

  const stats = useMemo(() => {
    const total = data.todo.length + data.inProgress.length + data.done.length;
    const completed = data.done.length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, progress };
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Tasks Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-lg flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <ListTodo size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
      </div>

      {/* Completion Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-lg flex items-center gap-4">
        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Completed</p>
          <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500 font-medium">Project Progress</p>
          <span className="text-sm font-bold text-blue-600">
            {stats.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mt-4">
          <div
            className="bg-blue-600 h-full transition-all duration-700 ease-out"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
