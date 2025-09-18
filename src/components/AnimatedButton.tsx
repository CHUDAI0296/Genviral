'use client';

import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';

interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const buttonVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

export function AnimatedButton({ 
  children, 
  className = '', 
  onClick, 
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false
}: AnimatedButtonProps) {
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground'
  };

  const baseClasses = 'px-4 py-2 rounded-md text-sm font-medium transition-colors';
  const isDisabled = disabled || loading;
  const disabledClasses = isDisabled ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      whileHover={!isDisabled ? "hover" : undefined}
      whileTap={!isDisabled ? "tap" : undefined}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && <LoadingSpinner size="sm" />}
        {children}
      </div>
    </motion.button>
  );
}