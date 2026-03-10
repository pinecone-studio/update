# EBMS — Employee Benefits Management System

Pinequest S3 Ep1 Project 2026. Cloudflare Workers + D1 + R2 + KV + Next.js Pages.

---

## 1. Багийн гишүүд — Анхлан эхлэх (5 алхам)

```bash
git clone https://github.com/pinecone-studio/team-7.git
cd team-7
npm install
npm run login          # Cloudflare нэвтрэх (нэг удаа, браузер нээгдэнэ)
```

**Local ажиллуулах:**

```bash
npm run dev:worker     # API → http://localhost:8787
npm run dev:web        # Frontend → http://localhost:3000
```

> Wrangler global суулгах шаардлагагүй. `npm install`-д wrangler орсон.

---

## 2. Production URLs

| Үйлчилгээ            | URL                                                          |
| -------------------- | ------------------------------------------------------------ |
| **API (Worker)**     | https://ebms-api.myagmartsognnaranbaatar.workers.dev         |
| **GraphQL**          | https://ebms-api.myagmartsognnaranbaatar.workers.dev/graphql |
| **Frontend (Pages)** | Cloudflare Pages → ebms-web project                          |

---

## 3. Deploy (GitHub Actions)

`main` branch руу push хийхэд автоматаар deploy хийгдэнэ.

**GitHub Secrets** (Settings → Secrets and variables → Actions):

| Secret                 | Хаанаас                                            |
| ---------------------- | -------------------------------------------------- |
| **EBMS_CF_ACCOUNT_ID** | Cloudflare Dashboard → баруун sidebar → Account ID |
| **EBMS_CF_API_TOKEN**  | My Profile → API Tokens → Create Token             |

**API Token-д шаардлагатай permissions:**

- Account → **Cloudflare Pages** → Edit
- Account → **D1** → Edit
- Account → **Workers Scripts** → Edit
- Account → **Workers R2 Storage** → Edit
- Account → **Workers KV Storage** → Edit
- Account → **Account Settings** → Read

> Cloudflare Pages → Edit байхгүй бол frontend deploy 403 алдаа гарна.

---

## 4. Cloudflare Resources (шинэ гишүүн тохируулахад)

| Ресурс    | Хаанаас үүсгэх                                           | wrangler.toml                 |
| --------- | -------------------------------------------------------- | ----------------------------- |
| **D1**    | Workers & Pages → D1 → Create                            | `database_id`                 |
| **R2**    | R2 → Create bucket                                       | `bucket_name: ebms-contracts` |
| **KV**    | Workers & Pages → KV → Create                            | `id`                          |
| **Pages** | Workers & Pages → Pages → Create project → Direct Upload | Project: `ebms-web`           |

---

## 5. Төслийн бүтэц

```
team-7/
├── apps/
│   ├── ebms-worker/     # API (Hono + GraphQL Yoga + D1 + R2 + KV)
│   └── ebms-web/        # Frontend (Next.js 14, static export)
├── docs/
│   └── EBMS-README.md   # Энэ файл
└── package.json
```

---

## 6. Дараагийн алхмууд (Phase 2)

- GraphQL schema дэлгэрүүлэх (Employee, Benefit, myBenefits)
- Eligibility engine (дүрмүүд evaluate)
- Employee dashboard UI (`/dashboard`)
- HR admin panel (`/admin`)
- Auth (Clerk / Auth.js)
