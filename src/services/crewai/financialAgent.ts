import { UserProfile, ExpenseItem, FinancialGoal, Investment } from '../../types/finance';
import {
    // Official A2A Types
    A2AAgent,
    AgentCard,
    Skill,
    Task,
    TaskState,
    TaskStatus,
    Message,
    Part,
    TextPart,
    FilePart,
    DataPart,
    Artifact,
    TaskStatusUpdateEvent,
    TaskArtifactUpdateEvent,
    FinancialContext,
    A2ATaskContext,
    JSONRPCRequest,
    JSONRPCResponse,
    JSONRPCError,
    A2A_ERROR_CODES,
    A2A_METHODS,
    WhatsAppToA2AMessage,
    A2AToWhatsAppResponse
} from '../../types/a2a';

// ============================================================================
// Google A2A Protocol Compliant Multi-Agent System
// ============================================================================

export class GoogleA2AFinancialAgentSystem {
    private agents: Map<string, A2AAgent>;
    private tasks: Map<string, Task>;
    private agentCommunications: TaskStatusUpdateEvent[];
    private uazapiConfig: {
        apiKey: string;
        baseUrl: string;
        instanceId: string;
    };

    constructor(
        uazapiApiKey: string,
        uazapiInstanceId: string,
        baseUrl: string = 'https://api.uazapi.com'
    ) {
        this.uazapiConfig = {
            apiKey: uazapiApiKey,
            baseUrl: baseUrl,
            instanceId: uazapiInstanceId
        };

        this.agents = new Map();
        this.tasks = new Map();
        this.agentCommunications = [];

        this.initializeA2AAgents();
    }

    private initializeA2AAgents(): void {
        // Initialize all specialized agents with official A2A Agent Cards
        const agents = this.createA2AAgentCards();
        agents.forEach(agent => {
            this.agents.set(agent.id, agent);
        });
    }

    private createA2AAgentCards(): A2AAgent[] {
        const baseUrl = 'http://localhost:3000/agents';

        return [
            // 1. Personal Financial Manager Agent
            {
                id: 'personal-manager',
                name: 'Personal Financial Manager',
                description: 'Main coordinator for financial tasks and multi-agent collaboration',
                agentCard: {
                    name: 'Personal Financial Manager',
                    description: 'Acts as the primary interface with users, understands their needs, and coordinates with specialist agents to provide comprehensive financial assistance.',
                    version: '1.0.0',
                    url: `${baseUrl}/personal-manager`,

                    provider: {
                        organization: 'Finance Buddy Mentor',
                        url: 'https://github.com/pealmeida/finance-buddy-mentor',
                        contact: 'support@finance-buddy-mentor.com',
                        termsOfService: 'https://finance-buddy-mentor.com/terms',
                        privacyPolicy: 'https://finance-buddy-mentor.com/privacy'
                    },

                    capabilities: {
                        streaming: true,
                        pushNotifications: true,
                        stateTransitionHistory: true,
                        multimodal: true,
                        functionCalling: true,
                        fileProcessing: false,
                        realTimeData: true,
                        memoryPersistence: true,
                        contextAwareness: true,
                        languageSupport: ['en', 'es', 'pt-BR'],
                        maxContextLength: 32000,
                        maxFileSize: 10485760, // 10MB
                        supportedFileTypes: ['text/plain', 'application/json', 'image/jpeg', 'image/png']
                    },

                    defaultInputModes: ['text/plain', 'application/json'],
                    defaultOutputModes: ['text/plain', 'application/json'],
                    supportedInputModes: ['text/plain', 'application/json', 'audio/mpeg', 'image/jpeg'],
                    supportedOutputModes: ['text/plain', 'application/json', 'text/markdown'],

                    skills: [
                        {
                            id: 'coordinate_agents',
                            name: 'Agent Coordination',
                            description: 'Coordinate with specialist agents for complex financial tasks',
                            tags: ['coordination', 'management', 'delegation'],
                            category: 'orchestration',
                            complexity: 'complex',
                            estimatedDuration: '10s',
                            requiresContext: true,
                            supportsStreaming: true,
                            confidence: 0.95,
                            version: '1.0.0',
                            examples: [
                                'Analyze my complete financial situation',
                                'Help me create a comprehensive financial plan',
                                'I need advice on multiple financial aspects'
                            ],
                            parameters: {
                                type: 'object',
                                properties: {
                                    query: { type: 'string', description: 'User financial query' },
                                    context: { type: 'object', description: 'Financial context' },
                                    priority: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Task priority' }
                                },
                                required: ['query']
                            },
                            returns: {
                                type: 'object',
                                properties: {
                                    coordinationPlan: { type: 'string' },
                                    agentsInvolved: { type: 'array', items: { type: 'string' } },
                                    estimatedTime: { type: 'string' }
                                }
                            }
                        },
                        {
                            id: 'natural_language_processing',
                            name: 'Natural Language Understanding',
                            description: 'Process and understand user financial queries with high accuracy',
                            tags: ['nlp', 'understanding', 'intent', 'context'],
                            category: 'language',
                            complexity: 'moderate',
                            estimatedDuration: '2s',
                            requiresContext: false,
                            supportsStreaming: false,
                            confidence: 0.92,
                            version: '1.0.0',
                            examples: [
                                'What does this mean for my budget?',
                                'Can you explain this in simple terms?',
                                'I don\'t understand this financial concept'
                            ],
                            parameters: {
                                type: 'object',
                                properties: {
                                    text: { type: 'string', description: 'Text to analyze' },
                                    language: { type: 'string', enum: ['en', 'es', 'pt-BR'], description: 'Language code' }
                                },
                                required: ['text']
                            }
                        }
                    ],

                    rateLimit: {
                        requests: 100,
                        window: '1h',
                        burst: 10
                    },

                    endpoints: {
                        tasks: `${baseUrl}/personal-manager/tasks`,
                        stream: `${baseUrl}/personal-manager/stream`,
                        wellKnown: `${baseUrl}/personal-manager/.well-known/agent.json`,
                        health: `${baseUrl}/personal-manager/health`
                    },

                    tags: ['financial', 'coordination', 'nlp', 'planning'],
                    categories: ['financial-services', 'personal-assistant'],
                    license: 'MIT',
                    documentation: 'https://finance-buddy-mentor.com/docs/personal-manager',

                    examples: [
                        {
                            title: 'Comprehensive Financial Analysis',
                            description: 'User requests complete financial overview',
                            userMessage: 'Can you analyze my complete financial situation?',
                            expectedResponse: 'I\'ll coordinate with all specialist agents to provide you with a comprehensive financial analysis...',
                            skillsUsed: ['coordinate_agents', 'natural_language_processing'],
                            complexity: 'complex',
                            category: 'analysis'
                        },
                        {
                            title: 'Simple Greeting',
                            description: 'User greets the assistant',
                            userMessage: 'Hello, can you help me?',
                            expectedResponse: 'Hello! I\'m your Personal Financial Manager. I can help you with expense tracking, savings strategies, financial goals, and investment advice.',
                            skillsUsed: ['natural_language_processing'],
                            complexity: 'simple',
                            category: 'greeting'
                        }
                    ],

                    a2aVersion: '0.2.0',
                    lastUpdated: new Date().toISOString(),
                    schemaVersion: '1.0.0',
                    supportsAuthenticatedExtendedCard: false
                },
                skills: ['coordinate_agents', 'natural_language_processing', 'user_profiling'],
                isActive: true,
                endpoint: `${baseUrl}/personal-manager`,
                authentication: { type: 'none' }
            },

            // 2. Expense Tracking Agent
            {
                id: 'expense-agent',
                name: 'Expense Tracking Specialist',
                description: 'Specialized agent for expense tracking and analysis',
                agentCard: {
                    name: 'Expense Tracking Specialist',
                    description: 'Track, categorize, and analyze user expenses. Provides insights on spending patterns and identifies areas for optimization.',
                    version: '1.0.0',
                    url: `${baseUrl}/expense-agent`,
                    provider: {
                        organization: 'Finance Buddy Mentor',
                        url: 'https://github.com/pealmeida/finance-buddy-mentor'
                    },
                    capabilities: {
                        streaming: true,
                        pushNotifications: false,
                        stateTransitionHistory: true
                    },
                    defaultInputModes: ['text/plain', 'application/json'],
                    defaultOutputModes: ['text/plain', 'application/json'],
                    skills: [
                        {
                            id: 'track_expense',
                            name: 'Track Expense',
                            description: 'Record and categorize a new expense',
                            tags: ['expense', 'tracking', 'categorization'],
                            examples: [
                                'I spent $50 on groceries',
                                'Add $20 gas expense',
                                'Record $100 restaurant bill'
                            ],
                            parameters: {
                                type: 'object',
                                properties: {
                                    amount: { type: 'number', description: 'Expense amount' },
                                    category: { type: 'string', description: 'Expense category' },
                                    description: { type: 'string', description: 'Expense description' },
                                    date: { type: 'string', format: 'date', description: 'Expense date' }
                                },
                                required: ['amount']
                            }
                        },
                        {
                            id: 'analyze_spending',
                            name: 'Analyze Spending Patterns',
                            description: 'Analyze user spending patterns and provide insights',
                            tags: ['analysis', 'patterns', 'insights'],
                            examples: [
                                'How much did I spend this month?',
                                'What are my top spending categories?',
                                'Show my spending trends'
                            ]
                        }
                    ],
                    supportsAuthenticatedExtendedCard: false
                },
                skills: ['track_expense', 'analyze_spending', 'category_classification'],
                isActive: true,
                endpoint: `${baseUrl}/expense-agent`,
                authentication: { type: 'none' }
            },

            // 3. Savings Strategy Agent
            {
                id: 'savings-agent',
                name: 'Savings Strategy Specialist',
                description: 'Specialized agent for savings optimization and strategy',
                agentCard: {
                    name: 'Savings Strategy Specialist',
                    description: 'Develop personalized savings strategies, track savings progress, and optimize savings rates based on user income and expenses.',
                    version: '1.0.0',
                    url: `${baseUrl}/savings-agent`,
                    provider: {
                        organization: 'Finance Buddy Mentor',
                        url: 'https://github.com/pealmeida/finance-buddy-mentor'
                    },
                    capabilities: {
                        streaming: true,
                        pushNotifications: false,
                        stateTransitionHistory: true
                    },
                    defaultInputModes: ['text/plain', 'application/json'],
                    defaultOutputModes: ['text/plain', 'application/json'],
                    skills: [
                        {
                            id: 'optimize_savings',
                            name: 'Optimize Savings Strategy',
                            description: 'Create personalized savings optimization strategies',
                            tags: ['savings', 'optimization', 'strategy'],
                            examples: [
                                'How can I save more money?',
                                'Create a savings plan for me',
                                'Optimize my savings rate'
                            ],
                            parameters: {
                                type: 'object',
                                properties: {
                                    income: { type: 'number', description: 'Monthly income' },
                                    expenses: { type: 'number', description: 'Monthly expenses' },
                                    goals: { type: 'array', description: 'Financial goals' }
                                }
                            }
                        },
                        {
                            id: 'emergency_fund_planning',
                            name: 'Emergency Fund Planning',
                            description: 'Plan and track emergency fund development',
                            tags: ['emergency', 'fund', 'planning'],
                            examples: [
                                'How much should I have in emergency fund?',
                                'Help me build an emergency fund',
                                'Track my emergency savings progress'
                            ]
                        }
                    ],
                    supportsAuthenticatedExtendedCard: false
                },
                skills: ['optimize_savings', 'emergency_fund_planning', 'automation_setup'],
                isActive: true,
                endpoint: `${baseUrl}/savings-agent`,
                authentication: { type: 'none' }
            },

            // 4. Goals Management Agent
            {
                id: 'goals-agent',
                name: 'Financial Goals Specialist',
                description: 'Specialized agent for financial goal setting and tracking',
                agentCard: {
                    name: 'Financial Goals Specialist',
                    description: 'Help users set realistic financial goals, create actionable plans, track progress, and adjust strategies to achieve their objectives.',
                    version: '1.0.0',
                    url: `${baseUrl}/goals-agent`,
                    provider: {
                        organization: 'Finance Buddy Mentor',
                        url: 'https://github.com/pealmeida/finance-buddy-mentor'
                    },
                    capabilities: {
                        streaming: true,
                        pushNotifications: true,
                        stateTransitionHistory: true
                    },
                    defaultInputModes: ['text/plain', 'application/json'],
                    defaultOutputModes: ['text/plain', 'application/json'],
                    skills: [
                        {
                            id: 'set_financial_goal',
                            name: 'Set Financial Goal',
                            description: 'Create and configure new financial goals',
                            tags: ['goals', 'planning', 'target'],
                            examples: [
                                'I want to save $10,000 for vacation',
                                'Help me plan for house down payment',
                                'Set a retirement savings goal'
                            ],
                            parameters: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string', description: 'Goal title' },
                                    targetAmount: { type: 'number', description: 'Target amount' },
                                    deadline: { type: 'string', format: 'date', description: 'Target date' },
                                    priority: { type: 'string', enum: ['low', 'medium', 'high'] }
                                },
                                required: ['title', 'targetAmount']
                            }
                        },
                        {
                            id: 'track_goal_progress',
                            name: 'Track Goal Progress',
                            description: 'Monitor and analyze financial goal progress',
                            tags: ['tracking', 'progress', 'monitoring'],
                            examples: [
                                'How am I doing on my vacation savings?',
                                'Show my goal progress',
                                'Am I on track to meet my goals?'
                            ]
                        }
                    ],
                    supportsAuthenticatedExtendedCard: false
                },
                skills: ['set_financial_goal', 'track_goal_progress', 'milestone_tracking'],
                isActive: true,
                endpoint: `${baseUrl}/goals-agent`,
                authentication: { type: 'none' }
            },

            // 5. Investment Advisory Agent
            {
                id: 'investment-agent',
                name: 'Investment Advisory Specialist',
                description: 'Specialized agent for investment advice and portfolio management',
                agentCard: {
                    name: 'Investment Advisory Specialist',
                    description: 'Provide investment recommendations, analyze portfolio performance, assess risk levels, and offer market insights.',
                    version: '1.0.0',
                    url: `${baseUrl}/investment-agent`,
                    provider: {
                        organization: 'Finance Buddy Mentor',
                        url: 'https://github.com/pealmeida/finance-buddy-mentor'
                    },
                    capabilities: {
                        streaming: true,
                        pushNotifications: true,
                        stateTransitionHistory: true
                    },
                    defaultInputModes: ['text/plain', 'application/json'],
                    defaultOutputModes: ['text/plain', 'application/json'],
                    skills: [
                        {
                            id: 'analyze_portfolio',
                            name: 'Analyze Investment Portfolio',
                            description: 'Analyze current investment portfolio and performance',
                            tags: ['investment', 'portfolio', 'analysis'],
                            examples: [
                                'How is my portfolio performing?',
                                'Analyze my investment allocation',
                                'Review my investment strategy'
                            ],
                            parameters: {
                                type: 'object',
                                properties: {
                                    riskProfile: { type: 'string', enum: ['conservative', 'moderate', 'aggressive'] },
                                    timeHorizon: { type: 'string', description: 'Investment time horizon' }
                                }
                            }
                        },
                        {
                            id: 'investment_recommendations',
                            name: 'Investment Recommendations',
                            description: 'Provide personalized investment recommendations',
                            tags: ['recommendations', 'advice', 'strategy'],
                            examples: [
                                'What should I invest in?',
                                'Recommend investments for my risk profile',
                                'How should I diversify my portfolio?'
                            ]
                        }
                    ],
                    supportsAuthenticatedExtendedCard: false
                },
                skills: ['analyze_portfolio', 'investment_recommendations', 'risk_assessment'],
                isActive: true,
                endpoint: `${baseUrl}/investment-agent`,
                authentication: { type: 'none' }
            }
        ];
    }

    // ============================================================================
    // Official A2A Protocol Message Processing
    // ============================================================================

    async processA2AMessage(
        whatsappMessage: WhatsAppToA2AMessage,
        context: FinancialContext
    ): Promise<A2AToWhatsAppResponse | null> {
        try {
            console.log('[Google A2A] Processing WhatsApp message:', whatsappMessage.message.parts[0]);

            // 1. Analyze intent using official A2A Message structure
            const intent = await this.analyzeUserIntent(
                whatsappMessage.message.parts.find(p => p.kind === 'text')?.text || '',
                context
            );

            // 2. Create A2A Task with official structure
            const task = await this.createA2ATask(intent, whatsappMessage.message, context);

            // 3. Execute task using appropriate agent
            const response = await this.executeA2ATask(task, context);

            if (response) {
                // 4. Convert A2A response to WhatsApp format
                return this.convertA2AToWhatsApp(response, whatsappMessage);
            }

            return null;
        } catch (error) {
            console.error('[Google A2A] Error processing message:', error);
            return this.createErrorResponse(whatsappMessage, error);
        }
    }

    private async createA2ATask(
        intent: any,
        message: Message,
        context: FinancialContext
    ): Promise<Task> {
        const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const contextId = `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const task: Task = {
            kind: 'task',
            id: taskId,
            contextId: contextId,
            status: {
                state: 'submitted',
                timestamp: new Date().toISOString()
            },
            history: [message],
            artifacts: [],
            metadata: {
                intent: intent.type,
                confidence: intent.confidence,
                agentId: this.selectAgentForIntent(intent.type)
            }
        };

        this.tasks.set(taskId, task);
        return task;
    }

    private async executeA2ATask(task: Task, context: FinancialContext): Promise<Message | null> {
        const agentId = task.metadata?.agentId as string;
        const agent = this.agents.get(agentId);

        if (!agent) {
            throw new Error(`Agent not found: ${agentId}`);
        }

        // Update task to working state
        await this.updateTaskStatus(task.id, 'working', 'Processing your request...');

        try {
            // Execute based on agent specialization
            const result = await this.executeAgentTask(agent, task, context);

            // Update task to completed state
            await this.updateTaskStatus(task.id, 'completed');

            return result;
        } catch (error) {
            // Update task to failed state
            await this.updateTaskStatus(task.id, 'failed', `Error: ${error.message}`);
            throw error;
        }
    }

    private async executeAgentTask(
        agent: A2AAgent,
        task: Task,
        context: FinancialContext
    ): Promise<Message> {
        const userMessage = task.history[0].parts.find(p => p.kind === 'text')?.text || '';

        switch (agent.id) {
            case 'expense-agent':
                return await this.executeExpenseAgentTask(task, context, userMessage);
            case 'savings-agent':
                return await this.executeSavingsAgentTask(task, context, userMessage);
            case 'goals-agent':
                return await this.executeGoalsAgentTask(task, context, userMessage);
            case 'investment-agent':
                return await this.executeInvestmentAgentTask(task, context, userMessage);
            case 'personal-manager':
            default:
                return await this.executePersonalManagerTask(task, context, userMessage);
        }
    }

    private async executeExpenseAgentTask(
        task: Task,
        context: FinancialContext,
        userMessage: string
    ): Promise<Message> {
        // Extract expense information
        const entities = this.extractEntities(userMessage);

        if (entities.amount) {
            // Create expense tracking artifact
            const artifact: Artifact = {
                artifactId: `expense_${Date.now()}`,
                name: 'expense_record.json',
                parts: [{
                    kind: 'data',
                    data: {
                        amount: entities.amount,
                        category: entities.category || 'Other',
                        description: entities.description || userMessage,
                        date: new Date().toISOString(),
                        userId: context.userProfile.id
                    }
                }]
            };

            // Add artifact to task
            const currentTask = this.tasks.get(task.id);
            if (currentTask) {
                currentTask.artifacts = currentTask.artifacts || [];
                currentTask.artifacts.push(artifact);
            }

            const response = `✅ Expense recorded successfully!\n💰 Amount: ${this.formatCurrency(entities.amount)}\n📁 Category: ${entities.category || 'Other'}\n📝 Description: ${entities.description || 'No description'}`;

            return {
                kind: 'message',
                messageId: `msg_${Date.now()}`,
                role: 'agent',
                parts: [{ kind: 'text', text: response }],
                taskId: task.id,
                contextId: task.contextId
            };
        }

        return {
            kind: 'message',
            messageId: `msg_${Date.now()}`,
            role: 'agent',
            parts: [{ kind: 'text', text: 'I need more details to record your expense. Please specify the amount and category.' }],
            taskId: task.id,
            contextId: task.contextId
        };
    }

    private async executeSavingsAgentTask(
        task: Task,
        context: FinancialContext,
        userMessage: string
    ): Promise<Message> {
        const { userProfile, recentTransactions } = context;
        const monthlyIncome = userProfile.monthlyIncome || 0;
        const monthlyExpenses = recentTransactions.reduce((sum, exp) => sum + exp.amount, 0);
        const savingsPotential = monthlyIncome - monthlyExpenses;
        const savingsRate = monthlyIncome > 0 ? (savingsPotential / monthlyIncome) * 100 : 0;

        const response = `💰 Savings Analysis:\n\n📊 Current Savings Rate: ${savingsRate.toFixed(1)}%\n💵 Monthly Savings Potential: ${this.formatCurrency(savingsPotential)}\n\n🎯 Recommendations:\n${savingsRate < 20 ? '• Try to increase your savings rate to 20%' : '• Great job maintaining a healthy savings rate!'}\n• Set up automatic transfers to savings\n• Consider high-yield savings accounts`;

        return {
            kind: 'message',
            messageId: `msg_${Date.now()}`,
            role: 'agent',
            parts: [{ kind: 'text', text: response }],
            taskId: task.id,
            contextId: task.contextId
        };
    }

    private async executeGoalsAgentTask(
        task: Task,
        context: FinancialContext,
        userMessage: string
    ): Promise<Message> {
        const goals = context.currentGoals;

        if (goals.length === 0) {
            const response = `🎯 Goal Setting Assistant\n\nI notice you don't have any financial goals set up yet. Let me help you create some!\n\nPopular goal types:\n• Emergency Fund (3-6 months expenses)\n• Vacation Savings\n• House Down Payment\n• Retirement Planning\n\nWhat financial goal would you like to work on?`;
        } else {
            const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length;
            const response = `🎯 Your Financial Goals Progress\n\n📈 Overall Progress: ${totalProgress.toFixed(1)}%\n\n${goals.map(goal => `• ${goal.title}: ${goal.progress}% (${this.formatCurrency(goal.currentAmount)} / ${this.formatCurrency(goal.targetAmount)})`).join('\n')}\n\n${totalProgress >= 80 ? '🎉 Excellent progress! Keep it up!' : '💪 You\'re making progress! Consider increasing your contributions.'}`;
        }

        return {
            kind: 'message',
            messageId: `msg_${Date.now()}`,
            role: 'agent',
            parts: [{ kind: 'text', text: response }],
            taskId: task.id,
            contextId: task.contextId
        };
    }

    private async executeInvestmentAgentTask(
        task: Task,
        context: FinancialContext,
        userMessage: string
    ): Promise<Message> {
        const { userProfile } = context;
        const riskProfile = userProfile.riskProfile || 'moderate';

        let recommendations = '';
        if (riskProfile === 'conservative') {
            recommendations = '• 70% Bonds/Fixed Income\n• 30% Diversified Stock ETFs\n• Consider Treasury Bills and CDs';
        } else if (riskProfile === 'moderate') {
            recommendations = '• 60% Stock ETFs\n• 30% Bonds\n• 10% REITs or Alternatives\n• Focus on low-cost index funds';
        } else {
            recommendations = '• 80% Stocks (mix of growth and value)\n• 15% International/Emerging Markets\n• 5% Alternative investments\n• Consider individual stocks for smaller portion';
        }

        const response = `📈 Investment Recommendations\n\n🎯 Risk Profile: ${riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}\n\n💼 Suggested Allocation:\n${recommendations}\n\n⚠️ Remember: Past performance doesn't guarantee future results. Consider consulting with a financial advisor for personalized advice.`;

        return {
            kind: 'message',
            messageId: `msg_${Date.now()}`,
            role: 'agent',
            parts: [{ kind: 'text', text: response }],
            taskId: task.id,
            contextId: task.contextId
        };
    }

    private async executePersonalManagerTask(
        task: Task,
        context: FinancialContext,
        userMessage: string
    ): Promise<Message> {
        const response = `👋 Hello! I'm your Personal Financial Manager.\n\nI can help you with:\n💰 Expense tracking and analysis\n📊 Savings strategies\n🎯 Financial goal planning\n📈 Investment guidance\n\nWhat would you like to work on today? Just tell me in natural language and I'll coordinate with my specialist agents to help you!`;

        return {
            kind: 'message',
            messageId: `msg_${Date.now()}`,
            role: 'agent',
            parts: [{ kind: 'text', text: response }],
            taskId: task.id,
            contextId: task.contextId
        };
    }

    // ============================================================================
    // Task Management with Official A2A States
    // ============================================================================

    private async updateTaskStatus(
        taskId: string,
        state: TaskState,
        message?: string
    ): Promise<void> {
        const task = this.tasks.get(taskId);
        if (!task) return;

        task.status = {
            state,
            timestamp: new Date().toISOString(),
            message: message ? {
                kind: 'message',
                messageId: `status_${Date.now()}`,
                role: 'agent',
                parts: [{ kind: 'text', text: message }],
                taskId: taskId,
                contextId: task.contextId
            } : undefined
        };

        // Emit status update event
        const statusUpdate: TaskStatusUpdateEvent = {
            kind: 'status-update',
            taskId: taskId,
            contextId: task.contextId,
            status: task.status,
            final: ['completed', 'failed', 'canceled'].includes(state)
        };

        this.agentCommunications.push(statusUpdate);
    }

    // ============================================================================
    // WhatsApp Integration
    // ============================================================================

    private convertA2AToWhatsApp(
        a2aResponse: Message,
        originalWhatsAppMessage: WhatsAppToA2AMessage
    ): A2AToWhatsAppResponse {
        const textPart = a2aResponse.parts.find(p => p.kind === 'text') as TextPart;

        return {
            taskId: a2aResponse.taskId,
            contextId: a2aResponse.contextId,
            whatsappResponse: {
                to: originalWhatsAppMessage.fromNumber,
                message: textPart?.text || 'Response processed successfully',
                type: 'text',
                metadata: {
                    messageId: a2aResponse.messageId,
                    agentSystem: 'Google A2A Financial Agents'
                }
            }
        };
    }

    private createErrorResponse(
        whatsappMessage: WhatsAppToA2AMessage,
        error: any
    ): A2AToWhatsAppResponse {
        return {
            whatsappResponse: {
                to: whatsappMessage.fromNumber,
                message: 'Sorry, I encountered an error processing your request. Please try again.',
                type: 'text',
                metadata: {
                    error: error.message,
                    timestamp: new Date().toISOString()
                }
            }
        };
    }

    // ============================================================================
    // Utility Methods
    // ============================================================================

    private selectAgentForIntent(intentType: string): string {
        const agentMapping: Record<string, string> = {
            'expense_tracking': 'expense-agent',
            'savings_strategy': 'savings-agent',
            'goal_management': 'goals-agent',
            'investment_advice': 'investment-agent',
            'general_inquiry': 'personal-manager'
        };

        return agentMapping[intentType] || 'personal-manager';
    }

    private async analyzeUserIntent(message: string, context: FinancialContext): Promise<{
        type: string;
        confidence: number;
        entities: any;
        action: string;
    }> {
        const messageLower = message.toLowerCase();

        // Intent analysis patterns
        const intentPatterns = {
            expense_tracking: ['spent', 'expense', 'cost', 'paid', 'bought', 'purchase'],
            savings_strategy: ['save', 'saving', 'savings', 'budget', 'emergency fund'],
            goal_management: ['goal', 'target', 'plan', 'achieve', 'progress'],
            investment_advice: ['invest', 'investment', 'portfolio', 'stocks', 'bonds', 'market'],
            general_inquiry: ['help', 'hello', 'hi', 'what', 'how', 'can you']
        };

        let bestMatch = 'general_inquiry';
        let maxScore = 0;

        Object.entries(intentPatterns).forEach(([intent, patterns]) => {
            const score = patterns.reduce((acc, pattern) => {
                return acc + (messageLower.includes(pattern) ? 1 : 0);
            }, 0);

            if (score > maxScore) {
                maxScore = score;
                bestMatch = intent;
            }
        });

        return {
            type: bestMatch,
            confidence: Math.min(maxScore / 3, 1),
            entities: this.extractEntities(message),
            action: 'process'
        };
    }

    private extractEntities(message: string): any {
        const entities: any = {};

        // Extract amount
        const amountMatch = message.match(/\$?(\d+(?:\.\d{2})?)/);
        if (amountMatch) {
            entities.amount = parseFloat(amountMatch[1]);
        }

        // Extract category
        const categories = ['food', 'groceries', 'gas', 'restaurant', 'shopping', 'entertainment', 'utilities', 'rent', 'transportation'];
        const foundCategory = categories.find(cat => message.toLowerCase().includes(cat));
        if (foundCategory) {
            entities.category = foundCategory;
        }

        // Extract description
        entities.description = message.replace(/\$?\d+(?:\.\d{2})?/, '').trim();

        return entities;
    }

    private formatCurrency(amount: number, currency: string = 'USD'): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // ============================================================================
    // Public API Methods
    // ============================================================================

    public getAgentCard(agentId: string): AgentCard | null {
        const agent = this.agents.get(agentId);
        return agent?.agentCard || null;
    }

    public getTask(taskId: string): Task | null {
        return this.tasks.get(taskId) || null;
    }

    public async cancelTask(taskId: string, reason?: string): Promise<boolean> {
        const task = this.tasks.get(taskId);
        if (!task) return false;

        await this.updateTaskStatus(taskId, 'canceled', reason);
        return true;
    }

    public getActiveAgents(): A2AAgent[] {
        return Array.from(this.agents.values()).filter(agent => agent.isActive);
    }
}