import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {icon && (
        <div className="mb-6 text-neutral-300">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
      {description && (
        <p className="text-neutral-500 max-w-[280px] mb-8">{description}</p>
      )}
      {action && (
        <div className="w-full max-w-[200px]">
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
