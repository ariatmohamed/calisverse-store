import type { PerformanceConfig } from '../types';

export const getPerformanceConfig = (): PerformanceConfig => {
  // Check for WebGL capabilities
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  if (!gl) {
    return {
      enableDRACO: false,
      enableKTX2: false,
      enableMeshopt: false
    };
  }

  // Check for extensions
  const dracoSupported = !!gl.getExtension('WEBGL_compressed_texture_s3tc');
  const ktx2Supported = !!gl.getExtension('WEBGL_compressed_texture_etc');
  
  return {
    enableDRACO: dracoSupported,
    enableKTX2: ktx2Supported,
    enableMeshopt: true // Generally supported
  };
};

export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const getOptimalPixelRatio = (): number => {
  const pixelRatio = window.devicePixelRatio || 1;
  const isMobileDevice = isMobile();
  
  // Limit pixel ratio on mobile for performance
  if (isMobileDevice) {
    return Math.min(pixelRatio, 2);
  }
  
  return Math.min(pixelRatio, 2.5);
};

export const shouldUseWebGL = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return !!gl;
  } catch {
    return false;
  }
};
