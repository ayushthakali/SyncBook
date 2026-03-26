"use client";

import { Task } from "@/lib/features/tasks/taskSlice";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { pointerWithin, DndContext, DragEndEvent } from "@dnd-kit/core";
import { openTaskModal } from "@/lib/features/ui/uiSlice";
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/lib/features/api/apiSlice";
import { Trash2 } from "lucide-react";

interface ColumnProps {
  id: string;
  color: string;
  title: string;
  shadow: string;
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

  const columnData: ColumnProps[] = [
    {
      id: "todo",
      title: "To Do",
      tasks: filteredTasks.todo,
      color: "bg-gray-100",
      shadow: "shadow-gray-300",
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: filteredTasks.inProgress,
      color: "bg-blue-50",
      shadow: "shadow-blue-200",
    },
    {
      id: "done",
      title: "Done",
      tasks: filteredTasks.done,
      color: "bg-green-50",
      shadow: "shadow-green-200",
    },
  ];

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!active.data.current || !over) return;
    if (active.data.current.status === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task["status"];

    await updateTaskStatus({ id: taskId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-blue-800 font-bold">
        Syncing with Database...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-red-500 text-center">
        Failed to load tasks. Check your connection.
      </div>
    );
  }

  return (
    <DndContext collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
      <div className="w-full h-[calc(100vh-100px)] flex p-6 gap-6 overflow-x-auto">
        {columnData.map((col) => (
          <Column key={col.id} {...col} />
        ))}
      </div>
    </DndContext>
  );
}

function Column({ id, color, title, tasks, shadow }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });
  const dispatch = useAppDispatch();
  return (
    <div
      ref={setNodeRef} // This tells dnd-kit this is a drop zone
      className={`flex-1 min-w-[300px] rounded-xl p-4 shadow-sm ${color} ${shadow}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-black text-xl font-bold">{title}</h2>
        <button
          onClick={() => dispatch(openTaskModal(id as Task["status"]))}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-400 hover:text-blue-600 hover:shadow-md transition-all font-bold"
        >
          +
        </button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
            No tasks yet...
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        status: task.status,
      },
    });
  const [deleteTask] = useDeleteTaskMutation();

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : 1, //z-index so the dragging card stays on top
    touchAction: "none", //Prevent touch interference (Essential for performance)
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group border border-gray-200 bg-white p-4 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-all 
        ${isDragging ? "opacity-80 border-blue-500 scale-105 shadow-xl" : "hover:border-blue-400 hover:shadow-md"}
      `}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-800 group-hover:text-blue-600 transition-colors">
            {task.title}
          </h3>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider  ${
              task.priority === "high"
                ? "bg-red-100 text-red-600 group-hover:bg-red-200 group-hover:text-red-600 transition-colors"
                : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-600 transition-colors"
            }`}
          >
            {task.priority}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag from starting as bubble ups to parent
            deleteTask(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 text-red-500 transition-opacity"
        >
          <Trash2 className="flex-shrink-0 size-5" />
        </button>
      </div>
    </div>
  );
}
