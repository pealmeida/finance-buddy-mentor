// Financial Flow Usage Examples
// Demonstrates how to use the CrewAI FinancialAnalysisFlow in the application

import { FinancialAnalysisFlow } from '../services/crewai/flows/FinancialAnalysisFlow';
import { UserProfile } from '../types/finance';
import { AnalysisType } from '../types/flow';

// ============================================================================
// Example 1: Basic Flow Execution
// ============================================================================

export async function runBasicFinancialAnalysis(userProfile: UserProfile): Promise<void> {
    console.log('🚀 Starting Basic Financial Analysis Flow...');

    // Initialize the flow with user data
    const flow = new FinancialAnalysisFlow({
        userProfile,
        requestedAnalysisType: 'comprehensive',
        timeframe: {
            period: 'monthly'
        }
    });

    try {
        // Execute the flow
        await flow.kickoff({
            userProfile,
            analysisType: 'comprehensive'
        });

        // Get the final state and results
        const state = flow.getState();
        const execution = flow.getExecution();

        console.log('✅ Analysis completed successfully!');
        console.log('📊 Final Analysis:', state.analysis);
        console.log('💡 Recommendations:', state.recommendations);
        console.log('⏱️ Execution time:', execution.metrics.executionTime, 'ms');
    } catch (error) {
        console.error('❌ Flow execution failed:', error);
        throw error;
    }
}

// ============================================================================
// Example 2: Advanced Flow with Custom Configuration
// ============================================================================

export async function runAdvancedFinancialAnalysis(
    userProfile: UserProfile,
    analysisType: AnalysisType = 'comprehensive',
    agentConfig?: {
        uazapiApiKey: string;
        instanceId: string;
    }
): Promise<{
    analysis: any;
    recommendations: any[];
    metrics: any;
    confidence: number;
}> {
    console.log(`🔍 Starting ${analysisType} Financial Analysis...`);

    const flow = new FinancialAnalysisFlow({
        userProfile,
        requestedAnalysisType: analysisType,
        timeframe: {
            period: 'monthly',
            startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
            endDate: new Date()
        }
    }, agentConfig);

    // Generate flow visualization
    flow.plot('financial-analysis-flow');

    const startTime = Date.now();

    try {
        await flow.kickoffAsync();

        const state = flow.getState();
        const execution = flow.getExecution();
        const endTime = Date.now();

        const results = {
            analysis: state.analysis,
            recommendations: state.recommendations,
            metrics: {
                executionTime: endTime - startTime,
                confidence: state.analysisConfidence,
                stepsExecuted: execution.executionHistory.length,
                dataQuality: {
                    hasIncome: !!state.userProfile?.monthlyIncome,
                    hasExpenses: (state.rawFinancialData?.expenses?.length || 0) > 0,
                    hasInvestments: (state.rawFinancialData?.investments?.length || 0) > 0,
                    hasGoals: (state.rawFinancialData?.goals?.length || 0) > 0
                }
            },
            confidence: state.analysisConfidence
        };

        console.log('📋 Analysis Results Summary:');
        console.log(`   • Overall Score: ${state.analysis.summary.overallScore}/100`);
        console.log(`   • Confidence Level: ${state.analysisConfidence}%`);
        console.log(`   • Recommendations: ${state.recommendations.length}`);
        console.log(`   • Critical Issues: ${state.recommendations.filter(r => r.priority === 'critical').length}`);

        return results;
    } catch (error) {
        console.error('❌ Advanced flow execution failed:', error);
        throw error;
    }
}

// ============================================================================
// Example 3: Integration with React Component
// ============================================================================

export class FinancialAnalysisService {
    private currentFlow: FinancialAnalysisFlow | null = null;

    async analyzeUserFinances(
        userProfile: UserProfile,
        onProgress?: (step: string, progress: number) => void,
        onStepComplete?: (stepName: string, result: any) => void
    ) {
        console.log('🎯 Starting Financial Analysis Service...');

        this.currentFlow = new FinancialAnalysisFlow({
            userProfile,
            requestedAnalysisType: 'comprehensive'
        });

        try {
            const result = await this.currentFlow.kickoff();
            const state = this.currentFlow.getState();

            // Notify completion of each major step if callback provided
            if (onStepComplete) {
                onStepComplete('Budget Analysis', state.budgetAnalysisResult);
                onStepComplete('Investment Analysis', state.investmentAnalysisResult);
                onStepComplete('Savings Analysis', state.savingsAnalysisResult);
                onStepComplete('Goal Analysis', state.goalAnalysisResult);
                onStepComplete('Final Analysis', state.analysis);
                onStepComplete('Recommendations', state.recommendations);
            }

            return {
                success: true,
                analysis: state.analysis,
                recommendations: state.recommendations,
                confidence: state.analysisConfidence,
                executionId: state.id
            };
        } catch (error) {
            console.error('❌ Analysis service failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                executionId: this.currentFlow?.getState().id
            };
        }
    }

    getFlowState() {
        return this.currentFlow?.getState();
    }

    getExecutionHistory() {
        return this.currentFlow?.getExecution().executionHistory;
    }

    cancelAnalysis() {
        console.log('🛑 Analysis cancelled');
        this.currentFlow = null;
    }
}

// ============================================================================
// Example 4: Batch Analysis for Multiple Users
// ============================================================================

export async function runBatchAnalysis(userProfiles: UserProfile[]): Promise<{
    successful: number;
    failed: number;
    results: Array<{
        userId: string;
        success: boolean;
        analysis?: any;
        error?: string;
    }>;
}> {
    console.log(`📊 Starting batch analysis for ${userProfiles.length} users...`);

    const results = [];
    let successful = 0;
    let failed = 0;

    for (const profile of userProfiles) {
        try {
            const flow = new FinancialAnalysisFlow({
                userProfile: profile,
                requestedAnalysisType: 'budget_analysis' // Use budget_analysis for batch processing
            });

            await flow.kickoff();
            const state = flow.getState();

            results.push({
                userId: profile.id,
                success: true,
                analysis: {
                    score: state.analysis.summary.overallScore,
                    confidence: state.analysisConfidence,
                    recommendations: state.recommendations.length,
                    criticalIssues: state.recommendations.filter(r => r.priority === 'critical').length
                }
            });
            successful++;
        } catch (error) {
            results.push({
                userId: profile.id,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            failed++;
        }
    }

    console.log(`✅ Batch analysis completed: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
}

// ============================================================================
// Example 5: Integration with Dashboard Component
// ============================================================================

export const useDashboardAnalysis = () => {
    const analysisService = new FinancialAnalysisService();

    const runDashboardAnalysis = async (
        userProfile: UserProfile,
        setProgress: (progress: number) => void,
        setCurrentStep: (step: string) => void,
        setResults: (results: any) => void
    ) => {
        try {
            const results = await analysisService.analyzeUserFinances(
                userProfile,
                (step, progress) => {
                    setCurrentStep(step);
                    setProgress(progress);
                },
                (stepName, result) => {
                    console.log(`✅ Completed: ${stepName}`);
                }
            );

            setResults(results);
            return results;
        } catch (error) {
            console.error('Dashboard analysis failed:', error);
            throw error;
        }
    };

    return {
        runDashboardAnalysis,
        getFlowState: () => analysisService.getFlowState(),
        getExecutionHistory: () => analysisService.getExecutionHistory(),
        cancelAnalysis: () => analysisService.cancelAnalysis()
    };
};

// ============================================================================
// Sample Usage Data for Testing
// ============================================================================

export const sampleUserProfile: UserProfile = {
    id: 'sample-user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 35,
    monthlyIncome: 7500,
    preferredCurrency: 'USD',
    riskProfile: 'moderate',
    monthlyExpenses: {
        userId: 'sample-user-1',
        year: 2024,
        data: [
            {
                month: 12, year: 2024, amount: 3700, items: [
                    { id: '1', description: 'Rent', amount: 2000, category: 'housing', date: '2024-12-01' },
                    { id: '2', description: 'Groceries', amount: 800, category: 'food', date: '2024-12-01' },
                    { id: '3', description: 'Transportation', amount: 500, category: 'transportation', date: '2024-12-01' },
                    { id: '4', description: 'Entertainment', amount: 400, category: 'entertainment', date: '2024-12-01' }
                ]
            }
        ]
    },
    monthlySavings: {
        id: 'savings-1',
        userId: 'sample-user-1',
        year: 2024,
        data: [
            { month: 12, year: 2024, amount: 1800 }
        ]
    },
    investments: [
        { id: '1', name: 'Index Fund', type: 'stocks', value: 27500 },
        { id: '2', name: 'Tech Stocks', type: 'stocks', value: 16200 }
    ],
    financialGoals: [
        { id: '1', name: 'Emergency Fund', targetAmount: 30000, currentAmount: 18000, targetDate: new Date('2024-12-31'), priority: 'high' },
        { id: '2', name: 'House Down Payment', targetAmount: 80000, currentAmount: 25000, targetDate: new Date('2026-06-01'), priority: 'medium' }
    ]
};

// Quick test function
export async function testFinancialFlow() {
    console.log('🧪 Testing Financial Analysis Flow...');

    try {
        const results = await runAdvancedFinancialAnalysis(sampleUserProfile);
        console.log('🎉 Test completed successfully!');
        console.log('Results:', results);
        return results;
    } catch (error) {
        console.error('❌ Test failed:', error);
        throw error;
    }
} 