"use client";

import { useDroppable } from "@dnd-kit/core";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ColumnProps } from "./KanbanBoard";
import { openTaskModal } from "@/lib/features/ui/uiSlice";
import { Task } from "@/lib/features/tasks/taskSlice";
import { Plus, PackageOpen } from "lucide-react";
import TaskCard from "./TaskCard";

export default function Column({ id, title, accent, dot, tasks }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const dispatch = useAppDispatch();
  const { searchTerm } = useAppSelector((state) => state.ui);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col flex-1 min-w-[300px] bg-white/10 backdrop-blur-md border ${accent} rounded-2xl transition-all  ${isOver ? "bg-white/10 border-violet-500/40" : ""}`}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.2) transparent",
      }}
    >
      <div className="flex justify-between items-center p-4 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <h2 className="text-white/90 font-semibold text-sm tracking-wide">
            {title}
          </h2>
          <span className="text-xs text-white/40 bg-white/10 border border-white/20 px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => dispatch(openTaskModal(id as Task["status"]))}
          className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-violet-500/20 border border-white/20 hover:border-violet-500/30 rounded-lg text-white/70 hover:text-violet-400 transition-all"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-white/10 rounded-xl mt-1">
            <div className="text-white/15 mb-2">
              <PackageOpen size={32} />
            </div>
            <p className="text-white/25 text-xs font-medium text-center">
              {searchTerm ? "No matching tasks" : "Drop tasks here"}
            </p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
