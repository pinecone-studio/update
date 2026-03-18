"use client";

import React from "react";

const trendBars = [
  { month: "Mar", barPx: 128 },
  { month: "Apr", barPx: 84 },
  { month: "May", barPx: 68 },
  { month: "Jun", barPx: 98, glow: true },
];

export function FinanceRightWidgets() {
  return (
    <aside className="flex h-full w-full flex-col gap-4 overflow-hidden">
      <div className="flex-1 rounded-3xl border border-[rgba(63,91,138,0.62)] bg-[radial-gradient(circle_at_90%_10%,rgba(76,114,255,0.08),transparent_48%),linear-gradient(160deg,rgba(28,29,82,0.62),rgba(22,37,79,0.58))] p-4 backdrop-blur-[2px] sm:p-5">
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

      <div className="overflow-hidden rounded-3xl border border-[rgba(63,91,138,0.62)] bg-[radial-gradient(circle_at_90%_10%,rgba(76,114,255,0.08),transparent_48%),linear-gradient(160deg,rgba(28,29,82,0.62),rgba(22,37,79,0.58))] p-4 backdrop-blur-[2px] sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-5 font-semibold text-white">Budget Usage Trend</h3>
          <button className="rounded-md border border-[#3A4F78] px-2 py-1 text-xs text-[#A7B6D3]">
            Last 6 Months ˅
          </button>
        </div>
        <div className="relative h-[300px] w-full overflow-hidden rounded-[20px] border border-[rgba(53,91,144,0.7)] bg-[linear-gradient(180deg,rgba(11,25,63,0.72),rgba(12,26,67,0.76))] px-3 pb-3 pt-5 sm:h-[320px] sm:px-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(56,128,255,0.12),transparent_55%)]" />

          <div className="relative grid h-full grid-cols-[58px_1fr] gap-2">
            <div className="flex h-full flex-col justify-between pb-10 pt-1 text-[15px] font-medium text-[#92A8CD]">
              <span>₮50M</span>
              <span>₮20M</span>
              <span>₮10M</span>
              <span>₮0M</span>
            </div>

            <div className="relative h-full">
              <div className="absolute inset-x-0 top-[18%] border-t border-dashed border-[#4A5F8E]/50" />
              <div className="absolute inset-x-0 top-[43%] border-t border-[#4A5F8E]/30" />
              <div className="absolute inset-x-0 top-[62%] border-t border-[#4A5F8E]/30" />
              <div className="absolute inset-x-0 top-[82%] border-t border-[#4A5F8E]/30" />
              <div className="absolute inset-x-0 bottom-10 border-t border-[#4A5F8E]/45" />

              <svg
                viewBox="0 0 300 120"
                className="pointer-events-none absolute left-1 right-1 top-[18%] h-[72px] w-[calc(100%-0.5rem)]"
              >
                <path
                  d="M10 78 C 62 72, 94 62, 136 58 S 228 52, 290 46"
                  fill="none"
                  stroke="#CBA0FF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="8 8"
                  className="trend-line"
                />
              </svg>

              <div className="absolute right-3 top-4 max-w-[calc(100%-1.5rem)] rounded-2xl border border-[#3A4F78] bg-[rgba(20,25,76,0.95)] px-4 py-2 text-[13px] text-[#E3ECFF] shadow-[0_10px_30px_rgba(2,8,27,0.45)] sm:right-5 sm:text-[15px]">
                <div className="font-semibold">₮2.5M Allocated</div>
                <div className="mt-1 text-[#B7C4DD]">₮47.5M Remaining</div>
                <div className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[#3A4F78] bg-[rgba(20,25,76,0.95)]" />
              </div>

              <div className="absolute inset-x-1 bottom-0 flex h-[138px] items-end justify-around gap-3 pb-10">
                {trendBars.map((bar, index) => (
                  <div key={bar.month} className="relative flex w-12 justify-center">
                    <div
                      className="bar-rise w-full rounded-t-[9px] bg-gradient-to-t from-[#2A8BFF] via-[#4B99EB] to-[#8ED7FF]/95 shadow-[0_10px_30px_rgba(42,139,255,0.2)]"
                      style={{
                        height: `${bar.barPx}px`,
                        animationDelay: `${index * 120}ms`,
                      }}
                    />
                    {bar.glow ? (
                      <div className="pointer-events-none absolute bottom-0 h-5 w-9 rounded-full bg-[#63C7FF]/70 blur-[6px]" />
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="absolute inset-x-1 bottom-0 flex items-end justify-around gap-3 pb-1">
                {trendBars.map((bar) => (
                  <span key={bar.month} className="w-12 text-center text-[15px] font-semibold text-[#D7E6FF]">
                    {bar.month}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bar-rise {
          transform-origin: bottom;
          animation: barRise 700ms ease-out both;
        }
        .trend-line {
          animation: trendDraw 1200ms ease-out both;
        }
        @keyframes barRise {
          from {
            transform: scaleY(0.12);
            opacity: 0.25;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        @keyframes trendDraw {
          from {
            stroke-dashoffset: 180;
            opacity: 0;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
      `}</style>
    </aside>
  );
}

export default FinanceRightWidgets;
