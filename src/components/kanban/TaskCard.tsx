"use client";

import { Task } from "@/lib/features/tasks/taskSlice";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";
import { useDeleteTaskMutation } from "@/lib/features/api/apiSlice";

export const priorityStyles = {
  high: {
    badge: "bg-red-500/15 text-red-400 border-red-500/20",
    dot: "bg-red-400",
  },
  medium: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  low: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
};

export default function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { id: task.id, status: task.status },
    });
  const [deleteTask] = useDeleteTaskMutation();

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none",
  };

  const pStyle =
    priorityStyles[task.priority as keyof typeof priorityStyles] ??
    priorityStyles.low;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 p-3.5 rounded-xl transition-all
        ${isDragging ? "opacity-0" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-start justify-between gap-2 cursor-grab active:cursor-grabbing"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-white/80 group-hover:text-white text-sm font-medium leading-snug mb-2.5 transition-colors truncate">
            {task.title}
          </h3>
          <div
            className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg border font-semibold uppercase tracking-wider ${pStyle.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`} />
            {task.priority}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
