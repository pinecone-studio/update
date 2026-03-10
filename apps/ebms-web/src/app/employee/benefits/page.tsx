import { Header } from "../components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="bg-[#0f172A] px-4 py-4 flex flex-col items-center gap-6 text-white">
        <div className="w-full md:w-[921px] h-16 flex flex-col gap-[4px]">
          <div className="w-full h-9 flex items-center"></div>
          <div className="w-full h-6">
            <p className="text-[#64748B] text-sm">
              Check your eligibility status and track progress
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full md:w-[921px]">
          <div className="bg-[#1E293B] w-full md:w-[448.5px] h-[214px] rounded-2xl border border-[#334155] p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[#22C55E] font-medium">
              📈 OKR Performance
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#94A3B8]">Current Score</p>
                <p className="text-[#94A3B8] text-sm mt-2">Quarter</p>
                <p className="text-xs text-[#64748B] mt-2">
                  Last synced: 2026-03-09 08:30 AM
                </p>
              </div> 
              
              <div className="text-right">
                <p className="text-3xl font-bold">82%</p>
                <span className="bg-[#DCFCE7] text-[#166534] text-xs px-3 py-1 rounded-full ml-2">
                  ↑ Trending Up
                </span>
                <p className="text-sm text-[#94A3B8] mt-3">Q1 2026</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1E293B] w-full md:w-[448.5px] h-[214px] rounded-2xl border border-[#334155] p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-medium">
              🕒 Attendance & Tenure
            </div>

            <div className="flex justify-between text-sm">
              <div className="text-[#94A3B8] flex flex-col gap-3">
                <p>Tenure</p>
                <p>Days Worked</p>
                <p>Employment Type</p>
                <p className="text-xs text-[#64748B]">
                  Last synced: 2026-03-09 08:25 AM
                </p>
              </div>

              <div className="text-right flex flex-col gap-3">
                <p>1 year 3 months</p>
                <p>185</p>
                <span className="border border-[#334155] px-3 py-1 rounded-full text-xs">
                  Full-time
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-[921px]">
          <div className="flex flex-wrap gap-2 md:gap-4">
            <div className="bg-[#1E293B] text-white px-4 py-2 rounded-full text-sm">
              Active Benefits (2)
            </div>
            <div className="text-[#94A3B8] px-4 py-2 text-sm">
              Eligibility Status
            </div>
            <div className="text-[#94A3B8] px-4 py-2 text-sm">
              Progress Timeline
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-[#1E293B] border border-[#334155] rounded-2xl p-6 gap-4">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-red-500 text-xl">
                ❤
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-white font-semibold">Health Insurance</p>
                <p className="text-[#64748B] text-sm">
                  Vendor: BlueCross HealthCare
                </p>
                <p className="text-[#94A3B8] text-sm">
                  Enrolled: 2025-06-15 &nbsp;&nbsp; Expires: 2026-06-14
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <span className="bg-[#DCFCE7] text-[#166534] px-3 py-1 text-xs rounded-full">
                ✔ Active
              </span>
              <button className="border border-[#334155] text-white px-4 py-1 rounded-full w-full md:w-auto">
                Manage
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-[#1E293B] border border-[#334155] rounded-2xl p-6 gap-4">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-[#DCFCE7] rounded-xl flex items-center justify-center text-green-600 text-xl">
                🚆
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-white font-semibold">Transit Pass</p>
                <p className="text-[#64748B] text-sm">
                  Vendor: Metro Transit Authority
                </p>
                <p className="text-[#94A3B8] text-sm">
                  Enrolled: 2025-01-10 &nbsp;&nbsp; Expires: 2026-01-09
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <span className="bg-[#DCFCE7] text-[#166534] px-3 py-1 text-xs rounded-full">
                ✔ Active
              </span>
              <button className="border border-[#334155] text-white px-4 py-1 rounded-full w-full md:w-auto">
                Manage
              </button>
            </div>
          </div>

          <button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 rounded-xl font-medium">
            Request New Benefit
          </button>
        </div>
      </div>
    </div>
  );
}
