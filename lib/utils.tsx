import { Transaction, DateRange } from '@/types';

interface GroupedTransactions {
  [key: string]: {
    transactions: Transaction[];
    amount: number;
  };
}

export const groupAndSumTransactionsByDate = (transactions: Transaction[]): GroupedTransactions => {
  const grouped: GroupedTransactions = {};
  for (const transaction of transactions) {
    const date = transaction.created_at.split('T')[0];
    if (!grouped[date]) {
      grouped[date] = { transactions: [], amount: 0 };
    }
    grouped[date].transactions.push(transaction);
    const amount = transaction.type === 'Expense' ? -transaction.amount : transaction.amount;
    grouped[date].amount += amount;
  }
  return grouped;
}

export const convertRangeToDateRange = (range: string): DateRange => {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  
  let startDate: string;
  
  switch (range) {
    case 'last7days':
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      startDate = sevenDaysAgo.toISOString().split('T')[0];
      break;
    case 'last30days':
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      startDate = thirtyDaysAgo.toISOString().split('T')[0];
      break;
    case 'last90days':
      const ninetyDaysAgo = new Date(now);
      ninetyDaysAgo.setDate(now.getDate() - 90);
      startDate = ninetyDaysAgo.toISOString().split('T')[0];
      break;
    case 'last365days':
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      startDate = oneYearAgo.toISOString().split('T')[0];
      break;
    default:
      // Default to last 30 days
      const defaultStart = new Date(now);
      defaultStart.setDate(now.getDate() - 30);
      startDate = defaultStart.toISOString().split('T')[0];
      break;
  }
  
  return {
    startDate,
    endDate
  };
}