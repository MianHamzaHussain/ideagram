import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type AnimationType = 'slide-up' | 'push' | 'fade' | 'none';

interface AnimatedPageProps {
  children: ReactNode;
  animationType?: AnimationType;
  className?: string;
}

const variants: Record<AnimationType, Variants> = {
  'slide-up': {
    initial: { y: '100%', opacity: 1 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.8
      }
    },
    exit: {
      y: '100%',
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 35,
        stiffness: 350,
      }
    }
  },
  'push': {
    initial: { x: '100%', opacity: 1 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300
      }
    },
    exit: {
      x: '-30%',
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  },
  'fade': {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  },
  'none': {
    initial: {},
    animate: {},
    exit: {}
  }
};

/**
 * AnimatedPage Component
 * Provides premium, industry-standard mobile transitions.
 */
const AnimatedPage = ({ children, animationType = 'fade', className = "" }: AnimatedPageProps) => {
  const currentVariant = variants[animationType];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={currentVariant}
      className={`w-full h-full will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
