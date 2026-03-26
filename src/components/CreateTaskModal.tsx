"use client";

import { useState } from "react";
import PriorityDropdown, { Priority } from "./PriorityDropdown";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { closeTaskModal } from "@/lib/features/ui/uiSlice";
import { Task } from "@/lib/features/tasks/taskSlice";
import { useCreateTaskMutation } from "@/lib/features/api/apiSlice";

interface Input {
  title: string;
  priority: Priority;
}

function CreateTaskModal() {
  const [input, setInput] = useState<Input>({
    title: "",
    priority: "medium",
  });

  const [createTask] = useCreateTaskMutation();
  const dispatch = useAppDispatch();
  const { activeColumn, isTaskModalOpen } = useAppSelector((state) => state.ui);

  if (!isTaskModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeColumn || !input.title.trim()) return;

    try {
      await createTask({
        title: input.title,
        description: "",
        status: activeColumn as Task["status"],
        priority: input.priority,
      }).unwrap(); //-> converts a dispatched async action into a standard Promise with direct success/error handling.

      setInput({ title: "", priority: "medium" });
      dispatch(closeTaskModal());
    } catch (err) {
      console.error("Failed to save the task: ", err);
    }
  };

  return (
    <div
      onClick={() => dispatch(closeTaskModal())}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Create New Task
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              autoFocus
              type="text"
              className="w-full p-3 border border-gray-200 text-gray-700 hover:border-gray-300 placeholder:text-gray-400 text-sm font-medium placeholder:text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Your task title..."
              value={input.title}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <PriorityDropdown
            value={input.priority}
            onChange={(value) =>
              setInput((prev) => ({
                ...prev,
                priority: value,
              }))
            }
          />

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => dispatch(closeTaskModal())}
              className="flex-1 py-2.5 text-sm bg-gray-100 border border-gray-200 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors cursor-pointer shadow-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 cursor-pointer"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;
