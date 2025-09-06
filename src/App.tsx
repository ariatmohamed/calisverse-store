import React, { useEffect } from 'react';
import { ProductPage } from './components/ProductPage';
import { preloadProductModels } from './utils/gltfCache';
import type { Product } from './types';

// Sample product data
const sampleProduct: Product = {
  id: 'pullup-bar-pro',
  name: 'Professional Pull-up Bar',
  price: 299.99,
  description: 'Premium steel construction pull-up bar designed for serious calisthenics training. Features ergonomic grips and supports up to 300lbs.',
  modelPath: '/models/pullup-bar.glb',
  variants: [
    {
      name: 'Black',
      color: '#1a1a1a',
      metalness: 0.8,
      roughness: 0.2,
      available: true
    },
    {
      name: 'Dark Gray',
      color: '#4a4a4a',
      metalness: 0.6,
      roughness: 0.3,
      available: true
    },
    {
      name: 'Light Gray',
      color: '#9ca3af',
      metalness: 0.4,
      roughness: 0.4,
      available: true
    },
    {
      name: 'Lilac',
      color: '#8B5CF6',
      metalness: 0.3,
      roughness: 0.5,
      available: true
    }
  ]
};

function App() {
  useEffect(() => {
    // Preload 3D models on app start
    preloadProductModels().catch(console.error);
  }, []);

  return (
    <div className="App">
      <ProductPage product={sampleProduct} />
    </div>
  );
}

export default App;
