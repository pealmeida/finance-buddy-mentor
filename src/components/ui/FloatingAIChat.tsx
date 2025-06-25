import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { UserProfile } from "../../types/finance";
import {
  Bot,
  Send,
  Loader2,
  X,
  MessageCircle,
  Expand,
  Minimize,
  Trash2,
  Sparkles,
  History,
  Plus,
  Brain,
  Users,
  Shield,
  AlertTriangle,
  Activity,
  ArrowRight,
  Settings,
  TrendingUp,
  DollarSign,
  Target,
  CreditCard,
  PieChart,
  Calculator,
  CheckCircle,
  XCircle,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../context/CurrencyContext";
import { useIsMobile } from "../../hooks/use-mobile";
import { Input } from "./input";
import { Switch } from "./switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./sheet";

// Enhanced interfaces for agent system
interface Agent {
  id: string;
  name: string;
  type: "triage" | "specialist" | "guardrail";
  status: "active" | "processing" | "inactive";
  isEnabled: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  content: string;
  timestamp: Date;
  type: "routing" | "processing" | "response" | "guardrail";
  metadata?: {
    confidence?: number;
    intent?: string;
    guardrailType?: string;
  };
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: "suggestion" | "analysis" | "general";
  agentFlow?: AgentMessage[];
  guardrailTriggered?: boolean;
}

interface FloatingAIChatProps {
  userProfile: UserProfile;
  savingsProgress: number;
  expensesRatio: number;
}

const FloatingAIChat: React.FC<FloatingAIChatProps> = ({
  userProfile,
  savingsProgress,
  expensesRatio,
}) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [currentAgentFlow, setCurrentAgentFlow] = useState<AgentMessage[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [conversations, setConversations] = useState<
    {
      id: string;
      title: string;
      messages: Message[];
      createdAt: Date;
      lastActivity: Date;
    }[]
  >([]);
  const [currentConversationId, setCurrentConversationId] =
    useState<string>("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize first conversation if none exists
      if (!currentConversationId) {
        const newConvId = `conv-${Date.now()}`;
        setCurrentConversationId(newConvId);
      }

      // Mensagem de boas-vindas quando o chat é aberto pela primeira vez
      const userName = userProfile.name?.split(" ")[0] || "você";
      const welcomeMessage: Message = {
        id: "welcome",
        content: t("dashboard.aiAssistant.welcome", {
          name: userName,
          defaultValue: isMobile
            ? `Olá ${userName}! 👋 Sou seu assistente financeiro pessoal. Analisei seus dados e estou pronto para ajudar com estratégias de economia, sugestões de investimento e análise de gastos. Como posso ajudá-lo hoje?`
            : `Olá ${userName}! 👋 Sou seu assistente financeiro pessoal. Analisei seus dados e estou pronto para ajudar com estratégias de economia, sugestões de investimento e análise de gastos. Como posso ajudá-lo hoje?`,
        }),
        isUser: false,
        timestamp: new Date(),
        type: "general",
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, userProfile.name, t, messages.length, currentConversationId]);

  // Initialize CrewAI Multi-Agent System
  useEffect(() => {
    const crewAIAgents: Agent[] = [
      {
        id: "personal-agent",
        name: "Personal Manager",
        type: "triage",
        status: "active",
        isEnabled: true,
        icon: Users,
        color: "blue",
        description: "Main interface and agent manager",
      },
      {
        id: "expense-agent",
        name: "Expense Specialist",
        type: "specialist",
        status: "active",
        isEnabled: true,
        icon: CreditCard,
        color: "green",
        description: "Expense tracking and analysis expert",
      },
      {
        id: "savings-agent",
        name: "Savings Specialist",
        type: "specialist",
        status: "active",
        isEnabled: true,
        icon: PieChart,
        color: "blue",
        description: "Savings optimization and strategy expert",
      },
      {
        id: "goals-agent",
        name: "Goals Specialist",
        type: "specialist",
        status: "active",
        isEnabled: true,
        icon: Target,
        color: "indigo",
        description: "Financial goal setting and tracking expert",
      },
      {
        id: "investment-agent",
        name: "Investment Specialist",
        type: "specialist",
        status: "active",
        isEnabled: true,
        icon: TrendingUp,
        color: "purple",
        description: "Investment advisory and portfolio management expert",
      },
    ];

    setActiveAgents(crewAIAgents);
  }, []);

  // Simulate agent orchestration flow
  const simulateAgentFlow = (userMessage: string): AgentMessage[] => {
    const lowerMessage = userMessage.toLowerCase();
    let targetAgent = "expense-agent";
    let intent = "expense_tracking";
    let confidence = 0.85;

    // Determine intent and target agent
    if (
      lowerMessage.includes("investimento") ||
      lowerMessage.includes("investir")
    ) {
      targetAgent = "investment-agent";
      intent = "investment_advice";
      confidence = 0.92;
    } else if (
      lowerMessage.includes("orçamento") ||
      lowerMessage.includes("budget")
    ) {
      targetAgent = "personal-agent"; // Budget handled by personal agent
      intent = "budget_planning";
      confidence = 0.88;
    } else if (
      lowerMessage.includes("meta") ||
      lowerMessage.includes("objetivo")
    ) {
      targetAgent = "goals-agent";
      intent = "goal_tracking";
      confidence = 0.9;
    } else if (
      lowerMessage.includes("economias") ||
      lowerMessage.includes("economizar") ||
      lowerMessage.includes("economia")
    ) {
      targetAgent = "savings-agent";
      intent = "savings_optimization";
      confidence = 0.87;
    }

    // Check if target agent is enabled
    const targetAgentObj = activeAgents.find(
      (agent) => agent.id === targetAgent
    );
    if (targetAgentObj && !targetAgentObj.isEnabled) {
      // Fallback to personal agent if target is disabled
      targetAgent = "personal-agent";
      intent = "general_assistance";
      confidence = 0.75;
    }

    // Check for guardrail triggers
    const shouldTriggerGuardrail =
      lowerMessage.includes("poema") ||
      lowerMessage.includes("receita") ||
      lowerMessage.includes("história") ||
      lowerMessage.includes("sistema") ||
      lowerMessage.includes("instruções");

    if (shouldTriggerGuardrail) {
      return [
        {
          id: "1",
          fromAgent: "user",
          toAgent: "triage-agent",
          content: userMessage,
          timestamp: new Date(),
          type: "processing",
        },
        {
          id: "2",
          fromAgent: "triage-agent",
          toAgent: "relevance-guardrail",
          content: "Checking message relevance...",
          timestamp: new Date(Date.now() + 500),
          type: "routing",
        },
        {
          id: "3",
          fromAgent: "relevance-guardrail",
          toAgent: "user",
          content:
            "🛡️ Desculpe, só posso responder questões relacionadas a finanças pessoais.",
          timestamp: new Date(Date.now() + 1000),
          type: "guardrail",
          metadata: { guardrailType: "relevance" },
        },
      ];
    }

    // Normal flow
    return [
      {
        id: "1",
        fromAgent: "user",
        toAgent: "triage-agent",
        content: userMessage,
        timestamp: new Date(),
        type: "processing",
      },
      {
        id: "2",
        fromAgent: "triage-agent",
        toAgent: targetAgent,
        content: `Routing ${intent} query to specialist agent`,
        timestamp: new Date(Date.now() + 500),
        type: "routing",
        metadata: { intent, confidence },
      },
      {
        id: "3",
        fromAgent: targetAgent,
        toAgent: "user",
        content: "Processing your request with specialized knowledge...",
        timestamp: new Date(Date.now() + 1000),
        type: "response",
      },
    ];
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simular delay da resposta da IA
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const userName = userProfile.name?.split(" ")[0] || "você";
    const monthlyIncome = userProfile.monthlyIncome || 0;
    const recommendedSavings = monthlyIncome * 0.2;

    // Análise baseada na mensagem do usuário
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("economias") ||
      lowerMessage.includes("economizar") ||
      lowerMessage.includes("economia")
    ) {
      if (savingsProgress < 50) {
        return t("dashboard.aiAssistant.savings.improvement", {
          name: userName,
          current: Math.round(savingsProgress),
          recommended: formatCurrency(recommendedSavings),
          defaultValue: `${userName}, analisando seus dados, você está economizando ${Math.round(
            savingsProgress
          )}% do valor recomendado. Para melhorar, sugiro:\n\n💰 Meta: ${formatCurrency(
            recommendedSavings
          )}/mês (20% da renda)\n🤖 Automatizar transferências\n📊 Revisar gastos não essenciais\n🎯 Criar metas específicas\n\nQuer que eu analise alguma categoria específica de gastos?`,
        });
      } else {
        return t("dashboard.aiAssistant.savings.good", {
          name: userName,
          current: Math.round(savingsProgress),
          defaultValue: `Parabéns ${userName}! 🎉 Você está economizando ${Math.round(
            savingsProgress
          )}% do valor recomendado, superando a meta!\n\n📈 Considere investir o excedente\n🏦 Diversificar em CDBs ou Tesouro Direto\n💼 Avaliar fundos de investimento\n\nPosso sugerir opções específicas baseadas no seu perfil de risco!`,
        });
      }
    }

    if (
      lowerMessage.includes("gasto") ||
      lowerMessage.includes("despesa") ||
      lowerMessage.includes("orçamento")
    ) {
      if (expensesRatio > 70) {
        return t("dashboard.aiAssistant.expenses.high", {
          name: userName,
          ratio: Math.round(expensesRatio),
          defaultValue: `${userName}, suas despesas representam ${Math.round(
            expensesRatio
          )}% da renda - acima do ideal (máx. 70%).\n\n📋 Categorize todos os gastos\n✂️ Identifique gastos supérfluos\n📊 Regra 50/30/20: 50% necessidades, 30% desejos, 20% economias\n🔄 Revise assinaturas não utilizadas\n\nQuer ajuda para criar um plano de redução de gastos?`,
        });
      } else {
        return t("dashboard.aiAssistant.expenses.good", {
          name: userName,
          ratio: Math.round(expensesRatio),
          defaultValue: `Muito bem ${userName}! 👏 Suas despesas estão controladas em ${Math.round(
            expensesRatio
          )}% da renda.\n\n✅ Continue monitorando\n Considere aumentar economias\n📈 Explore oportunidades de investimento\n🎯 Defina metas de longo prazo\n\nPosso ajudar a otimizar ainda mais suas finanças!`,
        });
      }
    }

    if (
      lowerMessage.includes("investimento") ||
      lowerMessage.includes("investir") ||
      lowerMessage.includes("aplicação")
    ) {
      const riskProfile = userProfile.riskProfile?.toLowerCase() || "moderate";
      return t(`dashboard.aiAssistant.investment.${riskProfile}`, {
        name: userName,
        defaultValue: `${userName}, baseado no seu perfil ${riskProfile}, recomendo uma estratégia adequada ao seu perfil de risco. Posso detalhar opções específicas de investimento!`,
      });
    }

    if (
      lowerMessage.includes("meta") ||
      lowerMessage.includes("objetivo") ||
      lowerMessage.includes("goal")
    ) {
      return t("dashboard.aiAssistant.goals", {
        name: userName,
        defaultValue: `${userName}, definir metas claras é fundamental! Baseado na sua situação:\n\n🚨 **Emergência**: 6 meses de gastos (prioridade #1)\n🏖️ **Aposentadoria**: 25x gastos anuais\n🎯 **Metas específicas**: viagem, casa, etc.\n📅 **Prazo definido** para cada objetivo\n\nQuer que eu calcule valores e prazos específicos para alguma meta?`,
      });
    }

    // Resposta genérica
    return t("dashboard.aiAssistant.general", {
      name: userName,
      defaultValue: `${userName}, posso ajudar com várias questões financeiras! 💡\n\n📊 **Análise personalizada** baseada nos seus dados reais\n💰 **Estratégias de economia** e controle de gastos\n📈 **Sugestões de investimento** para seu perfil\n🎯 **Planejamento de metas** e aposentadoria\n📱 **Dicas práticas** para o dia a dia\n\nO que gostaria de saber especificamente?`,
    });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    // Simulate agent orchestration flow
    const agentFlow = simulateAgentFlow(currentInput);
    setCurrentAgentFlow(agentFlow);

    // Update agent statuses during processing
    setActiveAgents((prev) =>
      prev.map((agent) => ({
        ...agent,
        status: agentFlow.some((flow) => flow.toAgent === agent.id)
          ? "processing"
          : agent.status,
      }))
    );

    try {
      const response = await generateResponse(currentInput);

      // Check for guardrail triggers
      const guardrailTriggered = agentFlow.some(
        (flow) => flow.type === "guardrail"
      );

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response,
        isUser: false,
        timestamp: new Date(),
        type: "analysis",
        agentFlow: agentFlow,
        guardrailTriggered: guardrailTriggered,
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Reset agent statuses
      setActiveAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          status: "active",
        }))
      );

      // Se o chat estiver em tela cheia, não mostrar notificação
      if (!isFullScreen) {
        setHasNewMessage(false);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: t("errors.chatError", {
          defaultValue: "Ocorreu um erro ao processar sua solicitação.",
        }),
        isUser: false,
        timestamp: new Date(),
        type: "general",
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Reset agent statuses on error
      setActiveAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          status: "active",
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // Quando o chat é aberto, a notificação de nova mensagem é "lida"
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Add a handler to close both full-screen and floating dialogs
  const handleCloseChat = () => {
    setIsFullScreen(false);
    setIsOpen(false);
  };

  const clearChat = () => {
    setMessages([]);
    // Mensagem de boas-vindas após limpar
    const userName = userProfile.name?.split(" ")[0] || "você";
    const welcomeMessage: Message = {
      id: "welcome",
      content: t("dashboard.aiAssistant.welcome", {
        name: userName,
        defaultValue: `Olá ${userName}! 👋 Sou seu assistente financeiro pessoal. Como posso ajudá-lo hoje?`,
      }),
      isUser: false,
      timestamp: new Date(),
      type: "general",
    };
    setMessages([welcomeMessage]);
  };

  const createNewConversation = () => {
    // Save current conversation if it has messages
    if (messages.length > 1 && currentConversationId) {
      const currentConv = conversations.find(
        (c) => c.id === currentConversationId
      );
      if (currentConv) {
        currentConv.messages = [...messages];
        currentConv.lastActivity = new Date();
        currentConv.title = generateConversationTitle(messages);
      }
    } else if (messages.length > 1) {
      // Create new conversation entry for current messages
      const newConv = {
        id: currentConversationId || `conv-${Date.now()}`,
        title: generateConversationTitle(messages),
        messages: [...messages],
        createdAt: new Date(),
        lastActivity: new Date(),
      };
      setConversations((prev) => [newConv, ...prev]);
    }

    // Start fresh conversation
    const newConvId = `conv-${Date.now()}`;
    setCurrentConversationId(newConvId);
    setMessages([]);
    setCurrentAgentFlow([]);
    setHasNewMessage(false);

    // Add welcome message for new conversation
    const userName = userProfile.name?.split(" ")[0] || "você";
    const welcomeMessage: Message = {
      id: "welcome-" + Date.now(),
      content: t("dashboard.aiAssistant.welcome", {
        name: userName,
        defaultValue: `Olá ${userName}! 👋 Nova conversa iniciada. Como posso ajudá-lo hoje?`,
      }),
      isUser: false,
      timestamp: new Date(),
      type: "general",
    };
    setMessages([welcomeMessage]);
  };

  const generateConversationTitle = (messages: Message[]): string => {
    const userMessages = messages.filter((m) => m.isUser);
    if (userMessages.length === 0) return "Nova Conversa";

    const firstUserMessage = userMessages[0].content;
    if (firstUserMessage.length > 50) {
      return firstUserMessage.substring(0, 50) + "...";
    }
    return firstUserMessage;
  };

  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      setMessages(conversation.messages);
      setShowHistoryDialog(false);

      // Update last activity
      conversation.lastActivity = new Date();
      setConversations((prev) => [...prev]);
    }
  };

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));

    // If deleting current conversation, create new one
    if (conversationId === currentConversationId) {
      createNewConversation();
    }
  };

  const toggleAgent = (agentId: string) => {
    setActiveAgents((prevAgents) =>
      prevAgents.map((agent) => {
        if (agent.id === agentId) {
          // Personal Manager cannot be disabled
          if (agent.type === "triage") {
            return agent;
          }

          const newIsEnabled = !agent.isEnabled;
          return {
            ...agent,
            isEnabled: newIsEnabled,
            status: newIsEnabled ? "active" : "inactive",
          };
        }
        return agent;
      })
    );
  };

  // Custom handlers for mutual exclusion between suggestions and settings panels
  const handleToggleSuggestions = () => {
    const newState = !showSuggestions;
    setShowSuggestions(newState);
    // If opening suggestions, close settings
    if (newState && showSettingsPanel) {
      setShowSettingsPanel(false);
    }
  };

  const handleToggleSettingsPanel = () => {
    const newState = !showSettingsPanel;
    setShowSettingsPanel(newState);
    // If opening settings, close suggestions
    if (newState && showSuggestions) {
      setShowSuggestions(false);
    }
  };

  // Render chat content (shared between floating and fullscreen modes)
  const renderChatContent = (isFullScreenMode: boolean = false) => {
    return (
      <>
        {/* Messages Area */}
        <div
          className={`flex-1 overflow-y-auto space-y-3 relative group ${
            showSettingsPanel ? "px-4 pt-2" : "px-4 pt-4"
          } ${isFullScreenMode ? "px-0 pt-2" : ""}`}>
          {/* Interactive Area Overlay - Only visible when no messages or empty areas */}
          {messages.length === 0 && (
            <div className='messages-empty-area absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
              <div className='text-center p-8 rounded-lg bg-blue-50/50 border-2 border-dashed border-blue-200'>
                <div className='flex items-center justify-center gap-4 mb-2'>
                  <div className='flex items-center gap-2 text-blue-600'>
                    <Settings className='h-4 w-4' />
                    <span className='text-sm font-medium'>
                      Clique para Configurações
                    </span>
                  </div>
                  <div className='text-gray-400'>|</div>
                  <div className='flex items-center gap-2 text-blue-600'>
                    <History className='h-4 w-4' />
                    <span className='text-sm font-medium'>
                      Clique direito para Histórico
                    </span>
                  </div>
                </div>
                <p className='text-xs text-gray-500'>
                  {isFullScreenMode
                    ? "Clique em qualquer área vazia para acessar configurações ou histórico"
                    : "Clique para abrir em tela cheia e acessar configurações"}
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
              onClick={(e) => e.stopPropagation()}>
              <div
                className={`max-w-[85%] p-2 rounded-lg text-sm ${
                  message.isUser
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-white border shadow-sm rounded-bl-sm"
                }`}>
                {!message.isUser && (
                  <div className='flex items-center gap-1 mb-1'>
                    <Bot className='h-3 w-3 text-blue-500' />
                    <span className='text-xs text-gray-500 font-medium'>
                      {t("dashboard.aiAssistant.botName", {
                        defaultValue: "Finance Bot",
                      })}
                    </span>
                    {/* Agent Flow Indicator */}
                    {message.agentFlow && message.agentFlow.length > 0 && (
                      <Badge
                        variant='outline'
                        className='text-xs px-1 py-0 ml-1'>
                        <Users className='h-2 w-2 mr-1' />
                        {message.agentFlow.length} agents
                      </Badge>
                    )}
                    {/* Guardrail Indicator */}
                    {message.guardrailTriggered && (
                      <Badge
                        variant='outline'
                        className='text-xs px-1 py-0 ml-1 text-yellow-600 border-yellow-300'>
                        <Shield className='h-2 w-2 mr-1' />
                        Protected
                      </Badge>
                    )}
                  </div>
                )}
                <p className='whitespace-pre-wrap'>{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    message.isUser ? "text-blue-100" : "text-gray-400"
                  }`}>
                  {message.timestamp.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div
              className='flex justify-start'
              onClick={(e) => e.stopPropagation()}>
              <div className='bg-white border shadow-sm p-3 rounded-lg text-sm max-w-[85%]'>
                <div className='flex items-center gap-2 mb-1'>
                  <Bot className='h-3 w-3 text-blue-500' />
                  <span className='text-xs text-gray-500 font-medium'>
                    {t("dashboard.aiAssistant.botName", {
                      defaultValue: "Finance Bot",
                    })}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='flex gap-1'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'></div>
                    <div
                      className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'
                      style={{ animationDelay: "0.1s" }}></div>
                    <div
                      className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'
                      style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className='text-gray-500'>
                    {t("dashboard.aiAssistant.thinking", {
                      defaultValue: "Analisando...",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Spacer for scroll */}
          <div ref={messagesEndRef} className='h-4 messages-empty-area'></div>

          {/* Interactive Areas for Messages Present */}
          {messages.length > 0 && (
            <>
              {/* Left side area - non-interactive */}
              <div className='absolute left-0 top-0 w-1/3 h-full opacity-0 messages-empty-area' />

              {/* Right side area - non-interactive */}
              <div className='absolute right-0 top-0 w-1/3 h-full opacity-0 messages-empty-area' />
            </>
          )}
        </div>

        {/* Enhanced Agent-Targeted Suggestions */}
        {messages.length <= 1 && (
          <div
            className={`border-t bg-blue-300/50 ${
              isFullScreenMode ? "mx-0" : ""
            }`}>
            <div
              className='flex items-center justify-between p-3 pb-2 cursor-pointer hover:bg-gray-100/50 transition-colors rounded-t-sm'
              onClick={handleToggleSuggestions}>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSuggestions();
                  }}
                  className='h-6 w-6 p-0 hover:bg-gray-200 transition-colors'
                  title={
                    showSuggestions ? "Ocultar sugestões" : "Mostrar sugestões"
                  }>
                  <Zap
                    className={`h-3 w-3 transition-transform duration-200 ${
                      showSuggestions ? "text-purple-600" : "text-gray-400"
                    }`}
                  />
                </Button>
                <p className='text-xs text-gray-600 font-medium'>
                  {t("dashboard.aiAssistant.quickSuggestionsTitle", {
                    defaultValue: "Sugestões:",
                  })}
                </p>
                <Badge variant='outline' className='text-xs'>
                  <Users className='h-2 w-2 mr-1' />
                  {activeAgents.length} agentes
                </Badge>
              </div>
              <div className='flex items-center'>
                {showSuggestions ? (
                  <ChevronUp className='h-4 w-4 text-gray-500 transition-transform duration-200' />
                ) : (
                  <ChevronDown className='h-4 w-4 text-gray-500 transition-transform duration-200' />
                )}
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showSuggestions
                  ? `${
                      isMobile ? "max-h-[300px]" : "max-h-[400px]"
                    } opacity-100`
                  : "max-h-0 opacity-0"
              }`}>
              <div
                className='px-3 pb-3 overflow-y-auto'
                style={{ maxHeight: isMobile ? "290px" : "390px" }}>
                <div
                  className={`grid gap-2 ${
                    isMobile ? "grid-cols-1" : "grid-cols-1"
                  }`}>
                  {getAgentSuggestions()
                    .slice(0, isMobile ? 4 : 6)
                    .map((suggestion, index) => {
                      const IconComponent = suggestion.icon;
                      return (
                        <Button
                          key={index}
                          variant='outline'
                          size='sm'
                          className={`w-full justify-start h-auto text-left hover:bg-blue-50 border-l-4 border-l-transparent hover:border-l-blue-400 transition-all ${
                            isMobile ? "p-2 ai-chat-mobile-suggestion" : "p-3"
                          }`}
                          onClick={() => {
                            setInputValue(suggestion.text);
                            inputRef.current?.focus();
                          }}>
                          <div className='flex items-center gap-2 w-full'>
                            <div
                              className={`p-1 rounded-full bg-${suggestion.color}-100`}>
                              <IconComponent
                                className={`h-3 w-3 text-${suggestion.color}-600`}
                              />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <div className='flex items-center gap-2 mb-1'>
                                <span
                                  className={`font-medium text-gray-800 truncate ${
                                    isMobile ? "text-xs" : "text-sm"
                                  }`}>
                                  {suggestion.text}
                                </span>
                              </div>
                              <div className='flex items-center gap-1'>
                                <Badge
                                  variant='secondary'
                                  className='text-xs px-1 py-0'>
                                  {suggestion.category}
                                </Badge>
                                {!isMobile && (
                                  <span className='text-xs text-gray-500'>
                                    →{" "}
                                    {activeAgents.find(
                                      (a) => a.id === suggestion.agent
                                    )?.name || "Specialist"}
                                  </span>
                                )}
                              </div>
                              {isMobile && suggestion.description && (
                                <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                                  {suggestion.description}
                                </p>
                              )}
                            </div>
                            <ArrowRight className='h-3 w-3 text-gray-400 flex-shrink-0' />
                          </div>
                        </Button>
                      );
                    })}
                </div>
                {/* Show More Button */}
                {getAgentSuggestions().length > (isMobile ? 4 : 6) && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full mt-2 text-xs text-gray-500 hover:text-gray-700'
                    onClick={() => {
                      // Could expand to show more suggestions or toggle between sets
                      setShowSuggestions(false);
                    }}>
                    <span>
                      Ver mais{" "}
                      {getAgentSuggestions().length - (isMobile ? 4 : 6)}{" "}
                      sugestões
                    </span>
                    <ArrowRight className='h-3 w-3 ml-1' />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Input de mensagem e botões de ação */}
        <div
          className={`flex items-stretch border-t ${
            isMobile
              ? "px-2 pt-2 pb-2 bg-gradient-to-r from-blue-500 to-blue-600 gap-1"
              : "px-3 pt-3 pb-3 bg-gradient-to-r from-blue-500 to-blue-600 gap-2"
          } ${isMobile && !isFullScreenMode ? "safe-area-inset-bottom" : ""} ${
            isFullScreenMode
              ? "px-4 pt-3 pb-3 bg-gradient-to-r from-blue-500 to-blue-600 gap-2"
              : ""
          } ${!isFullScreenMode ? "rounded-b-lg" : ""}`}
          style={{ paddingBottom: "12px" }}>
          {/* Nova conversa - lado esquerdo */}
          <Button
            onClick={createNewConversation}
            variant='ghost'
            size='sm'
            className={`${
              isMobile ? "h-10 w-8 p-0" : "h-10 w-9 p-0"
            } hover:bg-white/20 transition-all duration-200 flex-shrink-0`}
            title='Nova conversa'>
            <Plus
              className={`${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} text-white`}
            />
          </Button>

          {/* Input com melhor utilização do espaço */}
          <div className='flex-1 relative'>
            <Input
              ref={inputRef}
              type='text'
              placeholder={t("dashboard.aiAssistant.inputPlaceholder", {
                defaultValue: isMobile
                  ? "Pergunte sobre suas finanças..."
                  : "Digite sua pergunta sobre finanças...",
              })}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className={`w-full resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-200 transition-colors duration-200 ${
                isMobile ? "text-sm h-10 pr-12" : "h-10 pr-14"
              } ${isFullScreenMode ? "text-base" : ""}`}
              style={{
                paddingRight: isMobile ? "48px" : "56px",
              }}
            />

            {/* Botão de envio integrado no input */}
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              size='sm'
              className={`absolute right-1 top-1/2 -translate-y-1/2 ${
                isMobile ? "h-8 w-8 p-0" : "h-8 w-10 p-0"
              } bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white shadow-sm transition-all duration-200 ${
                !inputValue.trim() ? "opacity-50" : "opacity-100"
              }`}>
              {isLoading ? (
                <Loader2
                  className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} animate-spin`}
                />
              ) : (
                <Send className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              )}
            </Button>
          </div>
        </div>
      </>
    );
  };

  // Enhanced suggestions with agent targeting
  const getAgentSuggestions = () => [
    {
      text: t("dashboard.aiAssistant.quickSuggestions.expenses", {
        defaultValue: "Analisar meus gastos do último mês",
      }),
      agent: "expense-agent",
      icon: CreditCard,
      color: "green",
      category: "Gastos",
      description: "Identifique padrões de gastos e oportunidades de economia",
    },
    {
      text: t("dashboard.aiAssistant.quickSuggestions.investment", {
        defaultValue: "Recomendações de investimento para meu perfil",
      }),
      agent: "investment-agent",
      icon: TrendingUp,
      color: "purple",
      category: "Investimentos",
      description:
        "Obtenha estratégias personalizadas baseadas no seu perfil de risco",
    },
    {
      text: t("dashboard.aiAssistant.quickSuggestions.budget", {
        defaultValue: "Como criar um orçamento eficiente?",
      }),
      agent: "personal-agent",
      icon: Calculator,
      color: "orange",
      category: "Orçamento",
      description: "Planeje suas finanças com um orçamento personalizado",
    },
    {
      text: t("dashboard.aiAssistant.quickSuggestions.goals", {
        defaultValue: "Ajudar a definir minhas metas financeiras",
      }),
      agent: "goals-agent",
      icon: Target,
      color: "indigo",
      category: "Metas",
      description: "Estabeleça objetivos claros e acompanhe seu progresso",
    },
    {
      text: t("dashboard.aiAssistant.quickSuggestions.savings", {
        defaultValue: "Estratégias para aumentar minha economias",
      }),
      agent: "savings-agent",
      icon: PieChart,
      color: "blue",
      category: "Economias",
      description: "Descubra formas inteligentes de economizar mais dinheiro",
    },
    {
      text: t("dashboard.aiAssistant.quickSuggestions.emergency", {
        defaultValue: "Como montar minha reserva de emergência?",
      }),
      agent: "savings-agent",
      icon: Shield,
      color: "red",
      category: "Emergência",
      description: "Proteja suas finanças com uma reserva bem estruturada",
    },
    {
      text: t("dashboard.aiAssistant.quickSuggestions.portfolio", {
        defaultValue: "Análise completa da minha carteira",
      }),
      agent: "investment-agent",
      icon: DollarSign,
      color: "green",
      category: "Portfólio",
      description: "Avalie performance e diversificação dos seus investimentos",
    },
    {
      text: t("dashboard.aiAssistant.quickSuggestions.debt", {
        defaultValue: "Estratégia para quitar minhas dívidas",
      }),
      agent: "expense-agent",
      icon: AlertTriangle,
      color: "red",
      category: "Dívidas",
      description: "Organize e acelere o pagamento das suas dívidas",
    },
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {showFloatingButton && !isOpen && (
        <div
          className={`fixed right-4 z-[9999] group ai-chat-button-float ${
            isMobile ? "ai-chat-mobile-bottom" : "bottom-4"
          }`}>
          <div className='relative'>
            {/* Pulse ring effect */}
            <div className='absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/40 via-blue-500/40 to-cyan-500/40 ai-chat-pulse-ring'></div>

            {/* Main AI Button */}
            <Button
              onClick={handleToggle}
              className='h-20 w-20 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative group/button p-0 border-2 border-white/20 backdrop-blur-sm overflow-hidden ai-chat-gradient-shift'>
              {/* Animated background gradient */}
              <div className='absolute inset-0 bg-gradient-to-br from-purple-400/20 via-blue-400/20 to-cyan-400/20 animate-pulse rounded-full'></div>

              {/* Main icon with sparkle effect */}
              <div className='relative z-10 flex items-center justify-center h-full w-full'>
                <div className='relative'>
                  <Bot
                    className='h-7 w-7 text-white group-hover/button:scale-110 transition-all duration-300 drop-shadow-lg'
                    style={{ width: "28px", height: "28px" }}
                  />
                  {/* Sparkle effects */}
                  <Sparkles className='absolute -top-1 -right-1 h-4 w-4 md:h-3 md:w-3 text-yellow-300 ai-chat-sparkle' />
                  <div className='absolute inset-0 animate-ping'>
                    <div className='h-2 w-2 bg-white/30 rounded-full absolute top-2 right-2'></div>
                  </div>
                </div>
              </div>

              {/* Glowing ring effect */}
              <div className='absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-500/30 animate-pulse opacity-0 group-hover/button:opacity-100 transition-opacity duration-300'></div>

              {/* New message indicator */}
              {hasNewMessage && (
                <div className='absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce shadow-lg'>
                  <div className='h-3 w-3 bg-white rounded-full animate-pulse'></div>
                </div>
              )}
            </Button>

            {/* Close button */}
            <Button
              onClick={() => setShowFloatingButton(false)}
              variant='ghost'
              size='sm'
              className='absolute -top-1 -right-1 h-7 w-7 p-0 bg-gray-500/70 hover:bg-gray-400 text-white rounded-full backdrop-blur-sm border border-white/20 opacity-100 transition-all duration-200 z-10'>
              <X className='h-4 w-4' />
            </Button>

            {/* Enhanced Tooltip */}
            <div className='absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900/95 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm border border-white/10 shadow-xl'>
              <div className='flex items-center gap-2'>
                <Sparkles className='h-4 w-4 text-yellow-400' />
                <span className='font-medium'>
                  {t("dashboard.aiAssistant.tooltip", {
                    defaultValue: "Assistente Financeiro IA",
                  })}
                </span>
              </div>
              <div className='text-xs text-gray-300 mt-1'>
                {t("dashboard.aiAssistant.tooltipSubtext", {
                  defaultValue: "Clique para começar uma conversa",
                })}
              </div>
              {/* Tooltip arrow */}
              <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95'></div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Dialog */}
      {isFullScreen && (
        <Sheet open={isFullScreen} onOpenChange={setIsFullScreen}>
          <SheetContent
            side='bottom'
            className='fixed z-[10000] gap-4 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-x-0 bottom-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom h-[95vh] w-full rounded-t-lg border-t-0 flex flex-col overflow-hidden p-0'
            role='dialog'
            aria-describedby='chat-description'
            aria-labelledby='chat-title'>
            <SheetHeader className='sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-blue-600 border-b px-6 py-4'>
              <div className='flex justify-between items-center'>
                <SheetTitle
                  id='chat-title'
                  className='text-lg font-semibold text-center flex items-center gap-2'>
                  <span className='text-white'>Agentes de IA</span>
                  {hasNewMessage && (
                    <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                  )}
                  {/* Multi-Agent Indicator */}
                  <Badge
                    variant='secondary'
                    className='bg-purple-100 text-purple-700 flex items-center gap-1 text-xs ml-2'>
                    <Users className='h-3 w-3' />
                    <span>
                      {
                        activeAgents.filter(
                          (a) => a.isEnabled && a.status === "active"
                        ).length
                      }
                    </span>
                  </Badge>
                </SheetTitle>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleToggleSettingsPanel}
                    className='h-8 w-8 p-0 hover:bg-white/20 transition-all duration-200'
                    title={
                      showSettingsPanel
                        ? "Fechar configurações"
                        : "Configurações dos agentes"
                    }>
                    <Settings
                      className={`h-4 w-4 text-white transition-transform duration-200 ${
                        showSettingsPanel ? "rotate-45" : ""
                      }`}
                    />
                  </Button>

                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleFullScreen}
                    className='h-8 w-8 p-0 hover:bg-white/20 transition-all duration-200'
                    title='Tela Normal'>
                    <Minimize className='h-4 w-4 text-white' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleCloseChat}
                    className='h-8 w-8 p-0 hover:bg-white/20 transition-all duration-200'
                    title='Fechar'>
                    <X className='h-4 w-4 text-white' />
                  </Button>
                </div>
              </div>
            </SheetHeader>
            {/* Settings Panel - Only in Full Screen */}
            {showSettingsPanel ? (
              <div
                className='flex-1 px-4 py-4 overflow-y-auto bg-gray-100/50'
                id='settings-description'>
                <div className='max-w-4xl mx-auto'>
                  <div className='mb-6'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                      Configuração dos Agentes
                    </h2>
                    <p className='text-sm text-gray-600 mb-4'>
                      Configure quais agentes especializados estarão ativos para
                      ajudá-lo com suas consultas financeiras.
                    </p>
                    <div className='flex items-center gap-4 text-sm'>
                      <div className='flex items-center gap-2'>
                        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                        <span className='text-gray-700'>
                          {
                            activeAgents.filter(
                              (a) => a.isEnabled && a.status === "active"
                            ).length
                          }{" "}
                          agentes ativos
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='w-3 h-3 bg-gray-400 rounded-full'></div>
                        <span className='text-gray-700'>
                          {activeAgents.filter((a) => !a.isEnabled).length}{" "}
                          agentes inativos
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Agent List - Full Space */}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                    {activeAgents.map((agent) => {
                      const IconComponent = agent.icon;
                      const isDisabled = agent.type === "triage";

                      return (
                        <div
                          key={agent.id}
                          className={`p-3 rounded-md border transition-all duration-200 ${
                            agent.isEnabled && agent.status === "active"
                              ? "bg-green-50 border-green-200"
                              : agent.status === "processing"
                              ? "bg-blue-50 border-blue-200"
                              : "bg-gray-50 border-gray-200"
                          } ${!agent.isEnabled ? "opacity-60" : ""}`}>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2.5 flex-1 min-w-0'>
                              <div
                                className={`p-1.5 rounded-full ${
                                  agent.isEnabled
                                    ? `bg-${agent.color}-100`
                                    : "bg-gray-100"
                                }`}>
                                <IconComponent
                                  className={`h-3.5 w-3.5 ${
                                    agent.isEnabled
                                      ? `text-${agent.color}-600`
                                      : "text-gray-400"
                                  }`}
                                />
                              </div>
                              <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-1.5'>
                                  <span
                                    className={`text-sm font-medium truncate ${
                                      !agent.isEnabled
                                        ? "text-gray-500"
                                        : "text-gray-900"
                                    }`}>
                                    {agent.name}
                                  </span>
                                  {agent.type === "triage" && (
                                    <Badge
                                      variant='outline'
                                      className='text-xs px-1.5 py-0'>
                                      Core
                                    </Badge>
                                  )}
                                </div>
                                <p
                                  className={`text-xs leading-tight mt-0.5 line-clamp-1 ${
                                    !agent.isEnabled
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}>
                                  {agent.description}
                                </p>
                              </div>
                            </div>

                            <Switch
                              checked={agent.isEnabled}
                              onCheckedChange={() => toggleAgent(agent.id)}
                              disabled={isDisabled}
                              className={`ml-2 data-[state=checked]:bg-green-500 ${
                                isDisabled ? "opacity-50" : ""
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Advanced Settings Button */}
                    <div className='p-3 rounded-md border border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-200'>
                      <Button
                        variant='ghost'
                        onClick={() => setShowConfigDialog(true)}
                        className='w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-transparent'>
                        <div className='p-1.5 rounded-full bg-blue-100'>
                          <Settings className='h-3.5 w-3.5 text-blue-600' />
                        </div>
                        <div className='text-center'>
                          <span className='text-sm font-medium text-gray-700'>
                            Configurações Avançadas
                          </span>
                          <p className='text-xs text-gray-500 mt-0.5'>
                            Ajustes detalhados dos agentes
                          </p>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                id='chat-description'
                className='flex-1 overflow-hidden flex flex-col'
                style={{ pointerEvents: "auto" }}>
                {renderChatContent(true)}
              </div>
            )}
          </SheetContent>
        </Sheet>
      )}

      {/* Floating Chat Window */}
      {isOpen && !isFullScreen && (
        <div
          className={`fixed transition-all duration-300 ${
            isMobile
              ? "ai-chat-mobile-window right-4 w-80 max-w-[calc(100vw-2rem)] z-[10000]"
              : "bottom-4 right-4 w-80 md:w-96 z-[10000]"
          }`}>
          <Card
            className={`shadow-2xl border-0 bg-white flex flex-col h-[500px] ${
              isMobile ? "rounded-t-2xl rounded-b-lg" : "rounded-lg"
            }`}>
            {/* === HEADER === */}
            <CardHeader className='flex-shrink-0 flex flex-row items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg border-b border-blue-400/30'>
              <CardTitle
                className={`font-medium flex items-center gap-2 ${
                  isMobile ? "text-xs" : "text-sm"
                }`}>
                <span className='truncate'>Agentes de IA</span>
                {!isMobile && (
                  <Badge
                    variant='secondary'
                    className='text-xs bg-green-100 text-green-700'>
                    {t("dashboard.aiAssistant.beta", {
                      defaultValue: "BETA",
                    })}
                  </Badge>
                )}
                {/* Multi-Agent Indicator */}
                <Badge
                  variant='secondary'
                  className={`bg-purple-100 text-purple-700 flex items-center gap-1 ${
                    isMobile ? "text-xs px-1 py-0" : "text-xs"
                  }`}>
                  <Users className={`${isMobile ? "h-2 w-2" : "h-3 w-3"}`} />
                  <span>
                    {
                      activeAgents.filter(
                        (a) => a.isEnabled && a.status === "active"
                      ).length
                    }
                  </span>
                </Badge>
              </CardTitle>
              <div className='flex items-center gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setIsFullScreen(true);
                    setTimeout(() => {
                      handleToggleSettingsPanel();
                    }, 300);
                  }}
                  className='h-6 w-6 p-0 hover:bg-white/20 text-white'
                  title='Configurações dos agentes (Tela cheia)'>
                  <Settings className='h-3 w-3 transition-transform duration-200' />
                </Button>

                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleFullScreen}
                  className='h-6 w-6 p-0 hover:bg-white/20 text-white'
                  title={isFullScreen ? "Tela Normal" : "Tela Cheia"}>
                  {isFullScreen ? (
                    <Minimize className='h-3 w-3' />
                  ) : (
                    <Expand className='h-3 w-3' />
                  )}
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleToggle}
                  className='h-6 w-6 p-0 hover:bg-white/20 text-white'
                  title='Fechar'>
                  <X className='h-3 w-3' />
                </Button>
              </div>
            </CardHeader>

            {/* === CONTENT === */}
            <CardContent className='flex-1 flex flex-col overflow-hidden p-0 bg-gray-50/30'>
              {renderChatContent(false)}
            </CardContent>
          </Card>
        </div>
      )}
      {/* Conversation History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className='max-w-2xl max-h-[80vh] overflow-hidden flex flex-col'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <History className='h-5 w-5' />
              Histórico de Conversas
            </DialogTitle>
            <DialogDescription>
              Acesse suas conversas anteriores ou crie uma nova conversa.
            </DialogDescription>
          </DialogHeader>

          <div className='flex-1 overflow-y-auto'>
            {conversations.length === 0 ? (
              <div className='text-center py-8'>
                <MessageCircle className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500 text-sm'>
                  Nenhuma conversa salva ainda.
                </p>
                <p className='text-gray-400 text-xs mt-1'>
                  Suas conversas aparecerão aqui automaticamente.
                </p>
              </div>
            ) : (
              <div className='space-y-3'>
                {conversations
                  .sort(
                    (a, b) =>
                      b.lastActivity.getTime() - a.lastActivity.getTime()
                  )
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                        conversation.id === currentConversationId
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => loadConversation(conversation.id)}>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1 min-w-0'>
                          <h4 className='font-medium text-gray-900 truncate'>
                            {conversation.title}
                          </h4>
                          <div className='flex items-center gap-2 mt-1'>
                            <Badge variant='secondary' className='text-xs'>
                              {conversation.messages.length} mensagens
                            </Badge>
                            <span className='text-xs text-gray-500'>
                              {conversation.lastActivity.toLocaleDateString(
                                "pt-BR",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          {conversation.messages.length > 1 && (
                            <p className='text-sm text-gray-600 mt-2 line-clamp-2'>
                              {conversation.messages
                                .filter((m) => m.isUser)
                                .slice(-1)[0]?.content || "..."}
                            </p>
                          )}
                        </div>
                        <div className='flex items-center gap-1 ml-2'>
                          {conversation.id === currentConversationId && (
                            <Badge variant='default' className='text-xs'>
                              Atual
                            </Badge>
                          )}
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conversation.id);
                            }}
                            className='h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600'
                            title='Excluir conversa'>
                            <Trash2 className='h-3 w-3' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className='border-t pt-4 mt-4'>
            <Button
              onClick={() => {
                createNewConversation();
                setShowHistoryDialog(false);
              }}
              className='w-full'>
              <Plus className='h-4 w-4 mr-2' />
              Nova Conversa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingAIChat;
