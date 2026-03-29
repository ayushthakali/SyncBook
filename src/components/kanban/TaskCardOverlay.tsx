import { Task } from "@/lib/features/tasks/taskSlice";
import { priorityStyles } from "./TaskCard";

// Lightweight overlay card — no drag hooks needed
export default function TaskCardOverlay({ task }: { task: Task }) {
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
