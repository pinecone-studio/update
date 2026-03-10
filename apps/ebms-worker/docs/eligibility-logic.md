# Eligibility & benefit request logic

## 1. Config — нэг эх (single source of truth)

- **eligibility_config** (D1) — HR Rules Configuration UI-аас хадгалагдсан JSON.
- Дотор нь: `benefits` объект, benefit бүрт `rules` (type, operator, value, errorMessage).
- UI-аас өөрчлөгдөхөд **код deploy хийх шаардлагагүй** — дараагийн request/query-д шинэ config ашиглагдана.

## 2. Eligibility хэрхэн тооцоологдох вэ

- **getBenefitEligibility** (myBenefits, Employee.benefits):
  1. **getActiveEligibilityConfig(env)** — идэвхтэй config-ыг D1-ээс уншина.
  2. **getEmployeeForEligibility(env, employeeId)** — ажилтны талбарууд (employmentStatus, okrSubmitted, lateArrivalCount, responsibilityLevel).
  3. Benefit бүрийн хувьд: config-д энэ benefit байгаа бол **evaluateBenefitRules(rules, employee)** дуудаж дүрмүүдийг шалгана.
  4. Дүрэм бүр: `type` → ажилтны талбар, `operator` (eq, lt, gte г.м) + `value`-тай харьцуулна.
  5. Бүх дүрэм давсан → **ELIGIBLE**, нэг ч нь давваагүй → **LOCKED**; үр дүн + ruleEvaluations буцаана.
  6. Config байхгүй эсвэл benefit config-д байхгүй бол **benefit_eligibility** хүснэгт эсвэл default LOCKED ашиглана.

Тиймээс **дүрмийг config-аас уншиж, request цагт шалгадаг** — UI-аас өөрчлөлт орсноор дараагийн тооцоо шинэ дүрмээр явагдана.

## 3. Benefit request ямар үед зөвшөөрөгдөх вэ

- **requestBenefit** mutation:
  - Зөвхөн benefit оршин байгаа эсэх, идэвхтэй эсэхийг шалгана.
  - **Eligibility (LOCKED/ELIGIBLE) шалтгаанаар request-ийг хориглохгүй** — ажилтан үргэлж хүсэлт илгээж болно, HR шалгана.
- Ингэснээр config-аар “lock” болсон ч ажилтан хүсэлт илгээж, HR-ээр шийдвэрлүүлэх боломжтой; код deploy хийх шаардлагагүй.

## 4. Rule type → ажилтны талбар

| Config `type`       | Ажилтны талбар (DB)     |
|---------------------|-------------------------|
| employment_status   | employmentStatus        |
| okr_submitted       | okrSubmitted (0/1 → boolean) |
| attendance          | lateArrivalCount        |
| responsibility_level| responsibilityLevel     |

Operator: `eq`, `lt`, `lte`, `gte`, `gt`.  
`value`: string, number, boolean (JSON-аас).

## 5. Файлууд

- **src/eligibility/engine.ts** — config унших, дүрэм шалгах (getActiveEligibilityConfig, getEmployeeForEligibility, evaluateBenefitRules).
- **src/graphql/resolvers/getBenefitEligibility.ts** — myBenefits/Employee.benefits-д config байвал engine ашиглана.
- **src/graphql/resolvers/mutations/requestBenefit.ts** — eligibility-аар блоклохгүй, зөвхөн benefit оршин байгаа эсэх шалгана.

---

## 6. Ажиллаж байгааг хэрхэн шалгах вэ

### 6.1 Бэлтгэл

1. **Worker + local D1 ажиллуулах**
   ```bash
   cd apps/ebms-worker
   npm run dev
   ```
   API: `http://localhost:8787`

2. **Migration (хэрэв хийгээгүй бол)**
   ```bash
   npm run db:local
   npm run db:local:config
   ```

3. **Өгөгдөл байгаа эсэх**
   - **employees** — дор хаяж нэг мөр (id, employment_status, okr_submitted, late_arrival_count, responsibility_level).
   - **benefits** — дор хаяж нэг benefit (id нь config-ийн key-тэй таарна, жишээ: `gym_pinefit`).
   - **eligibility_config** — нэг идэвхтэй мөр (is_active=1), config_data = `{"benefits":{"<benefit_id>":{"rules":[...]}}}`.

### 6.2 Config (дүрэм) байгаа эсэхийг шалгах

**HR header-тэй** config унших:

```bash
curl -s -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -H "x-employee-id: hr-1" \
  -H "x-role: hr" \
  -d '{"query":"query { getEligibilityRuleConfig { config } }"}'
```

Хариунд `config`-д `benefits` объект гарна (хоосон `{}` эсвэл дүрмтэй).

### 6.3 myBenefits — eligibility тооцоолол

Ажилтны ID-г header-д өгч, myBenefits асууна. Config ба benefit ID таарсан бол дүрмээр **ELIGIBLE** эсвэл **LOCKED** + ruleEvaluations гарна.

```bash
curl -s -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -H "x-employee-id: <таны_employee_id>" \
  -d '{"query":"query { myBenefits { benefit { id name } status ruleEvaluations { ruleType passed reason } computedAt } }"}'
```

Шалгах зүйлс:
- **status** — `ELIGIBLE` эсвэл `LOCKED` (config-ийн rules-ээс).
- **ruleEvaluations** — rule бүрийн passed/reason (дүрэм давсан эсэх).

### 6.4 Request блоклогдохгүй эсэх

LOCKED benefit-д ч request илгээж болно:

```bash
curl -s -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -H "x-employee-id: <employee_id>" \
  -d '{"query":"mutation { requestBenefit(input: { benefitId: \"<benefit_id>\" }) { id status createdAt } }"}'
```

Хариунд `status: PENDING`, `id` гарвал амжилттай — eligibility-аар блоклоогүй.

### 6.5 Config өөрчлөлт (UI-аас) — deploy хэрэггүй эсэх

1. HR Rules Configuration (`/hr_admin/rules-configuration`) хуудаснаас дүрмээ засаад **Save**.
2. Дахин **myBenefits** дуудах — шинэ дүрмээр status + ruleEvaluations гарна.
3. Код өөрчлөх, deploy хийх шаардлагагүй.

### 6.6 Товч шалгалтын дараалал

| Алхам | Юу хийх | Юу харах |
|-------|---------|----------|
| 1 | `getEligibilityRuleConfig` (HR header) | config.benefits байна |
| 2 | `myBenefits` (employee header) | status, ruleEvaluations config-тай нийцнэ |
| 3 | `requestBenefit` (LOCKED benefit-д) | status: PENDING, алдаа гаргахгүй |
| 4 | UI-аас config засаад дахин myBenefits | Шинэ дүрмийн үр дүн |
