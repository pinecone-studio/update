/** @format */

"use client";

import { HiChevronDown } from "react-icons/hi2";
import type { SwitchUserOption } from "@/app/_lib/activeUser";

type UserDropdownProps = {
  open: boolean;
  selectedUser: SwitchUserOption;
  userOptions: SwitchUserOption[];
  onToggle: () => void;
  onSelect: (id: string) => void;
};

export function UserDropdown({
  open,
  selectedUser,
  userOptions,
  onToggle,
  onSelect,
}: UserDropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 dark:border-[#334155] dark:text-[#A7B6D3] dark:hover:border-white/20 dark:hover:bg-white/5"
        aria-label="Select user"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="max-w-[140px] truncate sm:max-w-[180px]">
          {selectedUser.name} ({selectedUser.id})
        </span>
        <HiChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-white/10 bg-[#0E1622] shadow-[0_28px_70px_-40px_rgba(0,0,0,0.85)]"
          role="listbox"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="max-h-[280px] overflow-y-auto py-2">
            {userOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={opt.id === selectedUser.id}
                onClick={() => {
                  onSelect(opt.id);
                  onToggle();
                }}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition ${
                  opt.id === selectedUser.id
                    ? "bg-white/10 font-medium text-white"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="min-w-0 truncate">{opt.name}</span>
                <span className="shrink-0 text-[11px] text-white/50">
                  ({opt.id})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
