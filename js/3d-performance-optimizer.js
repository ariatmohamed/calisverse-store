// 3D Performance Optimizer with Draco, KTX2, and Smart Loading
class Performance3DOptimizer {
    constructor() {
        this.isTabActive = true;
        this.activeViewers = new Set();
        this.loadedModels = new Map();
        this.compressionSupport = this.detectCompressionSupport();
        this.deviceCapabilities = this.analyzeDevice();
        
        this.init();
    }
    
    detectCompressionSupport() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return { draco: false, ktx2: false };
        
        return {
            draco: true, // Assume Draco support for modern browsers
            ktx2: !!gl.getExtension('WEBGL_compressed_texture_s3tc') || 
                  !!gl.getExtension('WEBGL_compressed_texture_etc1') ||
                  !!gl.getExtension('WEBGL_compressed_texture_astc')
        };
    }
    
    analyzeDevice() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        const capabilities = {
            isMobile: window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isLowEnd: navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4,
            maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048,
            webglVersion: this.getWebGLVersion(gl),
            pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
        };
        
        // Adjust pixel ratio for performance
        if (capabilities.isMobile || capabilities.isLowEnd) {
            capabilities.pixelRatio = Math.min(capabilities.pixelRatio, 1.5);
        }
        
        return capabilities;
    }
    
    getWebGLVersion(gl) {
        if (!gl) return 0;
        if (gl.getParameter(gl.VERSION).indexOf('WebGL 2.0') !== -1) return 2;
        return 1;
    }
    
    init() {
        this.setupTabVisibilityHandling();
        this.setupIntersectionObserver();
        this.preloadCriticalAssets();
        this.setupLoaders();
    }
    
    setupTabVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            this.isTabActive = !document.hidden;
            
            if (this.isTabActive) {
                this.resumeAllViewers();
            } else {
                this.pauseAllViewers();
            }
        });
    }
    
    setupIntersectionObserver() {
        this.viewerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const viewerId = entry.target.id;
                
                if (entry.isIntersecting) {
                    this.activateViewer(viewerId);
                } else {
                    this.deactivateViewer(viewerId);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe all 3D viewers
        document.querySelectorAll('.viewer-3d, .professional-3d-viewer').forEach(viewer => {
            this.viewerObserver.observe(viewer);
        });
    }
    
    setupLoaders() {
        if (typeof THREE === 'undefined') return;
        
        // Setup Draco loader
        if (this.compressionSupport.draco && THREE.DRACOLoader) {
            this.dracoLoader = new THREE.DRACOLoader();
            this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
            this.dracoLoader.setDecoderConfig({ type: 'js' });
        }
        
        // Setup KTX2 loader
        if (this.compressionSupport.ktx2 && THREE.KTX2Loader) {
            this.ktx2Loader = new THREE.KTX2Loader();
            this.ktx2Loader.setTranscoderPath('https://threejs.org/examples/js/libs/basis/');
        }
        
        // Enhanced GLTF loader with compression
        if (THREE.GLTFLoader) {
            this.gltfLoader = new THREE.GLTFLoader();
            
            if (this.dracoLoader) {
                this.gltfLoader.setDRACOLoader(this.dracoLoader);
            }
            
            if (this.ktx2Loader) {
                this.gltfLoader.setKTX2Loader(this.ktx2Loader);
            }
        }
    }
    
    preloadCriticalAssets() {
        // Preload only the first visible model
        const firstViewer = document.querySelector('.viewer-3d, .professional-3d-viewer');
        if (firstViewer) {
            const equipmentType = firstViewer.dataset.equipment;
            if (equipmentType) {
                this.preloadModel(equipmentType);
            }
        }
    }
    
    preloadModel(equipmentType) {
        const modelPath = this.getOptimizedModelPath(equipmentType);
        
        if (this.gltfLoader && !this.loadedModels.has(equipmentType)) {
            this.gltfLoader.load(
                modelPath,
                (gltf) => {
                    this.loadedModels.set(equipmentType, gltf);
                    console.log(`Preloaded model: ${equipmentType}`);
                },
                undefined,
                (error) => {
                    console.warn(`Failed to preload model: ${equipmentType}`, error);
                }
            );
        }
    }
    
    getOptimizedModelPath(equipmentType) {
        const basePath = '/models/';
        const extension = this.compressionSupport.draco ? '.draco.glb' : '.glb';
        
        // Fallback paths in order of preference
        const paths = [
            `${basePath}${equipmentType}-black${extension}`,
            `${basePath}${equipmentType}-black.glb`,
            `${basePath}${equipmentType}.glb`
        ];
        
        return paths[0]; // Return most optimized path available
    }
    
    optimizeRenderer(renderer) {
        if (!renderer) return;
        
        // Set optimal pixel ratio
        renderer.setPixelRatio(this.deviceCapabilities.pixelRatio);
        
        // Optimize shadow settings based on device
        if (this.deviceCapabilities.isMobile || this.deviceCapabilities.isLowEnd) {
            renderer.shadowMap.enabled = false;
            renderer.antialias = false;
        } else {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.antialias = true;
        }
        
        // Set optimal tone mapping
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        
        // Enable efficient rendering
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.physicallyCorrectLights = true;
        
        return renderer;
    }
    
    optimizeTextures(material) {
        if (!material) return;
        
        const maxTextureSize = this.deviceCapabilities.isMobile ? 1024 : 2048;
        
        // Optimize texture properties
        ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap'].forEach(prop => {
            if (material[prop]) {
                material[prop].generateMipmaps = true;
                material[prop].minFilter = THREE.LinearMipmapLinearFilter;
                material[prop].magFilter = THREE.LinearFilter;
                material[prop].wrapS = THREE.RepeatWrapping;
                material[prop].wrapT = THREE.RepeatWrapping;
                
                // Resize if needed (would need actual texture resizing implementation)
                if (material[prop].image && material[prop].image.width > maxTextureSize) {
                    console.warn(`Texture too large: ${material[prop].image.width}px, consider resizing`);
                }
            }
        });
    }
    
    activateViewer(viewerId) {
        this.activeViewers.add(viewerId);
        
        // Resume rendering if tab is active
        if (this.isTabActive) {
            this.resumeViewer(viewerId);
        }
    }
    
    deactivateViewer(viewerId) {
        this.activeViewers.delete(viewerId);
        this.pauseViewer(viewerId);
    }
    
    pauseViewer(viewerId) {
        const viewer = document.getElementById(viewerId);
        if (viewer && viewer.pauseRenderLoop) {
            viewer.pauseRenderLoop();
        }
    }
    
    resumeViewer(viewerId) {
        const viewer = document.getElementById(viewerId);
        if (viewer && viewer.resumeRenderLoop) {
            viewer.resumeRenderLoop();
        }
    }
    
    pauseAllViewers() {
        this.activeViewers.forEach(viewerId => {
            this.pauseViewer(viewerId);
        });
    }
    
    resumeAllViewers() {
        this.activeViewers.forEach(viewerId => {
            this.resumeViewer(viewerId);
        });
    }
    
    createFallbackImage(container, equipmentType) {
        const fallback = document.createElement('div');
        fallback.className = 'webgl-fallback-optimized';
        
        // Use WebP if supported, otherwise JPEG
        const imageFormat = this.supportsWebP() ? 'webp' : 'jpg';
        const imagePath = `/images/${equipmentType}-hero.${imageFormat}`;
        
        fallback.innerHTML = `
            <picture>
                <source srcset="${imagePath}" type="image/${imageFormat}">
                <img src="/images/${equipmentType}-hero.jpg" 
                     alt="${this.getProductName(equipmentType)}" 
                     loading="lazy"
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">
            </picture>
            <div class="fallback-overlay">
                <div class="fallback-icon">📱</div>
                <div class="fallback-text">3D view not supported on this device</div>
                <div class="fallback-subtitle">Showing high-quality product image</div>
            </div>
        `;
        
        fallback.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border-radius: 12px;
            overflow: hidden;
        `;
        
        container.appendChild(fallback);
    }
    
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    
    getProductName(equipmentType) {
        const names = {
            'pullup': 'Professional Pull-up Bar',
            'rings': 'Olympic Gymnastic Rings',
            'parallettes': 'Premium Parallettes'
        };
        return names[equipmentType] || 'Professional Equipment';
    }
    
    // Memory management
    disposeViewer(viewerId) {
        const viewer = document.getElementById(viewerId);
        if (!viewer) return;
        
        // Dispose of Three.js resources
        if (viewer.scene) {
            viewer.scene.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => this.disposeMaterial(material));
                    } else {
                        this.disposeMaterial(child.material);
                    }
                }
            });
        }
        
        if (viewer.renderer) {
            viewer.renderer.dispose();
        }
        
        this.activeViewers.delete(viewerId);
    }
    
    disposeMaterial(material) {
        if (!material) return;
        
        // Dispose textures
        ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'envMap'].forEach(prop => {
            if (material[prop]) {
                material[prop].dispose();
            }
        });
        
        material.dispose();
    }
    
    // Performance monitoring
    getPerformanceMetrics() {
        return {
            activeViewers: this.activeViewers.size,
            loadedModels: this.loadedModels.size,
            deviceCapabilities: this.deviceCapabilities,
            compressionSupport: this.compressionSupport,
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB'
            } : 'Not available'
        };
    }
}

// Defer non-critical JavaScript loading
function deferNonCriticalJS() {
    const scripts = [
        '/js/scroll-animations.js',
        '/js/mobile-optimizer.js',
        '/js/enhanced-3d-controls.js'
    ];
    
    // Load after initial render
    setTimeout(() => {
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.head.appendChild(script);
        });
    }, 1000);
}

// Initialize performance optimizer
let performanceOptimizer;

function initPerformanceOptimizer() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            performanceOptimizer = new Performance3DOptimizer();
            deferNonCriticalJS();
        });
    } else {
        performanceOptimizer = new Performance3DOptimizer();
        deferNonCriticalJS();
    }
}

// Auto-initialize
initPerformanceOptimizer();

// Export for global access
window.Performance3DOptimizer = Performance3DOptimizer;
window.performanceOptimizer = performanceOptimizer;

// Add optimized fallback styles
const style = document.createElement('style');
style.textContent = `
    .webgl-fallback-optimized {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .fallback-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        padding: 20px;
        text-align: center;
        color: white;
    }
    
    .fallback-icon {
        font-size: 24px;
        margin-bottom: 8px;
    }
    
    .fallback-text {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 4px;
    }
    
    .fallback-subtitle {
        font-size: 12px;
        opacity: 0.8;
    }
    
    /* Optimize for low-end devices */
    @media (max-width: 768px), (max-resolution: 150dpi) {
        .professional-3d-viewer .viewer-canvas {
            height: 300px;
        }
        
        .variant-controls {
            transform: scale(0.9);
            transform-origin: top left;
        }
        
        .sticky-cart-button {
            transform: scale(0.95);
            transform-origin: bottom right;
        }
    }
`;
document.head.appendChild(style);
