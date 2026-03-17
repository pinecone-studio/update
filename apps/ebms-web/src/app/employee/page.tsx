/** @format */

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FiCheck,
  FiStar,
  FiClock,
  FiLock,
  FiMessageCircle,
  FiHelpCircle,
  FiSend,
} from "react-icons/fi";
import { BenefitPortfolio } from "@/app/_components/BenefitPortfolio";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";
import { EmployeeDashboardSkeleton } from "./components/EmployeeDashboardSkeleton";
import {
  fetchMe,
  fetchMyBenefits,
  fetchMyBenefitRequests,
  uploadSignedContractPdf,
  requestBenefit,
  openBenefitContractPreview,
  getApiErrorMessage,
} from "./_lib/api";
import { mapMyBenefitsToCardProps } from "./_lib/mapBenefits";
import { IoClose } from "react-icons/io5";
import { ensureValidActiveUserProfile } from "@/app/_lib/activeUser";

const FILTER_PILL_STYLES = {
  ACTIVE: {
    label: "Active",
    tone: "text-[#EAF1FF]",
    countTone: "text-[#AAB4D7]",
    iconWrap:
      "bg-[linear-gradient(180deg,rgba(63,175,143,0.72),rgba(39,122,104,0.72))] text-[#A5FFE7] border border-[#66d9bf66]",
    idle: "border-[0.6px] border-[#AAB4D766] bg-[linear-gradient(90deg,#2C2647_0%,#0F1421_100%)]",
    active:
      "border border-[#5FE7C780] bg-[linear-gradient(90deg,#2C2647_0%,#0F1421_100%)] shadow-[0_0_0_1px_rgba(95,231,199,0.25),0_0_24px_rgba(31,183,145,0.35)]",
  },
  ELIGIBLE: {
    label: "Eligible",
    tone: "text-[#EAF1FF]",
    countTone: "text-[#AAB4D7]",
    iconWrap:
      "bg-[linear-gradient(180deg,rgba(83,140,214,0.72),rgba(44,90,157,0.72))] text-[#A9CCFF] border border-[#79AAFF66]",
    idle: "border-[0.6px] border-[#AAB4D766] bg-[linear-gradient(90deg,#0F1421_0%,#2C2647_100%)]",
    active:
      "border border-[#7AB6FF80] bg-[linear-gradient(90deg,#0F1421_0%,#2C2647_100%)] shadow-[0_0_0_1px_rgba(122,182,255,0.25),0_0_24px_rgba(81,141,230,0.35)]",
  },
  PENDING: {
    label: "Pending",
    tone: "text-[#EAF1FF]",
    countTone: "text-[#AAB4D7]",
    iconWrap:
      "bg-[linear-gradient(180deg,rgba(167,107,49,0.72),rgba(119,74,33,0.72))] text-[#FF9D33] border border-[#FFB16B66]",
    idle: "border-[0.6px] border-[#AAB4D766] bg-[linear-gradient(90deg,#2C2647_0%,#0F1421_100%)]",
    active:
      "border border-[#FFBF6B80] bg-[linear-gradient(90deg,#2C2647_0%,#0F1421_100%)] shadow-[0_0_0_1px_rgba(255,191,107,0.25),0_0_24px_rgba(255,157,51,0.32)]",
  },
  LOCKED: {
    label: "Locked",
    tone: "text-[#EAF1FF]",
    countTone: "text-[#AAB4D7]",
    iconWrap:
      "bg-[linear-gradient(180deg,rgba(177,89,108,0.72),rgba(122,56,72,0.72))] text-[#FF6D88] border border-[#FF96A866]",
    idle: "border-[0.6px] border-[#AAB4D766] bg-[linear-gradient(90deg,#0F1421_0%,#2C2647_100%)]",
    active:
      "border border-[#FF9AB180] bg-[linear-gradient(90deg,#0F1421_0%,#2C2647_100%)] shadow-[0_0_0_1px_rgba(255,154,177,0.22),0_0_24px_rgba(255,109,136,0.3)]",
  },
} as const;

const CardIcon = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => (
  <div
    className={`flex items-center justify-center w-12 h-12 rounded-lg ${className}`}
  >
    {children}
  </div>
);

export default function EmployeeDashboardPage() {
  const [me, setMe] = useState<{ name: string; okrSubmitted: boolean } | null>(
    null,
  );
  const [benefits, setBenefits] = useState<BenefitCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackPanelOpen, setFeedbackPanelOpen] = useState(false);
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
  const [statusFilter, setStatusFilter] = useState<
    "ACTIVE" | "ELIGIBLE" | "PENDING" | "LOCKED" | "ALL"
  >("ALL");
  const [contractTasks, setContractTasks] = useState<
    Array<{
      requestId: string;
      benefitName: string;
      uploadedUrl?: string | null;
    }>
  >([]);
  const [selectedContractFileByRequestId, setSelectedContractFileByRequestId] =
    useState<Record<string, File | null>>({});
  const [uploadingContractByRequestId, setUploadingContractByRequestId] =
    useState<Record<string, boolean>>({});
  const [contractUploadErrorByRequestId, setContractUploadErrorByRequestId] =
    useState<Record<string, string>>({});

  const load = useCallback(
    async (opts?: { silent?: boolean; retried?: boolean }) => {
      if (!opts?.silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const [meRes, myBenefitsRes] = await Promise.all([
          fetchMe(),
          fetchMyBenefits(),
        ]);
        setMe({ name: meRes.name, okrSubmitted: meRes.okrSubmitted });
        const mapped = mapMyBenefitsToCardProps(myBenefitsRes);
        setBenefits((prev) => {
          // Preserve optimistic PENDING (backend may still return ELIGIBLE for requested benefits)
          if (prev.length === 0) return mapped;
          return mapped.map((fresh) => {
            const existing = prev.find((p) => p.benefitId === fresh.benefitId);
            if (existing?.status === "PENDING" && fresh.status === "ELIGIBLE") {
              return existing;
            }
            return fresh;
          });
        });
        try {
          const requests = await fetchMyBenefitRequests("APPROVED");
          const tasks = requests
            .filter((r) => r.requiresContract)
            .map((r) => ({
              requestId: r.id,
              benefitName: r.benefitName ?? r.benefitId,
              uploadedUrl: r.contractTemplateUrl ?? null,
            }));
          setContractTasks(tasks);
        } catch {
          setContractTasks([]);
        }
      } catch (e) {
        const message = getApiErrorMessage(e);
        if (
          !opts?.retried &&
          message.toLowerCase().includes("employee not found")
        ) {
          try {
            await ensureValidActiveUserProfile();
            await load({ ...opts, retried: true });
            return;
          } catch {
            // fall through to regular error handling
          }
        }
        if (!opts?.silent) {
          setError(message);
          setBenefits([]);
        }
      } finally {
        if (!opts?.silent) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  // Refetch when tab becomes visible (e.g. after admin approves)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") load({ silent: true });
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [load]);

  const handleRequestBenefit = useCallback(
    async (benefit: BenefitCardProps) => {
      if (!benefit.benefitId) return;
      const confirmed = window.confirm(
        `Та "${benefit.name}" benefit-ийг хүсэхдээ итгэлтэй байна уу?`,
      );
      if (!confirmed) return;
      try {
        await requestBenefit(benefit.benefitId);
        // Optimistically update and switch to PENDING so user sees their request
        setBenefits((prev) =>
          prev.map((b) =>
            b.benefitId === benefit.benefitId
              ? { ...b, status: "PENDING" as const }
              : b,
          ),
        );
        setStatusFilter("PENDING");
        // Silent refresh to sync with backend (no loading spinner)
        await load({ silent: true });
      } catch (e) {
        alert(getApiErrorMessage(e));
      }
    },
    [load, me?.name],
  );

  const handleViewContract = useCallback(async (benefit: BenefitCardProps) => {
    if (!benefit.benefitId) return;
    try {
      const popup = window.open("", "_blank", "noopener,noreferrer");
      await openBenefitContractPreview(benefit.benefitId, popup);
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  }, []);

  const handleUploadSignedContract = useCallback(
    async (requestId: string) => {
      const selected = selectedContractFileByRequestId[requestId];
      if (!selected) {
        setContractUploadErrorByRequestId((prev) => ({
          ...prev,
          [requestId]: "PDF файл сонгоно уу.",
        }));
        return;
      }
      if (selected.type && selected.type !== "application/pdf") {
        setContractUploadErrorByRequestId((prev) => ({
          ...prev,
          [requestId]: "Зөвхөн PDF файл upload хийнэ.",
        }));
        return;
      }
      setContractUploadErrorByRequestId((prev) => ({
        ...prev,
        [requestId]: "",
      }));
      setUploadingContractByRequestId((prev) => ({
        ...prev,
        [requestId]: true,
      }));
      try {
        await uploadSignedContractPdf(requestId, selected);
        await load({ silent: true });
      } catch (e) {
        setContractUploadErrorByRequestId((prev) => ({
          ...prev,
          [requestId]: getApiErrorMessage(e),
        }));
      } finally {
        setUploadingContractByRequestId((prev) => ({
          ...prev,
          [requestId]: false,
        }));
      }
    },
    [load, selectedContractFileByRequestId],
  );

  const activeCount = benefits.filter((b) => b.status === "ACTIVE").length;
  const eligibleCount = benefits.filter((b) => b.status === "ELIGIBLE").length;
  const lockedCount = benefits.filter((b) => b.status === "LOCKED").length;
  const pendingCount = benefits.filter((b) => b.status === "PENDING").length;

  const filteredBenefits =
    statusFilter === "ALL"
      ? benefits
      : benefits.filter((b) => b.status === statusFilter);
  const totalVisible =
    statusFilter === "ALL" ? benefits.length : filteredBenefits.length;

  const statusOrder: Record<BenefitCardProps["status"], number> = {
    ACTIVE: 0,
    ELIGIBLE: 1,
    PENDING: 2,
    LOCKED: 3,
    REJECTED: 4,
  };
  const orderedBenefits = [...filteredBenefits].sort((a, b) => {
    const byStatus = statusOrder[a.status] - statusOrder[b.status];
    if (byStatus !== 0) return byStatus;
    return (a.category ?? "").localeCompare(b.category ?? "");
  });
  const filterItems = [
    { key: "ACTIVE" as const, count: activeCount, icon: <FiCheck size={16} /> },
    {
      key: "ELIGIBLE" as const,
      count: eligibleCount,
      icon: <FiStar size={16} />,
    },
    {
      key: "PENDING" as const,
      count: pendingCount,
      icon: <FiClock size={16} />,
    },
    { key: "LOCKED" as const, count: lockedCount, icon: <FiLock size={16} /> },
  ];

  const handleFeedbackSubmit = useCallback(async () => {
    if (!feedbackMessage.trim()) return;
    setFeedbackSubmitting(true);
    try {
      // Placeholder: wire to feedback API when available
      await new Promise((r) => setTimeout(r, 500));
      setFeedbackSubmitted(true);
      setFeedbackMessage("");
    } finally {
      setFeedbackSubmitting(false);
    }
  }, [feedbackMessage]);

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

  const handleAskSubmit = useCallback(() => {
    if (!chatQuestion.trim()) return;
    const q = chatQuestion.trim().toLowerCase();
    setChatMessages((prev) => [...prev, { role: "user", text: chatQuestion }]);
    setChatQuestion("");

    // Simple keyword matching for FAQ
    let reply = FAQ_RESPONSES.default;
    if (q.includes("request") || q.includes("how do i") || q.includes("apply"))
      reply = FAQ_RESPONSES.request;
    else if (q.includes("active")) reply = FAQ_RESPONSES.active;
    else if (q.includes("eligible")) reply = FAQ_RESPONSES.eligible;
    else if (q.includes("pending")) reply = FAQ_RESPONSES.pending;
    else if (q.includes("locked")) reply = FAQ_RESPONSES.locked;
    else if (
      q.includes("dashboard") ||
      q.includes("how does") ||
      q.includes("work")
    )
      reply = FAQ_RESPONSES.dashboard;

    setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
  }, [chatQuestion]);

  const renderContractTaskCard = (task: {
    requestId: string;
    benefitName: string;
    uploadedUrl?: string | null;
  }) => {
    const isUploading = uploadingContractByRequestId[task.requestId] ?? false;
    const selected = selectedContractFileByRequestId[task.requestId];
    const errorText = contractUploadErrorByRequestId[task.requestId];
    const needsUpload = !task.uploadedUrl;
    return (
      <div
        key={task.requestId}
        className="rounded-xl border border-amber-300/30 bg-black/20 p-3"
      >
        <p className="text-sm font-medium text-white">{task.benefitName}</p>
        <p className="mt-1 text-xs text-white/65">
          Request ID: {task.requestId}
        </p>
        {!needsUpload ? (
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-emerald-300">
              Signed contract uploaded
            </span>
            <a
              href={task.uploadedUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-300 hover:text-blue-200"
            >
              View uploaded file
            </a>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setSelectedContractFileByRequestId((prev) => ({
                  ...prev,
                  [task.requestId]: e.target.files?.[0] ?? null,
                }))
              }
              className="text-xs text-white/80 file:mr-2 file:rounded-md file:border-0 file:bg-white/20 file:px-3 file:py-1.5 file:text-xs file:text-white hover:file:bg-white/30"
            />
            <button
              type="button"
              disabled={!selected || isUploading}
              onClick={() => void handleUploadSignedContract(task.requestId)}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload signed PDF"}
            </button>
          </div>
        )}
        {errorText ? (
          <p className="mt-2 text-xs text-red-300">{errorText}</p>
        ) : null}
      </div>
    );
  };

  return (
    <div>
      <div className="flex min-h-screen w-full flex-col items-center px-4 py-5 sm:px-6 sm:py-6 lg:p-8">
        <div className="flex w-full max-w-[1512px] min-w-0 flex-col">
          {loading ? (
            <EmployeeDashboardSkeleton benefitCount={benefits.length || 6} />
          ) : (
            <>
              <section className="grid w-full min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_356px] lg:items-start lg:gap-8">
                <div className="min-w-0 max-w-[780px]">
                  <div className="mb-8 flex flex-col sm:mb-10">
                    <h1 className="text-[20px] font-semibold leading-[1.02] tracking-[-1.8px] text-white sm:text-[35px] sm:tracking-[-2.6px] letter-spacing-[-1px]">
                      Welcome back, {me?.name ?? "..."}
                    </h1>
                    <p className="mt-3 max-w-[640px] text-[17px] font-normal leading-7 tracking-[-0.3px] text-white/62 sm:text-[20px] sm:tracking-[-0.45px]">
                      You have {activeCount} active benefits and {pendingCount}{" "}
                      pending requests
                    </p>
                    {error && (
                      <p className="mt-3 text-sm text-red-400">
                        Error: {error}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:overflow-visible">
                    {filterItems.map((item) => {
                      const styles = FILTER_PILL_STYLES[item.key];
                      const isActive = statusFilter === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() =>
                            setStatusFilter((prev) =>
                              prev === item.key ? "ALL" : item.key,
                            )
                          }
                          className={`inline-flex h-[38px] w-[160px] shrink-0 cursor-pointer items-center gap-[10px] rounded-[13px] border px-[8px] py-[6px] text-left transition-all duration-200 ${
                            isActive ? styles.active : styles.idle
                          }`}
                        >
                          <span
                            className={`grid h-[26px] w-[26px] place-items-center rounded-[8px] ${styles.iconWrap}`}
                          >
                            {item.icon}
                          </span>
                          <span
                            className={`text-[14px] leading-none font-medium tracking-[-0.2px] ${styles.tone}`}
                          >
                            {styles.label}
                            <span className={`${styles.countTone} ml-2`}>
                              {item.count}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full lg:justify-self-end">
                  <div className="flex h-[180px] w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:h-[260px] lg:h-[242px] lg:w-[356px]">
                    <img
                      src="/employee.png"
                      alt="Office workspace"
                      className="h-[140px] w-auto object-contain sm:h-[200px] lg:h-[190px]"
                    />
                  </div>
                </div>
              </section>

              <section className="mt-12 w-full sm:mt-16">
                {contractTasks.length > 0 && (
                  <div className="mb-8 rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4">
                    <h3 className="text-sm font-semibold text-amber-200">
                      Signed Contract Required
                    </h3>
                    <p className="mt-1 text-xs text-amber-100/80">
                      Admin approved these requests. Please upload your manually
                      signed contract PDF.
                    </p>
                    <div className="mt-4 space-y-3">
                      {contractTasks.map(renderContractTaskCard)}
                    </div>
                  </div>
                )}
                <div>
                  <div className="mb-6">
                    <div>
                      <h2 className="text-[18px] font-semibold tracking-[-0.4px] text-white sm:text-[20px] sm:tracking-[-0.6px]">
                        {statusFilter === "ALL"
                          ? "All Benefits"
                          : `${statusFilter.charAt(0)}${statusFilter
                              .slice(1)
                              .toLowerCase()} Benefits`}
                      </h2>
                      <p className="mt-1 text-[15px] text-white/45">
                        {statusFilter === "ALL"
                          ? "Showing all your benefits"
                          : `Showing ${totalVisible} ${statusFilter.toLowerCase()} benefits`}
                      </p>
                    </div>
                  </div>

                  <BenefitPortfolio
                    benefits={orderedBenefits}
                    onRequestBenefit={handleRequestBenefit}
                    onViewContract={handleViewContract}
                  />
                </div>
              </section>
            </>
          )}
        </div>
        {!feedbackPanelOpen && (
          <button
            type="button"
            className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 bg-slate-800 text-white shadow-lg duration-200 hover:bg-slate-700 dark:bg-[#1E293B] dark:hover:bg-[#334155] sm:bottom-8 sm:right-8 sm:h-16 sm:w-16 lg:bottom-14 lg:right-14"
            onClick={() => setFeedbackPanelOpen(true)}
            aria-label="Help & Feedback"
          >
            <FiMessageCircle size={24} className="sm:h-7 sm:w-7" />
          </button>
        )}
        {feedbackPanelOpen && (
          <div className="fixed inset-x-4 bottom-4 z-50 flex h-[70vh] max-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-[#1E293B] sm:inset-x-auto sm:right-8 sm:w-[340px] lg:bottom-14 lg:right-14">
            <div className="bg-[#2196F3] dark:bg-[#1976D2] w-full rounded-t-2xl flex flex-col">
              <div className="flex items-center justify-between px-4 h-14">
                <div className="flex items-center gap-2">
                  <FiMessageCircle size={22} className="text-white" />
                  <span className="font-semibold text-white">
                    Help & Feedback
                  </span>
                </div>
                <button
                  type="button"
                  className="w-9 h-9 rounded-full flex justify-center items-center hover:bg-white/20 transition-colors text-white"
                  onClick={() => setFeedbackPanelOpen(false)}
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
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-slate-50 dark:bg-[#0f172a]">
              {panelTab === "ask" ? (
                <>
                  <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                    {chatMessages.map((m, i) => (
                      <div
                        key={i}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      >
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
                  <div className="flex-shrink-0 p-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatQuestion}
                        onChange={(e) => setChatQuestion(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && !e.shiftKey && handleAskSubmit()
                        }
                        placeholder="Ask how the portal works..."
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] dark:border-slate-600 dark:bg-[#1E293B] dark:text-white dark:placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={handleAskSubmit}
                        disabled={!chatQuestion.trim()}
                        className="px-4 py-2.5 rounded-lg bg-[#2196F3] text-white hover:bg-[#1976D2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiSend size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 min-h-0 overflow-hidden p-4 flex flex-col">
                  {feedbackSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <CardIcon className="bg-[#4CAF50]/20 mb-4">
                        <FiCheck size={24} color="#4CAF50" strokeWidth={2.5} />
                      </CardIcon>
                      <p className="text-slate-900 font-medium dark:text-white">
                        Thank you for your feedback!
                      </p>
                      <p className="text-sm text-slate-600 mt-1 dark:text-[#99A1AF]">
                        We appreciate you taking the time to share your
                        thoughts.
                      </p>
                      <button
                        type="button"
                        onClick={() => setFeedbackSubmitted(false)}
                        className="mt-4 text-sm text-[#2196F3] hover:text-[#1976D2] dark:text-[#60A5FA] dark:hover:text-[#93C5FD] underline"
                      >
                        Submit another feedback
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 min-h-0">
                      <p className="text-sm text-slate-600 dark:text-[#94A3B8] flex-shrink-0">
                        Share your thoughts to help us improve the benefits
                        experience.
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-[#E2E8F0] mb-1">
                          Your feedback
                        </label>
                        <textarea
                          value={feedbackMessage}
                          onChange={(e) => setFeedbackMessage(e.target.value)}
                          placeholder="Tell us what we can improve..."
                          rows={4}
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] dark:border-slate-600 dark:bg-[#0f172a] dark:text-white dark:placeholder:text-slate-500 resize-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleFeedbackSubmit}
                        disabled={!feedbackMessage.trim() || feedbackSubmitting}
                        className="w-full px-5 py-2.5 rounded-lg bg-[#2196F3] text-white font-medium hover:bg-[#1976D2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 flex-shrink-0"
                      >
                        <FiMessageCircle size={18} />
                        {feedbackSubmitting
                          ? "Submitting..."
                          : "Submit Feedback"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
