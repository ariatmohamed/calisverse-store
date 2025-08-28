// Master 3D Viewer System - Professional Implementation
class Master3DViewer {
    constructor() {
        this.viewers = new Map();
        this.observers = new Map();
        this.loadingStates = new Map();
        this.devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        
        // Exact file paths from inventory
        this.modelPaths = {
            'pullup-bar': '/models/pullup-bar.glb',
            'rings': '/models/rings.glb', 
            'parallettes': '/models/parallettes.glb'
        };
        
        // Default variants
        this.defaultVariants = {
            'pullup-bar': 'black',
            'rings': 'walnut',
            'parallettes': 'steel'
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
            
            // Create professional loading state
            this.createProfessionalLoader(container, productName);
            
            // Start observing for lazy loading
            this.intersectionObserver.observe(container);
            
            console.log(`🔍 Initialized viewer: ${viewerId} for product: ${productName}`);
        });
    }

    getProductNameFromContainer(container) {
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
        return 'pullup-bar';
    }

    createProfessionalLoader(container, productName) {
        const defaultVariant = this.defaultVariants[productName];
        const posterPath = `/images/${productName}-${defaultVariant}-poster.jpg`;
        
        const loaderOverlay = document.createElement('div');
        loaderOverlay.className = 'professional-loader';
        loaderOverlay.innerHTML = `
            <div class="poster-container">
                <img src="${posterPath}" alt="${productName} preview" class="poster-image" 
                     onerror="this.src='/images/product-placeholder.png'">
            </div>
            <div class="skeleton-loader">
                <div class="shimmer-pill">
                    <div class="shimmer-animation"></div>
                    <span class="loading-text">Loading 3D Model…</span>
                </div>
            </div>
        `;
        
        container.appendChild(loaderOverlay);
        this.loadingStates.set(container.dataset.viewerId, loaderOverlay);
    }

    async loadViewer(viewerId) {
        const container = document.querySelector(`[data-viewer-id="${viewerId}"]`);
        if (!container || this.viewers.has(viewerId)) return;

        const productName = this.getProductNameFromContainer(container);
        
        try {
            // Check if model exists
            const modelExists = await this.checkAssetExists(this.modelPaths[productName]);
            if (!modelExists) {
                this.showErrorFallback(container, productName);
                return;
            }

            // Create model-viewer element
            const modelViewer = this.createStandardModelViewer(productName);
            
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
                this.onModelLoad(viewerId, container, modelViewer, productName);
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

    createStandardModelViewer(productName) {
        const modelViewer = document.createElement('model-viewer');
        const defaultVariant = this.defaultVariants[productName];
        
        // Set exact paths
        modelViewer.src = this.modelPaths[productName];
        modelViewer.poster = `/images/${productName}-${defaultVariant}-poster.jpg`;
        modelViewer.alt = `${productName.replace('-', ' ')} 3D Model`;
        
        // Required attributes for consistent experience
        modelViewer.setAttribute('reveal', 'auto');
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('touch-action', 'pan-y');
        modelViewer.setAttribute('interaction-prompt', 'auto');
        modelViewer.setAttribute('environment-image', 'neutral');
        modelViewer.setAttribute('exposure', '1.0');
        modelViewer.setAttribute('shadow-intensity', '0.6');
        
        // Consistent framing for all products
        modelViewer.setAttribute('min-camera-orbit', 'auto auto 1.5m');
        modelViewer.setAttribute('max-camera-orbit', 'auto auto 4m');
        modelViewer.setAttribute('camera-orbit', '15deg 75deg 2.5m');
        
        // Performance optimizations
        modelViewer.setAttribute('loading', 'lazy');
        modelViewer.setAttribute('seamless-poster', '');
        
        // Auto-rotate for engagement
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('auto-rotate-delay', '3000');
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

    onModelLoad(viewerId, container, modelViewer, productName) {
        // Hide loading overlay
        const loadingOverlay = this.loadingStates.get(viewerId);
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
                this.loadingStates.delete(viewerId);
            }, 300);
        }

        // Set default variant and sync UI
        this.setDefaultVariant(container, modelViewer, productName);
        
        // Setup color pills
        this.setupColorPills(container, modelViewer, productName);
        
        // Show interaction hint after model is visible
        setTimeout(() => {
            this.showInteractionHint(container);
        }, 1000);
        
        console.log(`✅ Model loaded successfully: ${viewerId}`);
    }

    setDefaultVariant(container, modelViewer, productName) {
        const defaultVariant = this.defaultVariants[productName];
        const colorPills = container.querySelectorAll('.color-pill');
        
        // Map variants to pill classes
        const variantToPill = {
            'pullup-bar': { 'black': 'matte-black' },
            'rings': { 'walnut': 'walnut-brown' },
            'parallettes': { 'steel': 'steel-silver' }
        };
        
        const pillClass = variantToPill[productName]?.[defaultVariant];
        
        // Mark default pill as active
        colorPills.forEach(pill => {
            pill.classList.remove('active');
            pill.setAttribute('aria-pressed', 'false');
            if (pill.classList.contains(pillClass)) {
                pill.classList.add('active');
                pill.setAttribute('aria-pressed', 'true');
            }
        });
        
        console.log(`🎨 Set default variant: ${productName} -> ${defaultVariant}`);
    }

    setupColorPills(container, modelViewer, productName) {
        const colorPills = container.querySelectorAll('.color-pill');
        
        colorPills.forEach(pill => {
            pill.addEventListener('click', () => {
                this.changeVariant(container, modelViewer, pill, productName);
            });
        });
    }

    changeVariant(container, modelViewer, selectedPill, productName) {
        const colorPills = container.querySelectorAll('.color-pill');
        
        // Update active state
        colorPills.forEach(pill => {
            pill.classList.remove('active');
            pill.setAttribute('aria-pressed', 'false');
        });
        selectedPill.classList.add('active');
        selectedPill.setAttribute('aria-pressed', 'true');
        
        // Get variant from data attribute
        const variant = selectedPill.dataset.variant || 'black';
        const newModelPath = `/models/${productName}-${variant.toLowerCase()}.glb`;
        
        // Preserve camera position
        const currentOrbit = modelViewer.getCameraOrbit();
        const currentTarget = modelViewer.getCameraTarget();
        
        // Change model
        modelViewer.src = newModelPath;
        
        // Restore camera position after load
        modelViewer.addEventListener('load', () => {
            if (currentOrbit && currentTarget) {
                modelViewer.setCameraOrbit(currentOrbit.theta, currentOrbit.phi, currentOrbit.radius);
                modelViewer.setCameraTarget(currentTarget.x, currentTarget.y, currentTarget.z);
            }
        }, { once: true });
        
        console.log(`🎨 Changed variant: ${productName} -> ${variant}`);
    }

    showInteractionHint(container) {
        const hint = document.createElement('div');
        hint.className = 'interaction-hint';
        hint.innerHTML = 'Drag to rotate • Scroll to zoom';
        hint.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.875rem;
            pointer-events: none;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        container.appendChild(hint);
        
        // Fade in
        setTimeout(() => {
            hint.style.opacity = '1';
        }, 100);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            hint.style.opacity = '0';
            setTimeout(() => {
                hint.remove();
            }, 300);
        }, 3000);
    }

    showErrorFallback(container, productName) {
        const viewerId = container.dataset.viewerId;
        const loadingOverlay = this.loadingStates.get(viewerId);
        if (loadingOverlay) {
            loadingOverlay.remove();
            this.loadingStates.delete(viewerId);
        }

        const errorFallback = document.createElement('div');
        errorFallback.className = 'model-error-fallback';
        errorFallback.innerHTML = `
            <div class="error-content">
                <img src="/images/${productName}-fallback.png" 
                     alt="${productName.replace('-', ' ')}" 
                     onerror="this.src='/images/product-placeholder.png'"
                     style="width: 100%; height: 300px; object-fit: contain; margin-bottom: 1rem;">
                <p style="color: #666; margin-bottom: 1rem;">3D model temporarily unavailable</p>
                <button class="view-photos-btn" onclick="scrollToSection('gallery')" style="
                    padding: 12px 24px;
                    background: var(--accent);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">View Photos</button>
            </div>
        `;
        
        errorFallback.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 520px;
            background: #f8f9fa;
            border: 2px dashed #e5e7eb;
            border-radius: 12px;
            text-align: center;
        `;
        
        container.appendChild(errorFallback);
        console.warn(`⚠️ Showing error fallback for ${productName}`);
    }

    async checkAssetExists(path) {
        try {
            const response = await fetch(path, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
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

    pauseAllViewers() {
        this.viewers.forEach((viewer, viewerId) => {
            this.pauseViewer(viewerId);
        });
    }

    resumeAllViewers() {
        this.viewers.forEach((viewer, viewerId) => {
            this.resumeViewer(viewerId);
        });
    }

    // Asset integrity check for development
    async runAssetIntegrityCheck() {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return;
        }

        console.log('🔍 Running asset integrity check...');
        
        for (const [product, path] of Object.entries(this.modelPaths)) {
            const modelExists = await this.checkAssetExists(path);
            if (!modelExists) {
                console.error(`❌ Missing model: ${path}`);
            } else {
                console.log(`✅ Found model: ${path}`);
            }
            
            const defaultVariant = this.defaultVariants[product];
            const posterPath = `/images/${product}-${defaultVariant}-poster.jpg`;
            const posterExists = await this.checkAssetExists(posterPath);
            if (!posterExists) {
                console.warn(`⚠️ Missing poster: ${posterPath}`);
            } else {
                console.log(`✅ Found poster: ${posterPath}`);
            }
        }
        
        console.log('🔍 Asset integrity check complete');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.master3DViewer = new Master3DViewer();
    
    // Run asset integrity check in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(() => {
            window.master3DViewer.runAssetIntegrityCheck();
        }, 1000);
    }
});

// Utility function for error fallback
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Export for external use
window.Master3DViewer = Master3DViewer;
