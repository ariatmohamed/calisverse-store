import React from 'react';
import { motion } from 'framer-motion';
import type { MaterialVariant } from '../types';

interface ColorSwitcherProps {
  variants: MaterialVariant[];
  activeVariant: string;
  onVariantChange: (variant: MaterialVariant) => void;
  className?: string;
}

export const ColorSwitcher: React.FC<ColorSwitcherProps> = ({
  variants,
  activeVariant,
  onVariantChange,
  className = ''
}) => {
  // Only show available variants
  const availableVariants = variants.filter(variant => variant.available);

  if (availableVariants.length === 0) {
    return null;
  }

  return (
    <div className={`color-switcher ${className}`}>
      <div className="color-label text-sm font-medium text-slate-300 mb-3">
        Choose Color:
      </div>
      <div className="flex flex-wrap gap-3">
        {availableVariants.map((variant) => (
          <motion.button
            key={variant.name}
            className={`
              relative w-10 h-10 rounded-full border-2 transition-all duration-200
              ${activeVariant === variant.name 
                ? 'border-purple-400 shadow-lg shadow-purple-400/30' 
                : 'border-slate-600 hover:border-slate-400'
              }
            `}
            style={{ backgroundColor: variant.color }}
            onClick={() => onVariantChange(variant)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25 
            }}
          >
            {activeVariant === variant.name && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-purple-400"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <span className="sr-only">{variant.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
