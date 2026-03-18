# Eligibility & History — хадгалагдах дүрэм

## 1. eligibility_audit хэзээ бичигдэх вэ

| Үйлдэл | Файл | Тайлбар |
|--------|------|---------|
| **HR Override** | overrideEligibility.ts | HR eligibility override хийхэд |
| **Request Approved** | confirmBenefitRequest.ts | Admin/Finance request баталгаажуулах үед |
| **Request Rejected** | confirmBenefitRequest.ts | Admin/Finance request татгалзах үед |
| **Contract Uploaded** | archiveBenefitContractPdf.ts | Employee signed contract upload хийхэд |
| **Contract Expired** | getBenefitEligibility.ts | ACTIVE benefit-ийн contract хугацаа дууссан үед |

## 2. Хадгалах шаардлагагүй

| Үйлдэл | Шалтгаан |
|--------|----------|
| **ELIGIBLE → LOCKED** (request_deadline дууссан) | Rule-based, runtime тооцоолол; түүх хэрэггүй |
| **requestBenefit** (хүсэлт илгээсэн) | benefit_requests-д хадгалагдана; eligibility өөрчлөгдөхгүй |

## 3. Employee History (/employee/history)

- **Өгөгдөл:** fetchMyBenefitRequests + fetchMyAuditLog + fetchBenefits
- **Харуулна:** Benefit requests (PENDING, APPROVED, REJECTED) + eligibility audit (HR Override, Approved, Rejected, Contract Uploaded, Contract Expired)
- **Backend:** benefitRequests (employee filter), myAuditLog (employee filter)

## 4. Finance History (/finance/history)

- **Өгөгдөл:** fetchBenefitRequests + fetchBenefits
- **Харуулна:** APPROVED, REJECTED requests (бүх employee-ийн)
- **Backend:** benefitRequests (finance role — financeCheck benefit-үүд)
- **Ялгаа:** Audit log байхгүй; зөвхөн request түүх
