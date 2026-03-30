"use client";

import { Task } from "@/lib/features/tasks/taskSlice";
import {
  pointerWithin,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/lib/features/api/apiSlice";
import { useState } from "react";
import Column from "./Column";
import TaskCardOverlay from "./TaskCardOverlay";
import { useAppSelector } from "@/lib/hooks";
import { SkeletonCard } from "./SkeletonCard";

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Mouse must move 5px before dragging starts
      },
    }),
  );

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
      <div className="w-full h-[calc(100vh-280px)] flex gap-5 overflow-x-auto pb-2">
        {[1, 2, 3].map((col) => (
          <div
            key={col}
            className="flex-1 min-w-[300px] bg-white/5 border border-white/5 rounded-2xl p-4"
          >
            <div className="h-6 bg-white/10 rounded w-1/3 mb-6 animate-pulse" />
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ))}
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
      sensors={sensors}
    >
      <div className="w-full h-[calc(100vh-100px)] flex gap-5 overflow-x-auto pb-2">
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
