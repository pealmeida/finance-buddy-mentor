import { useState, useEffect, useCallback } from 'react';
import { UserProfile, MonthlyAmount } from '../types/finance';
import { useMonthlySavings } from './supabase/useMonthlySavings';
import { useMonthlyExpenses } from './supabase/useMonthlyExpenses';
import { calculateAverageSavings } from './supabase/utils/savingsUtils';

interface UseFinancialMetricsProps {
    userProfile: UserProfile | null;
    onProfileUpdate: (profile: UserProfile) => void;
}

export const useFinancialMetrics = ({ userProfile, onProfileUpdate }: UseFinancialMetricsProps) => {
    const currentYear = new Date().getFullYear();

    const [savingsProgress, setSavingsProgress] = useState<number>(0);
    const [expensesRatio, setExpensesRatio] = useState<number>(50);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const {
        monthlySavingsData,
        error: monthlySavingsError,
    } = useMonthlySavings(userProfile?.id || '', currentYear);

    const {
        expensesData: monthlyExpensesData,
        error: monthlyExpensesError,
    } = useMonthlyExpenses(userProfile?.id || '', currentYear);

    const calculateAverageExpenses = useCallback(
        (
            monthlyExpenses: { month: number; amount: number }[] | undefined
        ): number => {
            if (!monthlyExpenses || monthlyExpenses.length === 0) return 0;

            // Filter out months with zero expenses
            const nonZeroMonths = monthlyExpenses.filter((month) => month.amount > 0);
            if (nonZeroMonths.length === 0) return 0;

            const totalExpenses = nonZeroMonths.reduce(
                (sum, month) => sum + month.amount,
                0
            );
            return totalExpenses / nonZeroMonths.length;
        },
        []
    );

    useEffect(() => {
        const calculateMetrics = async () => {
            if (!userProfile || !userProfile.id) return;

            const monthlyIncome = userProfile.monthlyIncome ?? 0;
            const recommendedSavings = monthlyIncome * 0.2;

            try {
                // Savings Data
                if (!monthlySavingsData || !monthlySavingsData.data || monthlySavingsData.data.length === 0) {
                    setSavingsProgress(0);
                } else {
                    const typedSavingsData = Array.isArray(monthlySavingsData.data)
                        ? monthlySavingsData.data.map((item) => ({
                            month: typeof item.month === "number" ? item.month : parseInt(String(item.month)),
                            year: currentYear,
                            amount: typeof item.amount === "number" ? item.amount : parseFloat(String(item.amount)),
                        }))
                        : [];
                    const avgSavings = calculateAverageSavings(typedSavingsData);
                    const progress = avgSavings === 0 ? 0 : Math.min((avgSavings / recommendedSavings) * 100, 100);
                    setSavingsProgress(progress);

                    if (userProfile) {
                        if (JSON.stringify(userProfile.monthlySavings?.data) !== JSON.stringify(typedSavingsData)) {
                            const updatedProfileWithSavings = {
                                ...userProfile,
                                monthlySavings: {
                                    id: userProfile?.id || '',
                                    userId: userProfile?.id || '',
                                    year: currentYear,
                                    data: typedSavingsData,
                                },
                            };
                            onProfileUpdate(updatedProfileWithSavings);
                            setRefreshTrigger((prev) => prev + 1);
                        }
                    }
                }

                // Expenses Data
                if (monthlyExpensesData && monthlyExpensesData.length > 0) {
                    const typedExpensesData = Array.isArray(monthlyExpensesData)
                        ? monthlyExpensesData.map((item) => ({
                            month: typeof item.month === "number" ? item.month : parseInt(String(item.month)),
                            year: currentYear,
                            amount: typeof item.amount === "number" ? item.amount : parseFloat(String(item.amount)),
                        }))
                        : [];
                    const avgExpenses = calculateAverageExpenses(typedExpensesData);

                    if (monthlyIncome > 0) {
                        const expenseRatio = Math.min((avgExpenses / monthlyIncome) * 100, 100);
                        setExpensesRatio(expenseRatio);
                    } else {
                        setExpensesRatio(0); // If no income, ratio is 0 or handle as error
                    }

                    if (userProfile) {
                        if (JSON.stringify(userProfile.monthlyExpenses?.data) !== JSON.stringify(typedExpensesData)) {
                            const updatedProfileWithExpenses = {
                                ...userProfile,
                                monthlyExpenses: {
                                    id: userProfile?.id || '',
                                    userId: userProfile?.id || '',
                                    year: currentYear,
                                    data: typedExpensesData,
                                },
                            };
                            onProfileUpdate(updatedProfileWithExpenses);
                            setRefreshTrigger((prev) => prev + 1);
                        }
                    }
                } else {
                    setExpensesRatio(0);
                }
            } catch (error) {
                console.error("Error calculating financial metrics:", error);
            }
        };

        calculateMetrics();
    }, [
        userProfile,
        userProfile?.id ?? '',
        userProfile?.monthlyIncome ?? 0,
        monthlySavingsData,
        monthlyExpensesData,
        onProfileUpdate,
        calculateAverageExpenses,
        refreshTrigger,
        currentYear
    ]);

    return { savingsProgress, expensesRatio };
}; 