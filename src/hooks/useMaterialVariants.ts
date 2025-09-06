import { useCallback, useRef, useEffect } from 'react';
import { MeshStandardMaterial, MeshPhysicalMaterial, Color } from 'three';
import type { MaterialVariant } from '../types';

export const useMaterialVariants = (
  modelRef: React.RefObject<any>,
  availableVariants: MaterialVariant[]
) => {
  const isMountedRef = useRef(true);
  const originalMaterials = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const storeMaterials = useCallback(() => {
    if (!modelRef.current) return;

    modelRef.current.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material: any, index: number) => {
          const key = `${child.uuid}_${index}`;
          if (!originalMaterials.current.has(key)) {
            originalMaterials.current.set(key, {
              color: material.color?.clone(),
              metalness: material.metalness,
              roughness: material.roughness,
              map: material.map,
              normalMap: material.normalMap,
              roughnessMap: material.roughnessMap,
              metalnessMap: material.metalnessMap
            });
          }
        });
      }
    });
  }, [modelRef]);

  const applyVariant = useCallback((variant: MaterialVariant) => {
    if (!modelRef.current || !isMountedRef.current) return;

    const color = new Color(variant.color);
    
    modelRef.current.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        
        materials.forEach((material: any) => {
          if (material instanceof MeshStandardMaterial || material instanceof MeshPhysicalMaterial) {
            // Apply color tint
            material.color.copy(color);
            
            // Apply material properties if specified
            if (variant.metalness !== undefined) {
              material.metalness = variant.metalness;
            }
            if (variant.roughness !== undefined) {
              material.roughness = variant.roughness;
            }
            
            material.needsUpdate = true;
          }
        });
      }
    });
  }, [modelRef]);

  const resetToOriginal = useCallback(() => {
    if (!modelRef.current || !isMountedRef.current) return;

    modelRef.current.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        
        materials.forEach((material: any, index: number) => {
          const key = `${child.uuid}_${index}`;
          const original = originalMaterials.current.get(key);
          
          if (original && (material instanceof MeshStandardMaterial || material instanceof MeshPhysicalMaterial)) {
            if (original.color) material.color.copy(original.color);
            if (original.metalness !== undefined) material.metalness = original.metalness;
            if (original.roughness !== undefined) material.roughness = original.roughness;
            material.needsUpdate = true;
          }
        });
      }
    });
  }, [modelRef]);

  return {
    applyVariant,
    resetToOriginal,
    storeMaterials,
    availableVariants: availableVariants.filter(v => v.available)
  };
};
