import React from 'react';
import { motion } from 'framer-motion';

interface SpinnerProps {
  size?: number;
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 40, 
  color = '#8B5CF6' 
}) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        className="rounded-full border-2 border-transparent"
        style={{
          width: size,
          height: size,
          borderTopColor: color,
          borderRightColor: `${color}40`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export const ModelLoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner size={48} />
        <motion.p 
          className="text-slate-400 text-sm"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading 3D Model...
        </motion.p>
      </div>
    </div>
  );
};
