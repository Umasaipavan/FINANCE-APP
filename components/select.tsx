import { forwardRef, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export default forwardRef<HTMLSelectElement, SelectProps>(function Select(props, ref) {
  const { className = '', ...rest } = props;
  return (
    <select 
      ref={ref} 
      {...rest} 
      className={`w-full rounded-md shadow-sm border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950 ${className}`}
      suppressHydrationWarning={true}
    />
  );
});