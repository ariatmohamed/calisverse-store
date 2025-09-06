import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import { motion } from 'framer-motion';
import { ModelLoadingSkeleton } from './Spinner';
import { useMaterialVariants } from '../hooks/useMaterialVariants';
import { ColorSwitcher } from './ColorSwitcher';
import { getOptimalPixelRatio, shouldUseWebGL } from '../utils/performance';
import type { MaterialVariant } from '../types';

interface ModelProps {
  modelPath: string;
  variants: MaterialVariant[];
  onModelLoad?: () => void;
}

const Model: React.FC<ModelProps> = ({ modelPath, variants, onModelLoad }) => {
  const modelRef = useRef<any>();
  const { scene } = useGLTF(modelPath);
  const [activeVariant, setActiveVariant] = useState(variants.find(v => v.available)?.name || '');
  
  const { applyVariant, storeMaterials, availableVariants } = useMaterialVariants(
    modelRef, 
    variants
  );

  useEffect(() => {
    if (modelRef.current) {
      storeMaterials();
      onModelLoad?.();
    }
  }, [storeMaterials, onModelLoad]);

  useEffect(() => {
    const variant = availableVariants.find(v => v.name === activeVariant);
    if (variant) {
      applyVariant(variant);
    }
  }, [activeVariant, applyVariant, availableVariants]);

  const handleVariantChange = (variant: MaterialVariant) => {
    setActiveVariant(variant.name);
  };

  return (
    <group>
      <primitive 
        ref={modelRef} 
        object={scene.clone()} 
        scale={[1, 1, 1]} 
        position={[0, 0, 0]} 
      />
      
      {/* Color Switcher Overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        <ColorSwitcher
          variants={availableVariants}
          activeVariant={activeVariant}
          onVariantChange={handleVariantChange}
        />
      </div>
    </group>
  );
};

interface Product3DViewerProps {
  modelPath: string;
  variants: MaterialVariant[];
  className?: string;
  autoRotate?: boolean;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  modelPath,
  variants,
  className = '',
  autoRotate = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setHasWebGL(shouldUseWebGL());
  }, []);

  if (!hasWebGL) {
    return (
      <div className={`w-full h-full bg-slate-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-slate-400">
          <p>WebGL not supported</p>
          <p className="text-sm">Fallback to static image</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`relative w-full h-full ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        dpr={getOptimalPixelRatio()}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* HDRI Environment - using preset for now */}
          <Environment
            preset="studio"
            background={false}
          />
          
          {/* Key Light */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Fill Light */}
          <ambientLight intensity={0.2} />
          
          {/* Model */}
          <Model 
            modelPath={modelPath}
            variants={variants}
            onModelLoad={() => setIsLoaded(true)}
          />
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            dampingFactor={0.05}
            enableDamping={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            minDistance={2}
            maxDistance={10}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
      
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20">
          <ModelLoadingSkeleton />
        </div>
      )}
    </motion.div>
  );
};
