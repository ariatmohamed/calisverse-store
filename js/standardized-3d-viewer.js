// Standardized 3D Viewer System - Professional Implementation
class Standardized3DViewer {
    constructor() {
        this.viewers = new Map();
        this.observers = new Map();
        this.loadingStates = new Map();
        this.devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        
        // Exact case-sensitive paths based on deployed files
        this.modelPaths = {
            'pullup-bar': '/models/pullup-bar-black.glb',
            'rings': '/models/rings-walnut.glb', 
            'parallettes': '/models/parallettes-steel.glb'
        };
        
        // Poster images matching default colors
        this.posterPaths = {
            'pullup-bar': '/images/pullup-bar-black-poster.jpg',
            'rings': '/images/rings-walnut-poster.jpg',
            'parallettes': '/images/parallettes-steel-poster.jpg'
        };
        
        // Default variants
        this.defaultVariants = {
            'pullup-bar': 'black',
            'rings': 'walnut',
            'parallettes': 'steel'
        };
        
        // Variant paths for switching
        this.variantPaths = {
            'pullup-bar': {
                'black': '/models/pullup-bar-black.glb',
                'steel': '/models/pullup-bar-steel.glb',
                'walnut': '/models/pullup-bar-walnut.glb'
            },
            'rings': {
                'black': '/models/rings-black.glb',
                'steel': '/models/rings-steel.glb',
                'walnut': '/models/rings-walnut.glb'
            },
            'parallettes': {
                'black': '/models/parallettes-black.glb',
                'steel': '/models/parallettes-steel.glb',
                'walnut': '/models/parallettes-walnut.glb'
            }
        };
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.clampDevicePixelRatio();
        this.setupVisibilityHandler();
        this.initializeViewers();
    }

    clampDevicePixelRatio() {
        if (window.devicePixelRatio > 2) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(2 / window.devicePixelRatio, 2 / window.devicePixelRatio);
            }
        }
    }

    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAllViewers();
            } else {
                this.resumeAllViewers();
            }
        });
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const container = entry.target;
                const productName = container.dataset.product;
                
                if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                    this.loadViewer(productName, container);
                } else {
                    this.pauseViewer(productName);
                }
            });
        }, {
            rootMargin: '200px',
            threshold: [0, 0.1, 0.5]
        });
    }

    initializeViewers() {
        const containers = document.querySelectorAll('.model-viewer-container');
        containers.forEach(container => {
            const productName = container.dataset.product;
            if (productName && this.modelPaths[productName]) {
                this.intersectionObserver.observe(container);
                this.createLoadingState(container, productName);
            }
        });
    }

    createLoadingState(container, productName) {
        const loader = document.createElement('div');
        loader.className = 'professional-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="poster-preview">
                    <img src="${this.posterPaths[productName]}" alt="${productName} preview" />
                </div>
                <div class="skeleton-shimmer">
                    <div class="shimmer-bar"></div>
                    <div class="shimmer-bar"></div>
                    <div class="shimmer-bar"></div>
                </div>
                <div class="loading-pill">Loading 3D Model...</div>
            </div>
        `;
        
        loader.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05));
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            border-radius: 16px;
        `;
        
        container.appendChild(loader);
        this.loadingStates.set(productName, loader);
    }

    loadViewer(productName, container) {
        if (this.viewers.has(productName)) return;
        
        const modelViewer = document.createElement('model-viewer');
        
        // Required standardized attributes
        modelViewer.src = this.modelPaths[productName];
        modelViewer.poster = this.posterPaths[productName];
        modelViewer.alt = `${productName.replace('-', ' ')} 3D Model`;
        
        // Standardized interaction attributes
        modelViewer.setAttribute('reveal', 'auto');
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('touch-action', 'pan-y');
        modelViewer.setAttribute('interaction-prompt', 'auto');
        
        // Standardized lighting and environment
        modelViewer.setAttribute('environment-image', 'neutral');
        modelViewer.setAttribute('exposure', '1.1');
        modelViewer.setAttribute('shadow-intensity', '0.6');
        
        // Standardized framing
        modelViewer.setAttribute('min-camera-orbit', 'auto auto 1.5m');
        modelViewer.setAttribute('max-camera-orbit', 'auto auto 4m');
        modelViewer.setAttribute('camera-orbit', '15deg 75deg 2.5m');
        
        // Performance attributes
        modelViewer.setAttribute('loading', 'lazy');
        modelViewer.setAttribute('seamless-poster', '');
        
        // Styling
        modelViewer.style.cssText = `
            width: 100%;
            height: 100%;
            background: transparent;
            --poster-color: transparent;
            --progress-bar-color: #8b5cf6;
            --progress-mask: rgba(139, 92, 246, 0.2);
            pointer-events: auto;
            z-index: 1;
        `;
        
        // Event handlers
        this.setupEventHandlers(modelViewer, container, productName);
        
        // Store reference
        this.viewers.set(productName, modelViewer);
        
        // Append to container
        container.appendChild(modelViewer);
        
        // Set default variant and sync UI
        this.setDefaultVariant(container, productName);
        
        console.log(`✅ Loaded standardized viewer for ${productName}`);
    }

    setupEventHandlers(modelViewer, container, productName) {
        let loadTimeout;
        
        // Loading success
        modelViewer.addEventListener('load', () => {
            clearTimeout(loadTimeout);
            this.hideLoader(productName);
            this.showHelperText(container);
        });
        
        // Model visibility (fallback)
        modelViewer.addEventListener('model-visibility', () => {
            clearTimeout(loadTimeout);
            this.hideLoader(productName);
            this.showHelperText(container);
        });
        
        // Error handling with 8-second timeout
        loadTimeout = setTimeout(() => {
            this.showErrorFallback(container, productName);
        }, 8000);
        
        modelViewer.addEventListener('error', () => {
            clearTimeout(loadTimeout);
            this.showErrorFallback(container, productName);
        });
    }

    hideLoader(productName) {
        const loader = this.loadingStates.get(productName);
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
                this.loadingStates.delete(productName);
            }, 300);
        }
    }

    showHelperText(container) {
        const helperText = document.createElement('div');
        helperText.className = 'interaction-helper';
        helperText.textContent = 'Drag to rotate • Scroll to zoom';
        helperText.style.cssText = `
            position: absolute;
            bottom: 16px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            z-index: 5;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.3s ease;
        `;
        
        container.appendChild(helperText);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            helperText.style.opacity = '0';
            setTimeout(() => {
                if (helperText.parentNode) {
                    helperText.parentNode.removeChild(helperText);
                }
            }, 300);
        }, 3000);
    }

    showErrorFallback(container, productName) {
        this.hideLoader(productName);
        
        const fallback = document.createElement('div');
        fallback.className = 'error-fallback';
        fallback.innerHTML = `
            <div class="fallback-content">
                <img src="/images/${productName}-static.png" alt="${productName}" />
                <button class="view-photos-btn">View Photos</button>
            </div>
        `;
        
        fallback.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 16px;
            z-index: 10;
        `;
        
        container.appendChild(fallback);
    }

    setDefaultVariant(container, productName) {
        const defaultVariant = this.defaultVariants[productName];
        const pills = container.parentElement.querySelectorAll('.color-pill');
        
        pills.forEach(pill => {
            const variant = pill.dataset.variant;
            if (variant === defaultVariant) {
                pill.setAttribute('aria-pressed', 'true');
                pill.classList.add('active');
            } else {
                pill.setAttribute('aria-pressed', 'false');
                pill.classList.remove('active');
            }
        });
    }

    switchVariant(productName, variant) {
        const viewer = this.viewers.get(productName);
        if (!viewer || !this.variantPaths[productName] || !this.variantPaths[productName][variant]) return;
        
        // Store current camera position
        const currentOrbit = viewer.getCameraOrbit();
        
        // Switch model
        viewer.src = this.variantPaths[productName][variant];
        
        // Restore camera position after load
        viewer.addEventListener('load', () => {
            viewer.cameraOrbit = currentOrbit;
        }, { once: true });
    }

    pauseViewer(productName) {
        const viewer = this.viewers.get(productName);
        if (viewer && viewer.pause) {
            viewer.pause();
        }
    }

    pauseAllViewers() {
        this.viewers.forEach(viewer => {
            if (viewer.pause) viewer.pause();
        });
    }

    resumeAllViewers() {
        this.viewers.forEach(viewer => {
            if (viewer.play) viewer.play();
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.standardized3DViewer = new Standardized3DViewer();
});

// Utility function for color pill interactions
function handleColorPillClick(productName, variant, pillElement) {
    if (window.standardized3DViewer) {
        window.standardized3DViewer.switchVariant(productName, variant);
        
        // Update UI state
        const container = pillElement.closest('.product-section');
        const pills = container.querySelectorAll('.color-pill');
        
        pills.forEach(pill => {
            pill.setAttribute('aria-pressed', 'false');
            pill.classList.remove('active');
        });
        
        pillElement.setAttribute('aria-pressed', 'true');
        pillElement.classList.add('active');
    }
}
