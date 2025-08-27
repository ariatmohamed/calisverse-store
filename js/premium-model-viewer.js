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

    initializeProductViewers() {
        // Find all 3D containers
        const containers = document.querySelectorAll('#pullup-viewer, #rings-viewer, #parallettes-viewer, .viewer-3d, .professional-3d-viewer');
        
        containers.forEach(container => {
            const productName = this.getProductName(container);
            if (productName) {
                this.createPremiumViewer(container, productName);
            }
        });
    }

    getProductName(container) {
        // Extract product name from container ID or dataset
        if (container.id === 'pullup-viewer') return 'pullup-bar';
        if (container.id === 'rings-viewer') return 'rings';
        if (container.id === 'parallettes-viewer') return 'parallettes';
        
        // Fallback to dataset
        return container.dataset.equipment || container.dataset.product;
    }

    createPremiumViewer(container, productName) {
        // Clear existing content but preserve color swatches
        const colorBar = container.querySelector('.color-bar');
        const existingSwatches = container.querySelectorAll('.color-swatch');
        
        // Create loading state
        this.createLoadingState(container, productName);
        
        // Create model-viewer element
        const modelViewer = document.createElement('model-viewer');
        
        // Set premium attributes
        modelViewer.src = `/models/${productName}-black.glb`;
        modelViewer.poster = `/images/${productName}-black-poster.jpg`;
        modelViewer.alt = `${productName.replace('-', ' ')} 3D Model`;
        
        // Premium viewer settings
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('touch-action', 'pan-y');
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('auto-rotate-delay', '3000');
        modelViewer.setAttribute('rotation-per-second', '30deg');
        
        // Premium lighting and shadows
        modelViewer.setAttribute('environment-image', 'neutral');
        modelViewer.setAttribute('shadow-intensity', '1');
        modelViewer.setAttribute('shadow-softness', '0.5');
        modelViewer.setAttribute('exposure', '1.2');
        
        // Performance and UX
        modelViewer.setAttribute('loading', 'lazy');
        modelViewer.setAttribute('reveal', 'interaction');
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
        `;

        // Event handlers
        this.setupEventHandlers(modelViewer, container, productName);
        
        // Add variant controls
        this.createVariantControls(container, modelViewer, productName);
        
        // Add sticky cart button
        this.createStickyCartButton(container, productName);
        
        // Add interaction hints
        this.createInteractionHints(container);
        
        // Store reference
        this.modelViewers.set(productName, modelViewer);
        
        // Append to container
        container.appendChild(modelViewer);
        
        console.log(`✅ Created premium viewer for ${productName}`);
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
            console.log(`✅ Model loaded: ${productName}`);
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
            { id: 'black', name: 'Matte Black', color: '#1a1a1a' },
            { id: 'walnut', name: 'Walnut Wood', color: '#8b4513' },
            { id: 'steel', name: 'Brushed Steel', color: '#c0c0c0' }
        ];

        const variantControls = document.createElement('div');
        variantControls.className = 'premium-variant-controls';
        variantControls.innerHTML = `
            <div class="variant-label">Material:</div>
            <div class="variant-buttons">
                ${variants.map(variant => `
                    <button class="premium-variant-btn ${variant.id === 'black' ? 'active' : ''}" 
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

                // Update model
                const newSrc = btn.dataset.model;
                const newPoster = btn.dataset.poster;
                
                modelViewer.src = newSrc;
                modelViewer.poster = newPoster;
                
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
                <span class="cart-variant">Black</span>
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

    // Public API methods
    switchVariant(productName, variant) {
        const modelViewer = this.modelViewers.get(productName);
        if (modelViewer) {
            modelViewer.src = `/models/${productName}-${variant}.glb`;
            modelViewer.poster = `/images/${productName}-${variant}-poster.jpg`;
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
