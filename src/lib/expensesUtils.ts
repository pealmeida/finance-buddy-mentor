import { MonthlyAmount } from '@/types/finance';
import { MONTHS } from '@/constants/months';

export const initializeEmptyExpensesData = (): MonthlyAmount[] => {
    return MONTHS.map((_, index) => ({
        month: index + 1,
        amount: 0,
        items: [],
    }));
};

export const ensureCompleteExpensesData = (data: MonthlyAmount[]): MonthlyAmount[] => {
    const completeData = initializeEmptyExpensesData();
    data.forEach(monthData => {
        const index = completeData.findIndex(m => m.month === monthData.month);
        if (index !== -1) {
            completeData[index] = { ...completeData[index], ...monthData };
        }
    });
    return completeData;
}; 