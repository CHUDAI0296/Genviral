'use client';

import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCard({ children, className = '' }: AnimatedCardProps) {
  const isMobile = useIsMobile();
  
  const cardVariants = {
    initial: { opacity: 0, y: isMobile ? 10 : 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: isMobile ? 0.4 : 0.5 }
    },
    hover: { 
      scale: isMobile ? 1.02 : 1.05,
      y: isMobile ? -2 : -5,
      boxShadow: isMobile 
        ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
        : '0 10px 25px rgba(0, 0, 0, 0.15)',
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap={isMobile ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}