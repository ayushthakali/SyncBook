"use client";

import KanbanBoard from "@/components/KanbanBoard";
import CreateTaskModal from "@/components/CreateTaskModal";
import FilterBar from "@/components/FilterBar";
import StatsHeader from "@/components/StatsHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-300 to-purple-300">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex flex-col gap-1 mb-8 bg-white/30 p-5 rounded-xl">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tighter">
            SYNC <span className="text-blue-700">Board</span>
          </h1>
          <p className="text-gray-800 text-sm">
            Manage your project tasks and track progress in real-time.
          </p>
        </div>
        <StatsHeader />
        <FilterBar />

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <KanbanBoard />
        </div>
      </div>

      <CreateTaskModal />
    </main>
  );
}
