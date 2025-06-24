// Financial Analysis Flow - CrewAI Flow Implementation
// Comprehensive financial analysis workflow using the financial agents

import { BaseFlow, start, listen, router, createFlowState } from './BaseFlow';
import {
    FinancialAnalysisFlowState,
    FinancialFlowContext,
    FinancialAnalysis,
    FinancialRecommendation,
    AnalysisType,
    BudgetAnalysis,
    InvestmentAnalysis,
    SavingsAnalysis,
    GoalAnalysis,
    RiskAnalysis
} from '../../../types/flow';
import { GoogleA2AFinancialAgentSystem } from '../financialAgent';
import { UserProfile, ExpenseItem, FinancialGoal, Investment } from '../../../types/finance';
import { FinancialContext } from '../../../types/a2a';

// ============================================================================
// Financial Analysis Flow State
// ============================================================================

interface FinancialAnalysisState extends FinancialAnalysisFlowState {
    // User Input Data
    userProfile?: UserProfile;
    requestedAnalysisType: AnalysisType;
    timeframe: {
        period: 'monthly' | 'quarterly' | 'yearly';
        startDate?: Date;
        endDate?: Date;
    };

    // Intermediate Processing Results
    rawFinancialData?: {
        income: number;
        expenses: ExpenseItem[];
        savings: number;
        investments: Investment[];
        goals: FinancialGoal[];
    };

    // Agent Analysis Results
    budgetAnalysisResult?: BudgetAnalysis;
    investmentAnalysisResult?: InvestmentAnalysis;
    savingsAnalysisResult?: SavingsAnalysis;
    goalAnalysisResult?: GoalAnalysis;
    riskAnalysisResult?: RiskAnalysis;

    // Flow Control
    analysisConfidence: number;
    requiresUserInput: boolean;
    processingErrors: string[];
}

// ============================================================================
// Financial Analysis Flow
// ============================================================================

export class FinancialAnalysisFlow extends BaseFlow<FinancialAnalysisState> {
    private agentSystem: GoogleA2AFinancialAgentSystem;

    constructor(
        initialState?: Partial<FinancialAnalysisState>,
        agentSystemConfig?: {
            uazapiApiKey: string;
            instanceId: string;
        }
    ) {
        super(initialState);

        // Initialize the A2A agent system
        this.agentSystem = new GoogleA2AFinancialAgentSystem(
            agentSystemConfig?.uazapiApiKey || process.env.UAZAPI_API_KEY || 'demo-key',
            agentSystemConfig?.instanceId || process.env.UAZAPI_INSTANCE_ID || 'demo-instance'
        );
    }

    protected createInitialState(partial?: Partial<FinancialAnalysisState>): FinancialAnalysisState {
        const baseState = createFlowState<FinancialAnalysisState>({
            requestedAnalysisType: 'comprehensive',
            timeframe: {
                period: 'monthly'
            },
            analysisConfidence: 0,
            requiresUserInput: false,
            processingErrors: [],
            context: {
                analysisType: 'comprehensive',
                timeframe: {
                    period: 'monthly',
                    includeFuture: true
                },
                includeProjections: true
            },
            analysis: {
                summary: {
                    overallScore: 0,
                    strengths: [],
                    areasForImprovement: [],
                    keyMetrics: {}
                }
            },
            recommendations: [],
            ...partial
        });

        return baseState;
    }

    // ============================================================================
    // Flow Steps
    // ============================================================================

    @start({
        name: 'Initialize Analysis',
        description: 'Gather user profile and financial data for analysis',
        timeout: 10000
    })
    async initializeAnalysis(): Promise<string> {
        console.log('🔍 Initializing financial analysis flow...');

        // Validate required input data
        if (!this.state.userProfile) {
            this.state.requiresUserInput = true;
            throw new Error('User profile is required for financial analysis');
        }

        // Set analysis parameters
        this.state.context.analysisType = this.state.requestedAnalysisType;
        this.state.results.initializationTime = new Date().toISOString();

        console.log(`📊 Analysis type: ${this.state.requestedAnalysisType}`);
        console.log(`👤 User: ${this.state.userProfile.name}`);
        console.log(`💰 Monthly income: $${this.state.userProfile.monthlyIncome}`);

        return 'Analysis initialized successfully';
    }

    @listen('initializeAnalysis', {
        name: 'Collect Financial Data',
        description: 'Gather and organize all financial data from user profile',
        type: 'data_collection'
    })
    async collectFinancialData(previousResult: string): Promise<string> {
        console.log('📋 Collecting comprehensive financial data...');

        const profile = this.state.userProfile!;

        // Organize financial data
        this.state.rawFinancialData = {
            income: profile.monthlyIncome || 0,
            expenses: profile.monthlyExpenses?.data || [],
            savings: profile.monthlySavings?.data?.reduce((sum, saving) => sum + saving.amount, 0) || 0,
            investments: profile.investments || [],
            goals: profile.financialGoals || []
        };

        // Calculate basic metrics
        const totalExpenses = this.state.rawFinancialData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const savingsRate = this.state.rawFinancialData.income > 0
            ? (this.state.rawFinancialData.savings / this.state.rawFinancialData.income) * 100
            : 0;

        this.state.results.basicMetrics = {
            totalIncome: this.state.rawFinancialData.income,
            totalExpenses,
            totalSavings: this.state.rawFinancialData.savings,
            savingsRate,
            totalInvestments: this.state.rawFinancialData.investments.reduce((sum, inv) => sum + inv.amount, 0)
        };

        console.log(`📈 Savings rate: ${savingsRate.toFixed(1)}%`);
        console.log(`💳 Total expenses: $${totalExpenses}`);

        return 'Financial data collected and organized';
    }

    @listen('collectFinancialData', {
        name: 'Budget Analysis',
        description: 'Analyze budget and spending patterns using expense agent',
        type: 'agent_execution'
    })
    async performBudgetAnalysis(previousResult: string): Promise<BudgetAnalysis> {
        console.log('💰 Performing budget analysis with expense agent...');

        const context: FinancialContext = {
            userProfile: this.state.userProfile!,
            recentTransactions: this.state.rawFinancialData?.expenses || [],
            currentGoals: this.state.rawFinancialData?.goals || [],
            portfolioValue: this.state.rawFinancialData?.investments.reduce((sum, inv) => sum + inv.amount, 0) || 0,
            monthlyBudget: this.state.rawFinancialData?.income || 0,
            spendingCategories: this.calculateSpendingCategories(),
            conversationHistory: []
        };

        // Use expense agent for detailed budget analysis
        const expenseAgent = this.agentSystem.getActiveAgents().find(agent => agent.id === 'expense-agent');
        if (!expenseAgent) {
            throw new Error('Expense agent not available');
        }

        const analysis: BudgetAnalysis = {
            monthlyIncome: this.state.rawFinancialData?.income || 0,
            monthlyExpenses: this.state.rawFinancialData?.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0,
            savingsRate: (this.state.results.basicMetrics as any)?.savingsRate || 0,
            expenseBreakdown: this.calculateSpendingCategories(),
            budgetVariance: this.calculateBudgetVariance(),
            trends: this.calculateExpenseTrends()
        };

        this.state.budgetAnalysisResult = analysis;
        this.state.results.budgetAnalysis = analysis;

        console.log(`📊 Budget variance: ${analysis.budgetVariance.toFixed(1)}%`);
        return analysis;
    }

    @listen('collectFinancialData', {
        name: 'Investment Analysis',
        description: 'Analyze investment portfolio using investment agent',
        type: 'agent_execution'
    })
    async performInvestmentAnalysis(previousResult: string): Promise<InvestmentAnalysis> {
        console.log('📈 Performing investment analysis with investment agent...');

        const investments = this.state.rawFinancialData?.investments || [];

        if (investments.length === 0) {
            console.log('⚠️ No investments found, creating placeholder analysis');
            const analysis: InvestmentAnalysis = {
                totalValue: 0,
                allocation: {},
                performance: {
                    totalReturn: 0,
                    annualizedReturn: 0,
                    volatility: 0,
                    sharpeRatio: 0,
                    maxDrawdown: 0
                },
                riskMetrics: {
                    beta: 0,
                    valueAtRisk: 0,
                    correlationMatrix: {}
                },
                diversificationScore: 0
            };

            this.state.investmentAnalysisResult = analysis;
            return analysis;
        }

        // Calculate investment metrics
        const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const allocation = this.calculateAssetAllocation(investments);

        const analysis: InvestmentAnalysis = {
            totalValue,
            allocation,
            performance: {
                totalReturn: this.calculateTotalReturn(investments),
                annualizedReturn: this.calculateAnnualizedReturn(investments),
                volatility: this.calculateVolatility(investments),
                sharpeRatio: this.calculateSharpeRatio(investments),
                maxDrawdown: this.calculateMaxDrawdown(investments)
            },
            riskMetrics: {
                beta: this.calculateBeta(investments),
                valueAtRisk: this.calculateVaR(investments),
                correlationMatrix: this.calculateCorrelationMatrix(investments)
            },
            diversificationScore: this.calculateDiversificationScore(investments)
        };

        this.state.investmentAnalysisResult = analysis;
        this.state.results.investmentAnalysis = analysis;

        console.log(`💼 Portfolio value: $${totalValue.toLocaleString()}`);
        console.log(`📊 Diversification score: ${analysis.diversificationScore.toFixed(1)}`);

        return analysis;
    }

    @listen('collectFinancialData', {
        name: 'Savings Analysis',
        description: 'Analyze savings patterns and optimization using savings agent',
        type: 'agent_execution'
    })
    async performSavingsAnalysis(previousResult: string): Promise<SavingsAnalysis> {
        console.log('🏦 Performing savings analysis with savings agent...');

        const income = this.state.rawFinancialData?.income || 0;
        const savings = this.state.rawFinancialData?.savings || 0;
        const expenses = this.state.rawFinancialData?.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0;

        const savingsRate = income > 0 ? (savings / income) * 100 : 0;
        const emergencyFundRatio = this.calculateEmergencyFundRatio();
        const recommendedSavingsRate = this.calculateRecommendedSavingsRate();

        const analysis: SavingsAnalysis = {
            currentSavings: savings,
            savingsRate,
            emergencyFundRatio,
            savingsGoalProgress: this.calculateSavingsGoalProgress(),
            recommendedSavingsRate
        };

        this.state.savingsAnalysisResult = analysis;
        this.state.results.savingsAnalysis = analysis;

        console.log(`💰 Current savings rate: ${savingsRate.toFixed(1)}%`);
        console.log(`🚨 Emergency fund ratio: ${emergencyFundRatio.toFixed(1)}`);

        return analysis;
    }

    @listen('collectFinancialData', {
        name: 'Goal Analysis',
        description: 'Analyze financial goals progress using goals agent',
        type: 'agent_execution'
    })
    async performGoalAnalysis(previousResult: string): Promise<GoalAnalysis> {
        console.log('🎯 Performing goals analysis with goals agent...');

        const goals = this.state.rawFinancialData?.goals || [];

        if (goals.length === 0) {
            console.log('⚠️ No financial goals found');
            const analysis: GoalAnalysis = {
                totalGoals: 0,
                onTrackGoals: 0,
                behindScheduleGoals: 0,
                averageProgress: 0,
                projectedCompletionDates: {}
            };

            this.state.goalAnalysisResult = analysis;
            return analysis;
        }

        const onTrackGoals = goals.filter(goal => goal.progress >= this.calculateExpectedProgress(goal)).length;
        const behindScheduleGoals = goals.length - onTrackGoals;
        const averageProgress = goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length;

        const analysis: GoalAnalysis = {
            totalGoals: goals.length,
            onTrackGoals,
            behindScheduleGoals,
            averageProgress,
            projectedCompletionDates: this.calculateProjectedCompletionDates(goals)
        };

        this.state.goalAnalysisResult = analysis;
        this.state.results.goalAnalysis = analysis;

        console.log(`🎯 Goals on track: ${onTrackGoals}/${goals.length}`);
        console.log(`📊 Average progress: ${averageProgress.toFixed(1)}%`);

        return analysis;
    }

    @router(['performBudgetAnalysis', 'performInvestmentAnalysis', 'performSavingsAnalysis', 'performGoalAnalysis'], {
        name: 'Determine Analysis Confidence',
        description: 'Evaluate the quality and completeness of analysis results'
    })
    async determineAnalysisConfidence(): Promise<string> {
        console.log('🔍 Evaluating analysis confidence...');

        let confidence = 0;
        const factors = [];

        // Check data completeness
        if (this.state.userProfile?.monthlyIncome && this.state.userProfile.monthlyIncome > 0) {
            confidence += 25;
            factors.push('Income data available');
        }

        if (this.state.rawFinancialData?.expenses && this.state.rawFinancialData.expenses.length > 0) {
            confidence += 25;
            factors.push('Expense data available');
        }

        if (this.state.rawFinancialData?.investments && this.state.rawFinancialData.investments.length > 0) {
            confidence += 25;
            factors.push('Investment data available');
        }

        if (this.state.rawFinancialData?.goals && this.state.rawFinancialData.goals.length > 0) {
            confidence += 25;
            factors.push('Goals data available');
        }

        this.state.analysisConfidence = confidence;
        this.state.results.confidenceFactors = factors;

        console.log(`📊 Analysis confidence: ${confidence}%`);
        console.log(`✅ Confidence factors: ${factors.join(', ')}`);

        if (confidence >= 75) {
            return 'high_confidence';
        } else if (confidence >= 50) {
            return 'medium_confidence';
        } else {
            return 'low_confidence';
        }
    }

    @listen('high_confidence', {
        name: 'Generate Comprehensive Analysis',
        description: 'Generate full analysis with detailed recommendations',
        type: 'analysis'
    })
    async generateComprehensiveAnalysis(): Promise<FinancialAnalysis> {
        console.log('📊 Generating comprehensive financial analysis...');

        const analysis: FinancialAnalysis = {
            summary: {
                overallScore: this.calculateOverallScore(),
                strengths: this.identifyStrengths(),
                areasForImprovement: this.identifyAreasForImprovement(),
                keyMetrics: this.generateKeyMetrics()
            },
            budgetAnalysis: this.state.budgetAnalysisResult,
            investmentAnalysis: this.state.investmentAnalysisResult,
            savingsAnalysis: this.state.savingsAnalysisResult,
            goalAnalysis: this.state.goalAnalysisResult,
            riskAnalysis: this.performRiskAnalysis()
        };

        this.state.analysis = analysis;
        this.state.results.finalAnalysis = analysis;

        console.log(`🎯 Overall financial score: ${analysis.summary.overallScore}/100`);
        console.log(`💪 Strengths: ${analysis.summary.strengths.length}`);
        console.log(`🎯 Areas for improvement: ${analysis.summary.areasForImprovement.length}`);

        return analysis;
    }

    @listen('medium_confidence', {
        name: 'Generate Basic Analysis',
        description: 'Generate simplified analysis with available data',
        type: 'analysis'
    })
    async generateBasicAnalysis(): Promise<FinancialAnalysis> {
        console.log('📊 Generating basic financial analysis...');

        const analysis: FinancialAnalysis = {
            summary: {
                overallScore: this.calculateBasicScore(),
                strengths: this.identifyBasicStrengths(),
                areasForImprovement: ['More complete financial data needed for detailed analysis'],
                keyMetrics: this.generateBasicMetrics()
            },
            budgetAnalysis: this.state.budgetAnalysisResult,
            savingsAnalysis: this.state.savingsAnalysisResult
        };

        this.state.analysis = analysis;
        this.state.results.finalAnalysis = analysis;

        console.log(`📊 Basic financial score: ${analysis.summary.overallScore}/100`);
        return analysis;
    }

    @listen('low_confidence', {
        name: 'Request Additional Data',
        description: 'Request more financial data from user for better analysis',
        type: 'user_interaction'
    })
    async requestAdditionalData(): Promise<string> {
        console.log('❓ Requesting additional financial data...');

        this.state.requiresUserInput = true;

        const missingData = [];
        if (!this.state.userProfile?.monthlyIncome || this.state.userProfile.monthlyIncome <= 0) {
            missingData.push('Monthly income information');
        }
        if (!this.state.rawFinancialData?.expenses || this.state.rawFinancialData.expenses.length === 0) {
            missingData.push('Monthly expense details');
        }
        if (!this.state.rawFinancialData?.investments || this.state.rawFinancialData.investments.length === 0) {
            missingData.push('Investment portfolio information');
        }

        this.state.results.missingData = missingData;

        return `Additional data needed: ${missingData.join(', ')}`;
    }

    @listen(['generateComprehensiveAnalysis', 'generateBasicAnalysis'], {
        name: 'Generate Recommendations',
        description: 'Generate personalized financial recommendations',
        type: 'analysis'
    })
    async generateRecommendations(): Promise<FinancialRecommendation[]> {
        console.log('💡 Generating personalized recommendations...');

        const recommendations: FinancialRecommendation[] = [];

        // Budget recommendations
        if (this.state.budgetAnalysisResult) {
            recommendations.push(...this.generateBudgetRecommendations());
        }

        // Investment recommendations
        if (this.state.investmentAnalysisResult) {
            recommendations.push(...this.generateInvestmentRecommendations());
        }

        // Savings recommendations
        if (this.state.savingsAnalysisResult) {
            recommendations.push(...this.generateSavingsRecommendations());
        }

        // Goal recommendations
        if (this.state.goalAnalysisResult) {
            recommendations.push(...this.generateGoalRecommendations());
        }

        // Sort by priority
        recommendations.sort((a, b) => {
            const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
            return priorities[b.priority] - priorities[a.priority];
        });

        this.state.recommendations = recommendations;
        this.state.results.recommendations = recommendations;

        console.log(`💡 Generated ${recommendations.length} recommendations`);
        console.log(`🚨 Critical priorities: ${recommendations.filter(r => r.priority === 'critical').length}`);

        return recommendations;
    }

    @listen('generateRecommendations', {
        name: 'Finalize Analysis',
        description: 'Complete the analysis and prepare final report',
        type: 'data_storage'
    })
    async finalizeAnalysis(): Promise<string> {
        console.log('✅ Finalizing financial analysis...');

        // Mark completion time
        this.state.results.completionTime = new Date().toISOString();
        this.state.results.processingDuration = Date.now() - new Date(this.state.createdAt).getTime();

        // Generate summary stats
        const summary = {
            analysisType: this.state.requestedAnalysisType,
            confidenceLevel: this.state.analysisConfidence,
            recommendationsCount: this.state.recommendations.length,
            overallScore: this.state.analysis.summary.overallScore,
            completedAt: this.state.results.completionTime
        };

        this.state.results.summary = summary;

        console.log('📋 Analysis Summary:');
        console.log(`   Analysis Type: ${summary.analysisType}`);
        console.log(`   Confidence: ${summary.confidenceLevel}%`);
        console.log(`   Overall Score: ${summary.overallScore}/100`);
        console.log(`   Recommendations: ${summary.recommendationsCount}`);
        console.log(`   Duration: ${this.state.results.processingDuration}ms`);

        return 'Financial analysis completed successfully';
    }

    // ============================================================================
    // Helper Methods
    // ============================================================================

    private calculateSpendingCategories(): Record<string, number> {
        const expenses = this.state.rawFinancialData?.expenses || [];
        const categories: Record<string, number> = {};

        for (const expense of expenses) {
            const category = expense.category || 'Other';
            categories[category] = (categories[category] || 0) + expense.amount;
        }

        return categories;
    }

    private calculateBudgetVariance(): number {
        const income = this.state.rawFinancialData?.income || 0;
        const expenses = this.state.rawFinancialData?.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0;

        if (income === 0) return 0;
        return ((income - expenses) / income) * 100;
    }

    private calculateExpenseTrends(): any[] {
        // Simplified trend calculation
        return [
            { metric: 'Total Expenses', direction: 'stable' as const, changePercent: 0, timeframe: 'monthly' }
        ];
    }

    private calculateAssetAllocation(investments: Investment[]): Record<string, number> {
        const total = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const allocation: Record<string, number> = {};

        for (const investment of investments) {
            const type = investment.type || 'Other';
            allocation[type] = (allocation[type] || 0) + (investment.amount / total) * 100;
        }

        return allocation;
    }

    // Simplified calculation methods (in a real implementation, these would be more sophisticated)
    private calculateTotalReturn(investments: Investment[]): number { return 0; }
    private calculateAnnualizedReturn(investments: Investment[]): number { return 0; }
    private calculateVolatility(investments: Investment[]): number { return 0; }
    private calculateSharpeRatio(investments: Investment[]): number { return 0; }
    private calculateMaxDrawdown(investments: Investment[]): number { return 0; }
    private calculateBeta(investments: Investment[]): number { return 1; }
    private calculateVaR(investments: Investment[]): number { return 0; }
    private calculateCorrelationMatrix(investments: Investment[]): Record<string, Record<string, number>> { return {}; }
    private calculateDiversificationScore(investments: Investment[]): number { return investments.length > 5 ? 85 : 60; }

    private calculateEmergencyFundRatio(): number {
        const monthlyExpenses = this.state.rawFinancialData?.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0;
        const emergencyFund = this.state.userProfile?.hasEmergencyFund ? (this.state.userProfile.emergencyFundMonths || 3) * monthlyExpenses : 0;
        return monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;
    }

    private calculateRecommendedSavingsRate(): number {
        const age = this.state.userProfile?.age || 30;
        return age < 30 ? 20 : age < 50 ? 15 : 10;
    }

    private calculateSavingsGoalProgress(): number {
        return 50; // Simplified calculation
    }

    private calculateExpectedProgress(goal: FinancialGoal): number {
        // Calculate expected progress based on time elapsed
        const now = new Date();
        const start = new Date(goal.createdAt || now);
        const target = goal.targetDate ? new Date(goal.targetDate) : now;

        const totalTime = target.getTime() - start.getTime();
        const elapsedTime = now.getTime() - start.getTime();

        return totalTime > 0 ? (elapsedTime / totalTime) * 100 : 0;
    }

    private calculateProjectedCompletionDates(goals: FinancialGoal[]): Record<string, Date> {
        const projections: Record<string, Date> = {};
        for (const goal of goals) {
            if (goal.progress > 0) {
                const monthsRemaining = ((100 - goal.progress) / goal.progress) * 12;
                projections[goal.title] = new Date(Date.now() + monthsRemaining * 30 * 24 * 60 * 60 * 1000);
            }
        }
        return projections;
    }

    private calculateOverallScore(): number {
        let score = 0;
        let factors = 0;

        if (this.state.budgetAnalysisResult) {
            score += this.state.budgetAnalysisResult.savingsRate > 20 ? 25 : 15;
            factors += 1;
        }

        if (this.state.investmentAnalysisResult) {
            score += this.state.investmentAnalysisResult.diversificationScore > 70 ? 25 : 15;
            factors += 1;
        }

        if (this.state.savingsAnalysisResult) {
            score += this.state.savingsAnalysisResult.emergencyFundRatio >= 3 ? 25 : 15;
            factors += 1;
        }

        if (this.state.goalAnalysisResult) {
            score += this.state.goalAnalysisResult.averageProgress > 50 ? 25 : 15;
            factors += 1;
        }

        return factors > 0 ? Math.round(score / factors * 4) : 0;
    }

    private calculateBasicScore(): number {
        return Math.min(this.calculateOverallScore(), 60);
    }

    private identifyStrengths(): string[] {
        const strengths = [];

        if (this.state.savingsAnalysisResult?.savingsRate && this.state.savingsAnalysisResult.savingsRate > 20) {
            strengths.push('Strong savings rate');
        }

        if (this.state.investmentAnalysisResult?.diversificationScore && this.state.investmentAnalysisResult.diversificationScore > 70) {
            strengths.push('Well-diversified investment portfolio');
        }

        if (this.state.goalAnalysisResult?.onTrackGoals && this.state.goalAnalysisResult.totalGoals > 0) {
            const onTrackPercentage = (this.state.goalAnalysisResult.onTrackGoals / this.state.goalAnalysisResult.totalGoals) * 100;
            if (onTrackPercentage > 70) {
                strengths.push('Good progress on financial goals');
            }
        }

        return strengths;
    }

    private identifyBasicStrengths(): string[] {
        return ['Basic financial tracking in place'];
    }

    private identifyAreasForImprovement(): string[] {
        const improvements = [];

        if (this.state.savingsAnalysisResult?.savingsRate && this.state.savingsAnalysisResult.savingsRate < 10) {
            improvements.push('Increase monthly savings rate');
        }

        if (this.state.savingsAnalysisResult?.emergencyFundRatio && this.state.savingsAnalysisResult.emergencyFundRatio < 3) {
            improvements.push('Build larger emergency fund');
        }

        if (this.state.investmentAnalysisResult?.diversificationScore && this.state.investmentAnalysisResult.diversificationScore < 50) {
            improvements.push('Improve investment diversification');
        }

        return improvements;
    }

    private generateKeyMetrics(): Record<string, number> {
        return {
            savingsRate: this.state.savingsAnalysisResult?.savingsRate || 0,
            totalInvestments: this.state.investmentAnalysisResult?.totalValue || 0,
            emergencyFundMonths: this.state.savingsAnalysisResult?.emergencyFundRatio || 0,
            goalsOnTrack: this.state.goalAnalysisResult?.onTrackGoals || 0
        };
    }

    private generateBasicMetrics(): Record<string, number> {
        return {
            monthlyIncome: this.state.rawFinancialData?.income || 0,
            monthlyExpenses: this.state.rawFinancialData?.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0
        };
    }

    private performRiskAnalysis(): RiskAnalysis {
        return {
            overallRiskScore: 50,
            riskFactors: [],
            recommendations: ['Maintain diversified portfolio', 'Regular risk assessment'],
            insuranceCoverage: {
                life: 0,
                health: 0,
                disability: 0,
                property: 0,
                recommended: { life: 100000, health: 50000, disability: 25000, property: 75000 }
            }
        };
    }

    private generateBudgetRecommendations(): FinancialRecommendation[] {
        return [{
            id: 'budget-1',
            type: 'budget_adjustment',
            priority: 'medium',
            title: 'Optimize Monthly Budget',
            description: 'Review and categorize all expenses for better tracking',
            rationale: 'Better expense tracking leads to improved financial awareness',
            expectedImpact: { description: 'Improved financial visibility and control' },
            actionItems: [{ id: '1', description: 'Categorize all expenses', completed: false }],
            timeline: '2 weeks',
            category: 'budgeting'
        }];
    }

    private generateInvestmentRecommendations(): FinancialRecommendation[] {
        return [{
            id: 'investment-1',
            type: 'investment_rebalancing',
            priority: 'high',
            title: 'Improve Portfolio Diversification',
            description: 'Consider adding different asset classes to reduce risk',
            rationale: 'Diversification helps reduce overall portfolio risk',
            expectedImpact: { description: 'Lower portfolio volatility and better risk-adjusted returns' },
            actionItems: [{ id: '1', description: 'Research index funds', completed: false }],
            timeline: '1 month',
            category: 'investing'
        }];
    }

    private generateSavingsRecommendations(): FinancialRecommendation[] {
        return [{
            id: 'savings-1',
            type: 'savings_increase',
            priority: 'high',
            title: 'Increase Emergency Fund',
            description: 'Build emergency fund to cover 3-6 months of expenses',
            rationale: 'Emergency fund provides financial security',
            expectedImpact: { description: 'Financial stability and peace of mind' },
            actionItems: [{ id: '1', description: 'Set up automatic transfers', completed: false }],
            timeline: '6 months',
            category: 'savings'
        }];
    }

    private generateGoalRecommendations(): FinancialRecommendation[] {
        return [{
            id: 'goals-1',
            type: 'goal_modification',
            priority: 'medium',
            title: 'Review Financial Goals',
            description: 'Update and prioritize financial goals based on current situation',
            rationale: 'Regular goal review ensures they remain relevant and achievable',
            expectedImpact: { description: 'Better goal achievement and financial progress' },
            actionItems: [{ id: '1', description: 'List all current goals', completed: false }],
            timeline: '2 weeks',
            category: 'planning'
        }];
    }
} 