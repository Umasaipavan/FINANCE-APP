import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const styles = {
    'checkbox': 'rounded border-gray-300 text-gray-700 bg-white dark:bg-gray-950 dark:text-gray-500 shadow-sm disabled:opacity-75',
    'file': 'file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:opacity-50 file:dark:text-gray-400',
    'default': 'w-full rounded-md shadow-sm border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950 disabled:opacity-75'
  };
  
  const { className = '', type = 'text', ...rest } = props;
  
  return (
    <input 
      ref={ref} 
      type={type}
      {...rest} 
      className={`${styles[type as keyof typeof styles] ?? styles['default']} ${className}`}
      autoComplete={type === 'email' ? 'email' : type === 'password' ? 'current-password' : 'off'}
      suppressHydrationWarning={true}
    />
  );
});