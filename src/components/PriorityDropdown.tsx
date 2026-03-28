"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export type Priority = "low" | "medium" | "high";

interface PriorityOption {
  value: Priority;
  label: string;
  color: string;
  dot: string;
  border: string;
  activeBg: string;
}

interface PriorityDropdownType {
  value: Priority;
  onChange: (v: Priority) => void;
}

const options: PriorityOption[] = [
  {
    value: "low",
    label: "Low Priority",
    color: "text-emerald-400",
    dot: "bg-emerald-400",
    border: "border-emerald-500/40",
    activeBg: "bg-emerald-500/10",
  },
  {
    value: "medium",
    label: "Medium Priority",
    color: "text-amber-400",
    dot: "bg-amber-400",
    border: "border-amber-500/40",
    activeBg: "bg-amber-500/10",
  },
  {
    value: "high",
    label: "High Priority",
    color: "text-red-400",
    dot: "bg-red-400",
    border: "border-red-500/40",
    activeBg: "bg-red-500/10",
  },
];

export default function PriorityDropdown({
  value,
  onChange,
}: PriorityDropdownType) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value) || options[1];

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
        Priority
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all bg-white/5 ${
          isOpen
            ? `${selected.border} ring-1 ring-inset ${selected.activeBg}`
            : "border-white/10 hover:border-white/20"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${selected.dot} shadow-sm`} />
          <span className={`font-medium text-sm ${selected.color}`}>
            {selected.label}
          </span>
        </div>
        <ChevronDown
          size={15}
          className={`text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[110] w-full mt-2 bg-[#0f0f13] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                value === opt.value
                  ? `${opt.activeBg} ${opt.color}`
                  : "text-white/40 hover:bg-white/5 hover:text-white/70"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${opt.dot} ${value === opt.value ? "opacity-100" : "opacity-40"}`}
              />
              <span className="text-sm font-medium">{opt.label}</span>
              {value === opt.value && (
                <span className="ml-auto text-xs opacity-60">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
