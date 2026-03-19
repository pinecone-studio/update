/** @format */

"use client";

import { useEffect, useState } from "react";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import {
  fetchEscalatedFeedback,
  closeFeedback,
  getApiErrorMessage,
  type EscalatedFeedbackItem,
} from "../_lib/api";

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<EscalatedFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [closingId, setClosingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchEscalatedFeedback()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) setError(getApiErrorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = search.trim()
    ? items.filter((i) => {
        const term = search.trim().toLowerCase();
        const textMatch = i.text.toLowerCase().includes(term);
        const nameMatch =
          i.employeeName?.toLowerCase().includes(term) ?? false;
        return textMatch || nameMatch;
      })
    : items;

  const handleClose = async (id: string) => {
    setClosingId(id);
    try {
      await closeFeedback(id);
      setItems((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, closedAt: new Date().toISOString() } : f,
        ),
      );
      window.dispatchEvent(new CustomEvent("ebms:feedback-marked-read"));
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setClosingId(null);
    }
  };

  function formatDate(iso: string): string {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-5 font-semibold text-slate-900 dark:text-white">
          Employee Feedback
        </h1>
        <p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
          Feedback that reached 3 votes and was sent to admin
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#2C4264] dark:bg-[#1E293B] dark:shadow-none">
        <div className="flex items-center gap-3">
          <HiOutlineMagnifyingGlass className="text-slate-500 dark:text-[#8FA3C5]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-5 text-slate-900 placeholder:text-slate-400 outline-none dark:text-white dark:placeholder:text-[#8595B6]"
            placeholder="Search feedback..."
          />
        </div>
      </section>

      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

      {loading ? (
        <p className="text-5 text-slate-600 dark:text-[#A7B6D3]">Loading...</p>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-[#2C4264] dark:bg-[#1E293B] dark:shadow-none">
          <HiOutlineInformationCircle className="mx-auto mb-3 h-12 w-12 text-slate-400 dark:text-[#8FA3C5]" />
          <p className="text-5 text-slate-600 dark:text-[#A7B6D3]">
            No escalated feedback yet. Employees create feedback and vote; when
            it reaches 3 votes before the 24h deadline, it appears here.
          </p>
        </div>
      ) : (
        <section className="space-y-4">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#2C4264] dark:bg-[#1E293B] dark:shadow-none"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-[#122033] dark:text-[#34D399]">
                    <HiOutlineCheckCircle className="text-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-5 font-semibold text-slate-900 dark:text-white">
                      {item.text}
                    </p>
                    <p className="mt-1 text-5 text-slate-600 dark:text-[#A7B6D3]">
                      Sent by:{" "}
                      {item.isAnonymous
                        ? "Anonymous"
                        : item.employeeName ?? "Employee"}
                    </p>
                    <p className="mt-3 text-5 text-slate-500 dark:text-[#8192B3]">
                      {item.voteCount} votes · {formatDate(item.createdAt)}
                      {item.closedAt && (
                        <> · Read {formatDate(item.closedAt)}</>
                      )}
                    </p>
                  </div>
                </div>
                {!item.closedAt && (
                  <button
                    type="button"
                    onClick={() => handleClose(item.id)}
                    disabled={closingId === item.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-5 text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-[#4B5D83] dark:bg-[#334160] dark:text-[#D4DEEF] dark:hover:bg-[#3A4A6C]"
                  >
                    {closingId === item.id ? "..." : "Mark as read"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
