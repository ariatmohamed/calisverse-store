/**
 * Premium Model Viewer System - Google model-viewer with enhanced UX
 * Replaces all Three.js viewers with reliable model-viewer components
 */

class PremiumModelViewer {
    constructor() {
        this.modelViewers = new Map();
        this.loadingStates = new Map();
        this.init();
    }

    async init() {
        // Load model-viewer script if not already loaded
        if (!customElements.get('model-viewer')) {
            await this.loadModelViewerScript();
        }
        
        // Initialize all product viewers
        this.initializeProductViewers();
        
        console.log('✅ Premium Model Viewer System initialized');
    }

    loadModelViewerScript() {
        return new Promise((resolve, reject) => {
            if (document.querySelector('script[src*="model-viewer"]')) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    initializeViewers() {
        // Initialize all product viewers with premium model-viewer
        const viewerContainers = document.querySelectorAll('[id$="-viewer"]');
        
        viewerContainers.forEach(container => {
            const productName = this.extractProductName(container);
            if (productName) {
                // Clear any existing Three.js content
                this.clearLegacyContent(container);
                this.createPremiumViewer(container, productName);
            }
        });
    }

    extractProductName(container) {
        // Extract product name from container ID or dataset
        const id = container.id;
        if (id.includes('rings')) return 'rings';
        if (id.includes('pullup')) return 'pullup-bar';
        if (id.includes('parallettes')) return 'parallettes';
        
        // Fallback to dataset or other methods
        return container.dataset.product || null;
    }
    
    clearLegacyContent(container) {
        // Remove any existing Three.js canvases or conflicting elements
        const canvases = container.querySelectorAll('canvas');
        const threejsElements = container.querySelectorAll('.threejs-container, .three-viewer');
        
        canvases.forEach(canvas => {
            if (canvas.parentElement !== container) return;
            canvas.remove();
        });
        
        threejsElements.forEach(el => el.remove());
        
        // Clear any existing model-viewer elements to prevent duplicates
        const existingViewers = container.querySelectorAll('model-viewer');
        existingViewers.forEach(viewer => viewer.remove());
    }

    createPremiumViewer(container, productName) {
        // Clear existing content but preserve color swatches
        const colorBar = container.querySelector('.color-bar');
        const existingSwatches = container.querySelectorAll('.color-swatch');
        
        // Create loading state
        this.createLoadingState(container, productName);
        
        // Create model-viewer element
        const modelViewer = document.createElement('model-viewer');
        
        // Set premium attributes - use exact model paths as requested
        modelViewer.src = `/models/${productName}.glb`;
        modelViewer.poster = `/images/${productName}-poster.jpg`;
        modelViewer.alt = `${productName.replace('-', ' ')} 3D Model`;
        
        // Premium viewer settings
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('touch-action', 'pan-y');
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('auto-rotate-delay', '3000');
        modelViewer.setAttribute('rotation-per-second', '30deg');
        
        // Consistent settings for all products as requested
        modelViewer.setAttribute('interaction-prompt', 'auto');
        modelViewer.setAttribute('shadow-intensity', '1.0');
        modelViewer.setAttribute('exposure', '1.0');
        modelViewer.setAttribute('environment-image', 'neutral');
        
        // Premium lighting settings
        modelViewer.setAttribute('shadow-softness', '0.3');
        modelViewer.setAttribute('tone-mapping', 'aces');
        
        // Ensure model is visible on first render
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('auto-rotate-delay', '1000');
        
        // Consistent auto-rotation for all products
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('auto-rotate-delay', '1000');
        modelViewer.setAttribute('rotation-per-second', '30deg');
        
        // Performance and UX
        modelViewer.setAttribute('loading', 'lazy');
        // All products reveal automatically to start auto-rotation
        modelViewer.setAttribute('reveal', 'auto');
        modelViewer.setAttribute('seamless-poster', '');
        
        // Zoom and interaction limits
        modelViewer.setAttribute('min-camera-orbit', 'auto auto 1m');
        modelViewer.setAttribute('max-camera-orbit', 'auto auto 4m');
        modelViewer.setAttribute('camera-orbit', '30deg 75deg 2.5m');
        
        // Style for premium look
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
        
        // Debug asset loading with exact paths
        console.log(`🔍 Loading model: ${modelViewer.src}`);
        console.log(`🔍 Loading poster: ${modelViewer.poster}`);
        
        if (window.debugAssetChecker) {
            window.debugAssetChecker.checkAsset(modelViewer.src).then(exists => {
                if (!exists) {
                    console.error(`❌ Model not found: ${modelViewer.src}`);
                } else {
                    console.log(`✅ Model found: ${modelViewer.src}`);
                }
            });
        }
        
        // Set default variant as active
        this.setDefaultVariant(container, productName);
        
        // Add variant controls
        this.createVariantControls(container, modelViewer, productName);
        
        // Add sticky cart button
        this.createStickyCartButton(container, productName);
        
        // Add interaction hints
        this.createInteractionHints(container);
        
        // Ensure model viewer is interactive
        this.ensureInteractivity(modelViewer, container);
        
        // Store reference
        this.modelViewers.set(productName, modelViewer);
        
        // Append to container
        container.appendChild(modelViewer);
        
        console.log(`✅ Created premium viewer for ${productName}`);
    }

    setDefaultVariant(container, productName) {
        // Set appropriate default variant based on product
        if (productName === 'rings') {
            // For rings, set walnut as default (more visible than black)
            const walnutSwatch = container.querySelector('.color-swatch[data-color="0x8b4513"], .color-swatch.gunmetal-gray');
            if (walnutSwatch && !container.querySelector('.color-swatch.active')) {
                walnutSwatch.classList.add('active');
                return;
            }
        }
        
        // Fallback to first swatch for other products
        const firstSwatch = container.querySelector('.color-swatch');
        if (firstSwatch && !container.querySelector('.color-swatch.active')) {
            firstSwatch.classList.add('active');
        }
    }

    ensureInteractivity(modelViewer, container) {
        // Ensure model viewer receives pointer events
        modelViewer.style.pointerEvents = 'auto';
        modelViewer.style.touchAction = 'pan-y';
        
        // Set container to allow interactions
        container.style.position = 'relative';
        
        // Ensure overlays don't block interaction
        const overlays = container.querySelectorAll('.loading-text, .controls-hint, .loading, .scroll-overlay');
        overlays.forEach(overlay => {
            if (!overlay.classList.contains('color-swatch') && !overlay.classList.contains('color-bar')) {
                overlay.style.pointerEvents = 'none';
            }
        });
        
        // Special handling for rings viewer overlays
        if (container.id === 'rings-viewer') {
            const ringsOverlays = container.querySelectorAll('.loading, .loading-text, .controls-hint, .scroll-overlay');
            ringsOverlays.forEach(overlay => {
                overlay.style.pointerEvents = 'none';
                overlay.style.zIndex = '0';
            });
        }
        
        // Force camera controls to be enabled
        setTimeout(() => {
            modelViewer.cameraControls = true;
            // Force auto-rotate for all viewers
            modelViewer.autoRotate = true;
            modelViewer.autoRotateDelay = 1000;
            modelViewer.rotationPerSecond = '30deg';
            console.log(`🎮 Ensured interactivity for ${container.id}`);
        }, 100);
    }

    createLoadingState(container, productName) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'premium-loading-state';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading ${productName.replace('-', ' ')}...</div>
            <div class="loading-progress">
                <div class="progress-bar"></div>
            </div>
        `;
        
        loadingDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #8b5cf6;
            z-index: 10;
            transition: opacity 0.3s ease;
        `;
        
        container.appendChild(loadingDiv);
        this.loadingStates.set(productName, loadingDiv);
    }

    setupEventHandlers(modelViewer, container, productName) {
        // Hide loading on model load
        modelViewer.addEventListener('load', () => {
            const loadingState = this.loadingStates.get(productName);
            if (loadingState) {
                loadingState.style.opacity = '0';
                setTimeout(() => loadingState.remove(), 300);
            }
            
            // Hide existing loading text elements
            const existingLoading = container.querySelectorAll('.loading, .loading-text');
            existingLoading.forEach(el => {
                el.style.display = 'none';
            });
            
            // Ensure model is visible and lit properly
            this.applyStudioLighting(modelViewer);
            console.log(`✅ Model loaded: ${productName}`);
        });
        
        // Also hide loading on model-visibility event
        modelViewer.addEventListener('model-visibility', () => {
            const loadingState = this.loadingStates.get(productName);
            if (loadingState) {
                loadingState.style.opacity = '0';
                setTimeout(() => loadingState.remove(), 300);
            }
            
            // Hide existing loading text elements
            const existingLoading = container.querySelectorAll('.loading, .loading-text');
            existingLoading.forEach(el => {
                el.style.display = 'none';
            });
        });

        // Show loading progress
        modelViewer.addEventListener('progress', (event) => {
            const progress = event.detail.totalProgress;
            const loadingState = this.loadingStates.get(productName);
            if (loadingState) {
                const progressBar = loadingState.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = `${progress * 100}%`;
                }
            }
        });

        // Error handling
        modelViewer.addEventListener('error', (event) => {
            console.error(`❌ Model failed to load: ${productName}`, event);
            const loadingState = this.loadingStates.get(productName);
            if (loadingState) {
                loadingState.innerHTML = `
                    <div style="color: #ef4444;">
                        ⚠️ Failed to load 3D model<br>
                        <small>Please refresh the page</small>
                    </div>
                `;
            }
        });

        // Model visibility (when poster is hidden)
        modelViewer.addEventListener('model-visibility', () => {
            const loadingState = this.loadingStates.get(productName);
            if (loadingState) {
                loadingState.style.opacity = '0';
                setTimeout(() => loadingState.remove(), 300);
            }
        });
    }

    createVariantControls(container, modelViewer, productName) {
        const variants = [
            { id: 'walnut', name: 'Walnut Wood', color: '#8b4513' },
            { id: 'steel', name: 'Brushed Steel', color: '#c0c0c0' },
            { id: 'black', name: 'Matte Black', color: '#1a1a1a' }
        ];

        const variantControls = document.createElement('div');
        variantControls.className = 'premium-variant-controls';
        variantControls.innerHTML = `
            <div class="variant-label">Material:</div>
            <div class="variant-buttons">
                ${variants.map((variant, index) => `
                    <button class="premium-variant-btn ${(productName === 'rings' && variant.id === 'walnut') || (productName !== 'rings' && variant.id === 'black') ? 'active' : ''}" 
                            data-variant="${variant.id}"
                            data-model="/models/${productName}-${variant.id}.glb"
                            data-poster="/images/${productName}-${variant.id}-poster.jpg">
                        <div class="variant-preview" style="background: ${variant.color}"></div>
                        <span>${variant.name}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // Style the controls
        variantControls.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 15px;
            z-index: 5;
        `;

        // Add event listeners
        variantControls.addEventListener('click', (e) => {
            const btn = e.target.closest('.premium-variant-btn');
            if (btn) {
                // Update active state
                variantControls.querySelectorAll('.premium-variant-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update model with proper lighting
                const newSrc = btn.dataset.model;
                const newPoster = btn.dataset.poster;
                
                // Maintain lighting during switch
                const currentOrbit = modelViewer.getCameraOrbit();
                
                modelViewer.src = newSrc;
                modelViewer.poster = newPoster;
                
                // Restore camera position and apply lighting
                setTimeout(() => {
                    if (currentOrbit) {
                        modelViewer.cameraOrbit = currentOrbit.toString();
                    }
                    this.applyStudioLighting(modelViewer);
                }, 100);
                
                // Update sticky cart button
                this.updateStickyCart(container, btn.dataset.variant);
                
                console.log(`🔄 Switched ${productName} to ${btn.dataset.variant} variant`);
            }
        });

        container.appendChild(variantControls);
    }

    createStickyCartButton(container, productName) {
        const stickyCart = document.createElement('div');
        stickyCart.className = 'premium-sticky-cart';
        stickyCart.innerHTML = `
            <button class="premium-add-to-cart" onclick="addToCart('${productName}')">
                <span class="cart-icon">🛒</span>
                <span class="cart-text">Add to Cart</span>
                <span class="cart-variant">Default</span>
            </button>
        `;

        stickyCart.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            z-index: 5;
        `;

        container.appendChild(stickyCart);
    }

    createInteractionHints(container) {
        const hints = document.createElement('div');
        hints.className = 'premium-interaction-hints';
        hints.innerHTML = `
            <div class="hint-item">🖱️ Drag to rotate</div>
            <div class="hint-item">🔍 Scroll to zoom</div>
            <div class="hint-item">📱 Pinch to zoom</div>
        `;

        hints.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            padding: 10px;
            font-size: 12px;
            color: white;
            z-index: 5;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;

        // Hide hints after interaction
        container.addEventListener('mousedown', () => {
            setTimeout(() => {
                hints.style.opacity = '0';
                setTimeout(() => hints.remove(), 300);
            }, 2000);
        });

        container.appendChild(hints);
    }

    updateStickyCart(container, variant) {
        const stickyCart = container.querySelector('.premium-sticky-cart');
        if (stickyCart) {
            const variantSpan = stickyCart.querySelector('.cart-variant');
            if (variantSpan) {
                variantSpan.textContent = variant.charAt(0).toUpperCase() + variant.slice(1);
            }
        }
    }

    applyStudioLighting(modelViewer) {
        // Ensure consistent studio lighting is applied
        modelViewer.setAttribute('environment-image', 'neutral');
        modelViewer.setAttribute('shadow-intensity', '1.2');
        modelViewer.setAttribute('shadow-softness', '0.3');
        modelViewer.setAttribute('exposure', '1.8');
        modelViewer.setAttribute('tone-mapping', 'aces');
        
        // Add ambient lighting to prevent black models
        modelViewer.style.setProperty('--min-hotspot-opacity', '0.8');
        modelViewer.style.setProperty('--max-hotspot-opacity', '1');
        
        // Force lighting update
        if (modelViewer.model) {
            modelViewer.environmentImage = modelViewer.environmentImage;
        }
    }

    // Public API methods
    switchVariant(productName, variant) {
        const modelViewer = this.modelViewers.get(productName);
        if (modelViewer) {
            modelViewer.src = `/models/${productName}-${variant}.glb`;
            modelViewer.poster = `/images/${productName}-${variant}-poster.jpg`;
            // Apply lighting after switch
            setTimeout(() => this.applyStudioLighting(modelViewer), 100);
        }
    }

    getViewer(productName) {
        return this.modelViewers.get(productName);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.premiumModelViewer = new PremiumModelViewer();
    });
} else {
    window.premiumModelViewer = new PremiumModelViewer();
}

// Export for use in other scripts
window.PremiumModelViewer = PremiumModelViewer;
