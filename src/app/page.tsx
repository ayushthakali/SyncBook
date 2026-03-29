"use client";

import KanbanBoard from "@/components/kanban/KanbanBoard";
import TaskModal from "@/components/kanban/TaskModal";
import FilterBar from "@/components/FilterBar";
import StatsHeader from "@/components/StatsHeader";
import { useAppSelector } from "@/lib/hooks";
import LoginPage from "@/components/LoginPage";
import UserNav from "@/components/UserNav";

export default function Home() {
  const { user, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-[url('/bg5.jpg')] bg-cover bg-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 text-sm font-medium tracking-wide">
            Loading workspace...
          </p>
        </div>
      </div>
    );

  if (!user) return <LoginPage />;

  return (
    <main className="min-h-screen bg-[url('/bg5.jpg')] bg-cover bg-fixed bg-no-repeat bg-center relative">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-white tracking-tight">
                SyncBook <span className="text-violet-400">Board</span>
              </h1>
            </div>
            <p className="text-white/40 text-sm">
              Welcome back to your workspace
            </p>
          </div>
          <UserNav />
        </header>

        <StatsHeader />
        <FilterBar />

        <div className="overflow-hidden">
          <KanbanBoard />
        </div>
      </div>

      <TaskModal />
    </main>
  );
}
