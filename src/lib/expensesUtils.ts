
import { MonthlyAmount } from '@/types/finance';
import { MONTHS } from '@/constants/months';

export const initializeEmptyExpensesData = (year: number = new Date().getFullYear()): MonthlyAmount[] => {
    return MONTHS.map((_, index) => ({
        month: index + 1,
        year: year,
        amount: 0,
        items: [],
    }));
};

export const ensureCompleteExpensesData = (data: MonthlyAmount[], year: number = new Date().getFullYear()): MonthlyAmount[] => {
    const completeData = initializeEmptyExpensesData(year);
    data.forEach(monthData => {
        const index = completeData.findIndex(m => m.month === monthData.month);
        if (index !== -1) {
            completeData[index] = { ...completeData[index], ...monthData, year };
        }
    });
    return completeData;
}; 
