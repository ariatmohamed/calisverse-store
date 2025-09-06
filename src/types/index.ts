export interface MaterialVariant {
  name: string;
  color: string;
  metalness?: number;
  roughness?: number;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  modelPath: string;
  variants: MaterialVariant[];
}

export interface GLTFCache {
  [key: string]: any;
}

export interface PerformanceConfig {
  enableDRACO: boolean;
  enableKTX2: boolean;
  enableMeshopt: boolean;
}
