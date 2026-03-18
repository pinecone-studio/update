export const Taglines = [
  "💼    Санхүүгээ хянаж, ирээдүйгээ итгэлтэй төлөвлө.",
  "📊    Таны санхүүгийн зураглал эндээс эхэлнэ.",
  "💰    Орлого, зарлагаа ухаалгаар удирдах орон зай.",
  "🧾    Санхүүгээ нэг дороос, амархан, ойлгомжтой.",
  "🌱    Төлөвлөсөн санхүү — тайван ирээдүй.",
  "⚖️    Илүү цэгцтэй санхүү, илүү тайван шийдвэр.",
  "🎯    Санхүүгийн хяналт таны гарт.",
  "📈    Мөнгөний урсгалаа ойлгож, урагшаа итгэлтэй алх.",
  "🧠    Өдөр тутмын санхүүгээ илүү ухаалгаар удирд.",
  "🚀    Таны санхүүгийн зөв эхлэл энд байна.",
] as const;

export const TAGLINE_INDEX_KEY = "ebms_finance_tagline_index";
export const TAGLINE_LAST_CHANGE_KEY = "ebms_finance_tagline_last_change";
export const TAGLINE_CHANGE_MS = 24 * 60 * 60 * 1000;

export type FinanceNotificationItem = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  unread: boolean;
  type: "payment_pending" | "reimbursement" | "payment_completed";
  actions?: ("approve" | "reject" | "review")[];
};

export const FINANCE_NOTIFICATIONS: FinanceNotificationItem[] = [
  { id: "f1", title: "Payment approval required", subtitle: "Bat-Erdene — Gym membership", time: "5m ago", unread: true, type: "payment_pending", actions: ["approve", "reject"] },
  { id: "f2", title: "New reimbursement request", subtitle: "Nomin — Education allowance", time: "30m ago", unread: true, type: "reimbursement", actions: ["review"] },
  { id: "f3", title: "Payment processed", subtitle: "Gym membership approved", time: "1h ago", unread: false, type: "payment_completed" },
  { id: "f4", title: "Reimbursement approved", subtitle: "Ariunaa — Transit pass", time: "Yesterday", unread: false, type: "payment_completed" },
];
