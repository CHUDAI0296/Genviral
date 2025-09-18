'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface AnimatedWrapperProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const mobileVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export function AnimatedWrapper({ 
  children, 
  className = '', 
  variants,
  delay = 0
}: AnimatedWrapperProps) {
  const isMobile = useIsMobile();
  
  const animationVariants = variants || (isMobile ? mobileVariants : defaultVariants);
  
  // Apply delay to the visible state
  const variantsWithDelay = {
    ...animationVariants,
    visible: {
      ...animationVariants.visible,
      transition: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        duration: (animationVariants.visible as any).transition?.duration || 0.6,
        delay: delay
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={variantsWithDelay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: isMobile ? 0.1 : 0.3 }}
    >
      {children}
    </motion.div>
  );
}