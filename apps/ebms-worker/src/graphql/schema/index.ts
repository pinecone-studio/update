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
  }

  type RuleEvaluation {
    ruleType: String!
    passed: Boolean!
    reason: String!
  }

  type Benefit {
    id: ID!
    name: String!
    category: String!
    subsidyPercent: Int!
    requiresContract: Boolean!
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
    getEligibilityRuleConfig: EligibilityRuleConfig!
    getAvailableRuleAttributes: [String!]!
  }

  type Mutation {
    # Employee-only:
    requestBenefit(input: BenefitRequestInput!): BenefitRequest!
    confirmBenefitRequest(requestId: ID!, contractAccepted: Boolean!): BenefitRequest!
    cancelBenefitRequest(requestId: ID!): BenefitRequest!
    overrideEligibility(input: OverrideInput!): BenefitEligibility!
    updateEligibilityRuleConfig(config: String!): EligibilityRuleConfig!
  }
`;
