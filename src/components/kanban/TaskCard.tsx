"use client";

import { Task } from "@/lib/features/tasks/taskSlice";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { Trash2, GripVertical, AlignLeft } from "lucide-react";
import { useDeleteTaskMutation } from "@/lib/features/api/apiSlice";
import { useAppDispatch } from "@/lib/hooks";
import { openEditModal } from "@/lib/features/ui/uiSlice";

export const priorityStyles = {
  high: {
    badge: "bg-red-500/15 text-red-400 border-red-500/20",
    dot: "bg-red-400",
    glow: "shadow-red-500/10",
  },
  medium: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
    glow: "shadow-amber-500/10",
  },
  low: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/10",
  },
};

export default function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { id: task.id, status: task.status },
    });

  const dispatch = useAppDispatch();
  const [deleteTask] = useDeleteTaskMutation();

  const pStyle =
    priorityStyles[task.priority as keyof typeof priorityStyles] ??
    priorityStyles.low;

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if ((e.target as HTMLElement).closest("[data-drag-handle]")) return;
    dispatch(openEditModal(task));
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        touchAction: "none",
      }}
      className={`group relative bg-white/[0.06] hover:bg-white/[0.09] border border-white/10
        hover:border-white/20 rounded-2xl transition-all duration-200 shadow-lg ${pStyle.glow}
        ${isDragging ? "opacity-0" : ""}`}
    >
      {/* Drag handle strip on the left */}
      <div
        data-drag-handle
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center
          cursor-grab active:cursor-grabbing rounded-l-2xl opacity-0 group-hover:opacity-100
          hover:bg-white/5 transition-all z-10"
      >
        <GripVertical size={15} className="text-white/30" />
      </div>

      {/* Card content — offset to make room for drag handle on hover */}
      <div
        onClick={handleCardClick}
        className="p-3.5 pl-4 cursor-pointer group-hover:pl-10 transition-all duration-200"
      >
        {/* Top row: title + delete */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-white/80 group-hover:text-white text-sm font-medium
            leading-snug transition-colors flex-1 min-w-0 truncate"
          >
            {task.title}
          </h3>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-white/30
              hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all
              flex-shrink-0 -mt-0.5 -mr-0.5"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Description — only shown if it exists */}
        {task.description && (
          <p className="mt-1.5 mb-2.5 text-white/70 text-xs leading-relaxed line-clamp-2 flex gap-1.5 items-center">
            <AlignLeft
              size={11}
              className="text-white/70 mt-0.5 flex-shrink-0"
            />
            <span>{task.description}</span>
          </p>
        )}

        {/* Bottom row: priority badge */}
        <div
          className={`mt-2.5 inline-flex items-center gap-1.5 text-[10px]
          px-2 py-1 rounded-lg border font-semibold uppercase tracking-wider
          ${pStyle.badge} ${!task.description ? "mt-2.5" : ""}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`} />
          {task.priority}
        </div>
      </div>
    </div>
  );
}
