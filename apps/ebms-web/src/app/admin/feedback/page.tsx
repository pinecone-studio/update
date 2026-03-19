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
        <h1 className="text-[28px] font-semibold text-white">Employee Feedback</h1>
        <p className="mt-3 text-5 text-[#A7B6D3]">
          Feedback that reached 3 votes and was sent to admin
        </p>
      </div>

      <section className="rounded-2xl  dark:bg-[#20194D80]/50 p-4">
        <div className="flex items-center gap-3">
          <HiOutlineMagnifyingGlass className="text-[#8FA3C5]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-5 text-white placeholder:text-white/80 outline-none"
            placeholder="Search feedback..."
          />
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-5 text-[#A7B6D3]">Loading...</p>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl dark:bg-[#20194D80]/50 p-8 text-center">
          <HiOutlineInformationCircle className="mx-auto mb-3 h-12 w-12 text-[#8FA3C5]" />
          <p className="text-5 text-[#A7B6D3]">
            No escalated feedback yet. Employees create feedback and vote; when
            it reaches 3 votes before the 24h deadline, it appears here.
          </p>
        </div>
      ) : (
        <section className="space-y-4">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl dark:bg-[#20194D80]/50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#122033] text-[#34D399]">
                    <HiOutlineCheckCircle className="text-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-5 font-semibold text-white">
                      {item.text}
                    </p>
                    <p className="mt-1 text-5 text-[#A7B6D3]">
                      Sent by:{" "}
                      {item.isAnonymous
                        ? "Anonymous"
                        : item.employeeName ?? "Employee"}
                    </p>
                    <p className="mt-3 text-5 text-[#8192B3]">
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
                    className="rounded-xl border border-[#4B5D83] bg-[#334160] px-4 py-2 text-5 text-[#D4DEEF] transition hover:bg-[#3A4A6C] disabled:opacity-50"
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
