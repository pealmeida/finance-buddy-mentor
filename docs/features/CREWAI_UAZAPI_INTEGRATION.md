# CrewAI + uazapi WhatsApp Integration

This document describes the implementation of a CrewAI-powered financial assistant integrated with uazapi for WhatsApp Business API communication using A2A protocol.

## Overview

The system consists of:
- **CrewAI Financial Agent**: AI-powered assistant using CrewAI framework
- **A2A Protocol Handler**: Application-to-Application messaging protocol
- **uazapi Integration**: WhatsApp Business API service connection
- **Session Management**: User conversation state management
- **Webhook Server**: Incoming message processing

## Architecture

```
WhatsApp User 
    ↓ (sends message)
uazapi Service 
    ↓ (webhook)
A2A Webhook Handler 
    ↓ (processes)
CrewAI Financial Agent 
    ↓ (generates response)
uazapi Service 
    ↓ (sends response)
WhatsApp User
```

## Core Components

### 1. CrewAI Financial Agent (`src/services/crewai/financialAgent.ts`)

**Key Features:**
- Natural language understanding for financial conversations
- Intent analysis (expense tracking, reporting, goal tracking, investment analysis)
- Context-aware responses based on user's financial data
- Multi-currency support
- Personalized insights and recommendations

**Agent Configuration:**
```typescript
{
  role: "Personal Financial Assistant",
  goal: "Provide comprehensive financial guidance through WhatsApp",
  backstory: "Experienced financial advisor with expertise in personal finance",
  tools: ['expense_tracker', 'budget_analyzer', 'investment_monitor'],
  verbose: true,
  allowDelegation: false
}
```

**Supported Interactions:**
- Expense Recording: "I spent $50 on groceries"
- Financial Reports: "Show me my spending report"
- Goal Tracking: "How are my goals doing?"
- Investment Analysis: "Portfolio overview"
- Budget Checks: "How much budget do I have left?"
- Financial Advice: "Give me financial advice"

### 2. A2A Protocol Handler (`src/services/a2a/webhookHandler.ts`)

**A2A Message Structure:**
```typescript
interface A2AMessage {
  messageId: string;
  fromNumber: string;
  toNumber: string;
  messageType: 'text' | 'media' | 'interactive' | 'template';
  content: string;
  timestamp: Date;
  metadata?: {
    userId?: string;
    sessionId?: string;
    conversationId?: string;
    context?: any;
  };
}
```

**Key Functions:**
- Message validation and authorization
- User session management
- Financial context building
- Error handling and fallbacks

### 3. Webhook Server (`src/server/webhookServer.ts`)

**Features:**
- Express.js webhook endpoints for uazapi
- Session cleanup and management
- Test message simulation
- Statistics and monitoring

**Endpoints:**
- `POST /webhook/whatsapp` - Receive messages from uazapi
- `GET /stats` - Session and usage statistics
- `POST /test` - Send test messages

## uazapi Integration

### API Configuration

Based on the [uazapi-v2 Postman collection](https://www.postman.com/augustofcs/uazapi-v2/), the integration uses:

**Base URL:** `https://api.uazapi.com`

**Key Endpoints:**
- `POST /v1/send-message` - Send WhatsApp messages
- `POST /v1/webhook` - Configure webhook URL
- `GET /v1/instance/{id}/status` - Check instance status

**Authentication:**
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${UAZAPI_API_KEY}`
}
```

### Message Sending

```typescript
const payload = {
  number: phoneNumber.replace('+', ''),
  message: content,
  instance_id: instanceId
};

const response = await fetch(`${baseUrl}/v1/send-message`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify(payload)
});
```

### Webhook Configuration

Set up webhook URL in uazapi dashboard:
- **Webhook URL:** `https://your-domain.com/webhook/whatsapp`
- **Events:** `message.received`, `message.status`
- **Method:** POST

## Environment Configuration

Create `.env` file with:

```bash
# uazapi Configuration
UAZAPI_API_KEY=your_uazapi_api_key
UAZAPI_INSTANCE_ID=your_uazapi_instance_id
UAZAPI_BASE_URL=https://api.uazapi.com

# A2A Protocol
WEBHOOK_PORT=3001
WEBHOOK_SECRET=your_webhook_secret
ALLOWED_NUMBERS=+1234567890,+0987654321

# CrewAI Configuration
CREWAI_MODEL=gpt-4-turbo
CREWAI_TEMPERATURE=0.7
CREWAI_MAX_TOKENS=2000

# Financial Agent
AGENT_DAILY_UPDATES=true
AGENT_WEEKLY_REPORTS=true
AGENT_GOAL_REMINDERS=true
AGENT_EXPENSE_ALERTS=true
AGENT_INVESTMENT_UPDATES=true
AGENT_SPENDING_LIMIT_ALERTS=true
AGENT_EMERGENCY_FUND_ALERTS=true
AGENT_CUSTOM_ALERT_THRESHOLD=500
AGENT_PREFERRED_UPDATE_TIME=09:00
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
# Additional packages may be needed for CrewAI integration
npm install axios dotenv cors helmet
```

### 2. Configure uazapi Instance

1. Sign up at uazapi service
2. Create a new WhatsApp Business instance
3. Get API key and instance ID
4. Configure webhook URL pointing to your server

### 3. Set Up Webhook Server

```typescript
import { startWhatsAppWebhookServer } from './src/server/webhookServer';

// Start the webhook server
const server = await startWhatsAppWebhookServer();
console.log('WhatsApp AI Agent is ready!');
```

### 4. Configure Frontend Integration

Update `src/components/profile/PersonalInfoTab.tsx` to connect with the webhook server:

```typescript
// Add webhook server status check
const checkWebhookStatus = async () => {
  try {
    const response = await fetch('/api/webhook/status');
    const status = await response.json();
    setWebhookStatus(status.active);
  } catch (error) {
    console.error('Failed to check webhook status:', error);
  }
};
```

## Testing

### 1. Unit Tests

```bash
# Test CrewAI agent
npm test src/services/crewai/financialAgent.test.ts

# Test A2A protocol handler
npm test src/services/a2a/webhookHandler.test.ts

# Test webhook server
npm test src/server/webhookServer.test.ts
```

### 2. Integration Testing

```typescript
// Test message processing
const server = new UazapiWebhookServer(apiKey, instanceId);
await server.processTestMessage('+1234567890', 'I spent $25 on lunch');
```

### 3. Manual Testing with curl

```bash
# Send test webhook message
curl -X POST http://localhost:3001/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message.received",
    "data": {
      "messageId": "test123",
      "from": "+1234567890",
      "to": "+0987654321",
      "type": "text",
      "message": {
        "text": "I spent $50 on groceries"
      },
      "timestamp": 1640995200,
      "instance_id": "test_instance"
    }
  }'
```

## Usage Examples

### Expense Tracking
**User:** "I spent $25 on lunch at McDonald's"  
**Agent:** 
```
✅ Expense Recorded Successfully!

💰 Amount: $25.00
📁 Category: Food
📝 Description: lunch at McDonald's

📊 Quick Stats:
• Total spent in food this month: $325.00
• Remaining budget: $1,675.00

Type "report" to see your full monthly summary! 📈
```

### Financial Report
**User:** "Show me my monthly spending report"  
**Agent:**
```
📊 January 2024 Financial Dashboard

💸 Total Spending: $2,800.00
💰 Remaining Budget: $1,200.00
📈 Budget Used: 70.0%

📋 Spending by Category:
• 🏠 Housing: $1,500.00 (53.6%)
• 🍔 Food: $650.00 (23.2%)
• 🚗 Transportation: $400.00 (14.3%)
• 🎯 Entertainment: $250.00 (8.9%)

🎯 Goals Progress:
• Emergency Fund: 25.0% complete
• Vacation Fund: 60.0% complete

💡 Type "insight" for personalized recommendations!
```

### Goal Tracking
**User:** "How are my financial goals doing?"  
**Agent:**
```
🎯 Your Financial Goals Progress

📈 Emergency Fund
💰 Target: $10,000.00
💵 Current: $2,500.00
📊 Progress: 25.0% 🎯
🎯 Remaining: $7,500.00

💪 Getting started! Every step counts towards your goal!

📈 Vacation Fund
💰 Target: $5,000.00
💵 Current: $3,000.00
📊 Progress: 60.0% 🚀
🎯 Remaining: $2,000.00

🚀 Halfway there! Keep up the momentum!
```

## Security Considerations

### 1. Phone Number Authorization
- Whitelist authorized phone numbers
- Verify WhatsApp number ownership
- Implement rate limiting

### 2. Data Protection
- Encrypt sensitive financial data
- Secure webhook endpoints
- Validate all incoming messages

### 3. Session Security
- Implement session timeouts
- Secure session storage
- Monitor for suspicious activity

## Monitoring & Analytics

### 1. Message Metrics
- Total messages processed
- Response time analytics
- Error rate monitoring
- User engagement tracking

### 2. Financial Insights
- Most common expense categories
- Budget utilization patterns
- Goal achievement rates
- Investment portfolio performance

### 3. System Health
- Webhook uptime monitoring
- uazapi API status
- Database connection health
- Server resource usage

## Deployment

### 1. Production Environment

```bash
# Build the application
npm run build

# Start webhook server
npm run start:webhook

# Deploy to cloud platform (AWS, Google Cloud, etc.)
```

### 2. Webhook URL Configuration

Update uazapi webhook URL to point to production server:
```
https://your-domain.com/webhook/whatsapp
```

### 3. SSL/TLS Configuration

Ensure HTTPS is enabled for webhook endpoints:
```bash
# Use Let's Encrypt or similar
certbot --nginx -d your-domain.com
```

## Troubleshooting

### Common Issues

1. **Webhook not receiving messages**
   - Check uazapi webhook configuration
   - Verify server is running on correct port
   - Check firewall settings

2. **Agent not responding**
   - Verify CrewAI configuration
   - Check financial context data
   - Review error logs

3. **Message sending fails**
   - Validate uazapi API credentials
   - Check instance status
   - Verify phone number format

### Debug Commands

```bash
# Check webhook server status
curl http://localhost:3001/stats

# Test message processing
node -e "
const { UazapiWebhookServer } = require('./dist/server/webhookServer');
const server = new UazapiWebhookServer('test', 'test');
server.processTestMessage('+1234567890', 'test message');
"

# View session data
node -e "
const { MemorySessionManager } = require('./dist/services/a2a/webhookHandler');
const manager = new MemorySessionManager();
console.log(manager.getUserSession('+1234567890'));
"
```

## Future Enhancements

### 1. Advanced AI Features
- Multi-language support
- Voice message processing
- Image receipt analysis
- Investment recommendations

### 2. Integration Expansions
- Bank account connections
- Credit card APIs
- Investment platform APIs
- Cryptocurrency exchanges

### 3. Enhanced User Experience
- Interactive buttons and menus
- Rich media responses
- Scheduled notifications
- Group chat support

## Support

For technical support:
- Create issues in the GitHub repository
- Check uazapi documentation
- Review CrewAI framework docs
- Contact the development team

---

This integration provides a robust foundation for WhatsApp-based financial assistance using modern AI and messaging technologies. 