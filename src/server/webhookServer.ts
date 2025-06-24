import { A2AWebhookHandler, MemorySessionManager, A2AWebhookPayload } from '../services/a2a/webhookHandler';

// Basic webhook server interface for handling WhatsApp messages
export interface WebhookServer {
    start(port: number): Promise<void>;
    stop(): Promise<void>;
    addAuthorizedNumber(phoneNumber: string): void;
    removeAuthorizedNumber(phoneNumber: string): void;
}

export class UazapiWebhookServer implements WebhookServer {
    private handler: A2AWebhookHandler;
    private sessionManager: MemorySessionManager;
    private serverInstance: any;

    constructor(
        uazapiApiKey: string,
        uazapiInstanceId: string,
        allowedNumbers: string[] = []
    ) {
        this.sessionManager = new MemorySessionManager();
        this.handler = new A2AWebhookHandler(
            uazapiApiKey,
            uazapiInstanceId,
            this.sessionManager,
            allowedNumbers
        );

        // Clean up old sessions every hour
        setInterval(() => {
            this.sessionManager.cleanupOldSessions(24);
        }, 60 * 60 * 1000);
    }

    async start(port: number = 3001): Promise<void> {
        try {
            // Mock server for development - replace with actual Express implementation
            console.log(`[Webhook Server] Starting on port ${port}`);

            // Simulate webhook endpoint
            const webhookEndpoint = `/webhook/whatsapp`;
            console.log(`[Webhook Server] Webhook endpoint: http://localhost:${port}${webhookEndpoint}`);

            // For testing purposes, create a simple message handler
            this.setupTestHandler();

            console.log('[Webhook Server] Server started successfully');
        } catch (error) {
            console.error('[Webhook Server] Failed to start:', error);
            throw error;
        }
    }

    async stop(): Promise<void> {
        if (this.serverInstance) {
            console.log('[Webhook Server] Stopping server...');
            // this.serverInstance.close();
            console.log('[Webhook Server] Server stopped');
        }
    }

    addAuthorizedNumber(phoneNumber: string): void {
        this.handler.addAuthorizedNumber(phoneNumber);
        console.log(`[Webhook Server] Added authorized number: ${phoneNumber}`);
    }

    removeAuthorizedNumber(phoneNumber: string): void {
        this.handler.removeAuthorizedNumber(phoneNumber);
        console.log(`[Webhook Server] Removed authorized number: ${phoneNumber}`);
    }

    // Test handler for development
    private setupTestHandler(): void {
        console.log('[Webhook Server] Setting up test message handler...');

        // Simulate incoming message every 30 seconds for testing
        setTimeout(() => {
            this.simulateIncomingMessage();
        }, 10000); // Start after 10 seconds
    }

    private async simulateIncomingMessage(): Promise<void> {
        const testPayload: A2AWebhookPayload = {
            event: 'message.received',
            data: {
                messageId: `test_${Date.now()}`,
                from: '+1234567890',
                to: '+0987654321',
                type: 'text',
                message: {
                    text: 'I spent $25 on lunch today'
                },
                timestamp: Math.floor(Date.now() / 1000),
                instance_id: 'test_instance'
            }
        };

        console.log('[Webhook Server] Simulating incoming message:', testPayload.data.message.text);
        await this.handler.handleIncomingMessage(testPayload);
    }

    // Method to manually process a test message
    async processTestMessage(
        phoneNumber: string,
        message: string
    ): Promise<void> {
        const payload: A2AWebhookPayload = {
            event: 'message.received',
            data: {
                messageId: `manual_${Date.now()}`,
                from: phoneNumber,
                to: '+0987654321',
                type: 'text',
                message: {
                    text: message
                },
                timestamp: Math.floor(Date.now() / 1000),
                instance_id: 'manual_test'
            }
        };

        await this.handler.handleIncomingMessage(payload);
    }

    // Get session statistics
    async getStats(): Promise<{
        totalSessions: number;
        activeSessions: number;
        totalMessages: number;
    }> {
        return await this.handler.getSessionStats();
    }
}

// Configuration for the webhook server
export interface WebhookConfig {
    uazapiApiKey: string;
    uazapiInstanceId: string;
    port?: number;
    allowedNumbers?: string[];
    enableLogging?: boolean;
}

// Factory function to create and configure the webhook server
export function createWebhookServer(config: WebhookConfig): UazapiWebhookServer {
    return new UazapiWebhookServer(
        config.uazapiApiKey,
        config.uazapiInstanceId,
        config.allowedNumbers || []
    );
}

// Example usage function
export async function startWhatsAppWebhookServer(): Promise<UazapiWebhookServer> {
    const config: WebhookConfig = {
        uazapiApiKey: process.env.UAZAPI_API_KEY || 'test_key',
        uazapiInstanceId: process.env.UAZAPI_INSTANCE_ID || 'test_instance',
        port: parseInt(process.env.WEBHOOK_PORT || '3001'),
        allowedNumbers: process.env.ALLOWED_NUMBERS?.split(',') || [],
        enableLogging: true
    };

    const server = createWebhookServer(config);
    await server.start(config.port);

    console.log('[Webhook] WhatsApp AI Agent is ready to receive messages!');
    console.log('[Webhook] Configuration:', {
        port: config.port,
        allowedNumbers: config.allowedNumbers,
        instanceId: config.uazapiInstanceId
    });

    return server;
} 