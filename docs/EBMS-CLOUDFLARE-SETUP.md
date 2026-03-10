# EBMS — Cloudflare Setup Guide

Энэ гарын авлага нь EBMS (Employee Benefits Management System) төслийг Cloudflare-тай холбоход шаардлагатай алхмуудыг тайлбарлана.

---

## 1. Шаардлагатай Cloudflare ресурсууд

| Ресурс | Команд | Үр дүн |
|--------|--------|--------|
| **D1 Database** | `wrangler d1 create ebms-db` | `database_id` |
| **R2 Bucket** | `wrangler r2 bucket create ebms-contracts` | Bucket үүснэ |
| **KV Namespace** | `wrangler kv namespace create ELIGIBILITY_CACHE` | `id` |

---

## 2. Local тохиргоо

### 2.1 Wrangler суулгах (глобал)

```bash
npm install -g wrangler
wrangler login
```

### 2.2 D1 үүсгэх

```bash
cd apps/ebms-worker
wrangler d1 create ebms-db
```

Гаралтаас `database_id`-г хуулж `wrangler.toml` дотор тавьна:

```toml
[[d1_databases]]
binding = "DB"
database_name = "ebms-db"
database_id = "<ХУУЛСАН_ID>"
```

### 2.3 R2 bucket үүсгэх

```bash
wrangler r2 bucket create ebms-contracts
```

### 2.4 KV namespace үүсгэх

```bash
wrangler kv namespace create ELIGIBILITY_CACHE
```

Гаралтаас `id`-г хуулж `wrangler.toml` дотор тавьна:

```toml
[[kv_namespaces]]
binding = "ELIGIBILITY_CACHE"
id = "<ХУУЛСАН_ID>"
```

### 2.5 Migration ажиллуулах

```bash
# Local D1 (dev-д)
pnpm --filter ebms-worker db:local

# Remote D1 (production)
pnpm --filter ebms-worker db:migrate
```

> **Анхаар:** `db:migrate` ажиллахын тулд `database_id` `wrangler.toml`-д тохируулагдсан байх ёстой. `db:local` нь `wrangler dev`-ийн local SQLite-д ажиллана.

---

## 3. GitHub Secrets тохиргоо

EBMS deploy workflow ажиллахын тулд дараах secrets-ийг GitHub repo-д тохируулна:

| Secret | Утга | Хэрэглээ |
|--------|------|----------|
| `CF_ACCOUNT_ID` | Cloudflare Account ID | Дэлгэрэнгүй → Account ID |
| `CF_API_TOKEN` | API Token (Workers + Pages + D1 + R2 + KV) | API Tokens → Create Token |

**API Token permission:** Account — Workers R2 Storage, D1, KV Storage Edit, Account Settings Read.

> **Intern Metrics workflow**-д аль хэдийн `CF_ACCOUNT_ID`, `CF_API_TOKEN` ашиглагдаж байгаа бол тэдгээрийг EBMS-д ч ашиглаж болно. KV-д `CF_KV_NAMESPACE_ID` нь зөвхөн intern-metrics-д зориулагдсан.

---

## 4. Cloudflare Pages project үүсгэх

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages**
2. **Create project** → **Direct Upload**
3. Project name: `ebms-web`
4. GitHub Actions-аас deploy хийхдээ энэ нэртэй project олдож deploy хийгдэнэ

---

## 5. Ажиллуулах

```bash
# Dependencies
pnpm install

# Worker (local)
pnpm dev:worker

# Web (local)
pnpm dev:web

# Worker deploy
cd apps/ebms-worker && pnpm deploy

# Migration (remote)
pnpm db:migrate
```

---

## 6. Төслийн бүтэц

```
team-7/
├── apps/
│   ├── ebms-worker/       # Cloudflare Worker (GraphQL API, Eligibility Engine)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   └── db/schema.ts
│   │   ├── drizzle/migrations/
│   │   └── wrangler.toml
│   └── ebms-web/          # Next.js 14 (Cloudflare Pages)
│       └── src/app/
├── .github/workflows/
│   ├── deploy-ebms.yml    # Worker + Pages deploy
│   └── intern-metrics.yml # (өмнөх)
├── docs/
│   └── EBMS-CLOUDFLARE-SETUP.md
└── package.json
```

---

## 7. Дараагийн алхмууд (Phase 1+)

- [ ] GraphQL schema + Hono + graphql-yoga нэмэх
- [ ] Eligibility engine хэрэгжүүлэх
- [ ] Clerk/Auth.js нэвтрэлт холбох
- [ ] Employee dashboard UI хөгжүүлэх
