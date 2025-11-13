import BaseTrend from "@/components/trend"
import { DateRange } from "@/types"
import { TrendType } from "@/lib/consts"

interface TrendProps {
  type: TrendType;
  range: DateRange;
}

export default async function Trend({ type, range }: TrendProps) {
  // Mock trend data since authentication is bypassed
  const getMockTrendData = (type: TrendType) => {
    const mockData = {
      'Income': {
        current_amount: 4250.00,
        previous_amount: 3800.00
      },
      'Expense': {
        current_amount: 1550.50,
        previous_amount: 1200.00
      },
      'Investment': {
        current_amount: 500.00,
        previous_amount: 750.00
      },
      'Saving': {
        current_amount: 2699.50,
        previous_amount: 2600.00
      }
    };
    
    return mockData[type] || { current_amount: 0, previous_amount: 0 };
  };

  const amounts = getMockTrendData(type);

  return <BaseTrend type={type} amount={amounts.current_amount} prevAmount={amounts.previous_amount} />
}