import { useGLTF } from '@react-three/drei';
import type { GLTFCache } from '../types';

class GLTFCacheManager {
  private cache: GLTFCache = {};
  private loadingPromises: Map<string, Promise<any>> = new Map();

  preload(url: string): Promise<any> {
    if (this.cache[url]) {
      return Promise.resolve(this.cache[url]);
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    const promise = useGLTF.preload(url);
    this.loadingPromises.set(url, promise);

    promise
      .then((gltf) => {
        this.cache[url] = gltf;
        this.loadingPromises.delete(url);
      })
      .catch((error) => {
        console.error(`Failed to preload GLTF: ${url}`, error);
        this.loadingPromises.delete(url);
      });

    return promise;
  }

  get(url: string) {
    return this.cache[url];
  }

  clear() {
    this.cache = {};
    this.loadingPromises.clear();
  }

  preloadMultiple(urls: string[]): Promise<any[]> {
    return Promise.all(urls.map(url => this.preload(url)));
  }
}

export const gltfCache = new GLTFCacheManager();

// Preload common models
export const preloadProductModels = () => {
  const modelPaths = [
    '/models/pullup-bar.glb',
    '/models/gymnastic-rings.glb', 
    '/models/parallel-bars.glb'
  ];
  
  return gltfCache.preloadMultiple(modelPaths);
};
