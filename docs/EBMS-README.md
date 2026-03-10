# EBMS — Employee Benefits Management System

Pinequest S3 Ep1 Project 2026 · team-7

---

## Юу тохируулагдсан бэ? (Cloudflare мэдэхгүй хүнд)

**Cloudflare** — веб сайт, API, database-ийг cloud дээр ажиллуулах үйлчилгээ. EBMS энд ажилладаг.

| Тохируулагдсан зүйл | Юу вэ                          | EBMS-д юу хийх вэ                            |
| ------------------- | ------------------------------ | -------------------------------------------- |
| **D1**              | Database (хүснэгт хадгалах)    | employees, benefits, eligibility дэлгэрэнгүй |
| **R2**              | Файл хадгалах (S3 шиг)         | Vendor гэрээний PDF                          |
| **KV**              | Key-value cache (хурдан унших) | Eligibility-г cache хийх                     |
| **Worker**          | API server (backend код)       | GraphQL API, `/health`                       |
| **Pages**           | Frontend hosting (статик файл) | Next.js хуудаснууд                           |
| **GitHub Actions**  | Автомат deploy                 | push хийхэд Worker + Pages шинэчлэгдэнэ      |

---

## 1. Багийн гишүүд — Хэрхэн эхлэх вэ (4 алхам)

```bash
git clone https://github.com/pinecone-studio/team-7.git
cd team-7
npm install
npm run login          # Cloudflare нэвтрэх (нэг удаа, браузер нээгдэнэ)
```

**Local дээр ажиллуулах:**

```bash
npm run dev:worker     # API → http://localhost:8787
npm run dev:web        # Frontend → http://localhost:3000
```

> Wrangler (Cloudflare CLI) глобал суулгах шаардлагагүй — `npm install`-д орсон.

---

## 2. Production — Ажиллаж байгаа URL-ууд

| Үйлчилгээ    | URL                                                          |
| ------------ | ------------------------------------------------------------ |
| **API**      | https://ebms-api.myagmartsognnaranbaatar.workers.dev         |
| **GraphQL**  | https://ebms-api.myagmartsognnaranbaatar.workers.dev/graphql |
| **Frontend** | Cloudflare Dashboard → Pages → ebms-web → View site          |

---

## 3. Deploy — Юу хийгддэг вэ

`main` branch руу push хийхэд **GitHub Actions** ажиллана:

1. **Worker** deploy — API шинэчлэгдэнэ
2. **Pages** deploy — Frontend шинэчлэгдэнэ

Deploy хийхэд **GitHub Secrets** хэрэгтэй. Дараах хоёрыг repo Settings → Secrets → Actions-д нэмнэ:

| Secret                 | Юу оруулах вэ                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| **EBMS_CF_ACCOUNT_ID** | [Cloudflare Dashboard](https://dash.cloudflare.com) нээгээд баруун sidebar → **Account ID** хуулна |
| **EBMS_CF_API_TOKEN**  | My Profile → API Tokens → **Create Token** → шаардлагатай permissions-тэй үүсгэнэ → token хуулна   |

**Token-д яг юу сонгох вэ:**

- Create Custom Token
- Account → **Cloudflare Pages** → Edit
- Account → **D1** → Edit
- Account → **Workers Scripts** → Edit
- Account → **Workers R2 Storage** → Edit
- Account → **Workers KV Storage** → Edit
- Account → **Account Settings** → Read

---

## 4. Cloudflare Resources — Шинэ төсөл эхлүүлэхэд

Хэрэв төсөл шинээр эхлэж байвал эдгээрийг үүсгэнэ:

| Ресурс            | Юу вэ            | Хэрхэн үүсгэх вэ                                       |
| ----------------- | ---------------- | ------------------------------------------------------ |
| **D1**            | Database         | Dashboard → Workers & Pages → D1 → Create              |
| **R2**            | Файл хадгалах    | R2 → Create bucket (`ebms-contracts`)                  |
| **KV**            | Cache            | Workers & Pages → KV → Create instance                 |
| **Pages project** | Frontend project | Terminal: `npx wrangler pages project create ebms-web` |

ID-уудыг `apps/ebms-worker/wrangler.toml`-д оруулна.

---

## 5. Төслийн бүтэц

```
team-7/
├── apps/
│   ├── ebms-worker/     # API (Hono + GraphQL Yoga)
│   └── ebms-web/        # Frontend (Next.js)
├── docs/
│   └── EBMS-README.md   # Энэ файл
└── package.json
```

---

## 6. Дараагийн алхмууд (Phase 2)

- GraphQL schema дэлгэрүүлэх
- Eligibility engine
- Employee dashboard UI
- HR admin panel
- Auth (Clerk / Auth.js)
