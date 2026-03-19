/** @format */

"use client";

import { useCallback, useEffect, useState } from "react";
import { FiCheck, FiHelpCircle, FiMessageCircle, FiSend, FiThumbsUp, FiTrash2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import {
  createFeedback,
  deleteFeedback,
  fetchFeedbackList,
  voteFeedback,
  type FeedbackItem,
} from "../_lib/api";

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
  const [feedbackAnonymous, setFeedbackAnonymous] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [feedbackListLoading, setFeedbackListLoading] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddFeedback, setShowAddFeedback] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([
    {
      role: "assistant",
      text: "Hi! I can help you understand how the benefits portal works. Ask me anything—for example: How do I request a benefit? What does Active vs Eligible mean?",
    },
  ]);

  const loadFeedbackList = useCallback(async () => {
    setFeedbackListLoading(true);
    try {
      const items = await fetchFeedbackList();
      setFeedbackList(items);
    } catch {
      setFeedbackList([]);
    } finally {
      setFeedbackListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && panelTab === "feedback") {
      loadFeedbackList();
    }
  }, [open, panelTab, loadFeedbackList]);

  const handleFeedbackSubmit = useCallback(async () => {
    if (!feedbackMessage.trim()) return;
    setFeedbackSubmitting(true);
    setFeedbackError(null);
    try {
      await createFeedback({
        text: feedbackMessage.trim(),
        isAnonymous: feedbackAnonymous,
      });
      setFeedbackSubmitted(true);
      setFeedbackMessage("");
      loadFeedbackList();
    } catch (e) {
      setFeedbackError(e instanceof Error ? e.message : "Failed to submit feedback");
    } finally {
      setFeedbackSubmitting(false);
    }
  }, [feedbackMessage, feedbackAnonymous, loadFeedbackList]);

  const handleVote = useCallback(
    async (feedbackId: string) => {
      setVotingId(feedbackId);
      try {
        await voteFeedback(feedbackId);
        loadFeedbackList();
      } catch {
        // Silently fail - user can retry
      } finally {
        setVotingId(null);
      }
    },
    [loadFeedbackList]
  );

  const handleDelete = useCallback(
    async (feedbackId: string) => {
      if (!window.confirm("Delete this feedback? This cannot be undone.")) return;
      setDeletingId(feedbackId);
      try {
        await deleteFeedback(feedbackId);
        loadFeedbackList();
      } catch {
        // Silently fail - user can retry
      } finally {
        setDeletingId(null);
      }
    },
    [loadFeedbackList]
  );

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
                        ? "rounded-br-md border border-slate-300 bg-white text-slate-900"
                        : "rounded-bl-md border border-slate-300 bg-white text-slate-900"
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
                  Other employees can vote on it. At 3 votes it goes to admin.
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
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {(() => {
                  const openFeedback = feedbackList.filter((f) => f.status === "OPEN");
                  const hasOpenFeedback = openFeedback.length > 0;
                  const showVoteOnly = hasOpenFeedback && !showAddFeedback;

                  return (
                    <>
                      {/* Vote section — only shown when there are open feedback items */}
                      {hasOpenFeedback && (
                        <div
                          className={`min-h-0 overflow-y-auto ${
                            showVoteOnly ? "flex-1" : "flex-shrink-0 border-b border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-[#E2E8F0]">
                            Vote on feedback from others
                          </p>
                          {feedbackListLoading ? (
                            <p className="text-sm text-slate-500">Loading...</p>
                          ) : (
                            <ul className="space-y-2 pb-3">
                            {openFeedback.map((item) => (
                              <li
                                key={item.id}
                                className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-600 dark:bg-[#1E293B]"
                              >
                                <p className="text-sm text-slate-900 dark:text-white">
                                  {item.text}
                                </p>
                                <div className="mt-2 flex items-center justify-between gap-2">
                                  <span className="text-xs text-slate-500">
                                    {item.voteCount} votes
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {item.isCreator && (
                                      <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deletingId === item.id}
                                        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                                        title="Delete your feedback"
                                      >
                                        <FiTrash2 size={12} />
                                        {deletingId === item.id ? "..." : "Delete"}
                                      </button>
                                    )}
                                    {!item.hasVoted && !item.isCreator && (
                                      <button
                                        type="button"
                                        onClick={() => handleVote(item.id)}
                                        disabled={votingId === item.id}
                                        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#2196F3] hover:bg-[#2196F3]/10 disabled:opacity-50"
                                      >
                                        <FiThumbsUp size={14} />
                                        {votingId === item.id ? "..." : "Vote"}
                                      </button>
                                    )}
                                    {item.hasVoted && !item.isCreator && (
                                      <span className="text-xs text-[#4CAF50]">
                                        Voted
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                          )}
                        </div>
                      )}

                      {/* Feedback input — hidden when votes exist (unless Add clicked) */}
                      {(!hasOpenFeedback || showAddFeedback) && (
                        <div className="flex-shrink-0 flex flex-col gap-3 pt-3">
                          {hasOpenFeedback && (
                            <button
                              type="button"
                              onClick={() => setShowAddFeedback(false)}
                              className="self-start text-xs text-slate-500 hover:text-slate-700 dark:hover:text-[#94A3B8]"
                            >
                              ← Back to votes
                            </button>
                          )}
                          <p className="text-sm text-slate-600 dark:text-[#94A3B8]">
                            Share your thoughts. 3 votes → admin.
                          </p>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-[#E2E8F0]">
                              Your feedback
                            </label>
                            <textarea
                              value={feedbackMessage}
                              onChange={(e) => setFeedbackMessage(e.target.value)}
                              placeholder="Tell us what we can improve..."
                              rows={3}
                              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] dark:border-slate-600 dark:bg-[#0f172a] dark:text-white dark:placeholder:text-slate-500"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="feedback-anonymous"
                              checked={feedbackAnonymous}
                              onChange={(e) => setFeedbackAnonymous(e.target.checked)}
                              className="h-4 w-4 rounded border-slate-300 text-[#2196F3] focus:ring-[#2196F3]"
                            />
                            <label
                              htmlFor="feedback-anonymous"
                              className="text-sm text-slate-600 dark:text-[#94A3B8]"
                            >
                              Post anonymously
                            </label>
                          </div>
                          {feedbackError && (
                            <p className="text-sm text-red-500">{feedbackError}</p>
                          )}
                          <button
                            type="button"
                            onClick={handleFeedbackSubmit}
                            disabled={!feedbackMessage.trim() || feedbackSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2196F3] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#1976D2] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FiMessageCircle size={18} />
                            {feedbackSubmitting ? "Submitting..." : "Submit Feedback"}
                          </button>
                        </div>
                      )}

                      {/* Add feedback link — when vote-only mode */}
                      {hasOpenFeedback && !showAddFeedback && (
                        <div className="flex-shrink-0 border-t border-slate-200 pt-3 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => setShowAddFeedback(true)}
                            className="text-sm text-[#2196F3] hover:text-[#1976D2] dark:text-[#60A5FA]"
                          >
                            Add your feedback
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
