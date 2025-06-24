// Google Agent-to-Agent (A2A) Protocol v0.2.0 Types
// Official specification: https://a2aproject.github.io/A2A/

import { UserProfile, ExpenseItem, FinancialGoal, Investment } from './finance';

// ============================================================================
// JSON-RPC 2.0 Base Types
// ============================================================================

export interface JSONRPCRequest {
    jsonrpc: "2.0";
    id: string | number;
    method: string;
    params?: unknown;
}

export interface JSONRPCResponse {
    jsonrpc: "2.0";
    id: string | number | null;
    result?: unknown;
    error?: JSONRPCError;
}

export interface JSONRPCError {
    code: number;
    message: string;
    data?: unknown;
}

// ============================================================================
// A2A Protocol Core Types
// ============================================================================

// Part Types for multimodal content
export type Part =
    | TextPart
    | FilePart
    | DataPart
    | ImagePart
    | AudioPart
    | VideoPart
    | FunctionCallPart
    | FunctionResponsePart
    | ErrorPart
    | StatusPart;

export interface TextPart {
    kind: "text";
    text: string;
    metadata?: Record<string, unknown>;
}

export interface FilePart {
    kind: "file";
    file: {
        name?: string;
        mimeType: string;
        data?: string; // base64 encoded
        uri?: string;  // Alternative to data
        bytes?: string; // Alternative field name
        size?: number; // File size in bytes
        checksum?: string; // File integrity verification
    };
    metadata?: Record<string, unknown>;
}

export interface DataPart {
    kind: "data";
    data: Record<string, unknown>;
    schema?: JSONSchema; // Optional schema validation
    metadata?: Record<string, unknown>;
}

export interface ImagePart {
    kind: "image";
    image: {
        url?: string;
        data?: string; // base64 encoded
        mimeType: string; // image/jpeg, image/png, image/webp, etc.
        width?: number;
        height?: number;
        alt?: string; // Alternative text description
        caption?: string;
    };
    metadata?: Record<string, unknown>;
}

export interface AudioPart {
    kind: "audio";
    audio: {
        url?: string;
        data?: string; // base64 encoded
        mimeType: string; // audio/mpeg, audio/wav, audio/ogg, etc.
        duration?: number; // Duration in seconds
        transcript?: string; // Speech-to-text transcript
        language?: string; // Language code (e.g., 'en-US')
    };
    metadata?: Record<string, unknown>;
}

export interface VideoPart {
    kind: "video";
    video: {
        url?: string;
        data?: string; // base64 encoded
        mimeType: string; // video/mp4, video/webm, etc.
        duration?: number; // Duration in seconds
        width?: number;
        height?: number;
        thumbnail?: string; // base64 encoded thumbnail
        caption?: string;
        transcript?: string; // Video transcript/subtitles
    };
    metadata?: Record<string, unknown>;
}

export interface FunctionCallPart {
    kind: "function-call";
    functionCall: {
        name: string;
        args: Record<string, unknown>;
        id?: string; // Unique identifier for this call
    };
    metadata?: Record<string, unknown>;
}

export interface FunctionResponsePart {
    kind: "function-response";
    functionResponse: {
        name: string;
        response: unknown;
        id?: string; // Matches the function call ID
        success: boolean;
        error?: string;
    };
    metadata?: Record<string, unknown>;
}

export interface ErrorPart {
    kind: "error";
    error: {
        code: string | number;
        message: string;
        details?: Record<string, unknown>;
        recoverable?: boolean;
    };
    metadata?: Record<string, unknown>;
}

export interface StatusPart {
    kind: "status";
    status: {
        type: "progress" | "info" | "warning" | "success" | "typing";
        message?: string;
        progress?: number; // 0-100 percentage
        details?: Record<string, unknown>;
    };
    metadata?: Record<string, unknown>;
}

// ============================================================================
// Agent Card Types (Google A2A Specification v0.2.0)
// ============================================================================

export interface AgentCard {
    name: string;
    description: string;
    version: string;
    url?: string;

    // Provider Information
    provider?: {
        organization: string;
        url?: string;
        contact?: string;
        logo?: string;
        termsOfService?: string;
        privacyPolicy?: string;
    };

    // Agent Capabilities and Features
    capabilities?: {
        streaming?: boolean;
        pushNotifications?: boolean;
        stateTransitionHistory?: boolean;
        multimodal?: boolean;
        functionCalling?: boolean;
        fileProcessing?: boolean;
        realTimeData?: boolean;
        memoryPersistence?: boolean;
        contextAwareness?: boolean;
        languageSupport?: string[]; // e.g., ['en', 'es', 'fr']
        maxContextLength?: number;
        maxFileSize?: number; // in bytes
        supportedFileTypes?: string[]; // MIME types
    };

    // Security Configuration
    securitySchemes?: Record<string, SecurityScheme>;
    security?: SecurityRequirement[];

    // Input/Output Configuration
    defaultInputModes?: string[];
    defaultOutputModes?: string[];
    supportedInputModes?: string[];
    supportedOutputModes?: string[];

    // Skills and Functions
    skills: Skill[];
    functions?: Function[];

    // Advanced Features
    supportsAuthenticatedExtendedCard?: boolean;
    rateLimit?: {
        requests?: number;
        window?: string; // e.g., "1h", "1d"
        burst?: number;
    };

    // API Endpoints
    endpoints?: {
        tasks?: string;
        stream?: string;
        wellKnown?: string;
        health?: string;
        metrics?: string;
    };

    // Metadata
    tags?: string[];
    categories?: string[];
    license?: string;
    documentation?: string;
    examples?: AgentExample[];

    // A2A Protocol Specific
    a2aVersion?: string; // A2A protocol version
    lastUpdated?: string; // ISO 8601 timestamp
    schemaVersion?: string;
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    tags?: string[];
    examples?: string[];
    inputModes?: string[];
    outputModes?: string[];
    parameters?: JSONSchema;
    returns?: JSONSchema;

    // Enhanced A2A Skill Properties
    category?: string;
    complexity?: "simple" | "moderate" | "complex";
    estimatedDuration?: string; // e.g., "5s", "30s", "2m"
    requiresContext?: boolean;
    supportsBatch?: boolean;
    supportsStreaming?: boolean;
    rateLimit?: {
        calls?: number;
        window?: string;
    };
    prerequisites?: string[]; // Required skills or conditions
    postConditions?: string[]; // Effects or state changes
    confidence?: number; // 0-1 confidence in skill execution
    version?: string;
    deprecated?: boolean;
    replacedBy?: string; // Skill ID that replaces this one
}

export interface Function {
    name: string;
    description: string;
    parameters?: JSONSchema;
    returns?: JSONSchema;
    examples?: FunctionExample[];
    category?: string;
    tags?: string[];
    async?: boolean;
    timeout?: number; // milliseconds
    retryPolicy?: {
        maxRetries?: number;
        backoffMs?: number;
    };
}

export interface FunctionExample {
    name: string;
    description?: string;
    input: Record<string, unknown>;
    output: unknown;
    metadata?: Record<string, unknown>;
}

export interface AgentExample {
    title: string;
    description?: string;
    userMessage: string;
    expectedResponse?: string;
    context?: Record<string, unknown>;
    skillsUsed?: string[];
    functionsUsed?: string[];
    complexity?: "simple" | "moderate" | "complex";
    category?: string;
}

export interface SecurityScheme {
    type: "apiKey" | "http" | "oauth2" | "openIdConnect";
    scheme?: string;
    bearerFormat?: string;
    in?: "query" | "header" | "cookie";
    name?: string;
    flows?: Record<string, unknown>;
    openIdConnectUrl?: string;
}

export interface SecurityRequirement {
    [scheme: string]: string[];
}

export interface JSONSchema {
    type?: string;
    properties?: Record<string, JSONSchema>;
    required?: string[];
    items?: JSONSchema;
    enum?: unknown[];
    format?: string;
    description?: string;
}

// ============================================================================
// Message Types
// ============================================================================

export interface Message {
    kind: "message";
    messageId: string;
    role: "user" | "agent";
    parts: Part[];
    taskId?: string;
    contextId?: string;
    metadata?: Record<string, unknown>;
}

// ============================================================================
// Task Types
// ============================================================================

export type TaskState =
    | "submitted"
    | "working"
    | "input-required"
    | "completed"
    | "canceled"
    | "failed"
    | "unknown";

export interface TaskStatus {
    state: TaskState;
    message?: Message;
    timestamp: string; // ISO 8601
}

export interface Artifact {
    artifactId: string;
    name?: string;
    index?: number;
    parts: Part[];
    metadata?: Record<string, unknown>;
}

export interface Task {
    kind: "task";
    id: string;
    contextId: string;
    status: TaskStatus;
    history: Message[];
    artifacts?: Artifact[];
    metadata?: Record<string, unknown>;
}

// ============================================================================
// Event Types for Streaming
// ============================================================================

export interface TaskStatusUpdateEvent {
    kind: "status-update";
    taskId: string;
    contextId: string;
    status: TaskStatus;
    final?: boolean;
}

export interface TaskArtifactUpdateEvent {
    kind: "artifact-update";
    taskId: string;
    contextId: string;
    artifact: Artifact;
    append?: boolean;
    lastChunk?: boolean;
}

export type StreamEvent = Task | TaskStatusUpdateEvent | TaskArtifactUpdateEvent | Message;

// ============================================================================
// A2A Method Types
// ============================================================================

// Message methods
export interface MessageSendParams {
    message: Message;
    configuration?: {
        blocking?: boolean;
        acceptedOutputModes?: string[];
        pushNotificationConfig?: PushNotificationConfig;
    };
    metadata?: Record<string, unknown>;
}

export type MessageSendResponse = Task | Message;

// Task methods
export interface TaskQueryParams {
    id: string;
}

export interface TaskCancelParams {
    id: string;
    reason?: string;
}

export interface PushNotificationConfig {
    url: string;
    token?: string;
    authentication?: {
        schemes: string[];
        credentials?: Record<string, unknown>;
    };
}

export interface TaskPushNotificationParams {
    id: string;
    config: PushNotificationConfig;
}

export interface TaskResubscribeParams {
    id: string;
}

// ============================================================================
// Financial Context for A2A Agents
// ============================================================================

export interface FinancialContext {
    userProfile: UserProfile;
    recentTransactions: ExpenseItem[];
    currentGoals: FinancialGoal[];
    portfolioValue: number;
    monthlyBudget: number;
    spendingCategories: Record<string, number>;
    conversationHistory: Message[];
}

// ============================================================================
// A2A Agent Configuration
// ============================================================================

export interface A2AAgent {
    id: string;
    name: string;
    description: string;
    agentCard: AgentCard;
    skills: string[];
    isActive: boolean;
    endpoint?: string;
    authentication?: {
        type: "none" | "apiKey" | "bearer" | "oauth2";
        credentials?: Record<string, string>;
    };
}

// ============================================================================
// A2A Task Execution Context
// ============================================================================

export interface A2ATaskContext {
    task: Task;
    agent: A2AAgent;
    userProfile?: UserProfile;
    financialContext?: FinancialContext;
    metadata?: Record<string, unknown>;
}

// ============================================================================
// A2A Error Codes (JSON-RPC 2.0 Extensions)
// ============================================================================

export const A2A_ERROR_CODES = {
    // JSON-RPC 2.0 Standard Errors
    PARSE_ERROR: -32700,
    INVALID_REQUEST: -32600,
    METHOD_NOT_FOUND: -32601,
    INVALID_PARAMS: -32602,
    INTERNAL_ERROR: -32603,

    // A2A Specific Errors
    TASK_NOT_FOUND: -32000,
    TASK_NOT_CANCELABLE: -32001,
    PUSH_NOTIFICATION_NOT_SUPPORTED: -32002,
    UNSUPPORTED_OPERATION: -32003,
    AUTHENTICATION_FAILED: -32004,
    AUTHORIZATION_FAILED: -32005,
    SKILL_NOT_FOUND: -32006,
    INVALID_AGENT_CARD: -32007,
    TASK_TIMEOUT: -32008,
    INVALID_PART_TYPE: -32009,
    ARTIFACT_NOT_FOUND: -32010
} as const;

// ============================================================================
// A2A Protocol Methods
// ============================================================================

export const A2A_METHODS = {
    // Core messaging
    MESSAGE_SEND: "message/send",
    MESSAGE_STREAM: "message/stream",

    // Task management
    TASKS_GET: "tasks/get",
    TASKS_CANCEL: "tasks/cancel",
    TASKS_RESUBSCRIBE: "tasks/resubscribe",

    // Push notifications
    TASKS_PUSH_NOTIFICATION_SET: "tasks/pushNotification/set",
    TASKS_PUSH_NOTIFICATION_GET: "tasks/pushNotification/get",

    // Agent discovery
    AGENT_CARD_GET: "/.well-known/agent.json"
} as const;

// ============================================================================
// WhatsApp to A2A Bridge Types
// ============================================================================

export interface WhatsAppToA2AMessage {
    whatsappMessageId: string;
    fromNumber: string;
    toNumber: string;
    message: Message;
    timestamp: Date;
    metadata?: {
        instanceId?: string;
        conversationId?: string;
        userSession?: string;
    };
}

export interface A2AToWhatsAppResponse {
    taskId?: string;
    contextId?: string;
    whatsappResponse: {
        to: string;
        message: string;
        type: "text" | "media" | "interactive";
        metadata?: Record<string, unknown>;
    };
} 