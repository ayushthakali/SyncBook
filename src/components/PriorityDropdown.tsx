"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Flag } from "lucide-react"; // npm install lucide-react

export type Priority = "low" | "medium" | "high";

interface PriorityOption {
  value: Priority;
  label: string;
  color: string;
  bg: string;
}

interface PriorityDropdownType {
  value: Priority;
  onChange: (v: Priority) => void;
}

const options: PriorityOption[] = [
  {
    value: "low",
    label: "Low Priority",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    value: "medium",
    label: "Medium Priority",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    value: "high",
    label: "High Priority",
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

export default function PriorityDropdown({
  value,
  onChange,
}: PriorityDropdownType) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && //containerRef.current = <div>
        !containerRef.current.contains(event.target as Node) //event.target -> actual element clicked eg. button
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
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Priority
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-50"
            : "border-gray-200 hover:border-gray-300"
        } bg-white`}
      >
        <div className="flex items-center gap-2">
          <Flag size={16} className={selected.color} fill="currentColor" />
          <span className="font-medium text-gray-700 text-sm">
            {selected.label}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Animated Menu */}
      {isOpen && (
        <div className="absolute z-[110] w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                value === opt.value ? opt.bg : ""
              }`}
            >
              <Flag size={14} className={opt.color} fill="currentColor" />
              <span
                className={`text-sm font-medium  ${value === opt.value ? opt.color : "text-gray-600"}`}
              >
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
