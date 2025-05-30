
import { MonthlyAmount } from "@/types/finance";
import { v4 as uuidv4 } from 'uuid';

export class MonthlyExpensesDataEnhancer {
  
  // Function to adjust expense items to match the monthly total
  static adjustExpenseItemsToTotal = (items: any[], targetTotal: number) => {
    if (!items || items.length === 0) return items;
    
    const currentTotal = items.reduce((sum, item) => sum + item.amount, 0);
    
    if (currentTotal === 0 || currentTotal === targetTotal) return items;
    
    const adjustmentFactor = targetTotal / currentTotal;
    
    return items.map((item, index) => {
      if (index === items.length - 1) {
        // For the last item, calculate the exact amount to reach the target total
        const adjustedTotal = items.slice(0, -1).reduce((sum, adjustedItem, i) => 
          sum + Math.round(items[i].amount * adjustmentFactor * 100) / 100, 0);
        return {
          ...item,
          amount: Math.round((targetTotal - adjustedTotal) * 100) / 100
        };
      } else {
        return {
          ...item,
          amount: Math.round(item.amount * adjustmentFactor * 100) / 100
        };
      }
    });
  };

  static getSampleExpensesForMonth = (month: number) => {
    const sampleExpenses = {
      1: [ // January
        {
          id: uuidv4(),
          description: "Rent",
          amount: 1200,
          category: "housing" as const,
          date: "2024-01-01"
        },
        {
          id: uuidv4(),
          description: "Groceries",
          amount: 450,
          category: "food" as const,
          date: "2024-01-15"
        },
        {
          id: uuidv4(),
          description: "Gas Bill",
          amount: 89,
          category: "utilities" as const,
          date: "2024-01-05"
        },
        {
          id: uuidv4(),
          description: "Car Payment",
          amount: 350,
          category: "transportation" as const,
          date: "2024-01-01"
        },
        {
          id: uuidv4(),
          description: "Internet",
          amount: 65,
          category: "utilities" as const,
          date: "2024-01-10"
        },
        {
          id: uuidv4(),
          description: "Dining Out",
          amount: 180,
          category: "food" as const,
          date: "2024-01-20"
        },
        {
          id: uuidv4(),
          description: "Movie Tickets",
          amount: 25,
          category: "entertainment" as const,
          date: "2024-01-25"
        },
        {
          id: uuidv4(),
          description: "Doctor Visit",
          amount: 120,
          category: "healthcare" as const,
          date: "2024-01-18"
        }
      ],
      2: [ // February
        {
          id: uuidv4(),
          description: "Rent",
          amount: 1200,
          category: "housing" as const,
          date: "2024-02-01"
        },
        {
          id: uuidv4(),
          description: "Groceries",
          amount: 380,
          category: "food" as const,
          date: "2024-02-15"
        },
        {
          id: uuidv4(),
          description: "Electric Bill",
          amount: 110,
          category: "utilities" as const,
          date: "2024-02-05"
        },
        {
          id: uuidv4(),
          description: "Car Payment",
          amount: 350,
          category: "transportation" as const,
          date: "2024-02-01"
        },
        {
          id: uuidv4(),
          description: "Internet",
          amount: 65,
          category: "utilities" as const,
          date: "2024-02-10"
        },
        {
          id: uuidv4(),
          description: "Valentine's Dinner",
          amount: 95,
          category: "food" as const,
          date: "2024-02-14"
        },
        {
          id: uuidv4(),
          description: "Gym Membership",
          amount: 45,
          category: "healthcare" as const,
          date: "2024-02-01"
        },
        {
          id: uuidv4(),
          description: "Coffee Shops",
          amount: 75,
          category: "food" as const,
          date: "2024-02-20"
        }
      ],
      3: [ // March
        {
          id: uuidv4(),
          description: "Rent",
          amount: 1200,
          category: "housing" as const,
          date: "2024-03-01"
        },
        {
          id: uuidv4(),
          description: "Groceries",
          amount: 420,
          category: "food" as const,
          date: "2024-03-15"
        },
        {
          id: uuidv4(),
          description: "Water Bill",
          amount: 45,
          category: "utilities" as const,
          date: "2024-03-05"
        },
        {
          id: uuidv4(),
          description: "Car Payment",
          amount: 350,
          category: "transportation" as const,
          date: "2024-03-01"
        },
        {
          id: uuidv4(),
          description: "Internet",
          amount: 65,
          category: "utilities" as const,
          date: "2024-03-10"
        },
        {
          id: uuidv4(),
          description: "Spring Clothes",
          amount: 150,
          category: "other" as const,
          date: "2024-03-20"
        },
        {
          id: uuidv4(),
          description: "Concert Tickets",
          amount: 80,
          category: "entertainment" as const,
          date: "2024-03-25"
        },
        {
          id: uuidv4(),
          description: "Gas",
          amount: 85,
          category: "transportation" as const,
          date: "2024-03-12"
        },
        {
          id: uuidv4(),
          description: "Phone Bill",
          amount: 55,
          category: "utilities" as const,
          date: "2024-03-15"
        }
      ]
    };

    return sampleExpenses[month as keyof typeof sampleExpenses] || [];
  };

  static enhanceDataWithSampleExpenses = (data: MonthlyAmount[]) => {
    return data.map((item) => {
      if ([1, 2, 3].includes(item.month) && item.amount > 0 && (!item.items || item.items.length === 0)) {
        const sampleItems = MonthlyExpensesDataEnhancer.getSampleExpensesForMonth(item.month);
        
        return {
          ...item,
          items: MonthlyExpensesDataEnhancer.adjustExpenseItemsToTotal(sampleItems, item.amount)
        };
      }
      return item;
    });
  };
}
