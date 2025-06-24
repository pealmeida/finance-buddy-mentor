import {
    // Enhanced Part Types
    TextPart,
    ImagePart,
    AudioPart,
    VideoPart,
    DataPart,
    FunctionCallPart,
    FunctionResponsePart,
    ErrorPart,
    StatusPart,

    // Enhanced Agent Card Types
    AgentCard,
    Skill,
    Function,
    AgentExample,

    // Core A2A Types
    Message,
    Task,
    A2AAgent
} from '../types/a2a';

// ============================================================================
// Enhanced Part Types Usage Examples
// ============================================================================

export class EnhancedA2AExamples {

    // Text Part with Metadata
    static createEnhancedTextPart(text: string, language?: string): TextPart {
        return {
            kind: "text",
            text: text,
            metadata: {
                language: language || 'en',
                confidence: 0.95,
                processingTime: '150ms',
                wordCount: text.split(' ').length
            }
        };
    }

    // Image Part for Financial Charts/Documents
    static createFinancialChartPart(chartData: string, chartType: string): ImagePart {
        return {
            kind: "image",
            image: {
                data: chartData, // base64 encoded
                mimeType: "image/png",
                width: 800,
                height: 600,
                alt: `Financial ${chartType} chart`,
                caption: `Generated ${chartType} showing financial trends`
            },
            metadata: {
                chartType: chartType,
                generatedAt: new Date().toISOString(),
                dataPoints: 12,
                currency: 'USD'
            }
        };
    }

    // Audio Part for Voice Commands/Responses
    static createVoiceResponsePart(audioData: string, transcript: string): AudioPart {
        return {
            kind: "audio",
            audio: {
                data: audioData, // base64 encoded
                mimeType: "audio/mpeg",
                duration: 15.5,
                transcript: transcript,
                language: "en-US"
            },
            metadata: {
                voice: "financial-assistant",
                emotion: "professional",
                speed: "normal",
                generatedBy: "tts-engine-v2"
            }
        };
    }

    // Data Part for Structured Financial Data
    static createFinancialDataPart(financialData: any): DataPart {
        return {
            kind: "data",
            data: financialData,
            schema: {
                type: "object",
                properties: {
                    totalExpenses: { type: "number" },
                    categories: {
                        type: "object",
                        properties: {
                            food: { type: "number" },
                            transportation: { type: "number" },
                            entertainment: { type: "number" }
                        }
                    },
                    period: { type: "string", format: "date" }
                },
                required: ["totalExpenses", "categories", "period"]
            },
            metadata: {
                currency: "USD",
                period: "monthly",
                lastUpdated: new Date().toISOString(),
                source: "expense-tracking-agent"
            }
        };
    }

    // Function Call Part for Agent Coordination
    static createAgentCoordinationCall(query: string, priority: string): FunctionCallPart {
        return {
            kind: "function-call",
            functionCall: {
                name: "coordinate_financial_analysis",
                args: {
                    query: query,
                    priority: priority,
                    includeAgents: ["expense-agent", "savings-agent", "goals-agent"],
                    timeout: 30000
                },
                id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            },
            metadata: {
                requestedAt: new Date().toISOString(),
                userSession: "session_123",
                contextId: "ctx_financial_analysis"
            }
        };
    }

    // Function Response Part
    static createCoordinationResponse(callId: string, result: any): FunctionResponsePart {
        return {
            kind: "function-response",
            functionResponse: {
                name: "coordinate_financial_analysis",
                response: result,
                id: callId,
                success: true
            },
            metadata: {
                executionTime: "2.3s",
                agentsInvolved: 3,
                completedAt: new Date().toISOString()
            }
        };
    }

    // Error Part for Handling Failures
    static createRecoverableErrorPart(errorCode: string, message: string): ErrorPart {
        return {
            kind: "error",
            error: {
                code: errorCode,
                message: message,
                details: {
                    timestamp: new Date().toISOString(),
                    context: "financial-analysis",
                    suggestedAction: "retry with different parameters"
                },
                recoverable: true
            },
            metadata: {
                errorId: `err_${Date.now()}`,
                severity: "warning",
                category: "temporary-failure"
            }
        };
    }

    // Status Part for Progress Updates
    static createProgressStatusPart(progress: number, message: string): StatusPart {
        return {
            kind: "status",
            status: {
                type: "progress",
                message: message,
                progress: progress,
                details: {
                    currentStep: Math.floor(progress / 25) + 1,
                    totalSteps: 4,
                    estimatedTimeRemaining: `${Math.max(0, (100 - progress) * 0.1)}s`
                }
            },
            metadata: {
                taskId: "task_financial_analysis",
                updatedAt: new Date().toISOString()
            }
        };
    }

    // ============================================================================
    // Enhanced Agent Card Examples
    // ============================================================================

    static createExpenseTrackingAgentCard(): AgentCard {
        return {
            name: "Advanced Expense Tracking Specialist",
            description: "AI-powered expense tracking agent with OCR, categorization, and predictive analytics capabilities",
            version: "2.0.0",
            url: "https://api.finance-buddy-mentor.com/agents/expense-tracker",

            provider: {
                organization: "Finance Buddy Mentor",
                url: "https://finance-buddy-mentor.com",
                contact: "agents@finance-buddy-mentor.com",
                logo: "https://finance-buddy-mentor.com/assets/logo.png",
                termsOfService: "https://finance-buddy-mentor.com/terms",
                privacyPolicy: "https://finance-buddy-mentor.com/privacy"
            },

            capabilities: {
                streaming: true,
                pushNotifications: true,
                stateTransitionHistory: true,
                multimodal: true,
                functionCalling: true,
                fileProcessing: true,
                realTimeData: true,
                memoryPersistence: true,
                contextAwareness: true,
                languageSupport: ["en", "es", "fr", "de", "pt-BR"],
                maxContextLength: 16000,
                maxFileSize: 50 * 1024 * 1024, // 50MB
                supportedFileTypes: [
                    "image/jpeg", "image/png", "image/webp",
                    "application/pdf", "text/csv", "application/json"
                ]
            },

            defaultInputModes: ["text/plain", "image/jpeg", "application/json"],
            defaultOutputModes: ["text/plain", "application/json", "text/markdown"],
            supportedInputModes: [
                "text/plain", "text/markdown",
                "image/jpeg", "image/png", "image/webp",
                "application/pdf", "text/csv", "application/json",
                "audio/mpeg", "audio/wav"
            ],
            supportedOutputModes: [
                "text/plain", "text/markdown", "application/json",
                "image/png", "text/csv", "application/pdf"
            ],

            skills: [
                {
                    id: "smart_expense_tracking",
                    name: "Smart Expense Tracking",
                    description: "Automatically track and categorize expenses using AI-powered OCR and machine learning",
                    tags: ["expense", "tracking", "ocr", "ml", "categorization"],
                    category: "automation",
                    complexity: "moderate",
                    estimatedDuration: "3s",
                    requiresContext: true,
                    supportsBatch: true,
                    supportsStreaming: true,
                    confidence: 0.94,
                    version: "2.0.0",
                    examples: [
                        "I spent $45.67 on groceries at Whole Foods",
                        "Track this restaurant receipt [image attached]",
                        "Add $25 Uber ride expense"
                    ],
                    parameters: {
                        type: "object",
                        properties: {
                            amount: { type: "number", description: "Expense amount" },
                            description: { type: "string", description: "Expense description" },
                            category: { type: "string", enum: ["food", "transportation", "entertainment", "utilities", "healthcare", "shopping", "other"] },
                            date: { type: "string", format: "date", description: "Expense date (ISO 8601)" },
                            merchant: { type: "string", description: "Merchant or vendor name" },
                            paymentMethod: { type: "string", enum: ["cash", "credit", "debit", "digital"] },
                            receipt: { type: "string", description: "Base64 encoded receipt image" },
                            location: { type: "object", properties: { lat: { type: "number" }, lng: { type: "number" } } }
                        },
                        required: ["amount"]
                    },
                    returns: {
                        type: "object",
                        properties: {
                            transactionId: { type: "string" },
                            categorizedAs: { type: "string" },
                            confidence: { type: "number" },
                            suggestedCategory: { type: "string" },
                            extractedData: { type: "object" }
                        }
                    },
                    rateLimit: {
                        calls: 1000,
                        window: "1h"
                    }
                },
                {
                    id: "expense_analytics",
                    name: "Advanced Expense Analytics",
                    description: "Generate insights, trends, and predictive analytics from expense data",
                    tags: ["analytics", "insights", "trends", "prediction"],
                    category: "analysis",
                    complexity: "complex",
                    estimatedDuration: "5s",
                    requiresContext: true,
                    supportsBatch: false,
                    supportsStreaming: true,
                    confidence: 0.91,
                    version: "2.0.0",
                    examples: [
                        "Analyze my spending patterns for the last 6 months",
                        "Show me my food expense trends",
                        "Predict my expenses for next month"
                    ],
                    parameters: {
                        type: "object",
                        properties: {
                            period: { type: "string", enum: ["week", "month", "quarter", "year"] },
                            categories: { type: "array", items: { type: "string" } },
                            includePredicitions: { type: "boolean" },
                            compareWith: { type: "string", enum: ["previous_period", "yearly_average", "budget"] }
                        }
                    },
                    returns: {
                        type: "object",
                        properties: {
                            summary: { type: "object" },
                            trends: { type: "array" },
                            predictions: { type: "object" },
                            recommendations: { type: "array" }
                        }
                    }
                }
            ],

            functions: [
                {
                    name: "extract_receipt_data",
                    description: "Extract structured data from receipt images using OCR",
                    parameters: {
                        type: "object",
                        properties: {
                            image: { type: "string", description: "Base64 encoded receipt image" },
                            enhanceImage: { type: "boolean", description: "Apply image enhancement before OCR" }
                        },
                        required: ["image"]
                    },
                    returns: {
                        type: "object",
                        properties: {
                            merchant: { type: "string" },
                            total: { type: "number" },
                            items: { type: "array" },
                            date: { type: "string" },
                            confidence: { type: "number" }
                        }
                    },
                    examples: [
                        {
                            name: "Grocery Receipt",
                            description: "Extract data from a grocery store receipt",
                            input: { image: "base64_encoded_receipt", enhanceImage: true },
                            output: {
                                merchant: "Whole Foods Market",
                                total: 45.67,
                                items: [
                                    { name: "Organic Bananas", price: 3.99 },
                                    { name: "Almond Milk", price: 4.49 }
                                ],
                                date: "2024-01-15",
                                confidence: 0.94
                            }
                        }
                    ],
                    category: "ocr",
                    tags: ["ocr", "receipt", "extraction"],
                    async: true,
                    timeout: 10000,
                    retryPolicy: {
                        maxRetries: 3,
                        backoffMs: 1000
                    }
                }
            ],

            rateLimit: {
                requests: 1000,
                window: "1h",
                burst: 20
            },

            endpoints: {
                tasks: "/api/v2/expense-agent/tasks",
                stream: "/api/v2/expense-agent/stream",
                wellKnown: "/.well-known/expense-agent.json",
                health: "/api/v2/expense-agent/health",
                metrics: "/api/v2/expense-agent/metrics"
            },

            tags: ["financial", "expense", "tracking", "analytics", "ocr", "ml"],
            categories: ["financial-services", "automation", "analytics"],
            license: "MIT",
            documentation: "https://docs.finance-buddy-mentor.com/agents/expense-tracker",

            examples: [
                {
                    title: "Receipt OCR Processing",
                    description: "User uploads a receipt image for automatic expense tracking",
                    userMessage: "Please process this restaurant receipt",
                    expectedResponse: "I've analyzed your receipt from Mario's Italian Restaurant. Found a total of $78.50 with items categorized under 'food'. The expense has been automatically added to your tracking.",
                    context: { hasReceiptImage: true },
                    skillsUsed: ["smart_expense_tracking"],
                    functionsUsed: ["extract_receipt_data"],
                    complexity: "moderate",
                    category: "automation"
                },
                {
                    title: "Expense Analytics Request",
                    description: "User requests spending analysis and insights",
                    userMessage: "Show me my spending trends for this month",
                    expectedResponse: "Based on your expense data, you've spent $2,340 this month. Your food expenses are 15% higher than last month, while transportation costs decreased by 8%. Here's a detailed breakdown...",
                    skillsUsed: ["expense_analytics"],
                    complexity: "complex",
                    category: "analysis"
                }
            ],

            a2aVersion: "0.2.0",
            lastUpdated: new Date().toISOString(),
            schemaVersion: "1.0.0",
            supportsAuthenticatedExtendedCard: true
        };
    }

    // ============================================================================
    // Complete Message Examples with Enhanced Parts
    // ============================================================================

    static createMultimodalExpenseMessage(): Message {
        return {
            kind: "message",
            messageId: `msg_${Date.now()}`,
            role: "user",
            parts: [
                this.createEnhancedTextPart("Please analyze this receipt and track the expense", "en"),
                this.createFinancialChartPart("base64_receipt_image_data", "receipt"),
                this.createFinancialDataPart({
                    userPreferences: {
                        defaultCategory: "food",
                        autoApprove: true,
                        currency: "USD"
                    }
                })
            ],
            contextId: "ctx_expense_tracking_123",
            metadata: {
                timestamp: new Date().toISOString(),
                userLocation: { lat: 37.7749, lng: -122.4194 },
                deviceType: "mobile",
                sessionId: "session_abc123"
            }
        };
    }

    static createStreamingAnalysisResponse(): Message {
        return {
            kind: "message",
            messageId: `msg_${Date.now()}`,
            role: "agent",
            parts: [
                this.createProgressStatusPart(25, "Analyzing receipt data..."),
                this.createEnhancedTextPart("I'm processing your receipt from Mario's Italian Restaurant. Let me extract the details..."),
                this.createCoordinationResponse("call_123", {
                    merchant: "Mario's Italian Restaurant",
                    total: 78.50,
                    category: "food",
                    confidence: 0.94
                }),
                this.createFinancialDataPart({
                    extractedExpense: {
                        amount: 78.50,
                        merchant: "Mario's Italian Restaurant",
                        category: "food",
                        date: new Date().toISOString().split('T')[0],
                        items: [
                            { name: "Pasta Carbonara", price: 24.00 },
                            { name: "Caesar Salad", price: 16.50 },
                            { name: "Wine", price: 32.00 },
                            { name: "Tax & Tip", price: 6.00 }
                        ]
                    }
                })
            ],
            taskId: "task_expense_analysis_456",
            contextId: "ctx_expense_tracking_123",
            metadata: {
                processingTime: "2.3s",
                agentVersion: "2.0.0",
                confidenceScore: 0.94
            }
        };
    }
}

// ============================================================================
// Usage Examples
// ============================================================================

export function demonstrateEnhancedA2A() {
    const examples = new EnhancedA2AExamples();

    // Create an enhanced agent card
    const expenseAgent = EnhancedA2AExamples.createExpenseTrackingAgentCard();
    console.log("Enhanced Agent Card:", JSON.stringify(expenseAgent, null, 2));

    // Create multimodal message
    const userMessage = EnhancedA2AExamples.createMultimodalExpenseMessage();
    console.log("Multimodal Message:", JSON.stringify(userMessage, null, 2));

    // Create streaming response
    const agentResponse = EnhancedA2AExamples.createStreamingAnalysisResponse();
    console.log("Streaming Response:", JSON.stringify(agentResponse, null, 2));
} 