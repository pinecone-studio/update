"use client";

import React from "react";

export function FinanceRightWidgets() {
  return (
    <aside className="flex h-full w-full flex-col gap-4 overflow-hidden">
      <div className="flex-1 rounded-3xl border border-[rgba(63,91,138,0.44)] bg-[radial-gradient(circle_at_90%_10%,rgba(76,114,255,0.05),transparent_48%),linear-gradient(160deg,rgba(28,29,82,0.28),rgba(22,37,79,0.24))] p-4 backdrop-blur-[1px] sm:p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-5 font-semibold text-white">Recent Activity</h3>
          <button className="text-5 text-[#A7B6D3] hover:text-white">View All ›</button>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex items-start gap-3 border-b border-[#2B405F] pb-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
              ✓
            </div>
            <div className="flex-1">
              <p className="text-5 font-medium text-white">
                Bat approved Gym benefit — ₹200K
              </p>
              <p className="text-4 text-[#8FA3C5]">1 day ago</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
              ▣
            </div>
            <div className="flex-1">
              <p className="text-5 font-medium text-white">
                Sara requested Laptop — Pending
              </p>
              <p className="text-4 text-[#8FA3C5]">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default FinanceRightWidgets;
