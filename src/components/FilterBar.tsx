"use client";

import { setFilterPriority, setSearchTerm } from "@/lib/features/ui/uiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Filter, Search } from "lucide-react";

function FilterBar() {
  const { searchTerm, filterPriority } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const priorities: ("all" | "low" | "medium" | "high")[] = [
    "all",
    "low",
    "medium",
    "high",
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      {/* Search Input */}
      <div className="relative w-full lg:w-96">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 placeholder:text-gray-400 placeholder:text-sm text-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        />
      </div>

      {/* Priority Filters */}
      <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 md:pb-0">
        <Filter size={16} className="text-gray-400 mr-1 shrink-0" />
        {priorities.map((p) => (
          <button
            key={p}
            onClick={() => dispatch(setFilterPriority(p))}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap ${
              filterPriority === p
                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
