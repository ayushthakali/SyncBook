"use client";

import { useGetTasksQuery } from "@/lib/features/api/apiSlice";
import { CheckCircle2, ListTodo, Zap } from "lucide-react";
import { useMemo } from "react";

export default function StatsHeader() {
  const { data = { todo: [], inProgress: [], done: [] } } = useGetTasksQuery();

  const stats = useMemo(() => {
    const total = data.todo.length + data.inProgress.length + data.done.length;
    const completed = data.done.length;
    const inProgress = data.inProgress.length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, inProgress, progress };
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Tasks */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/8 transition-all">
        <div className="p-3 bg-violet-500/20 text-violet-400 rounded-xl border border-violet-500/20">
          <ListTodo size={20} />
        </div>
        <div>
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">
            Total Tasks
          </p>
          <p className="text-2xl font-black text-white">{stats.total}</p>
        </div>
      </div>

      {/* In Progress */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/8 transition-all">
        <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/20">
          <Zap size={20} />
        </div>
        <div>
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">
            In Progress
          </p>
          <p className="text-2xl font-black text-white">{stats.inProgress}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/8 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
              Completed
            </p>
            <p className="text-lg font-black text-white leading-none">
              {stats.completed}{" "}
              <span className="text-white/30 text-sm font-medium">
                / {stats.total}
              </span>
            </p>
          </div>
          <span className="ml-auto text-sm font-bold text-emerald-400">
            {stats.progress}%
          </span>
        </div>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
