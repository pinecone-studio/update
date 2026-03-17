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

| Config `type`        | Ажилтны талбар (DB)          |
| -------------------- | ---------------------------- |
| employment_status    | employmentStatus             |
| okr_submitted        | okrSubmitted (0/1 → boolean) |
| attendance           | lateArrivalCount             |
| responsibility_level | responsibilityLevel          |

Operator: `eq`, `lt`, `lte`, `gte`, `gt`.  
`value`: string, number, boolean (JSON-аас).

## 5. Benefit нэмэх (createBenefit)

- **createBenefit(input: CreateBenefitInput!): Benefit!** — хэн ч дуудаж болно (role шалгалтгүй). Нэг mutation-аар:
  1. **Catalog** — `benefits` хүснэгтэд шинэ benefit оруулна (id = нэрнээс slug, жишээ: "Gym Pinefit" → `gym_pinefit`).
  2. **Rules config** — идэвхтэй `eligibility_config`-ийн JSON-д `benefits[id]` нэмнэ (name, category, subsidyPercent, requiresContract, rules).
- Catalog болон rules config-ийн benefit **нэг id-аар таарна** — eligibility тооцоолох үед catalog-ийн benefit id-аар config-аас rules хайгдана.
- Input: `name`, `category`, `subsidyPercent` (optional), `requiresContract` (optional), `rules` (optional — EligibilityRuleInput[]).

## 6. Файлууд

- **src/eligibility/engine.ts** — config унших, дүрэм шалгах (getActiveEligibilityConfig, getEmployeeForEligibility, evaluateBenefitRules).
- **src/graphql/resolvers/getBenefitEligibility.ts** — myBenefits/Employee.benefits-д config байвал engine ашиглана.
- **src/graphql/resolvers/mutations/requestBenefit.ts** — eligibility-аар блоклохгүй, зөвхөн benefit оршин байгаа эсэх шалгана.
- **src/graphql/resolvers/mutations/createBenefit.ts** — catalog + rules config-д benefit нэмнэ (role шалгалтгүй).

---

## 7. Create benefit mutation хэрхэн нэмэх (заавар)

Шинэ mutation нэмэхдээ дараах алхмуудыг дагана.

### 7.1 GraphQL schema нэмэх

**Файл:** `src/graphql/schema/schema.graphql` (мөн `src/graphql/schema/index.ts`-ийг ижил агуулгаар шинэчилнэ)

1. **Input type** — mutation-д орж ирэх оролтын төрөл:

   ```graphql
   input EligibilityRuleInput {
     type: String!
     operator: String!
     value: String!
     errorMessage: String
   }

   input CreateBenefitInput {
     name: String!
     category: String!
     subsidyPercent: Int
     requiresContract: Boolean
     rules: [EligibilityRuleInput!]
   }
   ```

2. **Mutation** — `type Mutation` дотор нэмнэ:
   ```graphql
   createBenefit(input: CreateBenefitInput!): Benefit!
   ```

### 7.2 Resolver файл үүсгэх

**Файл:** `src/graphql/resolvers/mutations/createBenefit.ts`

1. **Import** — context, getDb, schema (benefits, eligibilityConfig), GraphQLError.
2. **ID үүсгэх** — нэрнээс slug (жишээ: "Gym Pinefit" → `gym_pinefit`). Ижил id байвал `_1`, `_2` гэж нэмнэ.
3. **Catalog** — `benefits` хүснэгтэд `insert`: id, name, category, subsidyPercent, requiresContract, isActive=1, createdAt/updatedAt.
4. **Rules config** — идэвхтэй `eligibility_config`-ийн JSON-г уншиж, `benefits[benefitId]` нэмээд шинэ мөр `insert`, хуучин идэвхтэйг `is_active=0` болгоно.
5. **Буцаах** — `{ id, name, category, subsidyPercent, requiresContract, activeContractId: null }` (Benefit type-д таарна).
6. **Эрх** — role шалгалтгүй; хэн ч benefit нэмж болно.

### 7.3 Resolver бүртгэх

- **Export:** `src/graphql/resolvers/mutations/index.ts`-д `export * from './createBenefit';` нэмнэ.
- **Resolvers** — `resolvers/index.ts`-д `Mutation` объект нь `import * as Mutation from './mutations'`-аар бүх mutation-уудыг авдаг тул нэмэлт код хэрэггүй.

### 7.4 Codegen ажиллуулах

Schema өөрчлөгдсөний дараа TypeScript type-уудыг дахин үүсгэнэ:

```bash
cd apps/ebms-worker
npm run graphql:generate
```

Үр дүн: `src/graphql/generated/graphql.ts`-д `CreateBenefitInput`, `MutationResolvers['createBenefit']` гэх мэт гарна.

### 7.5 Client-аас дуудах хэлбэр (GraphQL document)

Mutation нь **input** variable авдаг. Зурган дээрх бүтэц (name, category, subsidyPercent, requiresContract, rules) нь `CreateBenefitInput`-д тохирно:

```graphql
mutation createBenefit($input: CreateBenefitInput!) {
  createBenefit(input: $input) {
    id
    name
    category
    subsidyPercent
    requiresContract
  }
}
```

Variables (жишээ):

```json
{
  "input": {
    "name": "Gym Pinefit",
    "category": "wellness",
    "subsidyPercent": 50,
    "requiresContract": false,
    "rules": [
      {
        "type": "employment_status",
        "operator": "eq",
        "value": "active",
        "errorMessage": "Зөвхөн идэвхтэй"
      }
    ]
  }
}
```

### 7.6 Дуудах жишээ (curl)

```bash
curl -s -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateBenefit($input: CreateBenefitInput!) { createBenefit(input: $input) { id name category subsidyPercent requiresContract } }",
    "variables": {
      "input": {
        "name": "Gym Pinefit",
        "category": "wellness",
        "subsidyPercent": 50,
        "requiresContract": false,
        "rules": [
          { "type": "employment_status", "operator": "eq", "value": "active", "errorMessage": "Зөвхөн идэвхтэй" }
        ]
      }
    }
  }'
```

---

## 8. Ажиллаж байгааг хэрхэн шалгах вэ

### 8.1 Бэлтгэл

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

### 8.2 Config (дүрэм) байгаа эсэхийг шалгах

**HR header-тэй** config унших:

```bash
curl -s -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -H "x-employee-id: hr-1" \
  -H "x-role: hr" \
  -d '{"query":"query { getEligibilityRuleConfig { config } }"}'
```

Хариунд `config`-д `benefits` объект гарна (хоосон `{}` эсвэл дүрмтэй).

### 8.3 myBenefits — eligibility тооцоолол

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

### 8.4 Request блоклогдохгүй эсэх

LOCKED benefit-д ч request илгээж болно:

```bash
curl -s -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -H "x-employee-id: <employee_id>" \
  -d '{"query":"mutation { requestBenefit(input: { benefitId: \"<benefit_id>\" }) { id status createdAt } }"}'
```

Хариунд `status: PENDING`, `id` гарвал амжилттай — eligibility-аар блоклоогүй.

### 8.5 Config өөрчлөлт (UI-аас) — deploy хэрэггүй эсэх

1. HR Rules Configuration (`/hr_admin/rules-configuration`) хуудаснаас дүрмээ засаад **Save**.
2. Дахин **myBenefits** дуудах — шинэ дүрмээр status + ruleEvaluations гарна.
3. Код өөрчлөх, deploy хийх шаардлагагүй.

### 8.6 Товч шалгалтын дараалал

| Алхам | Юу хийх                                | Юу харах                                  |
| ----- | -------------------------------------- | ----------------------------------------- |
| 1     | `getEligibilityRuleConfig` (HR header) | config.benefits байна                     |
| 2     | `myBenefits` (employee header)         | status, ruleEvaluations config-тай нийцнэ |
| 3     | `requestBenefit` (LOCKED benefit-д)    | status: PENDING, алдаа гаргахгүй          |
| 4     | UI-аас config засаад дахин myBenefits  | Шинэ дүрмийн үр дүн                       |
