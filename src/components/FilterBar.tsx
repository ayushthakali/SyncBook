"use client";

import { setFilterPriority, setSearchTerm } from "@/lib/features/ui/uiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Search } from "lucide-react";

const priorityConfig = {
  all: {
    label: "All",
    active: "bg-white/20 text-white border-white/25",
    inactive:
      "text-white/60 border-white/20 hover:border-white/25 hover:text-white/60 bg-white/10",
  },
  low: {
    label: "Low",
    active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    inactive: "text-white/60 border-white/20 hover:text-emerald-400/70 bg-white/10",
  },
  medium: {
    label: "Medium",
    active: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    inactive: "text-white/60 border-white/20 hover:text-amber-400/70 bg-white/10",
  },
  high: {
    label: "High",
    active: "bg-red-500/20 text-red-400 border-red-500/30",
    inactive: "text-white/60 border-white/20 hover:text-red-400/70 bg-white/10",
  },
};

function FilterBar() {
  const { searchTerm, filterPriority } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
      {/* Search */}
      <div className="relative w-full lg:w-80">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/75"
          size={16}
        />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/20 border border-white/10 placeholder:text-white/75 text-white/80 text-sm rounded-xl focus:ring-1 focus:ring-violet-500/70 focus:border-violet-500/70 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        />
      </div>

      {/* Priority Filters */}
      <div className="flex items-center gap-2">
        {(
          Object.keys(priorityConfig) as Array<keyof typeof priorityConfig>
        ).map((p) => {
          const cfg = priorityConfig[p];
          const isActive = filterPriority === p;
          return (
            <button
              key={p}
              onClick={() => dispatch(setFilterPriority(p))}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize border transition-all ${isActive ? cfg.active : cfg.inactive}`}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterBar;
