import { sizes, variants } from "@/lib/variants";
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'base' | 'lg';
  className?: string;
}

export default function Button({ variant = 'default', size = 'base', className = '', ...props }: ButtonProps) {
  return (
    <button 
      {...props} 
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      suppressHydrationWarning={true}
    />
  );
}