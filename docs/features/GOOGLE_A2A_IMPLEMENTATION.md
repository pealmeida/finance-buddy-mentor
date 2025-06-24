# Google Agent-to-Agent (A2A) Protocol Implementation

## Overview

This document describes the implementation of Google's official Agent-to-Agent (A2A) Protocol v0.2.0 in the Finance Buddy Mentor application. The A2A protocol enables seamless communication and collaboration between AI agents across different platforms and frameworks.

## Protocol Specification

The implementation follows the official Google A2A Protocol specification:
- **Protocol Version**: v0.2.0
- **Transport**: JSON-RPC 2.0 over HTTP(S)
- **Discovery**: Agent Cards via `.well-known/agent.json`
- **Communication**: Synchronous, Streaming (SSE), and Push Notifications

## Architecture

### 1. Core Components

#### A2A Types (`src/types/a2a.ts`)
- **JSON-RPC 2.0 Base Types**: Request, Response, Error handling
- **Part Types**: TextPart, FilePart, DataPart for multimodal content
- **Agent Cards**: Skills, capabilities, security schemes
- **Tasks**: Lifecycle management (submitted/working/completed/failed)
- **Messages**: User and agent communication
- **Events**: Status updates and artifact streaming

#### Financial Agent System (`src/services/crewai/financialAgent.ts`)
- **GoogleA2AFinancialAgentSystem**: Main orchestrator class
- **Multi-Agent Architecture**: 5 specialized financial agents
- **A2A Compliance**: Official protocol implementation
- **WhatsApp Integration**: Bridge between WhatsApp and A2A

#### Webhook Handler (`src/services/a2a/webhookHandler.ts`)
- **HTTP Server**: Express.js with A2A endpoints
- **JSON-RPC 2.0**: Request/response handling
- **Streaming**: Server-Sent Events support
- **WhatsApp Bridge**: UAZAPI integration

### 2. Agent Architecture

#### Personal Financial Manager (Coordinator)
- **Role**: Main interface and agent coordinator
- **Skills**: Agent coordination, natural language processing
- **Purpose**: Routes requests to specialist agents

#### Expense Tracking Specialist
- **Role**: Expense tracking and analysis
- **Skills**: Track expenses, analyze spending patterns
- **Purpose**: Handle all expense-related queries

#### Savings Strategy Specialist
- **Role**: Savings optimization and strategy
- **Skills**: Optimize savings, emergency fund planning
- **Purpose**: Provide savings advice and strategies

#### Financial Goals Specialist
- **Role**: Goal setting and tracking
- **Skills**: Set goals, track progress, milestone management
- **Purpose**: Manage financial objectives

#### Investment Advisory Specialist
- **Role**: Investment advice and portfolio management
- **Skills**: Portfolio analysis, investment recommendations
- **Purpose**: Provide investment guidance

## Protocol Implementation

### 1. Agent Card Structure

Each agent exposes an official A2A Agent Card:

```json
{
  "name": "Personal Financial Manager",
  "description": "Main coordinator for financial tasks",
  "version": "1.0.0",
  "url": "http://localhost:3000/agents/personal-manager",
  "provider": {
    "organization": "Finance Buddy Mentor",
    "url": "https://github.com/pealmeida/finance-buddy-mentor"
  },
  "capabilities": {
    "streaming": true,
    "pushNotifications": true,
    "stateTransitionHistory": true
  },
  "defaultInputModes": ["text/plain", "application/json"],
  "defaultOutputModes": ["text/plain", "application/json"],
  "skills": [
    {
      "id": "coordinate_agents",
      "name": "Agent Coordination",
      "description": "Coordinate with specialist agents",
      "tags": ["coordination", "management"],
      "examples": ["Analyze my financial situation"],
      "parameters": {
        "type": "object",
        "properties": {
          "query": {"type": "string"},
          "context": {"type": "object"}
        }
      }
    }
  ]
}
```

### 2. Task Lifecycle

Tasks follow the official A2A state machine:

```
submitted → working → completed
    ↓         ↓         ↑
    ↓    input-required ↑
    ↓         ↓         ↑
    → canceled / failed
```

### 3. Message Structure

All messages use the official A2A format:

```typescript
interface Message {
  kind: "message";
  messageId: string;
  role: "user" | "agent";
  parts: Part[];
  taskId?: string;
  contextId?: string;
  metadata?: Record<string, unknown>;
}
```

### 4. Multimodal Parts

Support for different content types:

```typescript
// Text content
interface TextPart {
  kind: "text";
  text: string;
  metadata?: Record<string, unknown>;
}

// File content
interface FilePart {
  kind: "file";
  file: {
    name?: string;
    mimeType: string;
    data?: string; // base64
    uri?: string;
  };
}

// Structured data
interface DataPart {
  kind: "data";
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}
```

## API Endpoints

### 1. Agent Discovery
- **GET** `/.well-known/agent.json` - Agent Card discovery

### 2. JSON-RPC 2.0 Methods
- **POST** `/a2a` - Main A2A protocol endpoint
  - `message/send` - Send message to agent
  - `message/stream` - Send with streaming response
  - `tasks/get` - Get task status
  - `tasks/cancel` - Cancel task
  - `tasks/pushNotification/set` - Configure notifications
  - `tasks/pushNotification/get` - Get notification config
  - `tasks/resubscribe` - Resubscribe to task updates

### 3. Streaming
- **POST** `/a2a/stream` - Server-Sent Events endpoint

### 4. WhatsApp Integration
- **POST** `/webhook/whatsapp` - WhatsApp webhook for UAZAPI

### 5. Health Check
- **GET** `/health` - System health and status

## WhatsApp to A2A Bridge

### Message Conversion

```typescript
// WhatsApp → A2A
interface WhatsAppToA2AMessage {
  whatsappMessageId: string;
  fromNumber: string;
  toNumber: string;
  message: Message; // A2A Message
  timestamp: Date;
  metadata?: {
    instanceId?: string;
    conversationId?: string;
  };
}

// A2A → WhatsApp
interface A2AToWhatsAppResponse {
  taskId?: string;
  contextId?: string;
  whatsappResponse: {
    to: string;
    message: string;
    type: "text" | "media" | "interactive";
    metadata?: Record<string, unknown>;
  };
}
```

## Error Handling

### JSON-RPC 2.0 Error Codes

```typescript
export const A2A_ERROR_CODES = {
  // Standard JSON-RPC 2.0
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  
  // A2A Extensions
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
```

## Usage Examples

### 1. Direct A2A Communication

```bash
curl -X POST http://localhost:3000/a2a \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {
      "message": {
        "messageId": "msg-123",
        "role": "user",
        "parts": [{"kind": "text", "text": "How much did I spend this month?"}],
        "kind": "message"
      }
    }
  }'
```

### 2. Streaming Communication

```bash
curl -X POST http://localhost:3000/a2a/stream \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "method": "message/stream",
    "params": {
      "message": {
        "messageId": "msg-124",
        "role": "user",
        "parts": [{"kind": "text", "text": "Create a comprehensive financial plan"}],
        "kind": "message"
      }
    }
  }'
```

### 3. Agent Card Discovery

```bash
curl http://localhost:3000/.well-known/agent.json
```

## Configuration

### Environment Variables

```bash
# UAZAPI Configuration
UAZAPI_API_KEY=your_api_key
UAZAPI_INSTANCE_ID=your_instance_id
UAZAPI_BASE_URL=https://api.uazapi.com

# Server Configuration
A2A_PORT=3000
A2A_HOST=localhost

# Database Configuration
DATABASE_URL=your_database_url
```

### Starting the System

```typescript
import { GoogleA2AWebhookHandler } from './src/services/a2a/webhookHandler';

const handler = new GoogleA2AWebhookHandler(
  process.env.UAZAPI_API_KEY!,
  process.env.UAZAPI_INSTANCE_ID!,
  3000
);

handler.start();
```

## Security

### Authentication
- Agent-to-agent authentication via API keys
- OAuth 2.0 support for external integrations
- JWT tokens for session management

### Authorization
- Skill-based access control
- User permission validation
- Rate limiting per agent

### Data Privacy
- Agents maintain opacity (no internal state sharing)
- End-to-end encryption for sensitive data
- GDPR compliance for user data

## Monitoring and Observability

### Metrics
- Task completion rates
- Agent response times
- Error frequencies
- WhatsApp message volumes

### Logging
- Structured JSON logging
- Request/response tracing
- Agent communication logs
- Error stack traces

### Health Checks
- Agent availability monitoring
- Database connectivity
- WhatsApp API status
- System resource usage

## Future Enhancements

### Protocol Extensions
- Dynamic UX negotiation
- QuerySkill() method for capability discovery
- Enhanced multimodal support (audio/video)
- Advanced authentication schemes

### Agent Capabilities
- Learning from user interactions
- Proactive notifications
- Cross-agent memory sharing
- Advanced reasoning capabilities

### Integration Features
- MCP (Model Context Protocol) bridge
- Google Cloud AI Platform integration
- Third-party financial service APIs
- Voice and video calling support

## Compliance

This implementation follows:
- **Google A2A Protocol v0.2.0** specification
- **JSON-RPC 2.0** standard
- **HTTP/1.1** and **HTTP/2** protocols
- **Server-Sent Events** specification
- **OpenAPI 3.0** for security schemes

## Support

For issues and questions:
- **GitHub Repository**: https://github.com/pealmeida/finance-buddy-mentor
- **A2A Protocol Documentation**: https://a2aproject.github.io/A2A/
- **Google A2A Community**: https://github.com/a2aproject/A2A/discussions 