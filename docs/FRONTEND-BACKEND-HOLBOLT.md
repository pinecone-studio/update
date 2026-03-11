# EBMS — Frontend–Backend холболтын дүгнэлт (дугнэлт)

Team-7 төслийн backend (ebms-worker) болон frontend (ebms-web) хоорондын бүх query/mutation холболт, хийгдсэн өөрчлөлтүүдийн товч дүгнэлт.

---

## 1. Backend API (GraphQL) — бүрэн жагсаалт

### Queries
| Query | Зориулалт | Frontend ашиглалт |
|-------|------------|---------------------|
| `health` | Server эрүүл эсэх | ✅ `/` (root) |
| `me` | Одоогийн ажилтны мэдээлэл + benefits | ✅ Employee: dashboard, myprofile, Header |
| `myBenefits` | Ажилтны benefit eligibility жагсаалт | ✅ Employee: dashboard, benefits |
| `benefits(category?)` | Benefit каталог | ✅ Admin: add-benefit, manual-override |
| `employee(id)` | HR: нэг ажилтны дэлгэрэнгүй | ✅ Admin: employee-eligibility |
| `employees(department?, employmentStatus?)` | HR: ажилтнуудын жагсаалт | ✅ Admin: employee-eligibility |
| `auditLog(filters)` | HR: eligibility audit trail | ✅ Admin: audit-log |
| `getEligibilityRuleConfig` | Eligibility дүрмийн config | ✅ Admin: add-benefit |
| `getAvailableRuleAttributes` | Дүрэмд ашиглах attribute-ууд | ✅ Admin: add-benefit |

### Mutations
| Mutation | Зориулалт | Frontend ашиглалт |
|----------|------------|---------------------|
| `requestBenefit(input)` | Benefit хүсэх | ✅ Employee: dashboard, benefits |
| `confirmBenefitRequest(requestId, contractAccepted)` | Гэрээ баталгаажуулах | ❌ UI-д холбогдоогүй |
| `cancelBenefitRequest(requestId)` | Хүсэлтийг цуцалах | ❌ UI-д холбогдоогүй |
| `overrideEligibility(input)` | HR: eligibility гараар өөрчлөх | ✅ Admin: manual-override |
| `updateEligibilityRuleConfig(config)` | Eligibility config хадгалах | ✅ Admin: add-benefit |
| `createBenefit(input)` | Benefit каталогт нэмэх | ✅ Admin: add-benefit |

---

## 2. Хийгдсэн өөрчлөлтүүд (энэ удаагийн)

### 2.1 Root (`/`)
- **Засвар:** `health` query-д schema-д байхгүй `hello` талбарыг хассан (алдаа засагдсан).
- **Засвар:** GraphQL URL-ийг `NEXT_PUBLIC_API_URL`-аас `/graphql` давхарддаггүй байдлаар тохируулсан.

### 2.2 Employee хэсэг (өмнө нь холбогдсон)
- **`/employee`** — `me`, `myBenefits`, `requestBenefit` (add-benefit-ээс бусад өөрчлөлтгүй).
- **`/employee/benefits`** — `myBenefits`, `requestBenefit`.
- **`/employee/myprofile`** — `me`.
- **Header** — `me` (нэр, initials).

### 2.3 Admin HR API (`admin/_lib/api.ts`) — ШИНЭ
- Нэгдсэн HR client: `getHrClient()` — `x-employee-id: admin`, `x-role: hr`.
- `fetchAuditLog(filters)` → `auditLog(filters)`.
- `fetchEmployees(params?)` → `employees(...)`.
- `fetchEmployee(id)` → `employee(id)` (benefits-тай).
- `fetchBenefitsList(category?)` → `benefits(...)`.
- `overrideEligibility(input)` → `overrideEligibility` mutation.
- `getApiErrorMessage(e)` — алдааны мессеж.

### 2.4 Admin Audit Log (`/admin/audit-log`)
- **Өмнө:** Зөвхөн mock өгөгдөл.
- **Одоо:** `auditLog(filters)` query-тай холбогдсон. Шүүлт: employeeId, benefitId, from, to. "Clear All" ажиллана. Жагсаалт бодит D1 өгөгдлөөс ирнэ.

### 2.5 Admin Employee Eligibility (`/admin/employee-eligibility`)
- **Өмнө:** Mock benefits, нэг жишээ ажилтан.
- **Одоо:** `employees()` — бүх ажилтны жагсаалт, `employee(id)` — сонгосон ажилтны benefit eligibility (status, ruleEvaluations). Search-ээр ID эсвэл нэрээр хайж, сонголтоор дэлгэрэнгүй харна.

### 2.6 Admin Manual Override (`/admin/manual-override`)
- **Өмнө:** Form зөвхөн UI, submit хийгддэггүй.
- **Одоо:** `benefits()` — Benefit сонголтын dropdown бодит каталогоос. Form: employeeId, benefitId, status (ACTIVE/ELIGIBLE/LOCKED/PENDING), reason (min 20 тэмдэгт), expiresAt (заавал биш). Submit → `overrideEligibility(input)` дуудагдана.

### 2.7 Admin Add Benefit (`/admin/add-benefit`) — өмнө нь холбогдсон
- `benefits`, `getEligibilityRuleConfig`, `getAvailableRuleAttributes`, `updateEligibilityRuleConfig`, `createBenefit` — өөрчлөлтгүй.

---

## 3. Одоогоор UI-д ашиглагдаагүй backend API

- **`confirmBenefitRequest`** — ажилтан гэрээ баталгаажуулах flow (жишээ: "My requests" хуудас + Confirm товч).
- **`cancelBenefitRequest`** — хүсэлтийг цуцалах (жишээ: "My requests" хуудас + Cancel товч).

Эдгээрийг дараагийн шатанд "My benefit requests" гэх мэт хуудас нэмж холбож болно.

---

## 4. Frontend-ийн API холболтын байршил

| Хуудас/модуль | API файл | Ашигласан query/mutation |
|----------------|----------|---------------------------|
| `/` | `app/page.tsx` (inline) | `health` |
| `/employee/*` | `app/employee/_lib/api.ts` | `me`, `myBenefits`, `requestBenefit` |
| `/admin/add-benefit` | `app/admin/add-benefit/_lib/api.ts` | `benefits`, `getEligibilityRuleConfig`, `getAvailableRuleAttributes`, `updateEligibilityRuleConfig`, `createBenefit` |
| `/admin/audit-log` | `app/admin/_lib/api.ts` | `auditLog` |
| `/admin/employee-eligibility` | `app/admin/_lib/api.ts` | `employees`, `employee` |
| `/admin/manual-override` | `app/admin/_lib/api.ts` | `benefits`, `overrideEligibility` |

---

## 5. Тохиргоо

- **Backend URL:** `NEXT_PUBLIC_API_URL` (жишээ: `https://xxx.workers.dev/graphql` эсвэл `http://localhost:8787`). Frontend-д `/graphql` давхарддаггүйгээр боловсруулсан.
- **Employee (нэвтрэлтгүй):** `NEXT_PUBLIC_EMPLOYEE_ID` тохируулаагүй бол `emp-1` ашиглагдана.
- **HR/Admin:** Admin хуудсууд `x-employee-id: admin`, `x-role: hr` (эсвэл add-benefit-д `admin`) илгээнэ.

---

## 6. Дүгнэлт

- Backend-ийн **бүх** query болон **ашиглагдах** mutation-ууд frontend-т холбогдсон (confirm/cancel benefit request-ийг эс тооцвол).
- UI/UX өөрчлөгдөөгүй, зөвхөн өгөгдлийн эх сурвалжийг mock-аас GraphQL API руу шилжүүлсэн.
- Дутмаг зүйл: `confirmBenefitRequest`, `cancelBenefitRequest` — дараагийн шатанд "My requests" эсвэл ижил төстэй хуудас нэмж холбож болно.
- Finance хэсэг (`/finance/audit-trail` г.м.) одоогоор mock өгөгдөлтэй; шаардлагатай бол `auditLog`-ийг энд ашиглаж болно.
