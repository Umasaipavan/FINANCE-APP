import { z } from "zod"
import { categories, typesArray } from "./consts"

export const transactionSchema = z.object({
  type: z.enum(typesArray),
  category: z.preprocess((val: unknown) => (val as any)?.length ? val : undefined, z.string().optional()),
  amount: z.coerce.number().min(1, {
    message: "Amount must be at least 1"
  }),
  description: z.string().optional(),
  created_at: z.string().refine(
    val => !isNaN(Date.parse(val)),
    {
      message: "Date needs to contain a valid date"
    }
  )
}).refine((data) => {
  if (data.type === "Expense") {
    return data.category !== undefined && categories.includes(data.category)
  }
  return true;
}, {
  path: ["category"],
  message: "Category is required for Expense"
})