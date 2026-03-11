import type { GraphQLResolveInfo } from 'graphql';
import type { Ctx } from '../resolvers/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuditEntry = {
  __typename?: 'AuditEntry';
  benefitId: Scalars['ID']['output'];
  computedAt: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  newStatus: Scalars['String']['output'];
  oldStatus?: Maybe<Scalars['String']['output']>;
  triggeredBy?: Maybe<Scalars['String']['output']>;
};

export type AuditFilters = {
  benefitId?: InputMaybe<Scalars['ID']['input']>;
  employeeId?: InputMaybe<Scalars['ID']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
};

export type Benefit = {
  __typename?: 'Benefit';
  activeContract?: Maybe<Contract>;
  category: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  requiresContract: Scalars['Boolean']['output'];
  subsidyPercent: Scalars['Int']['output'];
  vendorName?: Maybe<Scalars['String']['output']>;
};

export type BenefitEligibility = {
  __typename?: 'BenefitEligibility';
  benefit: Benefit;
  computedAt: Scalars['String']['output'];
  ruleEvaluations: Array<RuleEvaluation>;
  status: BenefitStatus;
};

export type BenefitRequest = {
  __typename?: 'BenefitRequest';
  benefitId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  status: RequestStatus;
};

export type BenefitRequestInput = {
  benefitId: Scalars['ID']['input'];
};

export type BenefitStatus =
  | 'ACTIVE'
  | 'ELIGIBLE'
  | 'LOCKED'
  | 'PENDING';

export type Contract = {
  __typename?: 'Contract';
  benefitId: Scalars['ID']['output'];
  effectiveDate?: Maybe<Scalars['String']['output']>;
  expiryDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  version: Scalars['String']['output'];
};

export type CreateBenefitInput = {
  category: Scalars['String']['input'];
  name: Scalars['String']['input'];
  requiresContract?: InputMaybe<Scalars['Boolean']['input']>;
  rules?: InputMaybe<Array<EligibilityRuleInput>>;
  subsidyPercent?: InputMaybe<Scalars['Int']['input']>;
};

export type EligibilityRuleConfig = {
  __typename?: 'EligibilityRuleConfig';
  config: Scalars['String']['output'];
};

export type EligibilityRuleInput = {
  errorMessage?: InputMaybe<Scalars['String']['input']>;
  operator: Scalars['String']['input'];
  type: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Employee = {
  __typename?: 'Employee';
  benefits: Array<BenefitEligibility>;
  employmentStatus: EmploymentStatus;
  id: Scalars['ID']['output'];
  lateArrivalCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  okrSubmitted: Scalars['Boolean']['output'];
  responsibilityLevel: Scalars['Int']['output'];
  role: Scalars['String']['output'];
};

export type EmploymentStatus =
  | 'ACTIVE'
  | 'LEAVE'
  | 'PROBATION'
  | 'TERMINATED';

export type Health = {
  __typename?: 'Health';
  ok: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelBenefitRequest: BenefitRequest;
  confirmBenefitRequest: BenefitRequest;
  createBenefit: Benefit;
  overrideEligibility: BenefitEligibility;
  requestBenefit: BenefitRequest;
  updateEligibilityRuleConfig: EligibilityRuleConfig;
};


export type MutationCancelBenefitRequestArgs = {
  requestId: Scalars['ID']['input'];
};


export type MutationConfirmBenefitRequestArgs = {
  contractAccepted: Scalars['Boolean']['input'];
  requestId: Scalars['ID']['input'];
};


export type MutationCreateBenefitArgs = {
  input: CreateBenefitInput;
};


export type MutationOverrideEligibilityArgs = {
  input: OverrideInput;
};


export type MutationRequestBenefitArgs = {
  input: BenefitRequestInput;
};


export type MutationUpdateEligibilityRuleConfigArgs = {
  config: Scalars['String']['input'];
};

export type OverrideInput = {
  benefitId: Scalars['ID']['input'];
  employeeId: Scalars['ID']['input'];
  expiresAt?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  status: BenefitStatus;
};

export type Query = {
  __typename?: 'Query';
  auditLog: Array<AuditEntry>;
  benefits: Array<Benefit>;
  employee?: Maybe<Employee>;
  employees: Array<Employee>;
  getAvailableRuleAttributes: Array<Scalars['String']['output']>;
  getEligibilityRuleConfig: EligibilityRuleConfig;
  health: Health;
  me: Employee;
  myBenefits: Array<BenefitEligibility>;
};


export type QueryAuditLogArgs = {
  filters: AuditFilters;
};


export type QueryBenefitsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEmployeeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEmployeesArgs = {
  department?: InputMaybe<Scalars['String']['input']>;
  employmentStatus?: InputMaybe<Scalars['String']['input']>;
};

export type RequestStatus =
  | 'APPROVED'
  | 'CANCELLED'
  | 'PENDING'
  | 'REJECTED';

export type RuleEvaluation = {
  __typename?: 'RuleEvaluation';
  passed: Scalars['Boolean']['output'];
  reason: Scalars['String']['output'];
  ruleType: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuditEntry: ResolverTypeWrapper<AuditEntry>;
  AuditFilters: AuditFilters;
  Benefit: ResolverTypeWrapper<Benefit>;
  BenefitEligibility: ResolverTypeWrapper<BenefitEligibility>;
  BenefitRequest: ResolverTypeWrapper<BenefitRequest>;
  BenefitRequestInput: BenefitRequestInput;
  BenefitStatus: BenefitStatus;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Contract: ResolverTypeWrapper<Contract>;
  CreateBenefitInput: CreateBenefitInput;
  EligibilityRuleConfig: ResolverTypeWrapper<EligibilityRuleConfig>;
  EligibilityRuleInput: EligibilityRuleInput;
  Employee: ResolverTypeWrapper<Employee>;
  EmploymentStatus: EmploymentStatus;
  Health: ResolverTypeWrapper<Health>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  OverrideInput: OverrideInput;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RequestStatus: RequestStatus;
  RuleEvaluation: ResolverTypeWrapper<RuleEvaluation>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuditEntry: AuditEntry;
  AuditFilters: AuditFilters;
  Benefit: Benefit;
  BenefitEligibility: BenefitEligibility;
  BenefitRequest: BenefitRequest;
  BenefitRequestInput: BenefitRequestInput;
  Boolean: Scalars['Boolean']['output'];
  Contract: Contract;
  CreateBenefitInput: CreateBenefitInput;
  EligibilityRuleConfig: EligibilityRuleConfig;
  EligibilityRuleInput: EligibilityRuleInput;
  Employee: Employee;
  Health: Health;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  OverrideInput: OverrideInput;
  Query: Record<PropertyKey, never>;
  RuleEvaluation: RuleEvaluation;
  String: Scalars['String']['output'];
};

export type AuditEntryResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['AuditEntry'] = ResolversParentTypes['AuditEntry']> = {
  benefitId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  computedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  newStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  oldStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  triggeredBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type BenefitResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['Benefit'] = ResolversParentTypes['Benefit']> = {
  activeContract?: Resolver<Maybe<ResolversTypes['Contract']>, ParentType, ContextType>;
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requiresContract?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  subsidyPercent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  vendorName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type BenefitEligibilityResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['BenefitEligibility'] = ResolversParentTypes['BenefitEligibility']> = {
  benefit?: Resolver<ResolversTypes['Benefit'], ParentType, ContextType>;
  computedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ruleEvaluations?: Resolver<Array<ResolversTypes['RuleEvaluation']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['BenefitStatus'], ParentType, ContextType>;
};

export type BenefitRequestResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['BenefitRequest'] = ResolversParentTypes['BenefitRequest']> = {
  benefitId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['RequestStatus'], ParentType, ContextType>;
};

export type ContractResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['Contract'] = ResolversParentTypes['Contract']> = {
  benefitId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  effectiveDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiryDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type EligibilityRuleConfigResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['EligibilityRuleConfig'] = ResolversParentTypes['EligibilityRuleConfig']> = {
  config?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type EmployeeResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['Employee'] = ResolversParentTypes['Employee']> = {
  benefits?: Resolver<Array<ResolversTypes['BenefitEligibility']>, ParentType, ContextType>;
  employmentStatus?: Resolver<ResolversTypes['EmploymentStatus'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lateArrivalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  okrSubmitted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  responsibilityLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type HealthResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['Health'] = ResolversParentTypes['Health']> = {
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  cancelBenefitRequest?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationCancelBenefitRequestArgs, 'requestId'>>;
  confirmBenefitRequest?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationConfirmBenefitRequestArgs, 'contractAccepted' | 'requestId'>>;
  createBenefit?: Resolver<ResolversTypes['Benefit'], ParentType, ContextType, RequireFields<MutationCreateBenefitArgs, 'input'>>;
  overrideEligibility?: Resolver<ResolversTypes['BenefitEligibility'], ParentType, ContextType, RequireFields<MutationOverrideEligibilityArgs, 'input'>>;
  requestBenefit?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationRequestBenefitArgs, 'input'>>;
  updateEligibilityRuleConfig?: Resolver<ResolversTypes['EligibilityRuleConfig'], ParentType, ContextType, RequireFields<MutationUpdateEligibilityRuleConfigArgs, 'config'>>;
};

export type QueryResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  auditLog?: Resolver<Array<ResolversTypes['AuditEntry']>, ParentType, ContextType, RequireFields<QueryAuditLogArgs, 'filters'>>;
  benefits?: Resolver<Array<ResolversTypes['Benefit']>, ParentType, ContextType, Partial<QueryBenefitsArgs>>;
  employee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<QueryEmployeeArgs, 'id'>>;
  employees?: Resolver<Array<ResolversTypes['Employee']>, ParentType, ContextType, Partial<QueryEmployeesArgs>>;
  getAvailableRuleAttributes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  getEligibilityRuleConfig?: Resolver<ResolversTypes['EligibilityRuleConfig'], ParentType, ContextType>;
  health?: Resolver<ResolversTypes['Health'], ParentType, ContextType>;
  me?: Resolver<ResolversTypes['Employee'], ParentType, ContextType>;
  myBenefits?: Resolver<Array<ResolversTypes['BenefitEligibility']>, ParentType, ContextType>;
};

export type RuleEvaluationResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['RuleEvaluation'] = ResolversParentTypes['RuleEvaluation']> = {
  passed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ruleType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = Ctx> = {
  AuditEntry?: AuditEntryResolvers<ContextType>;
  Benefit?: BenefitResolvers<ContextType>;
  BenefitEligibility?: BenefitEligibilityResolvers<ContextType>;
  BenefitRequest?: BenefitRequestResolvers<ContextType>;
  Contract?: ContractResolvers<ContextType>;
  EligibilityRuleConfig?: EligibilityRuleConfigResolvers<ContextType>;
  Employee?: EmployeeResolvers<ContextType>;
  Health?: HealthResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RuleEvaluation?: RuleEvaluationResolvers<ContextType>;
};

