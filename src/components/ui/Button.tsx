import React from 'react';
import { clsx } from 'clsx'; // You already have this library installed

// Define the different styles our button can have
type ButtonVariant = 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';

// Define the different sizes
type ButtonSize = 'sm' | 'md' | 'lg';

// Define the props our component will accept
// It extends all standard button props (like onClick, disabled, type)
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// --- Style Definitions ---
// We define all the tailwind classes for each variant and size

const baseStyles = 
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 px-8 text-base',
};

// NOTE: These styles are based on your existing CSS.
// 'bg-primary', 'bg-error', 'text-white', etc.
const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-primary text-white hover:bg-primary/90',
  destructive: 'bg-error text-white hover:bg-error/90',
  outline: 'border border-divider bg-transparent hover:bg-surface hover:text-text-primary',
  secondary: 'bg-surface text-text-secondary hover:bg-surface/80',
  ghost: 'hover:bg-surface hover:text-text-primary',
  link: 'text-primary underline-offset-4 hover:underline',
};
// --- End Style Definitions ---


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className, 
      variant = 'default', // 'default' is the standard primary button
      size = 'md',        // 'md' is the standard size
      children, 
      ...props 
    }, 
    ref
  ) => {
    return (
      <button
        className={clsx(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          className // This allows you to add extra custom styles from outside
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// This is the crucial line that matches your import style
export default Button;