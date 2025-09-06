import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product3DViewer } from './Product3DViewer';
import type { Product, MaterialVariant } from '../types';

interface ProductPageProps {
  product: Product;
}

export const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<MaterialVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Set default variant to first available one
    const firstAvailable = product.variants.find(v => v.available);
    if (firstAvailable) {
      setSelectedVariant(firstAvailable);
    }
  }, [product.variants]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    // Add to cart logic here
    console.log('Adding to cart:', {
      product: product.id,
      variant: selectedVariant.name,
      quantity
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* 3D Viewer */}
          <motion.div
            className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Product3DViewer
              modelPath={product.modelPath}
              variants={product.variants}
              className="w-full h-full"
              autoRotate={true}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            
            {/* Title & Price */}
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl lg:text-5xl font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {product.name}
              </motion.h1>
              
              <motion.div 
                className="text-3xl font-bold text-purple-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                ${product.price}
              </motion.div>
            </div>

            {/* Description */}
            <motion.p 
              className="text-slate-300 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {product.description}
            </motion.p>

            {/* Color Selection */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-white">Choose Color:</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.filter(v => v.available).map((variant) => (
                  <motion.button
                    key={variant.name}
                    className={`
                      relative w-12 h-12 rounded-full border-2 transition-all duration-200
                      ${selectedVariant?.name === variant.name 
                        ? 'border-purple-400 shadow-lg shadow-purple-400/30' 
                        : 'border-slate-600 hover:border-slate-400'
                      }
                    `}
                    style={{ backgroundColor: variant.color }}
                    onClick={() => setSelectedVariant(variant)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25 
                    }}
                  >
                    {selectedVariant?.name === variant.name && (
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
              {selectedVariant && (
                <p className="text-slate-400 text-sm">
                  Selected: {selectedVariant.name}
                </p>
              )}
            </motion.div>

            {/* Quantity & Add to Cart */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <div className="flex items-center space-x-4">
                <label className="text-white font-medium">Quantity:</label>
                <div className="flex items-center border border-slate-600 rounded-lg">
                  <button
                    className="px-3 py-2 text-white hover:bg-slate-700 transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-white bg-slate-800">{quantity}</span>
                  <button
                    className="px-3 py-2 text-white hover:bg-slate-700 transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <motion.button
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={!selectedVariant}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </motion.button>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};
