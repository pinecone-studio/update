# Contract болон Finance шаардлагатай үед Flow

## Шаардлагууд

| Шаардлага | Эх сурвалж | Тайлбар |
|-----------|------------|---------|
| **financeCheck** | eligibility_config JSON (`benefits[benefitId].financeCheck`) | Benefit-д Finance баталгаажуулалт хэрэгтэй эсэх |
| **requiresContract** | benefits.requires_contract | Benefit-д гэрээ гарын үсэг + upload хэрэгтэй эсэх |

---

## Flow 1: financeCheck = false, requiresContract = false

```
Employee requestBenefit → PENDING
    ↓
Admin/HR confirmBenefitRequest(contractAccepted=true) → APPROVED
    ↓
benefit_eligibility → ACTIVE
```

**Хэн юу хийх:** Admin эсвэл HR нэг алхамаар approve хийнэ.

---

## Flow 2: financeCheck = false, requiresContract = true

```
Employee requestBenefit → PENDING
    ↓
Employee signBenefitContract (гэрээний нөхцөл зөвшөөрнө) → PENDING (contractAcceptedAt set)
    ↓
Admin/HR confirmBenefitRequest(contractAccepted=true) → APPROVED
    ↓
benefit_eligibility → PENDING ("awaiting signed contract upload")
    ↓
Employee archiveBenefitContractPdf (гарын үсэгтэй PDF upload) → ACTIVE
```

**Хэн юу хийх:**
1. Employee: Request → Sign contract (UI-аас гэрээ хараад зөвшөөрнө)
2. Admin/HR: Approve
3. Employee: Signed PDF upload (гарын үсэгтэй гэрээг оруулна)

---

## Flow 3: financeCheck = true, requiresContract = false

```
Employee requestBenefit → PENDING
    ↓
Admin/HR confirmBenefitRequest(contractAccepted=true) → ADMIN_APPROVED
    ↓
Finance confirmBenefitRequest(contractAccepted=true) → APPROVED
    ↓
benefit_eligibility → ACTIVE
```

**Хэн юу хийх:**
1. Admin/HR: Эхний approve (PENDING → ADMIN_APPROVED)
2. Finance: Эцсийн approve (ADMIN_APPROVED → APPROVED)

**Анхаар:** Finance PENDING-д шууд approve хийж болохгүй — "admin must approve first" алдаа гарна.

---

## Flow 4: financeCheck = true, requiresContract = true

```
Employee requestBenefit → PENDING
    ↓
Employee signBenefitContract → PENDING (contractAcceptedAt set)
    ↓
Admin/HR confirmBenefitRequest(contractAccepted=true) → ADMIN_APPROVED
    ↓
Finance confirmBenefitRequest(contractAccepted=true) → APPROVED
    ↓
benefit_eligibility → PENDING ("awaiting signed contract upload")
    ↓
Employee archiveBenefitContractPdf → ACTIVE
```

**Хэн юу хийх:**
1. Employee: Request → Sign contract
2. Admin/HR: Эхний approve
3. Finance: Эцсийн approve
4. Employee: Signed PDF upload

---

## Request status-ийн дараалал

| Status | Тайлбар |
|--------|---------|
| PENDING | Employee хүсэлт илгээсэн, Admin/Finance хүлээж байна |
| ADMIN_APPROVED | Admin approve хийсэн, Finance-д шилжсэн (зөвхөн financeCheck benefit-д) |
| APPROVED | Бүрэн баталгаажсан |
| REJECTED | Татгалзсан |

---

## Contract-тай холбоотой mutation-ууд

| Mutation | Хэн дуудаж болох | Үүрэг |
|----------|------------------|-------|
| **signBenefitContract** | Employee (өөрийн request) | PENDING үед гэрээний нөхцөл зөвшөөрнө |
| **archiveBenefitContractPdf** | Employee эсвэл HR/Admin/Finance | APPROVED үед гарын үсэгтэй PDF upload |

---

## Шалгах дараалал

### financeCheck шалгах
1. Admin benefit нэмэх/засах үед eligibility config-д `financeCheck: true` тохируулна
2. Тухайн benefit-д Employee request илгээнэ
3. Admin approve хийх → ADMIN_APPROVED болно
4. Finance dashboard-д "Awaiting" таб-д гарна
5. Finance approve хийх → APPROVED болно

### requiresContract шалгах
1. Benefit `requiresContract: true` байна
2. Employee request илгээсний дараа Contract task card гарна
3. Employee "Sign contract" дарж signBenefitContract дуудана
4. Admin/Finance approve хийх
5. Employee "Upload signed contract" дарж PDF оруулна
6. archiveBenefitContractPdf дуудагдана → ACTIVE болно

---

## Flow 4 шалгах (financeCheck + requiresContract)

**Бэлтгэл:**
1. Admin → Add Benefit эсвэл одоо байгаа benefit засах
2. **Finance approval** (financeCheck) болон **Vendor contract** (requiresContract) хоёулаа идэвхжүүлнэ
3. Benefit-д active contract тохируулсан байх (Admin → Vendor contracts)

**Алхамууд:**

| # | Хэн | Юу хийх | Хүлээгдэх үр дүн |
|---|-----|---------|------------------|
| 1 | Employee | Benefit request илгээх | PENDING |
| 2 | Employee | Sign contract (гэрээ зөвшөөрөх) | contractAcceptedAt set |
| 3 | Admin | Finance dashboard эсвэл Admin → benefit requests → Approve | ADMIN_APPROVED |
| 4 | Finance | /finance → Awaiting tab → Approve | APPROVED |
| 5 | Employee | Contract task card → "Upload signed PDF" → PDF сонгоод upload | ACTIVE |

**Шалгах цэгүүд:**
- Алхам 3 дараа: Employee notification "Admin Approved — Awaiting Finance"
- Алхам 3 дараа: Finance notification "Payment Approval Required"
- Алхам 4 дараа: Employee notification "Benefit Approved: Upload Signed Contract"
- Алхам 5 дараа: myBenefits дээр benefit ACTIVE, Contract task "Signed contract uploaded"

---

## Flow 4 кодоор шалгасан (Verification)

### Backend — дараалал зөв

| Алхам | Файл | Логик |
|-------|------|-------|
| 1. Request | `requestBenefit.ts` | benefit_requests.status = "pending" |
| 2. Sign | `signBenefitContract.ts` | Зөвхөн status="pending" үед. contractAcceptedAt set |
| 3. Admin approve | `confirmBenefitRequest.ts` | needsFinanceApproval && pending → admin_approved. Finance-д "admin must approve first" |
| 4. Finance approve | `confirmBenefitRequest.ts` | admin_approved + Finance role → approved. benefit_eligibility = "pending" (requiresContract) |
| 5. Upload | `archiveBenefitContractPdf.ts` | Зөвхөн status="approved" үед. benefit_eligibility = "active" |

### Frontend — UI холболт

| Алхам | Компонент | Юу харуулна |
|-------|-----------|--------------|
| 2 | BenefitStatusModal / Request flow | Sign contract → signBenefitContract |
| 3–4 | ContractTaskCard | rawStatus=ADMIN_APPROVED → "Awaiting Finance"; rawStatus=APPROVED → Upload PDF |
| 5 | useEmployeeDashboardData | fetchMyBenefitRequests → APPROVED + requiresContract → upload UI |
| 5 | uploadSignedContractPdf | PDF → base64 → archiveBenefitContractPdf mutation |

### Шалгах дараалал (Manual test)

1. **Бэлтгэл:** Benefit үүсгэх — financeCheck ✓, requiresContract ✓, active contract тохируулсан
2. **Employee:** Request → Sign contract (гэрээ хараад зөвшөөрөх)
3. **Admin:** /admin эсвэл benefit requests → Approve
4. **Шалгах:** Employee dashboard дээр Contract task "Awaiting Finance"
5. **Finance:** /finance → Awaiting tab → Approve
6. **Шалгах:** Contract task "Upload signed PDF" гарна
7. **Employee:** PDF сонгоод Upload → ACTIVE болно
