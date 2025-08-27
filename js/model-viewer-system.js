// Google Model-Viewer System for CalisVerse
class ModelViewerSystem {
    constructor() {
        this.viewers = new Map();
        this.isModelViewerLoaded = false;
        this.loadModelViewer();
        this.init();
    }

    loadModelViewer() {
        // Load Google's model-viewer
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
        script.onload = () => {
            this.isModelViewerLoaded = true;
            this.initializeViewers();
        };
        document.head.appendChild(script);
    }

    init() {
        this.setupIntersectionObserver();
        this.handleTabVisibility();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const viewer = entry.target;
                if (entry.isIntersecting) {
                    this.activateViewer(viewer);
                } else {
                    this.deactivateViewer(viewer);
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });
    }

    handleTabVisibility() {
        document.addEventListener('visibilitychange', () => {
            const isHidden = document.hidden;
            this.viewers.forEach(viewer => {
                if (isHidden) {
                    viewer.pause();
                } else {
                    viewer.play();
                }
            });
        });
    }

    initializeViewers() {
        if (!this.isModelViewerLoaded) {
            setTimeout(() => this.initializeViewers(), 100);
            return;
        }

        const containers = document.querySelectorAll('.model-viewer-container');
        containers.forEach(container => this.createViewer(container));
    }

    createViewer(container) {
        const equipmentType = container.dataset.equipment;
        const modelPath = `/models/${equipmentType.toLowerCase()}.glb`;
        const posterPath = `/images/${equipmentType.toLowerCase()}-poster.jpg`;

        // Create model-viewer element
        const viewer = document.createElement('model-viewer');
        viewer.setAttribute('src', modelPath);
        viewer.setAttribute('auto-rotate', '');
        viewer.setAttribute('camera-controls', '');
        viewer.setAttribute('shadow-intensity', '1');
        viewer.setAttribute('exposure', '1.2');
        viewer.setAttribute('shadow-softness', '0.5');
        viewer.setAttribute('loading', 'lazy');
        viewer.setAttribute('reveal', 'interaction');
        
        viewer.style.width = '100%';
        viewer.style.height = '400px';
        viewer.style.background = 'transparent';
        viewer.style.cssText = `
            --poster-color: transparent;
            --progress-bar-color: #8B5CF6;
            --progress-bar-height: 3px;
        `;
        
        // Performance settings
        viewer.setAttribute('camera-orbit', '45deg 75deg 4m');
        viewer.setAttribute('min-camera-orbit', 'auto 0deg auto');
        viewer.setAttribute('max-camera-orbit', 'auto 180deg auto');
        viewer.setAttribute('min-field-of-view', '25deg');
        viewer.setAttribute('max-field-of-view', '45deg');
        
        // Mobile optimizations
        if (window.innerWidth < 768) {
            viewer.setAttribute('camera-orbit', '45deg 75deg 5m');
            viewer.setAttribute('auto-rotate-delay', '5000');
        }

        // Add loading and error handling
        this.setupViewerEvents(viewer, container, equipmentType);
        
        // Add variant controls
        this.createVariantControls(container, viewer, equipmentType);
        
        // Add sticky cart button
        this.createStickyCart(container, equipmentType);

        container.appendChild(viewer);
        this.viewers.set(container.id, viewer);
        this.observer.observe(container);
    }

    initializeModelViewer(container, productId) {
        const modelViewer = container.querySelector('model-viewer');
        if (!modelViewer) return;

        // Add loading and error handling
        modelViewer.addEventListener('load', () => {
            this.hideLoadingSpinner(container);
            console.log(`Model loaded successfully for ${productId}`);
        });

        modelViewer.addEventListener('error', (event) => {
            console.error(`Model failed to load for ${productId}:`, event);
            this.showFallbackImage(container, productId);
        });

        // Add progress tracking
        modelViewer.addEventListener('progress', (event) => {
            const progress = event.detail.totalProgress;
            this.updateLoadingProgress(container, progress);
        });

        // Pause rendering when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                modelViewer.pause();
            } else {
                modelViewer.play();
            }
        });

        // Add variant buttons
        this.addVariantButtons(container, productId, modelViewer);

        // Add sticky cart button
        this.addStickyCartButton(container, productId);
    }

    setupViewerEvents(viewer, container, equipmentType) {
        const loadingElement = this.createLoadingElement(container);
        const fallbackElement = this.createFallbackElement(container, equipmentType);

        viewer.addEventListener('load', () => {
            loadingElement.style.display = 'none';
            fallbackElement.style.display = 'none';
            viewer.style.opacity = '1';
            this.frameModel(viewer);
        });

        viewer.addEventListener('error', (event) => {
            console.error('Model loading error:', event);
            loadingElement.style.display = 'none';
            viewer.style.display = 'none';
            fallbackElement.style.display = 'flex';
        });

        viewer.addEventListener('progress', (event) => {
            const progress = event.detail.totalProgress;
            this.updateLoadingProgress(loadingElement, progress * 100);
        });

        // Auto-rotate control
        viewer.addEventListener('camera-change', () => {
            viewer.autoRotate = false;
            clearTimeout(viewer.autoRotateTimeout);
            viewer.autoRotateTimeout = setTimeout(() => {
                viewer.autoRotate = true;
            }, 3000);
        });
    }

    createLoadingElement(container) {
        const loading = document.createElement('div');
        loading.className = 'model-loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading 3D Model...</div>
            <div class="loading-progress">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
        `;
        container.appendChild(loading);
        return loading;
    }

    createFallbackElement(container, equipmentType) {
        const fallback = document.createElement('div');
        fallback.className = 'model-fallback';
        fallback.innerHTML = `
            <img src="/images/${equipmentType.toLowerCase()}-hero.jpg" 
                 alt="${equipmentType}" 
                 style="width: 100%; height: 100%; object-fit: cover;">
            <div class="fallback-notice">
                <span>📱</span>
                <div>3D view not supported</div>
            </div>
        `;
        fallback.style.display = 'none';
        container.appendChild(fallback);
        return fallback;
    }

    updateLoadingProgress(loadingElement, progress) {
        const progressBar = loadingElement.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    frameModel(viewer) {
        // Auto-frame the model for optimal viewing
        viewer.cameraTarget = 'auto auto auto';
        viewer.cameraOrbit = 'auto auto auto';
        
        // Adjust for different equipment types
        const equipmentType = viewer.closest('.model-viewer-container').dataset.equipment;
        switch (equipmentType) {
            case 'pullup':
                viewer.cameraOrbit = '45deg 75deg 3m';
                break;
            case 'rings':
                viewer.cameraOrbit = '30deg 80deg 2.5m';
                break;
            case 'parallettes':
                viewer.cameraOrbit = '60deg 70deg 1.5m';
                break;
        }
    }

    createVariantControls(container, viewer, equipmentType) {
        const variants = [
            { id: 'black', name: 'Matte Black', model: `${equipmentType.toLowerCase()}-black.glb` },
            { id: 'walnut', name: 'Walnut Wood', model: `${equipmentType.toLowerCase()}-walnut.glb` },
            { id: 'steel', name: 'Brushed Steel', model: `${equipmentType.toLowerCase()}-steel.glb` }
        ];

        const variantControls = document.createElement('div');
        variantControls.className = 'variant-controls-mv';
        variantControls.innerHTML = `
            <div class="variant-label">Material:</div>
            <div class="variant-buttons">
                ${variants.map(variant => `
                    <button class="variant-btn-mv ${variant.id === 'black' ? 'active' : ''}" 
                            data-variant="${variant.id}"
                            data-model="/models/${variant.model}">
                        <div class="variant-preview" data-variant="${variant.id}"></div>
                        <span>${variant.name}</span>
                    </button>
                `).join('')}
            </div>
        `;

        variantControls.addEventListener('click', (e) => {
            const btn = e.target.closest('.variant-btn-mv');
            if (btn) {
                this.switchVariant(viewer, btn, variantControls);
            }
        });

        container.appendChild(variantControls);
    }

    switchVariant(viewer, button, controls) {
        const newModel = button.dataset.model;
        const variant = button.dataset.variant;

        // Update active state
        controls.querySelectorAll('.variant-btn-mv').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Switch model with loading state
        const container = viewer.closest('.product-3d-container');
        const loading = container.querySelector('.model-loading-overlay');
        
        loading.style.display = 'flex';
        viewer.style.opacity = '0.5';

        viewer.src = newModel;
        
        // Update sticky cart
        this.updateStickyCart(container, variant);
    }

    createStickyCart(container, equipmentType) {
        const stickyCart = document.createElement('div');
        stickyCart.className = 'sticky-cart-mv';
        
        const productInfo = this.getProductInfo(equipmentType);
        
        stickyCart.innerHTML = `
            <div class="cart-info">
                <div class="product-name">${productInfo.name}</div>
                <div class="product-variant">Matte Black</div>
                <div class="product-price">${productInfo.price}</div>
            </div>
            <button class="add-to-cart-btn-mv" onclick="addToCart('${equipmentType}')">
                <span>🛒</span>
                Add to Cart
            </button>
        `;

        container.appendChild(stickyCart);
    }

    updateStickyCart(container, variant) {
        const variantElement = container.querySelector('.product-variant');
        const variantNames = {
            'black': 'Matte Black',
            'walnut': 'Walnut Wood', 
            'steel': 'Brushed Steel'
        };
        
        if (variantElement) {
            variantElement.textContent = variantNames[variant] || 'Matte Black';
        }
    }

    getProductInfo(equipmentType) {
        const products = {
            'pullup': { name: 'Professional Pull-up Bar', price: '$299' },
            'rings': { name: 'Olympic Gymnastic Rings', price: '$149' },
            'parallettes': { name: 'Premium Parallettes', price: '$89' }
        };
        return products[equipmentType] || { name: 'Professional Equipment', price: '$199' };
    }

    activateViewer(viewer) {
        if (viewer.tagName === 'MODEL-VIEWER') {
            viewer.play();
        }
    }

    deactivateViewer(viewer) {
        if (viewer.tagName === 'MODEL-VIEWER') {
            viewer.pause();
        }
    }

    // Clean up Three.js conflicts
    removeThreeJSConflicts() {
        // Remove existing Three.js viewers
        const threeViewers = document.querySelectorAll('.viewer-3d, .professional-3d-viewer');
        threeViewers.forEach(viewer => {
            if (viewer.cleanup3DViewer) {
                viewer.cleanup3DViewer();
            }
        });

        // Clear Three.js global variables
        if (window.scenes) window.scenes = {};
        if (window.cameras) window.cameras = {};
        if (window.renderers) window.renderers = {};
        if (window.orbitControls) window.orbitControls = {};
    }
}

// Initialize when DOM is ready
let modelViewerSystem;

function initModelViewerSystem() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            modelViewerSystem = new ModelViewerSystem();
        });
    } else {
        modelViewerSystem = new ModelViewerSystem();
    }
}

// Auto-initialize
initModelViewerSystem();

// Export for global access
window.ModelViewerSystem = ModelViewerSystem;
window.modelViewerSystem = modelViewerSystem;
