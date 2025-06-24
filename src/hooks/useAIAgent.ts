// Arquivo inicial vazio - criar hook do agente de IA 

import { useState, useCallback } from 'react';
import { UserProfile } from '@/types/finance';
import { useSupabaseData } from './useSupabaseData';
import { useDocumentEmbeddings } from './supabase/useDocumentEmbeddings';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface AIMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    metadata?: {
        intent?: string;
        confidence?: number;
        dataAccessed?: string[];
    };
}

export interface AIResponse {
    message: string;
    recommendations?: string[];
    actions?: {
        type: 'create' | 'update' | 'delete';
        table: string;
        data?: any;
    }[];
}

interface UserDataContext {
    profile: UserProfile | null;
    recentExpenses: any[];
    recentSavings: any[];
    investmentPerformance: any[];
    marketData: any[];
}

export function useAIAgent(userProfile: UserProfile | null) {
    const [messages, setMessages] = useState<AIMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { fetchUserProfile, saveUserProfile } = useSupabaseData();
    const { searchSimilarDocuments, storeDocument } = useDocumentEmbeddings();
    const { toast } = useToast();
    const { t } = useTranslation();

    // Fetch comprehensive user data context
    const fetchUserContext = useCallback(async (userId: string): Promise<UserDataContext> => {
        try {
            const [
                profile,
                { data: expenses },
                { data: savings },
                { data: investments },
                { data: goals },
                { data: debts },
                { data: marketData }
            ] = await Promise.all([
                fetchUserProfile(userId),
                supabase.from('detailed_expenses').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(10),
                supabase.from('monthly_savings').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
                supabase.from('investments').select('*').eq('user_id', userId),
                supabase.from('financial_goals').select('*').eq('user_id', userId),
                supabase.from('debt_details').select('*').eq('user_id', userId),
                supabase.from('market_data').select('*').order('last_updated', { ascending: false }).limit(20)
            ]);

            return {
                profile: profile || userProfile,
                recentExpenses: expenses || [],
                recentSavings: savings || [],
                investmentPerformance: investments || [],
                marketData: marketData || []
            };
        } catch (error) {
            console.error('Error fetching user context:', error);
            return {
                profile: userProfile,
                recentExpenses: [],
                recentSavings: [],
                investmentPerformance: [],
                marketData: []
            };
        }
    }, [fetchUserProfile, userProfile]);

    // Analyze user query and determine intent
    const analyzeIntent = useCallback((query: string): { intent: string; confidence: number } => {
        const queryLower = query.toLowerCase();

        // Define intent patterns
        const intentPatterns = {
            expense_inquiry: ['gastos', 'expenses', 'quanto gastei', 'spending', 'spent'],
            savings_inquiry: ['economias', 'savings', 'quanto economizei', 'saved', 'economia'],
            investment_advice: ['investimento', 'investment', 'aplicar', 'invest', 'rentabilidade'],
            goal_management: ['meta', 'goal', 'objetivo', 'target'],
            debt_analysis: ['dívida', 'debt', 'pagamento', 'payment', 'empréstimo'],
            budget_planning: ['orçamento', 'budget', 'planejamento', 'planning'],
            recommendation: ['recomenda', 'suggest', 'advice', 'dica', 'sugestão'],
            crud_operations: ['adicionar', 'add', 'criar', 'create', 'atualizar', 'update', 'deletar', 'delete', 'remover', 'remove']
        };

        let bestMatch = 'general_inquiry';
        let maxScore = 0;

        Object.entries(intentPatterns).forEach(([intent, patterns]) => {
            const score = patterns.reduce((acc, pattern) => {
                return acc + (queryLower.includes(pattern) ? 1 : 0);
            }, 0);

            if (score > maxScore) {
                maxScore = score;
                bestMatch = intent;
            }
        });

        return {
            intent: bestMatch,
            confidence: Math.min(maxScore / 3, 1) // Normalize confidence
        };
    }, []);

    // Generate AI response based on intent and context
    const generateResponse = useCallback(async (
        query: string,
        intent: string,
        context: UserDataContext
    ): Promise<AIResponse> => {
        const { profile, recentExpenses, recentSavings, investmentPerformance } = context;

        switch (intent) {
            case 'expense_inquiry':
                const totalExpenses = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                const expensesByCategory = recentExpenses.reduce((acc, exp) => {
                    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                    return acc;
                }, {} as Record<string, number>);

                return {
                    message: `Nos últimos gastos registrados, você gastou um total de ${totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. As principais categorias foram: ${Object.entries(expensesByCategory).map(([cat, val]) => `${cat}: ${(val as number).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`).join(', ')}.`,
                    recommendations: [
                        'Considere estabelecer limites mensais para categorias de maior gasto',
                        'Analise se há gastos desnecessários que podem ser reduzidos',
                        'Use a funcionalidade de orçamento para melhor controle'
                    ]
                };

            case 'savings_inquiry':
                const currentSavings = recentSavings[0]?.data || [];
                const totalSaved = currentSavings.reduce((sum: number, month: any) => sum + month.amount, 0);
                const monthlyIncome = profile?.monthlyIncome || 0;
                const savingsRate = monthlyIncome > 0 ? (totalSaved / (monthlyIncome * 12)) * 100 : 0;

                return {
                    message: `Sua taxa de Economias atual é de ${savingsRate.toFixed(1)}%. ${savingsRate >= 20 ? 'Excelente!' : savingsRate >= 10 ? 'Boa!' : 'Pode melhorar!'} Total economizado: ${totalSaved.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`,
                    recommendations: [
                        savingsRate < 20 ? 'Tente aumentar sua taxa de Economias para 20% da renda' : 'Continue mantendo essa excelente taxa de Economias',
                        'Configure transferências automáticas para suas metas',
                        'Considere investimentos para fazer seu dinheiro crescer'
                    ]
                };

            case 'investment_advice':
                const totalInvested = investmentPerformance.reduce((sum, inv) => sum + inv.value, 0);
                const riskProfile = profile?.riskProfile || 'moderate';

                let advice = '';
                let recommendations: string[] = [];

                if (riskProfile === 'conservative') {
                    advice = 'Para seu perfil conservador, recomendo 70% em renda fixa e 30% em renda variável.';
                    recommendations = [
                        'Tesouro Direto IPCA+ para proteção contra inflação',
                        'CDBs de bancos grandes com boa liquidez',
                        'Fundos de renda fixa conservadores'
                    ];
                } else if (riskProfile === 'moderate') {
                    advice = 'Para seu perfil moderado, recomendo 50% em renda fixa e 50% em renda variável.';
                    recommendations = [
                        'Diversifique entre ações nacionais e internacionais',
                        'ETFs de índices amplos como BOVA11',
                        'Fundos imobiliários para diversificação'
                    ];
                } else {
                    advice = 'Para seu perfil agressivo, recomendo 30% em renda fixa e 70% em renda variável.';
                    recommendations = [
                        'Ações de growth e small caps',
                        'ETFs de mercados emergentes',
                        'Criptomoedas (máximo 5% da carteira)'
                    ];
                }

                return {
                    message: `${advice} Atualmente você tem ${totalInvested.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} investidos.`,
                    recommendations
                };

            case 'goal_management':
                const goals = profile?.financialGoals || [];
                if (goals.length === 0) {
                    return {
                        message: 'Você ainda não tem metas financeiras definidas. Que tal criar algumas?',
                        recommendations: [
                            'Defina uma meta de emergência (6 meses de gastos)',
                            'Estabeleça objetivos de curto, médio e longo prazo',
                            'Use a regra 50/30/20 para organizar seu dinheiro'
                        ],
                        actions: [{
                            type: 'create',
                            table: 'financial_goals',
                            data: {
                                name: 'Reserva de Emergência',
                                target_amount: (profile?.monthlyIncome || 5000) * 6,
                                current_amount: 0,
                                priority: 'high'
                            }
                        }]
                    };
                }

                const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;
                const totalProgress = goals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount), 0) / goals.length * 100;

                return {
                    message: `Você tem ${goals.length} metas, ${completedGoals} concluídas. Progresso médio: ${totalProgress.toFixed(1)}%.`,
                    recommendations: [
                        'Foque nas metas de alta prioridade primeiro',
                        'Revise suas metas trimestralmente',
                        'Comemore as conquistas para manter a motivação'
                    ]
                };

            case 'debt_analysis':
                const debts = profile?.debtDetails || [];
                const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

                if (debts.length === 0) {
                    return {
                        message: 'Parabéns! Você não possui dívidas registradas. Mantenha-se assim!',
                        recommendations: [
                            'Use cartão de crédito com responsabilidade',
                            'Mantenha uma reserva para emergências',
                            'Evite financiamentos desnecessários'
                        ]
                    };
                }

                const highInterestDebts = debts.filter(d => d.interestRate > 15);

                return {
                    message: `Você tem ${totalDebt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em dívidas. ${highInterestDebts.length > 0 ? 'Atenção para juros altos!' : 'Juros sob controle.'}`,
                    recommendations: [
                        'Quite primeiro as dívidas com maior taxa de juros',
                        'Considere renegociar condições',
                        'Evite novas dívidas enquanto não quitar as atuais'
                    ]
                };

            default:
                return {
                    message: 'Olá! Sou seu assistente financeiro pessoal. Posso ajudar com análises de gastos, investimentos, metas e muito mais. Como posso ajudar hoje?',
                    recommendations: [
                        'Pergunte sobre seus gastos: "Quanto gastei este mês?"',
                        'Solicite conselhos de investimento baseados no seu perfil',
                        'Analise suas metas financeiras',
                        'Gerencie suas dívidas e planejamento'
                    ]
                };
        }
    }, []);

    // Main chat function
    const sendMessage = useCallback(async (userMessage: string): Promise<void> => {
        if (!userProfile?.id) {
            toast({
                title: 'Erro',
                description: 'Você precisa estar logado para usar o assistente IA.',
                variant: 'destructive'
            });
            return;
        }

        setIsLoading(true);

        try {
            // Add user message
            const userMsg: AIMessage = {
                id: Date.now().toString(),
                role: 'user',
                content: userMessage,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, userMsg]);

            // Analyze intent
            const { intent, confidence } = analyzeIntent(userMessage);

            // Fetch user context
            const context = await fetchUserContext(userProfile.id);

            // Generate AI response
            const aiResponse = await generateResponse(userMessage, intent, context);

            // Add AI message
            const aiMsg: AIMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse.message,
                timestamp: new Date(),
                metadata: {
                    intent,
                    confidence,
                    dataAccessed: ['profile', 'expenses', 'savings', 'investments']
                }
            };

            setMessages(prev => [...prev, aiMsg]);

            // Store conversation for future reference
            try {
                await storeDocument(
                    `User: ${userMessage}\nAssistant: ${aiResponse.message}`,
                    [], // In a real implementation, this would be the embedding
                    {
                        intent,
                        confidence,
                        timestamp: new Date().toISOString(),
                        userId: userProfile.id
                    },
                    userProfile.id
                );
            } catch (embeddingError) {
            }

            // Execute any suggested actions
            if (aiResponse.actions) {
                for (const action of aiResponse.actions) {
                    await executeAction(action, userProfile.id);
                }
            }

        } catch (error) {
            console.error('Error in AI chat:', error);
            toast({
                title: 'Erro',
                description: 'Ocorreu um erro ao processar sua mensagem.',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    }, [userProfile, analyzeIntent, fetchUserContext, generateResponse, storeDocument, toast]);

    // Execute CRUD actions suggested by AI
    const executeAction = useCallback(async (action: any, userId: string): Promise<void> => {
        try {
            switch (action.type) {
                case 'create':
                    await supabase.from(action.table).insert({
                        ...action.data,
                        user_id: userId,
                        id: crypto.randomUUID()
                    });
                    break;

                case 'update':
                    await supabase.from(action.table)
                        .update(action.data)
                        .eq('user_id', userId)
                        .eq('id', action.data.id);
                    break;

                case 'delete':
                    await supabase.from(action.table)
                        .delete()
                        .eq('user_id', userId)
                        .eq('id', action.data.id);
                    break;
            }

            toast({
                title: 'Ação executada',
                description: `${action.type} realizada com sucesso na tabela ${action.table}.`
            });
        } catch (error) {
            console.error(`Error executing ${action.type} action:`, error);
        }
    }, [toast]);

    // Clear conversation
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    // Get conversation summary
    const getConversationSummary = useCallback(() => {
        const userMessages = messages.filter(m => m.role === 'user').length;
        const aiMessages = messages.filter(m => m.role === 'assistant').length;
        const intents = messages
            .filter(m => m.metadata?.intent)
            .map(m => m.metadata!.intent);

        return {
            totalMessages: messages.length,
            userMessages,
            aiMessages,
            topIntents: [...new Set(intents)],
            duration: messages.length > 0 ?
                new Date().getTime() - messages[0].timestamp.getTime() : 0
        };
    }, [messages]);

    return {
        messages,
        isLoading,
        sendMessage,
        clearMessages,
        getConversationSummary
    };
} 