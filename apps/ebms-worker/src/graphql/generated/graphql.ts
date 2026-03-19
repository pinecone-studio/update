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

export type AdminContract = {
  __typename?: 'AdminContract';
  benefitId: Scalars['ID']['output'];
  benefitName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  downloadUrl: Scalars['String']['output'];
  effectiveDate?: Maybe<Scalars['String']['output']>;
  employeeName?: Maybe<Scalars['String']['output']>;
  expiryDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  r2ObjectKey?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  vendorName?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type ArchiveBenefitContractPdfPayload = {
  __typename?: 'ArchiveBenefitContractPdfPayload';
  objectKey: Scalars['String']['output'];
  ok: Scalars['Boolean']['output'];
  requestId: Scalars['ID']['output'];
  uploadedAt: Scalars['String']['output'];
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
  ruleTraceJson?: Maybe<Scalars['String']['output']>;
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
  /** ISO date — after this benefit becomes LOCKED for everyone */
  requestDeadline?: Maybe<Scalars['String']['output']>;
  requiresContract: Scalars['Boolean']['output'];
  subsidyPercent: Scalars['Int']['output'];
  /** Max uses per period (default 1) */
  usageLimitCount: Scalars['Int']['output'];
  /** Period for usage limit: month | year */
  usageLimitPeriod?: Maybe<Scalars['String']['output']>;
  vendorName?: Maybe<Scalars['String']['output']>;
};

export type BenefitEligibility = {
  __typename?: 'BenefitEligibility';
  benefit: Benefit;
  computedAt: Scalars['String']['output'];
  overrideApplied: Scalars['Boolean']['output'];
  overrideReason?: Maybe<Scalars['String']['output']>;
  /** When status is PENDING: 'admin' or 'finance' — who must approve next */
  pendingApprovalBy?: Maybe<Scalars['String']['output']>;
  rejectedReason?: Maybe<Scalars['String']['output']>;
  ruleEvaluations: Array<RuleEvaluation>;
  status: BenefitStatus;
  /** When status is ACTIVE and contract was uploaded: request ID to view/download contract */
  uploadedContractRequestId?: Maybe<Scalars['String']['output']>;
};

export type BenefitRequest = {
  __typename?: 'BenefitRequest';
  benefitId: Scalars['ID']['output'];
  benefitName?: Maybe<Scalars['String']['output']>;
  contractAcceptedAt?: Maybe<Scalars['String']['output']>;
  contractId?: Maybe<Scalars['ID']['output']>;
  contractTemplateUrl?: Maybe<Scalars['String']['output']>;
  contractVersionAccepted?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['ID']['output'];
  employeeName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  rejectReason?: Maybe<Scalars['String']['output']>;
  requiresContract: Scalars['Boolean']['output'];
  reviewedBy?: Maybe<Scalars['String']['output']>;
  reviewedByName?: Maybe<Scalars['String']['output']>;
  status: RequestStatus;
};

export type BenefitRequestInput = {
  benefitId: Scalars['ID']['input'];
};

export type BenefitStatus =
  | 'ACTIVE'
  | 'ELIGIBLE'
  | 'LOCKED'
  | 'PENDING'
  | 'REJECTED';

export type Contract = {
  __typename?: 'Contract';
  benefitId: Scalars['ID']['output'];
  effectiveDate?: Maybe<Scalars['String']['output']>;
  expiryDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  version: Scalars['String']['output'];
};

export type ContractPreview = {
  __typename?: 'ContractPreview';
  benefitId: Scalars['ID']['output'];
  contractId?: Maybe<Scalars['ID']['output']>;
  contractVersion?: Maybe<Scalars['String']['output']>;
  html: Scalars['String']['output'];
  requiresContract: Scalars['Boolean']['output'];
};

export type ContractTemplate = {
  __typename?: 'ContractTemplate';
  benefitId: Scalars['ID']['output'];
  contractId?: Maybe<Scalars['ID']['output']>;
  contractVersion?: Maybe<Scalars['String']['output']>;
  html: Scalars['String']['output'];
  requestId: Scalars['ID']['output'];
  requiresContract: Scalars['Boolean']['output'];
};

export type CreateBenefitInput = {
  category: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  /** ISO date — after this benefit becomes LOCKED */
  requestDeadline?: InputMaybe<Scalars['String']['input']>;
  requiresContract?: InputMaybe<Scalars['Boolean']['input']>;
  rules?: InputMaybe<Array<EligibilityRuleInput>>;
  subsidyPercent?: InputMaybe<Scalars['Int']['input']>;
  /** Max uses per period (default 1) */
  usageLimitCount?: InputMaybe<Scalars['Int']['input']>;
  /** Period: month | year */
  usageLimitPeriod?: InputMaybe<Scalars['String']['input']>;
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

export type EmployeeNotification = {
  __typename?: 'EmployeeNotification';
  body: Scalars['String']['output'];
  channel: NotificationChannel;
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  tone: NotificationTone;
  type: NotificationType;
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
  archiveBenefitContractPdf: ArchiveBenefitContractPdfPayload;
  cancelBenefitRequest: BenefitRequest;
  confirmBenefitRequest: BenefitRequest;
  createBenefit: Benefit;
  deleteBenefit: Scalars['Boolean']['output'];
  markAllNotificationsRead: Scalars['Boolean']['output'];
  markNotificationRead: EmployeeNotification;
  overrideEligibility: BenefitEligibility;
  requestBenefit: BenefitRequest;
  signBenefitContract: BenefitRequest;
  updateBenefit: Benefit;
  updateEligibilityRuleConfig: EligibilityRuleConfig;
  uploadAdminContract: UploadAdminContractPayload;
};


export type MutationArchiveBenefitContractPdfArgs = {
  html?: InputMaybe<Scalars['String']['input']>;
  requestId: Scalars['ID']['input'];
};


export type MutationCancelBenefitRequestArgs = {
  requestId: Scalars['ID']['input'];
};


export type MutationConfirmBenefitRequestArgs = {
  contractAccepted: Scalars['Boolean']['input'];
  rejectReason?: InputMaybe<Scalars['String']['input']>;
  requestId: Scalars['ID']['input'];
};


export type MutationCreateBenefitArgs = {
  input: CreateBenefitInput;
};


export type MutationDeleteBenefitArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMarkNotificationReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationOverrideEligibilityArgs = {
  input: OverrideInput;
};


export type MutationRequestBenefitArgs = {
  input: BenefitRequestInput;
};


export type MutationSignBenefitContractArgs = {
  requestId: Scalars['ID']['input'];
};


export type MutationUpdateBenefitArgs = {
  input: UpdateBenefitInput;
};


export type MutationUpdateEligibilityRuleConfigArgs = {
  config: Scalars['String']['input'];
};


export type MutationUploadAdminContractArgs = {
  input: UploadAdminContractInput;
};

export type NotificationChannel =
  | 'EMAIL'
  | 'IN_APP';

export type NotificationTone =
  | 'INFO'
  | 'NEUTRAL'
  | 'SUCCESS'
  | 'WARNING';

export type NotificationType =
  | 'ELIGIBILITY_CHANGE'
  | 'REQUEST_STATUS'
  | 'WARNING';

export type OverrideInput = {
  benefitId: Scalars['ID']['input'];
  employeeId: Scalars['ID']['input'];
  expiresAt?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  status: BenefitStatus;
};

export type Query = {
  __typename?: 'Query';
  adminContracts: Array<AdminContract>;
  auditLog: Array<AuditEntry>;
  benefitContractPreview: ContractPreview;
  benefitRequestContractTemplate: ContractTemplate;
  benefitRequests: Array<BenefitRequest>;
  benefits: Array<Benefit>;
  employee?: Maybe<Employee>;
  employees: Array<Employee>;
  getAvailableRuleAttributes: Array<Scalars['String']['output']>;
  getEligibilityRuleConfig: EligibilityRuleConfig;
  health: Health;
  me: Employee;
  myAuditLog: Array<AuditEntry>;
  myBenefits: Array<BenefitEligibility>;
  myNotifications: Array<EmployeeNotification>;
  userOptions: Array<SwitchUserOption>;
};


export type QueryAdminContractsArgs = {
  tab: Scalars['String']['input'];
};


export type QueryAuditLogArgs = {
  filters: AuditFilters;
};


export type QueryBenefitContractPreviewArgs = {
  benefitId: Scalars['ID']['input'];
};


export type QueryBenefitRequestContractTemplateArgs = {
  requestId: Scalars['ID']['input'];
};


export type QueryBenefitRequestsArgs = {
  status?: InputMaybe<RequestStatus>;
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


export type QueryMyAuditLogArgs = {
  filters: AuditFilters;
};


export type QueryMyNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  unreadOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RequestStatus =
  | 'ADMIN_APPROVED'
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

export type SwitchUserOption = {
  __typename?: 'SwitchUserOption';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type UpdateBenefitInput = {
  category: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  requestDeadline?: InputMaybe<Scalars['String']['input']>;
  requiresContract: Scalars['Boolean']['input'];
  subsidyPercent: Scalars['Int']['input'];
  usageLimitCount?: InputMaybe<Scalars['Int']['input']>;
  usageLimitPeriod?: InputMaybe<Scalars['String']['input']>;
};

export type UploadAdminContractInput = {
  benefitId: Scalars['ID']['input'];
  contentType?: InputMaybe<Scalars['String']['input']>;
  effectiveDate?: InputMaybe<Scalars['String']['input']>;
  expiryDate?: InputMaybe<Scalars['String']['input']>;
  fileBase64: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  vendorName?: InputMaybe<Scalars['String']['input']>;
  version: Scalars['String']['input'];
};

export type UploadAdminContractPayload = {
  __typename?: 'UploadAdminContractPayload';
  contract: AdminContract;
  ok: Scalars['Boolean']['output'];
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
  AdminContract: ResolverTypeWrapper<AdminContract>;
  ArchiveBenefitContractPdfPayload: ResolverTypeWrapper<ArchiveBenefitContractPdfPayload>;
  AuditEntry: ResolverTypeWrapper<AuditEntry>;
  AuditFilters: AuditFilters;
  Benefit: ResolverTypeWrapper<Benefit>;
  BenefitEligibility: ResolverTypeWrapper<BenefitEligibility>;
  BenefitRequest: ResolverTypeWrapper<BenefitRequest>;
  BenefitRequestInput: BenefitRequestInput;
  BenefitStatus: BenefitStatus;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Contract: ResolverTypeWrapper<Contract>;
  ContractPreview: ResolverTypeWrapper<ContractPreview>;
  ContractTemplate: ResolverTypeWrapper<ContractTemplate>;
  CreateBenefitInput: CreateBenefitInput;
  EligibilityRuleConfig: ResolverTypeWrapper<EligibilityRuleConfig>;
  EligibilityRuleInput: EligibilityRuleInput;
  Employee: ResolverTypeWrapper<Employee>;
  EmployeeNotification: ResolverTypeWrapper<EmployeeNotification>;
  EmploymentStatus: EmploymentStatus;
  Health: ResolverTypeWrapper<Health>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  NotificationChannel: NotificationChannel;
  NotificationTone: NotificationTone;
  NotificationType: NotificationType;
  OverrideInput: OverrideInput;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RequestStatus: RequestStatus;
  RuleEvaluation: ResolverTypeWrapper<RuleEvaluation>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SwitchUserOption: ResolverTypeWrapper<SwitchUserOption>;
  UpdateBenefitInput: UpdateBenefitInput;
  UploadAdminContractInput: UploadAdminContractInput;
  UploadAdminContractPayload: ResolverTypeWrapper<UploadAdminContractPayload>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AdminContract: AdminContract;
  ArchiveBenefitContractPdfPayload: ArchiveBenefitContractPdfPayload;
  AuditEntry: AuditEntry;
  AuditFilters: AuditFilters;
  Benefit: Benefit;
  BenefitEligibility: BenefitEligibility;
  BenefitRequest: BenefitRequest;
  BenefitRequestInput: BenefitRequestInput;
  Boolean: Scalars['Boolean']['output'];
  Contract: Contract;
  ContractPreview: ContractPreview;
  ContractTemplate: ContractTemplate;
  CreateBenefitInput: CreateBenefitInput;
  EligibilityRuleConfig: EligibilityRuleConfig;
  EligibilityRuleInput: EligibilityRuleInput;
  Employee: Employee;
  EmployeeNotification: EmployeeNotification;
  Health: Health;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  OverrideInput: OverrideInput;
  Query: Record<PropertyKey, never>;
  RuleEvaluation: RuleEvaluation;
  String: Scalars['String']['output'];
  SwitchUserOption: SwitchUserOption;
  UpdateBenefitInput: UpdateBenefitInput;
  UploadAdminContractInput: UploadAdminContractInput;
  UploadAdminContractPayload: UploadAdminContractPayload;
};

export type AdminContractResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['AdminContract'] = ResolversParentTypes['AdminContract']> = {
  benefitId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  benefitName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  downloadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  effectiveDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  employeeName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiryDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  r2ObjectKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendorName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type ArchiveBenefitContractPdfPayloadResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['ArchiveBenefitContractPdfPayload'] = ResolversParentTypes['ArchiveBenefitContractPdfPayload']> = {
  objectKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  requestId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  uploadedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type AuditEntryResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['AuditEntry'] = ResolversParentTypes['AuditEntry']> = {
  benefitId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  computedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  newStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  oldStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ruleTraceJson?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  triggeredBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type BenefitResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['Benefit'] = ResolversParentTypes['Benefit']> = {
  activeContract?: Resolver<Maybe<ResolversTypes['Contract']>, ParentType, ContextType>;
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestDeadline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requiresContract?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  subsidyPercent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  usageLimitCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  usageLimitPeriod?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendorName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type BenefitEligibilityResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['BenefitEligibility'] = ResolversParentTypes['BenefitEligibility']> = {
  benefit?: Resolver<ResolversTypes['Benefit'], ParentType, ContextType>;
  computedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  overrideApplied?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  overrideReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pendingApprovalBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rejectedReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ruleEvaluations?: Resolver<Array<ResolversTypes['RuleEvaluation']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['BenefitStatus'], ParentType, ContextType>;
  uploadedContractRequestId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type BenefitRequestResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['BenefitRequest'] = ResolversParentTypes['BenefitRequest']> = {
  benefitId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  benefitName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contractAcceptedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contractId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  contractTemplateUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contractVersionAccepted?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  employeeName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rejectReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requiresContract?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reviewedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reviewedByName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['RequestStatus'], ParentType, ContextType>;
};

export type ContractResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['Contract'] = ResolversParentTypes['Contract']> = {
  benefitId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  effectiveDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiryDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ContractPreviewResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['ContractPreview'] = ResolversParentTypes['ContractPreview']> = {
  benefitId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  contractId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  contractVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  html?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requiresContract?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type ContractTemplateResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['ContractTemplate'] = ResolversParentTypes['ContractTemplate']> = {
  benefitId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  contractId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  contractVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  html?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  requiresContract?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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

export type EmployeeNotificationResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['EmployeeNotification'] = ResolversParentTypes['EmployeeNotification']> = {
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  channel?: Resolver<ResolversTypes['NotificationChannel'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tone?: Resolver<ResolversTypes['NotificationTone'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NotificationType'], ParentType, ContextType>;
};

export type HealthResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['Health'] = ResolversParentTypes['Health']> = {
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  archiveBenefitContractPdf?: Resolver<ResolversTypes['ArchiveBenefitContractPdfPayload'], ParentType, ContextType, RequireFields<MutationArchiveBenefitContractPdfArgs, 'requestId'>>;
  cancelBenefitRequest?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationCancelBenefitRequestArgs, 'requestId'>>;
  confirmBenefitRequest?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationConfirmBenefitRequestArgs, 'contractAccepted' | 'requestId'>>;
  createBenefit?: Resolver<ResolversTypes['Benefit'], ParentType, ContextType, RequireFields<MutationCreateBenefitArgs, 'input'>>;
  deleteBenefit?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBenefitArgs, 'id'>>;
  markAllNotificationsRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  markNotificationRead?: Resolver<ResolversTypes['EmployeeNotification'], ParentType, ContextType, RequireFields<MutationMarkNotificationReadArgs, 'id'>>;
  overrideEligibility?: Resolver<ResolversTypes['BenefitEligibility'], ParentType, ContextType, RequireFields<MutationOverrideEligibilityArgs, 'input'>>;
  requestBenefit?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationRequestBenefitArgs, 'input'>>;
  signBenefitContract?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationSignBenefitContractArgs, 'requestId'>>;
  updateBenefit?: Resolver<ResolversTypes['Benefit'], ParentType, ContextType, RequireFields<MutationUpdateBenefitArgs, 'input'>>;
  updateEligibilityRuleConfig?: Resolver<ResolversTypes['EligibilityRuleConfig'], ParentType, ContextType, RequireFields<MutationUpdateEligibilityRuleConfigArgs, 'config'>>;
  uploadAdminContract?: Resolver<ResolversTypes['UploadAdminContractPayload'], ParentType, ContextType, RequireFields<MutationUploadAdminContractArgs, 'input'>>;
};

export type QueryResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  adminContracts?: Resolver<Array<ResolversTypes['AdminContract']>, ParentType, ContextType, RequireFields<QueryAdminContractsArgs, 'tab'>>;
  auditLog?: Resolver<Array<ResolversTypes['AuditEntry']>, ParentType, ContextType, RequireFields<QueryAuditLogArgs, 'filters'>>;
  benefitContractPreview?: Resolver<ResolversTypes['ContractPreview'], ParentType, ContextType, RequireFields<QueryBenefitContractPreviewArgs, 'benefitId'>>;
  benefitRequestContractTemplate?: Resolver<ResolversTypes['ContractTemplate'], ParentType, ContextType, RequireFields<QueryBenefitRequestContractTemplateArgs, 'requestId'>>;
  benefitRequests?: Resolver<Array<ResolversTypes['BenefitRequest']>, ParentType, ContextType, Partial<QueryBenefitRequestsArgs>>;
  benefits?: Resolver<Array<ResolversTypes['Benefit']>, ParentType, ContextType, Partial<QueryBenefitsArgs>>;
  employee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<QueryEmployeeArgs, 'id'>>;
  employees?: Resolver<Array<ResolversTypes['Employee']>, ParentType, ContextType, Partial<QueryEmployeesArgs>>;
  getAvailableRuleAttributes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  getEligibilityRuleConfig?: Resolver<ResolversTypes['EligibilityRuleConfig'], ParentType, ContextType>;
  health?: Resolver<ResolversTypes['Health'], ParentType, ContextType>;
  me?: Resolver<ResolversTypes['Employee'], ParentType, ContextType>;
  myAuditLog?: Resolver<Array<ResolversTypes['AuditEntry']>, ParentType, ContextType, RequireFields<QueryMyAuditLogArgs, 'filters'>>;
  myBenefits?: Resolver<Array<ResolversTypes['BenefitEligibility']>, ParentType, ContextType>;
  myNotifications?: Resolver<Array<ResolversTypes['EmployeeNotification']>, ParentType, ContextType, Partial<QueryMyNotificationsArgs>>;
  userOptions?: Resolver<Array<ResolversTypes['SwitchUserOption']>, ParentType, ContextType>;
};

export type RuleEvaluationResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['RuleEvaluation'] = ResolversParentTypes['RuleEvaluation']> = {
  passed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ruleType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SwitchUserOptionResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['SwitchUserOption'] = ResolversParentTypes['SwitchUserOption']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UploadAdminContractPayloadResolvers<ContextType = Ctx, ParentType extends ResolversParentTypes['UploadAdminContractPayload'] = ResolversParentTypes['UploadAdminContractPayload']> = {
  contract?: Resolver<ResolversTypes['AdminContract'], ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type Resolvers<ContextType = Ctx> = {
  AdminContract?: AdminContractResolvers<ContextType>;
  ArchiveBenefitContractPdfPayload?: ArchiveBenefitContractPdfPayloadResolvers<ContextType>;
  AuditEntry?: AuditEntryResolvers<ContextType>;
  Benefit?: BenefitResolvers<ContextType>;
  BenefitEligibility?: BenefitEligibilityResolvers<ContextType>;
  BenefitRequest?: BenefitRequestResolvers<ContextType>;
  Contract?: ContractResolvers<ContextType>;
  ContractPreview?: ContractPreviewResolvers<ContextType>;
  ContractTemplate?: ContractTemplateResolvers<ContextType>;
  EligibilityRuleConfig?: EligibilityRuleConfigResolvers<ContextType>;
  Employee?: EmployeeResolvers<ContextType>;
  EmployeeNotification?: EmployeeNotificationResolvers<ContextType>;
  Health?: HealthResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RuleEvaluation?: RuleEvaluationResolvers<ContextType>;
  SwitchUserOption?: SwitchUserOptionResolvers<ContextType>;
  UploadAdminContractPayload?: UploadAdminContractPayloadResolvers<ContextType>;
};

