# EBMS — Тохиргоо ба Ажиллах Принцип

Pinequest S3 Ep1 — Employee Benefits Management System. Энэ документ нь одоогоор юу тохируулагдсан, хэрхэн ажилладаг талаар товч тайлбарлана.

---

## 1. Тохируулсан зүйлсийн хураангуй

| Компонент | Технологи | Төлөв | Үүрэг |
|-----------|-----------|--------|-------|
| **Database** | Cloudflare D1 (SQLite) | ✓ Тохируулагдсан | employees, benefits, eligibility, audit, contracts |
| **Object Storage** | Cloudflare R2 | ✓ Тохируулагдсан | Vendor contract PDF хадгалах |
| **Cache** | Cloudflare KV | ✓ Тохируулагдсан | Eligibility cache (5 мин TTL) |
| **API** | Cloudflare Worker (Hono) | ✓ Ажиллана | REST/GraphQL endpoint |
| **Frontend** | Next.js 14 (Pages) | ✓ Ажиллана | Employee dashboard, HR admin |
| **Deploy** | GitHub Actions | ✓ Тохируулагдсан | Worker + Pages автомат deploy |

---

## 2. wrangler.toml — Worker bindings

```
D1   (DB)             → employees, benefits, eligibility_rules, benefit_requests, contracts, eligibility_audit
R2   (CONTRACTS)      → ebms-contracts bucket (vendor PDF)
KV   (ELIGIBILITY_CACHE) → eligibility cache
Cron → 02:00 UTC өдөр бүр (OKR sync)
```

| Binding | ID/Name | Хэрэглээ |
|---------|---------|----------|
| DB | 139bcf8f-fa56-4d83-b060-b0582c0fd458 | D1 database |
| CONTRACTS | ebms-contracts | R2 bucket |
| ELIGIBILITY_CACHE | 612adff365b747bea1d421bf4899b697 | KV namespace |

---

## 3. Ажиллах зарчим

### 3.1 Local development

```
npm install
npm run login        # Cloudflare нэвтрэх (нэг удаа)
npm run db:migrate   # D1 migration (нэг удаа)
npm run dev:worker   # Worker → http://localhost:8787
npm run dev:web      # Frontend → http://localhost:3000
```

- **Worker:** D1 local simulation (Miniflare), R2/KV Cloudflare-тай холбогдоно
- **Web:** Next.js dev server, API-г `localhost:8787`-д хандана

### 3.2 Production deploy (GitHub Actions)

1. `main` branch дээр push хийх (apps/ebms-worker/** эсвэл apps/ebms-web/** өөрчлөгдсөн)
2. Эсвэл: Actions → Deploy EBMS to Cloudflare → Run workflow
3. Workflow:
   - Worker → `ebms-api.<account>.workers.dev`
   - Frontend → Cloudflare Pages `ebms-web` project

### 3.3 GitHub Secrets (EBMS deploy)

| Secret | Хаанаас авах |
|--------|--------------|
| EBMS_CF_ACCOUNT_ID | Cloudflare Dashboard → баруун sidebar Account ID |
| EBMS_CF_API_TOKEN | Cloudflare → My Profile → API Tokens → Create Token |

---

## 4. Төслийн бүтэц

```
team-7/
├── apps/
│   ├── ebms-worker/          # Cloudflare Worker
│   │   ├── src/
│   │   │   ├── index.ts      # Hono API (/ , /health)
│   │   │   ├── types.ts      # Env (DB, CONTRACTS, ELIGIBILITY_CACHE)
│   │   │   └── db/schema.ts  # Drizzle schema
│   │   ├── drizzle/migrations/0000_init.sql
│   │   └── wrangler.toml
│   └── ebms-web/             # Next.js 14
│       ├── src/app/
│       └── next.config.js    # output: 'export' (static)
├── .github/workflows/
│   ├── deploy-ebms.yml       # EBMS deploy
│   └── intern-metrics.yml    # Intern metrics (өөр workflow)
├── docs/
│   ├── EBMS-SETUP-OVERVIEW.md  # Энэ файл
│   ├── EBMS-CLOUDFLARE-SETUP.md
│   └── TEAM-SETUP.md
└── package.json
```

---

## 5. D1 хүснэгтүүд

| Хүснэгт | Үүрэг |
|---------|-------|
| employees | Ажилчдын профайл, OKR, attendance |
| benefits | Benefit каталог |
| eligibility_rules | Benefit-тэй холбоотой дүрмүүд |
| benefit_eligibility | Тооцоолсон eligibility cache |
| benefit_requests | Benefit хүсэлтүүд |
| contracts | Vendor гэрээний metadata |
| eligibility_audit | Eligibility өөрчлөлтийн log |

---

## 6. Дараагийн алхмууд (Phase 2+) — Setup

### 6.1 GraphQL API (graphql-yoga + Hono)

**Reference:** [GraphQL Yoga + Hono](https://the-guild.dev/graphql/yoga-server/docs/integrations/hono), [Cloudflare Workers](https://the-guild.dev/graphql/yoga-server/docs/integrations/cloudflare-workers)

**Setup:**
```bash
cd apps/ebms-worker
npm install graphql graphql-yoga
```

`apps/ebms-worker/src/index.ts` — Yoga-г Hono-той холбох:
```ts
import { createYoga } from 'graphql-yoga';
// createYoga({ schema }) → app.route('/graphql', yoga)
```

`apps/ebms-worker/src/graphql/schema.ts` — TDD §9 schema (Employee, Benefit, BenefitEligibility, Query, Mutation).

---

### 6.2 Eligibility engine

**Reference:** TDD §5 Benefit Catalog, §6 Eligibility Rule Schema

**Setup:**
- `apps/ebms-worker/src/eligibility/rules.json` — benefit-to-rule mapping
- `apps/ebms-worker/src/eligibility/evaluator.ts` — `evaluate(employee, benefitId) → { status, ruleTrace }`
- Rule types: employment_status, okr_submitted, attendance, responsibility_level, role, tenure_days

---

### 6.3 Employee dashboard UI

**Reference:** TDD §2 FR-01

**Setup:**
```bash
cd apps/ebms-web
npm install @tanstack/react-query  # API дуудлага
```

| Хуудас | Зам | Агуулга |
|--------|-----|---------|
| Dashboard | `/dashboard` | Benefit catalog, status badges (ACTIVE/ELIGIBLE/LOCKED/PENDING) |
| Benefit detail | `/dashboard/benefits/[id]` | Rule breakdown, request button |
| Request flow | `/dashboard/requests` | Pending, contract acceptance |

`apps/ebms-web/src/app/dashboard/page.tsx` — benefit cards, GraphQL `myBenefits` query.

---

### 6.4 HR admin panel

**Reference:** TDD §2 FR-07

**Setup:**
| Хуудас | Зам | Агуулга |
|--------|-----|---------|
| Admin | `/admin` | Employee list, eligibility snapshot |
| Rule config | `/admin/rules` | eligibility_rules editor |
| Audit log | `/admin/audit` | Audit log viewer, filters |
| Override | `/admin/employees/[id]` | Manual override, reason |

`apps/ebms-web/src/app/admin/page.tsx` — HR-only route, `overrideEligibility` mutation.

---

### 6.5 Auth (Clerk / Auth.js)

**Reference:** [Clerk](https://clerk.com/docs), [Auth.js](https://authjs.dev)

**Setup:**
- Clerk: `npm install @clerk/nextjs` — `NEXT_PUBLIC_CLERK_*` env
- JWT → Worker: `Authorization: Bearer <token>` шалгах middleware
- Role claim: `hr_admin`, `finance_manager` → TDD §9.2 Authorization Matrix
