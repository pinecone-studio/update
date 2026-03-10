/** @format */

import { useRouter } from "next/navigation"
import { useState } from "react"

import {
	HiSquares2X2,
	HiOutlineBookmark,
	HiOutlineDocumentText,
	HiOutlineBell,
	HiBars3,
} from "react-icons/hi2";

export const Header = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  return(
    <header className="w-full bg-[#1E293B] h-[64px] px-4 relative sticky top-0 z-50">
      <div className="h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-white">
            <img src="/logo.png" alt="EBMS Logo" className="h-8 w-auto" />
            <span className="text-lg font-semibold tracking-wide">EBMS</span>
          </div>
          <nav className="hidden md:flex items-center gap-2 text-slate-300 text-xs ml-6">
            <button
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 transition ${
                activeTab === "dashboard"
                  ? "text-white bg-blue-600 ring-blue-300"
                  : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <HiSquares2X2 className="text-base" />
              Dashboard
            </button>
            <button
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 transition ${
                activeTab === "eligibility"
                  ? "text-white bg-blue-600 ring-blue-300"
                  : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
              }`}
              onClick={() => setActiveTab("eligibility")}
            >
              <HiOutlineBookmark className="text-base" />
              Benefit Eligibility
            </button>
            <button
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 transition ${
                activeTab === "requests"
                  ? "text-white bg-blue-600 ring-blue-300"
                  : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
              }`}
              onClick={() => setActiveTab("requests")}
            >
              <HiOutlineDocumentText className="text-base" />
              Benefit Requests
            </button>
            <button
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 transition ${
                activeTab === "notifications"
                  ? "text-white bg-blue-600 ring-blue-300"
                  : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
              }`}
              onClick={() => {
                setActiveTab("notifications")
                router.push("/employee/notification")
              }}
            >
              <HiOutlineBell className="text-base" />
              Notifications
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="md:hidden h-8 w-8 rounded-full bg-slate-800 text-slate-200 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-700 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <HiBars3 className="text-sm" />
          </button>
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <button className="h-8 w-8 rounded-full bg-slate-800 text-slate-200 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-700 transition">
                <HiOutlineBell className="text-sm" />
              </button>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-[10px] font-semibold grid place-items-center ml-1">
              JD
            </div>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden absolute left-0 top-[64px] w-full bg-slate-900 border-t border-slate-800 ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col gap-1 p-3 text-slate-300 text-sm">
          <button
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ring-1 transition ${
              activeTab === "dashboard"
                ? "text-white bg-blue-600 ring-blue-300"
                : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
            }`}
            onClick={() => {
              setActiveTab("dashboard")
              setMenuOpen(false)
            }}
          >
            <HiSquares2X2 className="text-base" />
            Dashboard
          </button>
          <button
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ring-1 transition ${
              activeTab === "eligibility"
                ? "text-white bg-blue-600 ring-blue-300"
                : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
            }`}
            onClick={() => {
              setActiveTab("eligibility")
              setMenuOpen(false)
            }}
          >
            <HiOutlineBookmark className="text-base" />
            Benefit Eligibility
          </button>
          <button
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ring-1 transition ${
              activeTab === "requests"
                ? "text-white bg-blue-600 ring-blue-300"
                : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
            }`}
            onClick={() => {
              setActiveTab("requests")
              setMenuOpen(false)
            }}
          >
            <HiOutlineDocumentText className="text-base" />
            Benefit Requests
          </button>
          <button
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ring-1 transition ${
              activeTab === "notifications"
                ? "text-white bg-blue-600 ring-blue-300"
                : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
            }`}
            onClick={() => {
              setActiveTab("notifications")
              setMenuOpen(false)
              router.push("/employee/notification")
            }}
          >
            <HiOutlineBell className="text-base" />
            Notifications
          </button>
          <div className="h-px bg-slate-800 my-2" />
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-full bg-slate-800 text-slate-200 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-700 transition">
              <HiOutlineBell className="text-sm" />
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-[10px] font-semibold grid place-items-center">
              JD
            </div>
            <span className="text-slate-300 text-xs">Account</span>
          </div>
        </nav>
      </div>
    </header>
  )
}
