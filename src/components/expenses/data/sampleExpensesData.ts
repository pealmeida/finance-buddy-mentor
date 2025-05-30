
import { v4 as uuidv4 } from 'uuid';

/**
 * Sample expense data for demonstration purposes
 */
export class SampleExpensesData {
  
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
}
