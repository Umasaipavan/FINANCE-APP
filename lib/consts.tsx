export const types = [
  'Income', 'Expense', 'Investment', 'Saving'
] as const

export type TrendType = typeof types[number]

// Create a mutable version for zod validation
export const typesArray: [string, ...string[]] = [...types]

export const categories = [
  'Housing', 'Transport', 'Health', 'Food', 'Education', 'Other'
]