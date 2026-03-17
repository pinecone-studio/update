export const Taglines = [
  "Санхүүгээ хянаж, ирээдүйгээ итгэлтэй төлөвлө.",
  "Таны санхүүгийн зураглал эндээс эхэлнэ.",
  "Орлого, зарлагаа ухаалгаар удирдах орон зай.",
  "Санхүүгээ нэг дороос, амархан, ойлгомжтой.",
  "Төлөвлөсөн санхүү — тайван ирээдүй.",
  "Илүү цэгцтэй санхүү, илүү тайван шийдвэр.",
  "Санхүүгийн хяналт таны гарт.",
  "Мөнгөний урсгалаа ойлгож, урагшаа итгэлтэй алх.",
  "Өдөр тутмын санхүүгээ илүү ухаалгаар удирд.",
  "Таны санхүүгийн зөв эхлэл энд байна.",
] as const;

export const TAGLINE_INDEX_KEY = "ebms_finance_tagline_index";
export const TAGLINE_LAST_CHANGE_KEY = "ebms_finance_tagline_last_change";
export const TAGLINE_CHANGE_MS = 24 * 60 * 60 * 1000;

export const FINANCE_NOTIFICATIONS = [
  { id: "f1", title: "Payment Approval Required", body: "Bat-Erdene's Gym Membership benefit requires payment approval.", time: "5 minutes ago", unread: true },
  { id: "f2", title: "New Reimbursement Request", body: "Nomin submitted an expense reimbursement for Education Allowance.", time: "30 minutes ago", unread: true },
  { id: "f3", title: "Payment Processed", body: "Payment for Bat-Erdene's Gym Membership has been completed.", time: "2 hours ago", unread: false },
  { id: "f4", title: "Reimbursement Approved", body: "Ariunaa's Transit Pass reimbursement was approved.", time: "Yesterday", unread: false },
];
