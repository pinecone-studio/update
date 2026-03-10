const typeDefs = `
type Employee {
  id: ID!
  email: String!
  name: String
  nameEng: String
  role: String!
  department: String
  responsibilityLevel: Int!
  employmentStatus: String!
  hireDate: String
  okrSubmitted: Int!
  lateArrivalCount: Int!
  lateArrivalUpdatedAt: String
  employeeCode: String
  createdAt: String
  updatedAt: String
}

type Benefit {
  id: ID!
  name: String!
  category: String!
  subsidyPercent: Int!
  vendorName: String
  requiresContract: Boolean!
  activeContractId: String
  isActive: Boolean!
  createdAt: String
  updatedAt: String
}

type EligibilityRule {
  id: ID!
  benefitId: ID!
  ruleType: String!
  operator: String!
  value: String!
  errorMessage: String
  priority: Int!
  isActive: Boolean!
  createdAt: String
  updatedAt: String
}

type BenefitEligibility {
  employeeId: ID!
  benefitId: ID!
  status: String!
  ruleEvaluationJson: String
  computedAt: String!
  overrideBy: String
  overrideReason: String
  overrideExpiresAt: String
}

type Query {
  getEmployeeById(id: ID!): Employee
  getAllEmployees: [Employee!]!
  myBenefits(employeeId: ID!): [BenefitEligibility!]!
  getBenefitsByCategory(category: String!): [Benefit!]!
}
`;
export default typeDefs;
