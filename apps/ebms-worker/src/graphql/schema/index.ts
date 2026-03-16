/**
 * EBMS GraphQL schema — TDD §9
 * typeDefs kept in sync with schema.graphql (codegen uses .graphql file).
 */

export const typeDefs = /* GraphQL */ `
  enum BenefitStatus {
    ACTIVE
    ELIGIBLE
    LOCKED
    PENDING
    REJECTED
  }

  enum RequestStatus {
    PENDING
    APPROVED
    REJECTED
    CANCELLED
  }

  enum EmploymentStatus {
    ACTIVE
    PROBATION
    LEAVE
    TERMINATED
  }

  type Health {
    ok: Boolean!
    timestamp: String!
  }

  type Employee {
    id: ID!
    name: String!
    role: String!
    responsibilityLevel: Int!
    employmentStatus: EmploymentStatus!
    okrSubmitted: Boolean!
    lateArrivalCount: Int!
    benefits: [BenefitEligibility!]!
  }

  type BenefitEligibility {
    benefit: Benefit!
    status: BenefitStatus!
    ruleEvaluations: [RuleEvaluation!]!
    computedAt: String!
    rejectedReason: String
  }

  type RuleEvaluation {
    ruleType: String!
    passed: Boolean!
    reason: String!
  }

  type Benefit {
    id: ID!
    name: String!
    description: String
    category: String!
    subsidyPercent: Int!
    requiresContract: Boolean!
    vendorName: String
    activeContract: Contract
  }

  type Contract {
    id: ID!
    benefitId: ID!
    version: String!
    effectiveDate: String
    expiryDate: String
  }

  input BenefitRequestInput {
    benefitId: ID!
  }

  type BenefitRequest {
    id: ID!
    employeeId: ID!
    benefitId: ID!
    status: RequestStatus!
    createdAt: String!
    employeeName: String
    benefitName: String
    rejectReason: String
    contractVersionAccepted: String
    contractAcceptedAt: String
    requiresContract: Boolean!
    contractId: ID
    contractTemplateUrl: String
  }

  type ContractTemplate {
    requestId: ID!
    benefitId: ID!
    contractId: ID
    contractVersion: String
    requiresContract: Boolean!
    html: String!
  }

  type ContractPreview {
    benefitId: ID!
    contractId: ID
    contractVersion: String
    requiresContract: Boolean!
    html: String!
  }

  type SwitchUserOption {
    id: ID!
    name: String!
    role: String!
  }

  type AdminContract {
    id: ID!
    benefitId: ID!
    benefitName: String
    vendorName: String
    version: String
    effectiveDate: String
    expiryDate: String
    isActive: Boolean!
    r2ObjectKey: String
    createdAt: String
    updatedAt: String
    employeeName: String
    downloadUrl: String!
  }

  input UploadAdminContractInput {
    benefitId: ID!
    version: String!
    vendorName: String
    effectiveDate: String
    expiryDate: String
    fileName: String!
    fileBase64: String!
    contentType: String
  }

  type UploadAdminContractPayload {
    ok: Boolean!
    contract: AdminContract!
  }

  type ArchiveBenefitContractPdfPayload {
    ok: Boolean!
    requestId: ID!
    objectKey: String!
    uploadedAt: String!
  }

  input AuditFilters {
    employeeId: ID
    benefitId: ID
    from: String
    to: String
  }

  type AuditEntry {
    id: ID!
    employeeId: ID!
    benefitId: ID!
    oldStatus: String
    newStatus: String!
    computedAt: String!
    triggeredBy: String
    createdAt: String!
  }

  input OverrideInput {
    employeeId: ID!
    benefitId: ID!
    status: BenefitStatus!
    reason: String
    expiresAt: String
  }

  input EligibilityRuleInput {
    type: String!
    operator: String!
    value: String!
    errorMessage: String
  }

  input CreateBenefitInput {
    name: String!
    description: String
    category: String!
    subsidyPercent: Int
    requiresContract: Boolean
    rules: [EligibilityRuleInput!]
  }

  input UpdateBenefitInput {
    id: ID!
    name: String!
    description: String
    category: String!
    subsidyPercent: Int!
    requiresContract: Boolean!
  }

  type EligibilityRuleConfig {
    config: String!
  }

  type Query {
    health: Health!
    me: Employee!
    myBenefits: [BenefitEligibility!]!
    benefits(category: String): [Benefit!]!
    employee(id: ID!): Employee
    employees(department: String, employmentStatus: String): [Employee!]!
    auditLog(filters: AuditFilters!): [AuditEntry!]!
    benefitRequests(status: RequestStatus): [BenefitRequest!]!
    benefitRequestContractTemplate(requestId: ID!): ContractTemplate!
    benefitContractPreview(benefitId: ID!): ContractPreview!
    getEligibilityRuleConfig: EligibilityRuleConfig!
    getAvailableRuleAttributes: [String!]!
    userOptions: [SwitchUserOption!]!
    adminContracts(tab: String!): [AdminContract!]!
  }

  type Mutation {
    # Employee-only:
    requestBenefit(input: BenefitRequestInput!): BenefitRequest!
    signBenefitContract(requestId: ID!): BenefitRequest!
    confirmBenefitRequest(requestId: ID!, contractAccepted: Boolean!, rejectReason: String): BenefitRequest!
    cancelBenefitRequest(requestId: ID!): BenefitRequest!
    overrideEligibility(input: OverrideInput!): BenefitEligibility!
    updateEligibilityRuleConfig(config: String!): EligibilityRuleConfig!
    createBenefit(input: CreateBenefitInput!): Benefit!
    updateBenefit(input: UpdateBenefitInput!): Benefit!
    deleteBenefit(id: ID!): Boolean!
    uploadAdminContract(input: UploadAdminContractInput!): UploadAdminContractPayload!
    archiveBenefitContractPdf(requestId: ID!, html: String): ArchiveBenefitContractPdfPayload!
  }
`;
