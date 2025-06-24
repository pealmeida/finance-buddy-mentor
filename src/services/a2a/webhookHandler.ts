import express from 'express';
import {
    JSONRPCRequest,
    JSONRPCResponse,
    JSONRPCError,
    A2A_ERROR_CODES,
    A2A_METHODS,
    Message,
    MessageSendParams,
    Task,
    TaskQueryParams,
    TaskCancelParams,
    TaskPushNotificationParams,
    TaskResubscribeParams,
    WhatsAppToA2AMessage,
    A2AToWhatsAppResponse,
    FinancialContext,
    TextPart
} from '../../types/a2a';
import { GoogleA2AFinancialAgentSystem } from '../crewai/financialAgent';
import { UserProfile } from '../../types/finance';

export class GoogleA2AWebhookHandler {
    private agentSystem: GoogleA2AFinancialAgentSystem;
    private port: number;
    private app: express.Application;

    constructor(
        uazapiApiKey: string,
        uazapiInstanceId: string,
        port: number = 3000
    ) {
        this.agentSystem = new GoogleA2AFinancialAgentSystem(
            uazapiApiKey,
            uazapiInstanceId
        );
        this.port = port;
        this.app = express();
        this.setupMiddleware();
        this.setupA2ARoutes();
    }

    private setupMiddleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // CORS for A2A protocol
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });
    }

    private setupA2ARoutes(): void {
        // ============================================================================
        // Official Google A2A Protocol Endpoints
        // ============================================================================

        // Agent Card Discovery Endpoint
        this.app.get('/.well-known/agent.json', (req, res) => {
            const mainAgentCard = this.agentSystem.getAgentCard('personal-manager');
            if (mainAgentCard) {
                res.json(mainAgentCard);
            } else {
                res.status(404).json({ error: 'Agent card not found' });
            }
        });

        // JSON-RPC 2.0 A2A Protocol Endpoint
        this.app.post('/a2a', async (req, res) => {
            try {
                const jsonrpcRequest: JSONRPCRequest = req.body;

                // Validate JSON-RPC 2.0 structure
                if (jsonrpcRequest.jsonrpc !== "2.0" || !jsonrpcRequest.method) {
                    return this.sendJSONRPCError(res, {
                        id: jsonrpcRequest.id || null,
                        code: A2A_ERROR_CODES.INVALID_REQUEST,
                        message: 'Invalid JSON-RPC 2.0 request'
                    });
                }

                const response = await this.handleA2AMethod(jsonrpcRequest);
                res.json(response);
            } catch (error) {
                console.error('[A2A] Error handling request:', error);
                this.sendJSONRPCError(res, {
                    id: null,
                    code: A2A_ERROR_CODES.INTERNAL_ERROR,
                    message: 'Internal server error'
                });
            }
        });

        // Server-Sent Events endpoint for streaming
        this.app.post('/a2a/stream', (req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Cache-Control'
            });

            // Handle streaming A2A requests
            this.handleA2AStream(req.body, res);
        });

        // WhatsApp Webhook Integration
        this.app.post('/webhook/whatsapp', async (req, res) => {
            try {
                const whatsappMessage = this.parseWhatsAppWebhook(req.body);
                if (whatsappMessage) {
                    const response = await this.processWhatsAppMessage(whatsappMessage);
                    if (response) {
                        await this.sendWhatsAppResponse(response);
                    }
                }
                res.status(200).json({ status: 'ok' });
            } catch (error) {
                console.error('[WhatsApp] Error handling webhook:', error);
                res.status(500).json({ error: 'Webhook processing failed' });
            }
        });

        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                protocol: 'Google A2A v0.2.0',
                timestamp: new Date().toISOString(),
                agents: this.agentSystem.getActiveAgents().length
            });
        });
    }

    // ============================================================================
    // A2A Protocol Method Handlers
    // ============================================================================

    private async handleA2AMethod(request: JSONRPCRequest): Promise<JSONRPCResponse> {
        try {
            switch (request.method) {
                case A2A_METHODS.MESSAGE_SEND:
                    return await this.handleMessageSend(request);

                case A2A_METHODS.TASKS_GET:
                    return await this.handleTasksGet(request);

                case A2A_METHODS.TASKS_CANCEL:
                    return await this.handleTasksCancel(request);

                case A2A_METHODS.TASKS_PUSH_NOTIFICATION_SET:
                    return await this.handleTasksPushNotificationSet(request);

                case A2A_METHODS.TASKS_PUSH_NOTIFICATION_GET:
                    return await this.handleTasksPushNotificationGet(request);

                case A2A_METHODS.TASKS_RESUBSCRIBE:
                    return await this.handleTasksResubscribe(request);

                default:
                    return {
                        jsonrpc: "2.0",
                        id: request.id,
                        error: {
                            code: A2A_ERROR_CODES.METHOD_NOT_FOUND,
                            message: `Method '${request.method}' not found`
                        }
                    };
            }
        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: request.id,
                error: {
                    code: A2A_ERROR_CODES.INTERNAL_ERROR,
                    message: (error as Error).message
                }
            };
        }
    }

    private async handleMessageSend(request: JSONRPCRequest): Promise<JSONRPCResponse> {
        const params = request.params as MessageSendParams;

        if (!params?.message) {
            return {
                jsonrpc: "2.0",
                id: request.id,
                error: {
                    code: A2A_ERROR_CODES.INVALID_PARAMS,
                    message: 'Missing required parameter: message'
                }
            };
        }

        // Convert to WhatsApp message format for processing
        const whatsappMessage: WhatsAppToA2AMessage = {
            whatsappMessageId: params.message.messageId,
            fromNumber: 'a2a-client',
            toNumber: 'financial-assistant',
            message: params.message,
            timestamp: new Date(),
            metadata: {
                conversationId: params.message.contextId || 'default'
            }
        };

        // Create mock financial context
        const context: FinancialContext = await this.createMockFinancialContext();

        const response = await this.agentSystem.processA2AMessage(whatsappMessage, context);

        if (response?.taskId) {
            const task = this.agentSystem.getTask(response.taskId);
            return {
                jsonrpc: "2.0",
                id: request.id,
                result: task
            };
        } else {
            // Return direct message response
            const message: Message = {
                kind: 'message',
                messageId: `msg_${Date.now()}`,
                role: 'agent',
                parts: [{ kind: 'text', text: response?.whatsappResponse.message || 'Response processed' }],
                contextId: params.message.contextId
            };

            return {
                jsonrpc: "2.0",
                id: request.id,
                result: message
            };
        }
    }

    private async handleTasksGet(request: JSONRPCRequest): Promise<JSONRPCResponse> {
        const params = request.params as TaskQueryParams;

        if (!params?.id) {
            return {
                jsonrpc: "2.0",
                id: request.id,
                error: {
                    code: A2A_ERROR_CODES.INVALID_PARAMS,
                    message: 'Missing required parameter: id'
                }
            };
        }

        const task = this.agentSystem.getTask(params.id);

        if (!task) {
            return {
                jsonrpc: "2.0",
                id: request.id,
                error: {
                    code: A2A_ERROR_CODES.TASK_NOT_FOUND,
                    message: `Task with id '${params.id}' not found`
                }
            };
        }

        return {
            jsonrpc: "2.0",
            id: request.id,
            result: task
        };
    }

    private async handleTasksCancel(request: JSONRPCRequest): Promise<JSONRPCResponse> {
        const params = request.params as TaskCancelParams;

        if (!params?.id) {
            return {
                jsonrpc: "2.0",
                id: request.id,
                error: {
                    code: A2A_ERROR_CODES.INVALID_PARAMS,
                    message: 'Missing required parameter: id'
                }
            };
        }

        const success = await this.agentSystem.cancelTask(params.id, params.reason);

        if (!success) {
            return {
                jsonrpc: "2.0",
                id: request.id,
                error: {
                    code: A2A_ERROR_CODES.TASK_NOT_FOUND,
                    message: `Task with id '${params.id}' not found or not cancelable`
                }
            };
        }

        return {
            jsonrpc: "2.0",
            id: request.id,
            result: { canceled: true }
        };
    }

    private async handleTasksPushNotificationSet(request: JSONRPCRequest): Promise<JSONRPCResponse> {
        // Push notifications not implemented yet
        return {
            jsonrpc: "2.0",
            id: request.id,
            error: {
                code: A2A_ERROR_CODES.PUSH_NOTIFICATION_NOT_SUPPORTED,
                message: 'Push notifications not supported in this implementation'
            }
        };
    }

    private async handleTasksPushNotificationGet(request: JSONRPCRequest): Promise<JSONRPCResponse> {
        // Push notifications not implemented yet
        return {
            jsonrpc: "2.0",
            id: request.id,
            error: {
                code: A2A_ERROR_CODES.PUSH_NOTIFICATION_NOT_SUPPORTED,
                message: 'Push notifications not supported in this implementation'
            }
        };
    }

    private async handleTasksResubscribe(request: JSONRPCRequest): Promise<JSONRPCResponse> {
        const params = request.params as TaskResubscribeParams;

        if (!params?.id) {
            return {
                jsonrpc: "2.0",
                id: request.id,
                error: {
                    code: A2A_ERROR_CODES.INVALID_PARAMS,
                    message: 'Missing required parameter: id'
                }
            };
        }

        const task = this.agentSystem.getTask(params.id);

        if (!task) {
            return {
                jsonrpc: "2.0",
                id: request.id,
                error: {
                    code: A2A_ERROR_CODES.TASK_NOT_FOUND,
                    message: `Task with id '${params.id}' not found`
                }
            };
        }

        // Return current task state for resubscription
        return {
            jsonrpc: "2.0",
            id: request.id,
            result: task
        };
    }

    // ============================================================================
    // Streaming Support
    // ============================================================================

    private async handleA2AStream(
        requestBody: JSONRPCRequest,
        res: express.Response
    ): Promise<void> {
        try {
            if (requestBody.method === A2A_METHODS.MESSAGE_STREAM) {
                const params = requestBody.params as MessageSendParams;

                // Send initial response
                this.sendSSEEvent(res, {
                    jsonrpc: "2.0",
                    id: requestBody.id,
                    result: {
                        kind: 'task',
                        id: `stream_task_${Date.now()}`,
                        contextId: params.message.contextId || `ctx_${Date.now()}`,
                        status: {
                            state: 'submitted',
                            timestamp: new Date().toISOString()
                        },
                        history: [params.message],
                        artifacts: []
                    }
                });

                // Simulate streaming updates
                setTimeout(() => {
                    this.sendSSEEvent(res, {
                        jsonrpc: "2.0",
                        id: requestBody.id,
                        result: {
                            kind: 'status-update',
                            taskId: `stream_task_${Date.now()}`,
                            contextId: params.message.contextId || `ctx_${Date.now()}`,
                            status: {
                                state: 'working',
                                timestamp: new Date().toISOString()
                            },
                            final: false
                        }
                    });
                }, 1000);

                setTimeout(() => {
                    this.sendSSEEvent(res, {
                        jsonrpc: "2.0",
                        id: requestBody.id,
                        result: {
                            kind: 'status-update',
                            taskId: `stream_task_${Date.now()}`,
                            contextId: params.message.contextId || `ctx_${Date.now()}`,
                            status: {
                                state: 'completed',
                                timestamp: new Date().toISOString()
                            },
                            final: true
                        }
                    });
                    res.end();
                }, 3000);
            }
        } catch (error) {
            console.error('[A2A Stream] Error:', error);
            res.end();
        }
    }

    private sendSSEEvent(res: express.Response, data: any): void {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    // ============================================================================
    // WhatsApp Integration
    // ============================================================================

    private parseWhatsAppWebhook(body: any): WhatsAppToA2AMessage | null {
        try {
            // Parse UAZAPI webhook format
            if (body.messages && body.messages.length > 0) {
                const msg = body.messages[0];
                const textPart: TextPart = {
                    kind: 'text',
                    text: msg.body || msg.text?.body || ''
                };

                return {
                    whatsappMessageId: msg.id,
                    fromNumber: msg.from,
                    toNumber: msg.to || 'assistant',
                    message: {
                        kind: 'message',
                        messageId: msg.id,
                        role: 'user',
                        parts: [textPart]
                    },
                    timestamp: new Date(msg.timestamp * 1000),
                    metadata: {
                        instanceId: body.instance_id,
                        conversationId: msg.chat_id
                    }
                };
            }
            return null;
        } catch (error) {
            console.error('[WhatsApp] Error parsing webhook:', error);
            return null;
        }
    }

    private async processWhatsAppMessage(
        whatsappMessage: WhatsAppToA2AMessage
    ): Promise<A2AToWhatsAppResponse | null> {
        // Create financial context from user profile
        const context = await this.createFinancialContext(whatsappMessage.fromNumber);

        return await this.agentSystem.processA2AMessage(whatsappMessage, context);
    }

    private async sendWhatsAppResponse(response: A2AToWhatsAppResponse): Promise<void> {
        try {
            const uazapiUrl = `${(this.agentSystem as any).uazapiConfig.baseUrl}/sendMessage`;

            const payload = {
                chatId: response.whatsappResponse.to,
                message: response.whatsappResponse.message,
                type: response.whatsappResponse.type
            };

            await fetch(uazapiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(this.agentSystem as any).uazapiConfig.apiKey}`
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('[WhatsApp] Error sending response:', error);
        }
    }

    // ============================================================================
    // Utility Methods
    // ============================================================================

    private async createFinancialContext(userNumber: string): Promise<FinancialContext> {
        // Create mock context - in production, fetch from database
        return await this.createMockFinancialContext();
    }

    private async createMockFinancialContext(): Promise<FinancialContext> {
        const userProfile: UserProfile = {
            id: 'mock-user',
            email: 'user@example.com',
            name: 'Mock User',
            monthlyIncome: 5000,
            preferredCurrency: 'USD',
            riskProfile: 'moderate',
            hasEmergencyFund: true,
            emergencyFundMonths: 6
        };

        return {
            userProfile,
            recentTransactions: [],
            currentGoals: [],
            portfolioValue: 25000,
            monthlyBudget: 4000,
            spendingCategories: {
                'food': 800,
                'transportation': 400,
                'entertainment': 300,
                'utilities': 200
            },
            conversationHistory: []
        };
    }

    private sendJSONRPCError(
        res: express.Response,
        error: { id: string | number | null; code: number; message: string; data?: any }
    ): void {
        const response: JSONRPCResponse = {
            jsonrpc: "2.0",
            id: error.id,
            error: {
                code: error.code,
                message: error.message,
                data: error.data
            }
        };
        res.json(response);
    }

    // ============================================================================
    // Server Management
    // ============================================================================

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`🚀 Google A2A Financial Agent System started on port ${this.port}`);
            console.log(`📋 Agent Card: http://localhost:${this.port}/.well-known/agent.json`);
            console.log(`🔗 A2A Endpoint: http://localhost:${this.port}/a2a`);
            console.log(`📡 Streaming: http://localhost:${this.port}/a2a/stream`);
            console.log(`📱 WhatsApp Webhook: http://localhost:${this.port}/webhook/whatsapp`);
            console.log(`✅ Health Check: http://localhost:${this.port}/health`);
        });
    }

    public stop(): void {
        console.log('🛑 Stopping Google A2A Financial Agent System...');
        process.exit(0);
    }
} 