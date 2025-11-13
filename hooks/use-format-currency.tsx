import { useMemo } from "react";

export const useFormatCurrency = (amount: number): string => {
  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value);

  return useMemo(
    () => formatCurrency(amount),
    [amount]
  );
}