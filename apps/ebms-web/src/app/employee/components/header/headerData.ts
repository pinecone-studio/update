/** @format */

export const STORAGE_KEY = "ebms_employee_notifications";
export const TAGLINE_INDEX_KEY = "ebms_employee_tagline_index";
export const TAGLINE_LAST_CHANGE_KEY = "ebms_employee_tagline_last_change";
export const TAGLINE_CHANGE_MS = 24 * 60 * 60 * 1000;

export const TAGLINES = [
  "✨ Таны ирээдүйг хамтдаа бүтээцгээе",
  "🚀 Хамтдаа амжилтад хүрье",
  "🌟 Өнөөдөр ч гайхалтай өдөр байх болно",
  "💪 Та үнэхээр гайхалтай ажил хийж байна",
  "🌈 Бүх зүйл боломжтой, зүгээр л эхэл",
  "💫 Чи чадна, бид чамд итгэж байна",
  "🔥 Өдрийн амжилт эхлэх цаг боллоо",
  "🎯 Таны хичээл зүтгэл үр дүнгээ өгөх болно",
  "💡 Урам зориг бүтээлч санаанаас төрнө",
  "🌅 Өнөөдрийн хүчин чармайлт маргаашийн амжилт",
  "🧭 Зорилго тодорхой бол зам тодорхой",
  "🤝 Хамтдаа бид илүү хүчтэй",
  "⚡ Амжилтын түлхүүр бол тасралтгүй хөдөлгөөн",
  "🎊 Таны хөгжил бидний баяр баясгалан",
  "🌱 Өнөөдрийн хэцүү нь маргаашийн амархан",
  "🌸 Итгэл найдвар үүсгэх үйлчилгээ",
  "🧘 Ажил амьдралын тэнцвэр бол амжилт",
  "🏆 Та өөрийгөө үнэлж, бид таныг дэмжинэ",
  "✨ Шинэ өдөр шинэ боломж",
  "🔮 Хамтдаа ирээдүйг тодорхойлье",
] as const;

export const DEFAULT_NOTIFICATIONS = [
  {
    id: "1",
    title: "You're Now Eligible for Education Allowance!",
    body: "Congratulations! You've reached 1 year tenure with an OKR score of 82%. You can now request Education Allowance.",
    time: "2 hours ago",
    tone: "success" as const,
    unread: true,
  },
  {
    id: "2",
    title: "OKR Score Updated",
    body: "Your Q1 2026 OKR score has been updated to 82%. This may affect your benefit eligibility.",
    time: "5 hours ago",
    tone: "info" as const,
    unread: true,
  },
  {
    id: "3",
    title: "Transit Pass Request Approved",
    body: "Your Transit Pass benefit request has been approved. You'll receive further details via email.",
    time: "1 day ago",
    tone: "success" as const,
    unread: false,
  },
];

export type EmployeeNotification = (typeof DEFAULT_NOTIFICATIONS)[number];
