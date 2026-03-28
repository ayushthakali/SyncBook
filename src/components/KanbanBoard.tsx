"use client";

import { Task } from "@/lib/features/tasks/taskSlice";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  pointerWithin,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { openTaskModal } from "@/lib/features/ui/uiSlice";
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/lib/features/api/apiSlice";
import { PackageOpen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ColumnProps {
  id: string;
  title: string;
  accent: string;
  dot: string;
  tasks: Task[];
}

export default function KanbanBoard() {
  const {
    data = { todo: [], inProgress: [], done: [] },
    isLoading,
    isError,
  } = useGetTasksQuery();
  const { searchTerm, filterPriority } = useAppSelector((state) => state.ui);
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [activeTask, setActiveTask] = useState<Task | null>(null); // 👈 track dragging task

  const filteredFn = (task: Task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  };

  const filteredTasks = {
    todo: data.todo.filter(filteredFn),
    inProgress: data.inProgress.filter(filteredFn),
    done: data.done.filter(filteredFn),
  };

  const allTasks = [...data.todo, ...data.inProgress, ...data.done];

  const columnData: ColumnProps[] = [
    {
      id: "todo",
      title: "To Do",
      accent: "border-white/10",
      dot: "bg-white/40",
      tasks: filteredTasks.todo,
    },
    {
      id: "in-progress",
      title: "In Progress",
      accent: "border-amber-500/20",
      dot: "bg-amber-400",
      tasks: filteredTasks.inProgress,
    },
    {
      id: "done",
      title: "Done",
      accent: "border-emerald-500/20",
      dot: "bg-emerald-400",
      tasks: filteredTasks.done,
    },
  ];

  const handleDragStart = (e: DragStartEvent) => {
    const task = allTasks.find((t) => t.id === e.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = e;
    if (!active.data.current || !over) return;
    if (active.data.current.status === over.id) return;
    await updateTaskStatus({
      id: active.id as string,
      status: over.id as Task["status"],
    });
  };

  if (isLoading)
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 text-center text-white/60">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-3" />
        Syncing with database...
      </div>
    );

  if (isError)
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-10 text-center text-red-400">
        Failed to load tasks. Please check your connection.
      </div>
    );

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-[calc(100vh-280px)] flex gap-5 overflow-x-auto pb-2">
        {columnData.map((col) => (
          <Column key={col.id} {...col} />
        ))}
      </div>

      {/* 👇 Renders dragged card in a portal above ALL columns */}
      <DragOverlay>
        {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

// Lightweight overlay card — no drag hooks needed
function TaskCardOverlay({ task }: { task: Task }) {
  const pStyle =
    priorityStyles[task.priority as keyof typeof priorityStyles] ??
    priorityStyles.low;
  return (
    <div className="bg-white/10 border border-violet-500/50 shadow-2xl shadow-violet-500/20 p-3.5 rounded-xl scale-105 cursor-grabbing">
      <h3 className="text-white text-sm font-medium leading-snug mb-2.5 truncate">
        {task.title}
      </h3>
      <div
        className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg border font-semibold uppercase tracking-wider ${pStyle.badge}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`} />
        {task.priority}
      </div>
    </div>
  );
}

function Column({ id, title, accent, dot, tasks }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const dispatch = useAppDispatch();
  const { searchTerm } = useAppSelector((state) => state.ui);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col flex-1 min-w-[300px] bg-white/5 backdrop-blur-md border ${accent} rounded-2xl transition-all ${isOver ? "bg-white/10 border-violet-500/40" : ""}`}
    >
      <div className="flex justify-between items-center p-4 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <h2 className="text-white/90 font-bold text-sm tracking-wide">
            {title}
          </h2>
          <span className="text-xs text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => dispatch(openTaskModal(id as Task["status"]))}
          className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 rounded-lg text-white/40 hover:text-violet-400 transition-all"
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

const priorityStyles = {
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

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { status: task.status },
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
      className={
        `group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 p-3.5 rounded-xl transition-all
        ${isDragging ? "opacity-30" : ""}` // 👈 just fade original, overlay shows the "live" card
      }
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
          className="opacity-0 group-hover:opacity-100 p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
