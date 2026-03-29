"use client";

import { useEffect, useState } from "react";
import PriorityDropdown, { Priority } from "../PriorityDropdown";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { closeModal } from "@/lib/features/ui/uiSlice";
import { Task, updateTask } from "@/lib/features/tasks/taskSlice";
import { useCreateTaskMutation } from "@/lib/features/api/apiSlice";
import { X } from "lucide-react";

interface Input {
  title: string;
  priority: Priority;
}

function TaskModal() {
  const { modalType, isModalOpen, editingTask } = useAppSelector(
    (state) => state.ui,
  );
  const [input, setInput] = useState<Input>({
    title: editingTask?.title ?? "",
    priority: editingTask?.priority ?? "low",
  });
  const [createTask] = useCreateTaskMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalType || !input.title.trim()) return;
    try {
      if (editingTask) {
        await updateTask
      } else {
        await createTask({
          title: input.title,
          description: "",
          status: modalType as Task["status"],
          priority: input.priority,
        }).unwrap();
      }
      setInput({ title: "", priority: "medium" });
      dispatch(closeModal());
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  };

  return (
    <div
      onClick={() => dispatch(closeModal())}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f0f13] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl shadow-black/50 p-6 animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">New Task</h2>
            <p className="text-white/30 text-xs mt-0.5">
              Add a task to your board
            </p>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-1.5 text-white/30 hover:text-white/70 hover:bg-white/5 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Task Title
            </label>
            <input
              autoFocus
              type="text"
              className="w-full p-3 bg-white/5 border border-white/10 text-white/80 placeholder:text-white/20 text-sm rounded-xl focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/40 outline-none transition-all"
              placeholder="What needs to be done?"
              value={input.title}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <PriorityDropdown
            value={input.priority}
            onChange={(value) =>
              setInput((prev) => ({ ...prev, priority: value }))
            }
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className="flex-1 py-2.5 text-sm bg-white/5 border border-white/10 text-white/50 font-medium hover:bg-white/10 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all active:scale-95"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
