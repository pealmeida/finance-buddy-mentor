import { UserProfile, ExpenseItem, FinancialGoal, Investment } from '../types/finance';

export interface WhatsAppMessage {
    from: string;
    body: string;
    timestamp: Date;
    messageId: string;
}

export interface WhatsAppResponse {
    to: string;
    message: string;
    type: 'text' | 'media' | 'interactive';
}

export interface AgentCommand {
    type: 'expense' | 'goal' | 'investment' | 'report' | 'insight' | 'query';
    action: string;
    data?: any;
}

export class WhatsAppAgent {
    private userId: string;
    private userProfile: UserProfile;
    private apiEndpoint: string;
    private accessToken: string;

    constructor(userId: string, userProfile: UserProfile) {
        this.userId = userId;
        this.userProfile = userProfile;
        this.apiEndpoint = process.env.WHATSAPP_API_ENDPOINT || '';
        this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    }

    // Send message to user via WhatsApp
    async sendMessage(response: WhatsAppResponse): Promise<boolean> {
        try {
            const payload = {
                messaging_product: 'whatsapp',
                to: response.to,
                type: 'text',
                text: {
                    body: response.message
                }
            };

            const result = await fetch(`${this.apiEndpoint}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            return result.ok;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            return false;
        }
    }

    // Process incoming WhatsApp message
    async processMessage(message: WhatsAppMessage): Promise<WhatsAppResponse | null> {
        try {
            const command = await this.parseMessage(message.body);

            if (!command) {
                return {
                    to: message.from,
                    message: this.getHelpMessage(),
                    type: 'text'
                };
            }

            return await this.executeCommand(command, message.from);
        } catch (error) {
            console.error('Error processing WhatsApp message:', error);
            return {
                to: message.from,
                message: 'Sorry, I encountered an error processing your request. Please try again.',
                type: 'text'
            };
        }
    }

    // Parse natural language message into command
    private async parseMessage(message: string): Promise<AgentCommand | null> {
        const lowerMessage = message.toLowerCase().trim();

        // Expense tracking patterns
        if (lowerMessage.includes('spent') || lowerMessage.includes('expense') || lowerMessage.includes('paid')) {
            const amount = this.extractAmount(message);
            const category = this.extractCategory(message);
            const description = this.extractDescription(message);

            if (amount) {
                return {
                    type: 'expense',
                    action: 'add',
                    data: { amount, category, description }
                };
            }
        }

        // Financial report patterns
        if (lowerMessage.includes('report') || lowerMessage.includes('summary') || lowerMessage.includes('spending')) {
            return {
                type: 'report',
                action: 'monthly',
                data: {}
            };
        }

        // Goal tracking patterns
        if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
            if (lowerMessage.includes('progress') || lowerMessage.includes('status')) {
                return {
                    type: 'goal',
                    action: 'status',
                    data: {}
                };
            }
        }

        // Investment patterns
        if (lowerMessage.includes('investment') || lowerMessage.includes('portfolio')) {
            return {
                type: 'investment',
                action: 'overview',
                data: {}
            };
        }

        // General financial insights
        if (lowerMessage.includes('insight') || lowerMessage.includes('advice') || lowerMessage.includes('recommend')) {
            return {
                type: 'insight',
                action: 'generate',
                data: {}
            };
        }

        return null;
    }

    // Execute parsed command
    private async executeCommand(command: AgentCommand, userNumber: string): Promise<WhatsAppResponse> {
        switch (command.type) {
            case 'expense':
                return await this.handleExpenseCommand(command, userNumber);
            case 'report':
                return await this.handleReportCommand(command, userNumber);
            case 'goal':
                return await this.handleGoalCommand(command, userNumber);
            case 'investment':
                return await this.handleInvestmentCommand(command, userNumber);
            case 'insight':
                return await this.handleInsightCommand(command, userNumber);
            default:
                return {
                    to: userNumber,
                    message: this.getHelpMessage(),
                    type: 'text'
                };
        }
    }

    // Handle expense-related commands
    private async handleExpenseCommand(command: AgentCommand, userNumber: string): Promise<WhatsAppResponse> {
        if (command.action === 'add' && command.data) {
            const { amount, category, description } = command.data;

            // Here you would integrate with your expense tracking API
            // For now, we'll simulate the response

            const response = `✅ Expense recorded successfully!
💰 Amount: ${this.formatCurrency(amount)}
📁 Category: ${category || 'Other'}
📝 Description: ${description || 'No description'}

Your monthly spending is now updated. Type "report" to see your current month summary.`;

            return {
                to: userNumber,
                message: response,
                type: 'text'
            };
        }

        return {
            to: userNumber,
            message: 'I need more details to record your expense. Try: "I spent $50 on groceries"',
            type: 'text'
        };
    }

    // Handle financial report commands
    private async handleReportCommand(command: AgentCommand, userNumber: string): Promise<WhatsAppResponse> {
        // Here you would fetch actual data from your API
        const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const response = `📊 *${currentMonth} Financial Summary*

💸 *Total Spending:* ${this.formatCurrency(2840)}
💰 *Remaining Budget:* ${this.formatCurrency(1160)}
📈 *vs Last Month:* +12% increase

*Top Categories:*
🏠 Housing: ${this.formatCurrency(1200)}
🍔 Food: ${this.formatCurrency(650)}
🚗 Transport: ${this.formatCurrency(480)}
🎯 Entertainment: ${this.formatCurrency(310)}
💊 Healthcare: ${this.formatCurrency(200)}

🎯 *Goals Progress:*
Emergency Fund: 75% complete
Vacation: 45% complete

Need help optimizing your spending? Type "insight" for personalized advice!`;

        return {
            to: userNumber,
            message: response,
            type: 'text'
        };
    }

    // Handle goal-related commands
    private async handleGoalCommand(command: AgentCommand, userNumber: string): Promise<WhatsAppResponse> {
        const response = `🎯 *Your Financial Goals Status*

🚨 *Emergency Fund*
Target: ${this.formatCurrency(10000)}
Current: ${this.formatCurrency(7500)}
Progress: 75% ✅
Status: On track! ${this.formatCurrency(2500)} to go

🏖️ *Vacation Fund*
Target: ${this.formatCurrency(5000)}
Current: ${this.formatCurrency(2250)}
Progress: 45% 📈
Status: Slightly behind schedule

🏠 *Down Payment*
Target: ${this.formatCurrency(50000)}
Current: ${this.formatCurrency(12000)}
Progress: 24% 🔄
Status: Long-term progress

💡 *Tip:* Increase your vacation fund by ${this.formatCurrency(100)}/month to stay on track!`;

        return {
            to: userNumber,
            message: response,
            type: 'text'
        };
    }

    // Handle investment-related commands
    private async handleInvestmentCommand(command: AgentCommand, userNumber: string): Promise<WhatsAppResponse> {
        const response = `📈 *Investment Portfolio Overview*

💼 *Total Portfolio Value:* ${this.formatCurrency(45200)}
📊 *Today's Change:* +${this.formatCurrency(340)} (+0.75%)

*Asset Allocation:*
📊 Stocks: 60% (${this.formatCurrency(27120)})
🏛️ Bonds: 25% (${this.formatCurrency(11300)})
💰 Cash/Emergency: 10% (${this.formatCurrency(4520)})
🏗️ Real Estate: 5% (${this.formatCurrency(2260)})

*Top Performers:*
🚀 Tech ETF: +2.3% today
📈 S&P 500: +0.8% today
🏦 Bond Fund: +0.1% today

*Portfolio Health:* ✅ Well diversified
*Risk Level:* Moderate (matches your profile)

Need investment advice? Type "insight" for personalized recommendations!`;

        return {
            to: userNumber,
            message: response,
            type: 'text'
        };
    }

    // Handle insight/advice commands
    private async handleInsightCommand(command: AgentCommand, userNumber: string): Promise<WhatsAppResponse> {
        const response = `💡 *Personalized Financial Insights*

*This Month's Analysis:*
⚠️ Your food spending is 20% above average. Consider meal planning to save ~${this.formatCurrency(130)}/month.

🎯 You're ahead on your emergency fund goal! Great job! 

📈 *Recommendations:*
1. Reduce dining out by 2 meals/week → Save ${this.formatCurrency(80)}/month
2. Consider increasing retirement contributions by 1%
3. Your insurance is due for review - could save ${this.formatCurrency(45)}/month

💰 *Opportunity:* 
Switch to a high-yield savings account for emergency fund → Extra ${this.formatCurrency(15)}/month in interest

🔮 *Forecast:*
At current pace, you'll reach vacation goal 2 months late. Increase monthly contribution by ${this.formatCurrency(100)} to stay on track.

Want me to help with any specific area? Just ask!`;

        return {
            to: userNumber,
            message: response,
            type: 'text'
        };
    }

    // Extract amount from message using regex
    private extractAmount(message: string): number | null {
        const amountRegex = /\$?(\d+(?:\.\d{2})?)/;
        const match = message.match(amountRegex);
        return match ? parseFloat(match[1]) : null;
    }

    // Extract category from message
    private extractCategory(message: string): string {
        const categories = {
            'food': ['food', 'groceries', 'restaurant', 'dining', 'lunch', 'dinner', 'breakfast'],
            'transportation': ['gas', 'uber', 'taxi', 'bus', 'train', 'transport'],
            'housing': ['rent', 'mortgage', 'utilities', 'electricity', 'water', 'internet'],
            'entertainment': ['movie', 'concert', 'game', 'entertainment', 'fun'],
            'healthcare': ['doctor', 'medicine', 'pharmacy', 'hospital', 'health'],
            'shopping': ['shopping', 'clothes', 'amazon', 'store']
        };

        const lowerMessage = message.toLowerCase();

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                return category;
            }
        }

        return 'other';
    }

    // Extract description from message
    private extractDescription(message: string): string {
        // Remove common expense-related words and amounts to get description
        const cleanMessage = message
            .replace(/\$?\d+(?:\.\d{2})?/g, '')
            .replace(/\b(spent|paid|bought|purchased|on|for|at)\b/gi, '')
            .trim();

        return cleanMessage.length > 3 ? cleanMessage : '';
    }

    // Format currency according to user's preferred currency
    private formatCurrency(amount: number): string {
        const currency = this.userProfile.preferredCurrency || 'USD';

        switch (currency) {
            case 'BRL':
                return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            case 'EUR':
                return `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;
            default:
                return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        }
    }

    // Get help message with available commands
    private getHelpMessage(): string {
        return `🤖 *Finance Buddy AI Assistant*

I can help you with:

💰 *Track Expenses:*
"I spent $50 on groceries"
"Paid $30 for gas"

📊 *Get Reports:*
"Show me my spending report"
"Monthly summary"

🎯 *Check Goals:*
"How are my goals doing?"
"Goal progress"

📈 *Investment Updates:*
"Portfolio overview"
"How are my investments?"

💡 *Get Insights:*
"Give me financial advice"
"What should I optimize?"

Just send me a message in natural language and I'll help you manage your finances! 🚀`;
    }

    // Send daily financial update
    async sendDailyUpdate(userNumber: string): Promise<boolean> {
        const today = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const message = `🌅 *Good Morning! Daily Financial Update*
📅 ${today}

💰 *Yesterday's Spending:* ${this.formatCurrency(45.67)}
🎯 *Monthly Budget Remaining:* ${this.formatCurrency(1160)}
📊 *This Month vs Last:* +12% increase

🚨 *Quick Reminder:*
Your emergency fund goal is 75% complete - you're doing great! 

💡 *Today's Tip:* Pack lunch today and save ~${this.formatCurrency(12)} 🥪

Type "report" for detailed analysis or "insight" for personalized advice!`;

        return await this.sendMessage({
            to: userNumber,
            message,
            type: 'text'
        });
    }

    // Send weekly financial report
    async sendWeeklyReport(userNumber: string): Promise<boolean> {
        const message = `📊 *Weekly Financial Summary*

🗓️ *Week Ending:* ${new Date().toLocaleDateString()}

💸 *Weekly Spending:* ${this.formatCurrency(387.45)}
📈 *vs Last Week:* -8% decrease ✅
🎯 *Budget Adherence:* 92% on track

*This Week's Categories:*
🍔 Food: ${this.formatCurrency(125)} (32%)
🚗 Transport: ${this.formatCurrency(89)} (23%)
🎯 Entertainment: ${this.formatCurrency(67)} (17%)
🛒 Shopping: ${this.formatCurrency(106)} (28%)

🏆 *Achievement Unlocked:*
You stayed under budget for 5 consecutive days!

📈 *Goals Progress:*
Emergency Fund: +${this.formatCurrency(200)} this week
Vacation Fund: +${this.formatCurrency(150)} this week

Keep up the great work! 🌟`;

        return await this.sendMessage({
            to: userNumber,
            message,
            type: 'text'
        });
    }
}

// Webhook handler for incoming WhatsApp messages
export async function handleWhatsAppWebhook(payload: any): Promise<void> {
    try {
        const entry = payload.entry?.[0];
        const changes = entry?.changes?.[0];
        const messages = changes?.value?.messages;

        if (!messages || messages.length === 0) {
            return;
        }

        for (const message of messages) {
            const from = message.from;
            const body = message.text?.body;
            const messageId = message.id;

            if (!body) continue;

            // Get user profile by WhatsApp number
            const userProfile = await getUserProfileByWhatsApp(from);

            if (!userProfile || !userProfile.whatsAppAgentEnabled) {
                continue;
            }

            const agent = new WhatsAppAgent(userProfile.id, userProfile);

            const incomingMessage: WhatsAppMessage = {
                from,
                body,
                timestamp: new Date(),
                messageId
            };

            const response = await agent.processMessage(incomingMessage);

            if (response) {
                await agent.sendMessage(response);
            }
        }
    } catch (error) {
        console.error('Error handling WhatsApp webhook:', error);
    }
}

// Mock function to get user profile by WhatsApp number
async function getUserProfileByWhatsApp(whatsAppNumber: string): Promise<UserProfile | null> {
    // In a real implementation, this would query your database
    // For now, return null to indicate user not found
    return null;
}

// Schedule daily updates for all active WhatsApp agents
export async function sendScheduledUpdates(): Promise<void> {
    try {
        // Get all users with WhatsApp agent enabled
        const activeUsers = await getActiveWhatsAppUsers();

        for (const user of activeUsers) {
            if (user.whatsAppAgentConfig?.dailyUpdates) {
                const agent = new WhatsAppAgent(user.id, user);
                await agent.sendDailyUpdate(user.whatsAppNumber!);

                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    } catch (error) {
        console.error('Error sending scheduled updates:', error);
    }
}

// Mock function to get active WhatsApp users
async function getActiveWhatsAppUsers(): Promise<UserProfile[]> {
    // In a real implementation, this would query your database
    return [];
} 