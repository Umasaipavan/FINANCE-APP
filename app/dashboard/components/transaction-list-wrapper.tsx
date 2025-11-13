import { fetchTransactions } from "@/lib/actions"
import TransactionList from "./transaction-list"
import { DateRange, Transaction } from "@/types"

interface TransactionListWrapperProps {
  range: DateRange;
}

export default async function TransactionListWrapper({ range }: TransactionListWrapperProps) {
  const transactions = await fetchTransactions(range)
  return <TransactionList initialTransactions={transactions} key={JSON.stringify(range)} range={range} />
}