import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import { useAIAgent, AIMessage } from "../hooks/useAIAgent";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import {
  Bot,
  User,
  Send,
  Trash2,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Target,
  CreditCard,
  Lightbulb,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UserProfile } from "../types/finance";

interface AIFinancialAssistantProps {
  userProfile: UserProfile | null;
}

export function AIFinancialAssistant({
  userProfile,
}: AIFinancialAssistantProps) {
  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    getConversationSummary,
  } = useAIAgent(userProfile);

  const [inputMessage, setInputMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage("");
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return format(timestamp, "HH:mm", { locale: ptBR });
  };

  const getIntentIcon = (intent?: string) => {
    switch (intent) {
      case "expense_inquiry":
        return <DollarSign className='h-3 w-3' />;
      case "savings_inquiry":
        return <TrendingUp className='h-3 w-3' />;
      case "investment_advice":
        return <TrendingUp className='h-3 w-3' />;
      case "goal_management":
        return <Target className='h-3 w-3' />;
      case "debt_analysis":
        return <CreditCard className='h-3 w-3' />;
      default:
        return <Lightbulb className='h-3 w-3' />;
    }
  };

  const getIntentColor = (intent?: string) => {
    switch (intent) {
      case "expense_inquiry":
        return "bg-red-100 text-red-800";
      case "savings_inquiry":
        return "bg-green-100 text-green-800";
      case "investment_advice":
        return "bg-blue-100 text-blue-800";
      case "goal_management":
        return "bg-purple-100 text-purple-800";
      case "debt_analysis":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const conversationSummary = getConversationSummary();

  const quickActions = [
    { label: "Meus gastos", message: "Quanto gastei este mês?" },
    { label: "Minhas Economias", message: "Como está minha economias?" },
    { label: "Investimentos", message: "Que investimentos você recomenda?" },
    { label: "Metas financeiras", message: "Como estão minhas metas?" },
    { label: "Análise de dívidas", message: "Analise minhas dívidas" },
  ];

  if (!isExpanded) {
    return (
      <Card className='fixed bottom-4 right-4 w-80 shadow-lg border-2 border-primary/20'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Bot className='h-5 w-5 text-primary' />
              <CardTitle className='text-sm'>Assistente Financeiro</CardTitle>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsExpanded(true)}>
              <MessageSquare className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          <p className='text-xs text-muted-foreground mb-3'>
            Olá! Sou seu assistente financeiro pessoal. Posso ajudar com
            análises, recomendações e gerenciamento dos seus dados financeiros.
          </p>
          {conversationSummary.totalMessages > 0 && (
            <div className='text-xs text-muted-foreground'>
              {conversationSummary.totalMessages} mensagens na conversa
            </div>
          )}
          <div className='grid grid-cols-2 gap-2 mt-3'>
            {quickActions.slice(0, 4).map((action, index) => (
              <Button
                key={index}
                variant='outline'
                size='sm'
                className='text-xs h-8'
                onClick={() => {
                  setIsExpanded(true);
                  sendMessage(action.message);
                }}>
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='fixed bottom-4 right-4 w-96 h-[600px] shadow-lg border-2 border-primary/20 flex flex-col'>
      <CardHeader className='pb-3 flex-shrink-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Bot className='h-5 w-5 text-primary' />
            <CardTitle className='text-sm'>Assistente Financeiro IA</CardTitle>
          </div>
          <div className='flex gap-1'>
            {messages.length > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={clearMessages}
                className='h-8 w-8 p-0'>
                <Trash2 className='h-3 w-3' />
              </Button>
            )}
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsExpanded(false)}
              className='h-8 w-8 p-0'>
              ×
            </Button>
          </div>
        </div>
        {conversationSummary.totalMessages > 0 && (
          <div className='text-xs text-muted-foreground'>
            {conversationSummary.totalMessages} mensagens •
            {conversationSummary.topIntents.length > 0 && (
              <> Tópicos: {conversationSummary.topIntents.join(", ")}</>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className='flex-1 flex flex-col p-0'>
        {messages.length === 0 ? (
          <div className='flex-1 p-4 flex flex-col justify-center'>
            <div className='text-center mb-4'>
              <Bot className='h-12 w-12 text-muted-foreground mx-auto mb-2' />
              <p className='text-sm text-muted-foreground'>
                Olá! Sou seu assistente financeiro pessoal. Como posso ajudar
                hoje?
              </p>
            </div>

            <div className='space-y-2'>
              <p className='text-xs font-medium text-muted-foreground'>
                Ações rápidas:
              </p>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant='outline'
                  size='sm'
                  className='w-full justify-start text-xs h-8'
                  onClick={() => sendMessage(action.message)}>
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <ScrollArea className='flex-1 p-4'>
            <div className='space-y-4'>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}>
                    <div className='flex items-center gap-2 mb-1'>
                      {message.role === "user" ? (
                        <User className='h-3 w-3' />
                      ) : (
                        <Bot className='h-3 w-3' />
                      )}
                      <span className='text-xs font-medium'>
                        {message.role === "user" ? "Você" : "Assistente"}
                      </span>
                      <span className='text-xs opacity-70'>
                        {formatTimestamp(message.timestamp)}
                      </span>
                      {message.metadata?.intent && (
                        <Badge
                          variant='secondary'
                          className={`text-xs ${getIntentColor(
                            message.metadata.intent
                          )}`}>
                          {getIntentIcon(message.metadata.intent)}
                          <span className='ml-1'>
                            {message.metadata.intent}
                          </span>
                        </Badge>
                      )}
                    </div>
                    <p className='text-sm whitespace-pre-wrap'>
                      {message.content}
                    </p>
                    {message.metadata?.confidence && (
                      <div className='text-xs opacity-70 mt-1'>
                        Confiança:{" "}
                        {Math.round(message.metadata.confidence * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
        )}

        <Separator className='mx-4' />

        <div className='p-4 flex-shrink-0'>
          <div className='flex gap-2'>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Digite sua pergunta...'
              disabled={isLoading}
              className='flex-1'
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size='sm'>
              {isLoading ? (
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
              ) : (
                <Send className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
