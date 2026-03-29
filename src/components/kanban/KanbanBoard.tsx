"use client";

import { Task } from "@/lib/features/tasks/taskSlice";
import {
  pointerWithin,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/lib/features/api/apiSlice";
import { useState } from "react";
import Column from "./Column";
import TaskCardOverlay from "./TaskCardOverlay";
import { useAppSelector } from "@/lib/hooks";

export interface ColumnProps {
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
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
      accent: "border-blue-500/20",
      dot: "bg-blue-400",
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

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.data.current?.id as string;
    const task = allTasks.find((t) => t.id === id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);

    const { id, status } = event.active.data.current || {};

    if (!id || !status || !event.over) return;

    if (status === event.over.id) return;

    await updateTaskStatus({
      id,
      status: event.over.id as Task["status"],
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

      <DragOverlay>
        {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
