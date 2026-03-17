/** @format */

"use client";

import { useCallback, useState } from "react";
import { FiCheck, FiHelpCircle, FiMessageCircle, FiSend } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const FAQ_RESPONSES: Record<string, string> = {
  request:
    "To request a benefit: 1) Click on an Eligible benefit card, 2) Click 'Request benefit', 3) Confirm. Your request goes to the admin for approval. You'll see it as Pending until approved.",
  active:
    "Active benefits are ones you're already enrolled in. You can manage them from the benefit card.",
  eligible:
    "Eligible means you meet the requirements and can request this benefit. Click 'Request benefit' to apply.",
  pending:
    "Pending benefits are requests you've submitted that are awaiting admin approval. Check back later or you'll get notified when approved.",
  locked:
    "Locked benefits are ones you don't qualify for yet (e.g., tenure, OKR score). Click a card to see why it's locked and what you need to do.",
  dashboard:
    "The dashboard shows your benefit counts (Active, Eligible, Pending, Locked). Click a stat card to filter the list. Use the 'All' button to see everything.",
  default:
    "I'm here to help with the benefits portal. Try asking: How do I request a benefit? What does Active vs Eligible mean? What are Pending benefits?",
};

function CardIcon({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${className}`}>
      {children}
    </div>
  );
}

export function HelpFeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<"ask" | "feedback">("ask");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([
    {
      role: "assistant",
      text: "Hi! I can help you understand how the benefits portal works. Ask me anything—for example: How do I request a benefit? What does Active vs Eligible mean?",
    },
  ]);

  const handleFeedbackSubmit = useCallback(async () => {
    if (!feedbackMessage.trim()) return;
    setFeedbackSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setFeedbackSubmitted(true);
      setFeedbackMessage("");
    } finally {
      setFeedbackSubmitting(false);
    }
  }, [feedbackMessage]);

  const handleAskSubmit = useCallback(() => {
    if (!chatQuestion.trim()) return;
    const q = chatQuestion.trim().toLowerCase();
    setChatMessages((prev) => [...prev, { role: "user", text: chatQuestion }]);
    setChatQuestion("");

    let reply = FAQ_RESPONSES.default;
    if (q.includes("request") || q.includes("how do i") || q.includes("apply")) {
      reply = FAQ_RESPONSES.request;
    } else if (q.includes("active")) {
      reply = FAQ_RESPONSES.active;
    } else if (q.includes("eligible")) {
      reply = FAQ_RESPONSES.eligible;
    } else if (q.includes("pending")) {
      reply = FAQ_RESPONSES.pending;
    } else if (q.includes("locked")) {
      reply = FAQ_RESPONSES.locked;
    } else if (q.includes("dashboard") || q.includes("how does") || q.includes("work")) {
      reply = FAQ_RESPONSES.dashboard;
    }

    setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
  }, [chatQuestion]);

  if (!open) {
    return (
      <button
        type="button"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 bg-slate-800 text-white shadow-lg duration-200 hover:bg-slate-700 dark:bg-[#1E293B] dark:hover:bg-[#334155] sm:bottom-8 sm:right-8 sm:h-16 sm:w-16 lg:bottom-14 lg:right-14"
        onClick={() => setOpen(true)}
        aria-label="Help & Feedback"
      >
        <FiMessageCircle size={24} className="sm:h-7 sm:w-7" />
      </button>
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 flex h-[70vh] max-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-[#1E293B] sm:inset-x-auto sm:right-8 sm:w-[340px] lg:bottom-14 lg:right-14">
      <div className="w-full rounded-t-2xl bg-[#2196F3] dark:bg-[#1976D2]">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FiMessageCircle size={22} className="text-white" />
            <span className="font-semibold text-white">Help & Feedback</span>
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex gap-0 px-2 pb-2">
          <button
            type="button"
            onClick={() => setPanelTab("ask")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-t-lg text-sm font-medium transition ${
              panelTab === "ask"
                ? "bg-white/20 text-white"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <FiHelpCircle size={18} />
            Ask a question
          </button>
          <button
            type="button"
            onClick={() => setPanelTab("feedback")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-t-lg text-sm font-medium transition ${
              panelTab === "feedback"
                ? "bg-white/20 text-white"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <FiMessageCircle size={18} />
            Send feedback
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-[#0f172a]">
        {panelTab === "ask" ? (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === "user"
                        ? "bg-[#2196F3] text-white rounded-br-md"
                        : "bg-white dark:bg-[#334155] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-bl-md"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-shrink-0 border-t border-slate-200 p-3 dark:border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAskSubmit()}
                  placeholder="Ask how the portal works..."
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] dark:border-slate-600 dark:bg-[#1E293B] dark:text-white dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAskSubmit}
                  disabled={!chatQuestion.trim()}
                  className="rounded-lg bg-[#2196F3] px-4 py-2.5 text-white transition-colors hover:bg-[#1976D2] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
            {feedbackSubmitted ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CardIcon className="mb-4 bg-[#4CAF50]/20">
                  <FiCheck size={24} color="#4CAF50" strokeWidth={2.5} />
                </CardIcon>
                <p className="font-medium text-slate-900 dark:text-white">
                  Thank you for your feedback!
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-[#99A1AF]">
                  We appreciate you taking the time to share your thoughts.
                </p>
                <button
                  type="button"
                  onClick={() => setFeedbackSubmitted(false)}
                  className="mt-4 text-sm text-[#2196F3] underline hover:text-[#1976D2] dark:text-[#60A5FA] dark:hover:text-[#93C5FD]"
                >
                  Submit another feedback
                </button>
              </div>
            ) : (
              <div className="flex min-h-0 flex-col gap-3">
                <p className="flex-shrink-0 text-sm text-slate-600 dark:text-[#94A3B8]">
                  Share your thoughts to help us improve the benefits experience.
                </p>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-[#E2E8F0]">
                    Your feedback
                  </label>
                  <textarea
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Tell us what we can improve..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] dark:border-slate-600 dark:bg-[#0f172a] dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackMessage.trim() || feedbackSubmitting}
                  className="flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-[#2196F3] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#1976D2] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiMessageCircle size={18} />
                  {feedbackSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
