"use client";

// import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// import { addTask, selectAllTasks } from "@/lib/features/tasks/taskSlice";
import KanbanBoard from "@/components/KanbanBoard";
import CreateTaskModal from "@/components/CreateTaskModal";

export default function Home() {
  // const dispatch = useAppDispatch();
  // const tasks = useAppSelector(selectAllTasks);

  // const handleAddTask = () => {
  //   dispatch(
  //     addTask({
  //       id: uuidv4(),
  //       title: `New Task ${tasks.length + 1}`,
  //       description: "Built with Redux Toolkit",
  //       status: "todo",
  //       priority: "high",
  //       createdAt: new Date().toISOString(),
  //     }),
  //   );
  // };

  return (
    <div className="min-h-screen bg-slate-50 ">
      <header className="bg-white border-b p-4 flex justify-between items-center px-8">
        <h1 className="text-3xl font-bold tracking-wider text-slate-800">
          SYNC
        </h1>
        <button
          // onClick={handleAddTask}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + New Task
        </button>
      </header>

      <main>
        <KanbanBoard />
        <CreateTaskModal />
      </main>
    </div>
  );
}
