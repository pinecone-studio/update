/**
 * EBMS GraphQL schema — TDD §9
 *
 * Keep typeDefs separate from resolvers to match pinecone-monorepo structure.
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

  type Health {
    ok: Boolean!
    timestamp: String!
  }

  type Employee {
    id: ID!
    email: String!
    name: String
    role: String!
    responsibilityLevel: Int!
    employmentStatus: String!
    okrSubmitted: Boolean!
    lateArrivalCount: Int!
  }

  type Benefit {
    id: ID!
    name: String!
    category: String!
    subsidyPercent: Int!
    vendorName: String
    requiresContract: Boolean!
    isActive: Boolean!
  }

  type RuleEvaluation {
    ruleType: String!
    passed: Boolean!
    reason: String!
  }

  type BenefitEligibility {
    benefit: Benefit!
    status: BenefitStatus!
    ruleEvaluations: [RuleEvaluation!]!
    computedAt: String!
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

  type Query {
    health: Health!
    # Employee-only:
    me: Employee!
    myBenefits: [BenefitEligibility!]!
    benefits(category: String): [Benefit!]!
  }

  type Mutation {
    # Employee-only:
    requestBenefit(input: BenefitRequestInput!): BenefitRequest!
    cancelBenefitRequest(requestId: ID!): BenefitRequest!
  }
`;

