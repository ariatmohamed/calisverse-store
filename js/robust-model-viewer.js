// Robust Model Viewer System with Lazy Loading and Error Handling
class RobustModelViewer {
    constructor() {
        this.viewers = new Map();
        this.observers = new Map();
        this.loadingStates = new Map();
        this.errorStates = new Map();
        this.devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.clampDevicePixelRatio();
        this.initializeViewers();
    }

    clampDevicePixelRatio() {
        // Clamp devicePixelRatio to max 2 on mobile to avoid GPU stalls
        if (window.devicePixelRatio > 2) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(2 / window.devicePixelRatio, 2 / window.devicePixelRatio);
            }
        }
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const viewerId = entry.target.dataset.viewerId;
                if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                    this.loadViewer(viewerId);
                } else {
                    this.pauseViewer(viewerId);
                }
            });
        }, {
            rootMargin: '200px',
            threshold: [0, 0.1, 0.5]
        });
    }

    initializeViewers() {
        const viewerContainers = document.querySelectorAll('.model-viewer-container');
        
        viewerContainers.forEach((container, index) => {
            const productName = this.getProductNameFromContainer(container);
            const viewerId = `viewer-${productName}-${index}`;
            
            container.dataset.viewerId = viewerId;
            
            // Create loading state immediately
            this.createLoadingState(container, productName);
            
            // Start observing for lazy loading
            this.intersectionObserver.observe(container);
            
            console.log(`🔍 Initialized viewer: ${viewerId} for product: ${productName}`);
        });
    }

    getProductNameFromContainer(container) {
        // Extract product name from container context
        const section = container.closest('section');
        if (section) {
            if (section.id.includes('pullup') || section.querySelector('h2')?.textContent.includes('Pull-Up')) {
                return 'pullup-bar';
            }
            if (section.id.includes('rings') || section.querySelector('h2')?.textContent.includes('Rings')) {
                return 'rings';
            }
            if (section.id.includes('parallettes') || section.querySelector('h2')?.textContent.includes('Parallettes')) {
                return 'parallettes';
            }
        }
        return 'pullup-bar'; // Default fallback
    }

    createLoadingState(container, productName) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'model-loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-shimmer">
                <div class="shimmer-pill">
                    <div class="shimmer-animation"></div>
                    <span class="loading-text">Loading 3D Model…</span>
                </div>
            </div>
        `;
        
        container.appendChild(loadingOverlay);
        this.loadingStates.set(container.dataset.viewerId, loadingOverlay);
    }

    async loadViewer(viewerId) {
        const container = document.querySelector(`[data-viewer-id="${viewerId}"]`);
        if (!container || this.viewers.has(viewerId)) return;

        const productName = this.getProductNameFromContainer(container);
        
        try {
            // Check if assets exist first
            const assetsExist = await this.checkAssets(productName);
            if (!assetsExist) {
                this.showErrorFallback(container, productName);
                return;
            }

            // Create model-viewer element
            const modelViewer = this.createModelViewer(productName);
            
            // Set up loading timeout
            const loadTimeout = setTimeout(() => {
                if (!this.viewers.has(viewerId)) {
                    console.warn(`⏰ Loading timeout for ${productName}`);
                    this.showErrorFallback(container, productName);
                }
            }, 8000);

            // Set up event handlers
            modelViewer.addEventListener('load', () => {
                clearTimeout(loadTimeout);
                this.onModelLoad(viewerId, container, modelViewer);
            });

            modelViewer.addEventListener('error', () => {
                clearTimeout(loadTimeout);
                console.error(`❌ Model load error: ${productName}`);
                this.showErrorFallback(container, productName);
            });

            // Add to container
            container.appendChild(modelViewer);
            this.viewers.set(viewerId, modelViewer);
            
            console.log(`🚀 Loading model viewer: ${viewerId}`);
            
        } catch (error) {
            console.error(`❌ Failed to create viewer for ${productName}:`, error);
            this.showErrorFallback(container, productName);
        }
    }

    createModelViewer(productName) {
        const modelViewer = document.createElement('model-viewer');
        
        // Set exact paths with case-sensitive filenames
        modelViewer.src = `/models/${productName}.glb`;
        modelViewer.poster = `/images/${productName}-poster.jpg`;
        modelViewer.alt = `${productName.replace('-', ' ')} 3D Model`;
        
        // Essential attributes for consistent experience
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('touch-action', 'pan-y');
        modelViewer.setAttribute('interaction-prompt', 'auto');
        modelViewer.setAttribute('shadow-intensity', '0.6');
        modelViewer.setAttribute('exposure', '1.0');
        modelViewer.setAttribute('environment-image', 'neutral');
        
        // Consistent framing and zoom
        modelViewer.setAttribute('min-camera-orbit', 'auto auto 1.5m');
        modelViewer.setAttribute('max-camera-orbit', 'auto auto 4m');
        modelViewer.setAttribute('camera-orbit', '15deg 75deg 2.5m');
        
        // Performance and loading optimizations
        modelViewer.setAttribute('loading', 'lazy');
        modelViewer.setAttribute('reveal', 'auto');
        modelViewer.setAttribute('seamless-poster', '');
        
        // Safe defaults to avoid black-until-tap
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('auto-rotate-delay', '2000');
        modelViewer.setAttribute('rotation-per-second', '20deg');
        
        // Styling
        modelViewer.style.cssText = `
            width: 100%;
            height: 520px;
            background: transparent;
            --poster-color: transparent;
            --progress-bar-color: #8b5cf6;
            --progress-mask: rgba(139, 92, 246, 0.1);
            pointer-events: auto;
            z-index: 1;
        `;

        return modelViewer;
    }

    async checkAssets(productName) {
        try {
            const modelPath = `/models/${productName}.glb`;
            const posterPath = `/images/${productName}-poster.jpg`;
            
            const [modelExists, posterExists] = await Promise.all([
                this.checkAssetExists(modelPath),
                this.checkAssetExists(posterPath)
            ]);
            
            if (!modelExists) {
                console.error(`❌ Missing model: ${modelPath}`);
            }
            if (!posterExists) {
                console.warn(`⚠️ Missing poster: ${posterPath}`);
            }
            
            return modelExists; // Poster is optional, model is required
        } catch (error) {
            console.error(`❌ Asset check failed for ${productName}:`, error);
            return false;
        }
    }

    async checkAssetExists(path) {
        try {
            const response = await fetch(path, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    onModelLoad(viewerId, container, modelViewer) {
        // Hide loading overlay
        const loadingOverlay = this.loadingStates.get(viewerId);
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
                this.loadingStates.delete(viewerId);
            }, 300);
        }

        // Show helper text briefly
        this.showHelperText(container);
        
        console.log(`✅ Model loaded successfully: ${viewerId}`);
    }

    showHelperText(container) {
        const helperText = document.createElement('div');
        helperText.className = 'interaction-helper';
        helperText.innerHTML = 'Drag to rotate • Scroll to zoom';
        helperText.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.875rem;
            pointer-events: none;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        container.appendChild(helperText);
        
        // Fade in
        setTimeout(() => {
            helperText.style.opacity = '1';
        }, 500);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            helperText.style.opacity = '0';
            setTimeout(() => {
                helperText.remove();
            }, 300);
        }, 3500);
    }

    showErrorFallback(container, productName) {
        // Hide loading overlay
        const viewerId = container.dataset.viewerId;
        const loadingOverlay = this.loadingStates.get(viewerId);
        if (loadingOverlay) {
            loadingOverlay.remove();
            this.loadingStates.delete(viewerId);
        }

        // Create error fallback
        const errorFallback = document.createElement('div');
        errorFallback.className = 'model-error-fallback';
        errorFallback.innerHTML = `
            <div class="error-content">
                <img src="/images/${productName}-fallback.png" 
                     alt="${productName.replace('-', ' ')}" 
                     onerror="this.src='/images/product-placeholder.png'"
                     style="width: 100%; height: 300px; object-fit: contain; margin-bottom: 1rem;">
                <p style="color: #666; margin-bottom: 1rem;">3D model temporarily unavailable</p>
                <a href="#gallery" class="view-photos-btn" style="
                    display: inline-block;
                    padding: 12px 24px;
                    background: var(--accent);
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                ">View Photos</a>
            </div>
        `;
        
        errorFallback.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 520px;
            background: #f8f9fa;
            border-radius: 12px;
            text-align: center;
        `;
        
        container.appendChild(errorFallback);
        this.errorStates.set(viewerId, errorFallback);
        
        console.warn(`⚠️ Showing error fallback for ${productName}`);
    }

    pauseViewer(viewerId) {
        const modelViewer = this.viewers.get(viewerId);
        if (modelViewer && modelViewer.pause) {
            modelViewer.pause();
        }
    }

    resumeViewer(viewerId) {
        const modelViewer = this.viewers.get(viewerId);
        if (modelViewer && modelViewer.play) {
            modelViewer.play();
        }
    }

    // Asset integrity checker for development
    async runAssetIntegrityCheck() {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return; // Only run in development
        }

        console.log('🔍 Running asset integrity check...');
        
        const products = ['pullup-bar', 'rings', 'parallettes'];
        const variants = ['', '-black', '-steel', '-walnut'];
        
        for (const product of products) {
            // Check main model
            const mainModelExists = await this.checkAssetExists(`/models/${product}.glb`);
            if (!mainModelExists) {
                console.error(`❌ Missing: /models/${product}.glb`);
            } else {
                console.log(`✅ Found: /models/${product}.glb`);
            }
            
            // Check poster
            const posterExists = await this.checkAssetExists(`/images/${product}-poster.jpg`);
            if (!posterExists) {
                console.warn(`⚠️ Missing poster: /images/${product}-poster.jpg`);
            } else {
                console.log(`✅ Found: /images/${product}-poster.jpg`);
            }
            
            // Check variants
            for (const variant of variants) {
                if (variant) {
                    const variantExists = await this.checkAssetExists(`/models/${product}${variant}.glb`);
                    if (!variantExists) {
                        console.warn(`⚠️ Missing variant: /models/${product}${variant}.glb`);
                    }
                }
            }
        }
        
        console.log('🔍 Asset integrity check complete');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.robustModelViewer = new RobustModelViewer();
    
    // Run asset integrity check in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(() => {
            window.robustModelViewer.runAssetIntegrityCheck();
        }, 1000);
    }
});

// Export for external use
window.RobustModelViewer = RobustModelViewer;
