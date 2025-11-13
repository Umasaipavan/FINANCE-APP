type VariantType = {
  [key: string]: string;
};

type SizeType = {
  [key: string]: string;
};

export const variants: VariantType = {
  default: 'bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-50',
  primary: 'bg-blue-500 text-white dark:bg-blue-600 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50',
  success: 'bg-green-500 text-white dark:bg-green-600 rounded-md hover:bg-green-700 dark:hover:bg-green-800 disabled:opacity-50',
  warning: 'bg-yellow-500 text-white dark:bg-yellow-600 rounded-md hover:bg-yellow-700 dark:hover:bg-yellow-800 disabled:opacity-50',
  danger: 'bg-red-500 text-white dark:bg-red-500 rounded-md hover:bg-red-700 dark:hover:bg-red-700 disabled:opacity-50',
  outline: 'border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50',
  ghost: 'rounded-md bg-white dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50',
};

export const sizes: SizeType = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-1.5',
  base: 'text-base px-4 py-2',
  lg: 'text-lg px-4 py-2'
};