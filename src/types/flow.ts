// CrewAI Flows Types for Financial Buddy Mentor
// Inspired by CrewAI Flows documentation

import { UserProfile, ExpenseItem, FinancialGoal, Investment } from './finance';
import { A2AAgent, Task, Message, Artifact } from './a2a';

// ============================================================================
// Core Flow Types
// ============================================================================

export interface FlowState {
    id: string;
    userId?: string;
    currentStep: number;
    totalSteps: number;
    status: FlowStatus;
    context: FlowContext;
    results: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

export type FlowStatus =
    | 'initialized'
    | 'running'
    | 'waiting'
    | 'completed'
    | 'failed'
    | 'cancelled';

export interface FlowContext {
    userProfile?: UserProfile;
    financialData?: FinancialData;
    preferences?: UserPreferences;
    sessionData?: Record<string, unknown>;
}

export interface FinancialData {
    monthlyIncome: number;
    monthlyExpenses: ExpenseItem[];
    currentSavings: number;
    investments: Investment[];
    goals: FinancialGoal[];
    emergencyFund?: number;
}

export interface UserPreferences {
    language: string;
    currency: string;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
}

// ============================================================================
// Flow Step Types
// ============================================================================

export interface FlowStep {
    id: string;
    name: string;
    description: string;
    flowId: string;
    order: number;
    type: FlowStepType;
    configuration: StepConfiguration;
    dependencies?: string[]; // IDs of steps that must complete first
    condition?: StepCondition;
    timeout?: number; // milliseconds
    retryPolicy?: RetryPolicy;
    status: StepStatus;
    startedAt?: Date;
    completedAt?: Date;
    result?: unknown;
    error?: FlowError;
}

export type FlowStepType =
    | 'data_collection'
    | 'analysis'
    | 'agent_execution'
    | 'crew_execution'
    | 'decision_point'
    | 'user_interaction'
    | 'notification'
    | 'data_storage'
    | 'external_api'
    | 'validation';

export type StepStatus =
    | 'pending'
    | 'ready'
    | 'running'
    | 'completed'
    | 'failed'
    | 'skipped'
    | 'cancelled';

export interface StepConfiguration {
    agent?: A2AAgent;
    crewId?: string;
    inputMapping?: Record<string, string>;
    outputMapping?: Record<string, string>;
    parameters?: Record<string, unknown>;
    validation?: ValidationRule[];
}

export interface StepCondition {
    type: 'expression' | 'function' | 'state_check';
    condition: string | ((state: FlowState) => boolean);
}

export interface RetryPolicy {
    maxAttempts: number;
    backoffStrategy: 'fixed' | 'exponential' | 'linear';
    baseDelayMs: number;
    maxDelayMs?: number;
}

export interface ValidationRule {
    field: string;
    type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
    value?: unknown;
    message?: string;
}

export interface FlowError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    recoverable: boolean;
    timestamp: Date;
}

// ============================================================================
// Flow Definition Types
// ============================================================================

export interface FlowDefinition {
    id: string;
    name: string;
    description: string;
    version: string;
    category: FlowCategory;
    tags: string[];
    steps: FlowStepDefinition[];
    triggers: FlowTrigger[];
    configuration: FlowConfiguration;
    metadata?: Record<string, unknown>;
}

export type FlowCategory =
    | 'financial_analysis'
    | 'budget_planning'
    | 'investment_advisory'
    | 'expense_tracking'
    | 'savings_optimization'
    | 'goal_management'
    | 'onboarding'
    | 'reporting'
    | 'notification'
    | 'maintenance';

export interface FlowStepDefinition {
    id: string;
    name: string;
    description: string;
    type: FlowStepType;
    configuration: StepConfiguration;
    dependencies?: string[];
    condition?: StepCondition;
    position: FlowPosition;
}

export interface FlowPosition {
    x: number;
    y: number;
}

export interface FlowTrigger {
    id: string;
    type: TriggerType;
    configuration: TriggerConfiguration;
    enabled: boolean;
}

export type TriggerType =
    | 'schedule'
    | 'webhook'
    | 'user_action'
    | 'data_change'
    | 'event'
    | 'manual';

export interface TriggerConfiguration {
    schedule?: ScheduleConfig;
    webhook?: WebhookConfig;
    event?: EventConfig;
    parameters?: Record<string, unknown>;
}

export interface ScheduleConfig {
    cron: string;
    timezone: string;
    enabled: boolean;
}

export interface WebhookConfig {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    authentication?: WebhookAuth;
}

export interface WebhookAuth {
    type: 'bearer' | 'basic' | 'apikey';
    credentials: Record<string, string>;
}

export interface EventConfig {
    eventType: string;
    filters?: EventFilter[];
}

export interface EventFilter {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: unknown;
}

export interface FlowConfiguration {
    maxConcurrentSteps: number;
    timeoutMs: number;
    retryPolicy: RetryPolicy;
    errorHandling: ErrorHandlingStrategy;
    logging: LoggingConfig;
    notifications: NotificationConfig;
}

export type ErrorHandlingStrategy =
    | 'fail_fast'
    | 'continue_on_error'
    | 'retry_on_error'
    | 'skip_on_error';

export interface LoggingConfig {
    level: 'debug' | 'info' | 'warn' | 'error';
    includeStepDetails: boolean;
    includeStateSnapshots: boolean;
}

export interface NotificationConfig {
    onStart: boolean;
    onComplete: boolean;
    onError: boolean;
    channels: NotificationChannel[];
}

export interface NotificationChannel {
    type: 'email' | 'webhook' | 'push' | 'whatsapp';
    configuration: Record<string, unknown>;
}

// ============================================================================
// Flow Execution Types
// ============================================================================

export interface FlowExecution {
    id: string;
    flowDefinitionId: string;
    state: FlowState;
    currentStepId?: string;
    executionHistory: FlowExecutionEvent[];
    artifacts: FlowArtifact[];
    metrics: FlowMetrics;
}

export interface FlowExecutionEvent {
    id: string;
    executionId: string;
    type: ExecutionEventType;
    stepId?: string;
    timestamp: Date;
    data: Record<string, unknown>;
    duration?: number;
}

export type ExecutionEventType =
    | 'flow_started'
    | 'flow_completed'
    | 'flow_failed'
    | 'flow_cancelled'
    | 'step_started'
    | 'step_completed'
    | 'step_failed'
    | 'step_retried'
    | 'decision_made'
    | 'user_input_required'
    | 'external_call_made';

export interface FlowArtifact {
    id: string;
    executionId: string;
    stepId: string;
    name: string;
    type: ArtifactType;
    content: unknown;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}

export type ArtifactType =
    | 'analysis_result'
    | 'recommendation'
    | 'report'
    | 'notification'
    | 'user_input'
    | 'api_response'
    | 'file'
    | 'data_export';

export interface FlowMetrics {
    executionTime: number;
    stepsExecuted: number;
    stepsSkipped: number;
    stepsFailed: number;
    retriesPerformed: number;
    averageStepDuration: number;
    resourcesUsed: ResourceUsage;
}

export interface ResourceUsage {
    cpuTime: number;
    memoryUsed: number;
    apiCalls: number;
    databaseQueries: number;
}

// ============================================================================
// Financial Flow Specific Types
// ============================================================================

export interface FinancialAnalysisFlowState extends FlowState {
    context: FinancialFlowContext;
    analysis: FinancialAnalysis;
    recommendations: FinancialRecommendation[];
}

export interface FinancialFlowContext extends FlowContext {
    analysisType: AnalysisType;
    timeframe: TimeframeConfig;
    includeProjections: boolean;
    benchmarkData?: BenchmarkData;
}

export type AnalysisType =
    | 'comprehensive'
    | 'budget_analysis'
    | 'investment_review'
    | 'savings_optimization'
    | 'goal_progress'
    | 'risk_assessment';

export interface TimeframeConfig {
    period: 'monthly' | 'quarterly' | 'yearly';
    startDate?: Date;
    endDate?: Date;
    includeFuture: boolean;
}

export interface BenchmarkData {
    ageGroup: string;
    incomeLevel: string;
    location: string;
    averageMetrics: Record<string, number>;
}

export interface FinancialAnalysis {
    summary: AnalysisSummary;
    budgetAnalysis?: BudgetAnalysis;
    investmentAnalysis?: InvestmentAnalysis;
    savingsAnalysis?: SavingsAnalysis;
    goalAnalysis?: GoalAnalysis;
    riskAnalysis?: RiskAnalysis;
}

export interface AnalysisSummary {
    overallScore: number;
    strengths: string[];
    areasForImprovement: string[];
    keyMetrics: Record<string, number>;
}

export interface BudgetAnalysis {
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    expenseBreakdown: Record<string, number>;
    budgetVariance: number;
    trends: TrendAnalysis[];
}

export interface InvestmentAnalysis {
    totalValue: number;
    allocation: Record<string, number>;
    performance: PerformanceMetrics;
    riskMetrics: RiskMetrics;
    diversificationScore: number;
}

export interface SavingsAnalysis {
    currentSavings: number;
    savingsRate: number;
    emergencyFundRatio: number;
    savingsGoalProgress: number;
    recommendedSavingsRate: number;
}

export interface GoalAnalysis {
    totalGoals: number;
    onTrackGoals: number;
    behindScheduleGoals: number;
    averageProgress: number;
    projectedCompletionDates: Record<string, Date>;
}

export interface RiskAnalysis {
    overallRiskScore: number;
    riskFactors: RiskFactor[];
    recommendations: string[];
    insuranceCoverage: InsuranceCoverage;
}

export interface TrendAnalysis {
    metric: string;
    direction: 'up' | 'down' | 'stable';
    changePercent: number;
    timeframe: string;
}

export interface PerformanceMetrics {
    totalReturn: number;
    annualizedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
}

export interface RiskMetrics {
    beta: number;
    valueAtRisk: number;
    correlationMatrix: Record<string, Record<string, number>>;
}

export interface RiskFactor {
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    mitigation: string;
}

export interface InsuranceCoverage {
    life: number;
    health: number;
    disability: number;
    property: number;
    recommended: Record<string, number>;
}

export interface FinancialRecommendation {
    id: string;
    type: RecommendationType;
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    rationale: string;
    expectedImpact: ExpectedImpact;
    actionItems: ActionItem[];
    timeline: string;
    category: string;
}

export type RecommendationType =
    | 'budget_adjustment'
    | 'investment_rebalancing'
    | 'savings_increase'
    | 'debt_reduction'
    | 'insurance_adjustment'
    | 'goal_modification'
    | 'risk_mitigation';

export interface ExpectedImpact {
    monetaryValue?: number;
    riskReduction?: number;
    timeToGoal?: number;
    description: string;
}

export interface ActionItem {
    id: string;
    description: string;
    dueDate?: Date;
    completed: boolean;
    assignedTo?: string;
}

// ============================================================================
// Flow Orchestration Types
// ============================================================================

export interface FlowOrchestrator {
    executeFlow(flowId: string, context: FlowContext): Promise<FlowExecution>;
    pauseFlow(executionId: string): Promise<void>;
    resumeFlow(executionId: string): Promise<void>;
    cancelFlow(executionId: string, reason?: string): Promise<void>;
    getFlowStatus(executionId: string): Promise<FlowExecution>;
    retryFailedStep(executionId: string, stepId: string): Promise<void>;
}

export interface FlowEngine {
    registerFlowDefinition(definition: FlowDefinition): Promise<void>;
    updateFlowDefinition(id: string, definition: Partial<FlowDefinition>): Promise<void>;
    deleteFlowDefinition(id: string): Promise<void>;
    getFlowDefinition(id: string): Promise<FlowDefinition | null>;
    listFlowDefinitions(category?: FlowCategory): Promise<FlowDefinition[]>;
}

export interface FlowStepExecutor {
    executeStep(step: FlowStep, context: FlowContext): Promise<unknown>;
    validateStepInputs(step: FlowStep, context: FlowContext): Promise<ValidationResult>;
    canExecuteStep(step: FlowStep, context: FlowContext): Promise<boolean>;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

export interface ValidationError {
    field: string;
    code: string;
    message: string;
}

export interface ValidationWarning {
    field: string;
    code: string;
    message: string;
} 