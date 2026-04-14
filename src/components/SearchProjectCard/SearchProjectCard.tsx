import { motion } from 'framer-motion';
import { type Project } from '@/api';

interface SearchProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const SearchProjectCard = ({ project, onClick }: SearchProjectCardProps) => {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm transition-colors cursor-pointer hover:bg-neutral-50/50"
      onClick={onClick}
    >
      <h3 className="heading-m text-neutral-900 mb-3 truncate">
        {project.name}
      </h3>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="body-s text-neutral-500">Person in charge:</span>
          <span className="body-s text-neutral-800 font-medium">{project.leaderName || 'N/A'}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="body-s text-neutral-500">Latest report:</span>
          <span className="body-s text-neutral-800 font-medium">
            {project.modifiedOn ? new Date(project.modifiedOn).toLocaleDateString() : 'No reports yet'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchProjectCard;
