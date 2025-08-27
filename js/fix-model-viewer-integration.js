// Fix Model Viewer Integration for CalisVerse
// This script properly integrates model-viewer with existing 3D containers

class ModelViewerIntegration {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM and model-viewer script to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupModelViewers());
        } else {
            this.setupModelViewers();
        }
    }

    setupModelViewers() {
        // Find all 3D containers
        const containers = [
            { id: 'pullup-viewer', product: 'pullup-bar' },
            { id: 'rings-viewer', product: 'rings' },
            { id: 'parallettes-viewer', product: 'parallettes' }
        ];

        containers.forEach(({ id, product }) => {
            const container = document.getElementById(id);
            if (container) {
                this.createModelViewer(container, product);
            }
        });
    }

    createModelViewer(container, productName) {
        // Clear existing content except loading text
        const loadingText = container.querySelector('.loading-text');
        const colorBar = container.querySelector('.color-bar');
        
        // Create model-viewer element
        const modelViewer = document.createElement('model-viewer');
        
        // Set attributes
        modelViewer.src = `/models/${productName}-black.glb`;
        modelViewer.poster = `/images/${productName}-black-poster.jpg`;
        modelViewer.alt = `${productName.replace('-', ' ')} 3D Model`;
        
        // Model-viewer attributes
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('shadow-intensity', '1');
        modelViewer.setAttribute('exposure', '1.2');
        modelViewer.setAttribute('shadow-softness', '0.5');
        modelViewer.setAttribute('loading', 'lazy');
        modelViewer.setAttribute('reveal', 'interaction');
        
        // Style the viewer
        modelViewer.style.cssText = `
            width: 100%;
            height: 100%;
            background: transparent;
            --poster-color: transparent;
            --progress-bar-color: #8B5CF6;
            --progress-bar-height: 3px;
        `;

        // Camera settings based on product
        switch (productName) {
            case 'pullup-bar':
                modelViewer.setAttribute('camera-orbit', '45deg 75deg 4m');
                break;
            case 'rings':
                modelViewer.setAttribute('camera-orbit', '30deg 80deg 3m');
                break;
            case 'parallettes':
                modelViewer.setAttribute('camera-orbit', '60deg 70deg 2m');
                break;
        }

        // Event handlers
        modelViewer.addEventListener('load', () => {
            if (loadingText) loadingText.style.display = 'none';
            console.log(`✅ ${productName} model loaded successfully`);
        });

        modelViewer.addEventListener('error', (event) => {
            console.error(`❌ ${productName} model failed to load:`, event);
            if (loadingText) {
                loadingText.textContent = 'Failed to load 3D model';
                loadingText.style.color = '#ff6b6b';
            }
        });

        modelViewer.addEventListener('progress', (event) => {
            const progress = event.detail.totalProgress;
            if (loadingText && progress < 1) {
                loadingText.textContent = `Loading... ${Math.round(progress * 100)}%`;
            }
        });

        // Add variant functionality to existing color swatches
        if (colorBar) {
            this.setupVariantSwitching(modelViewer, colorBar, productName);
        }

        // Add model viewer to container
        container.appendChild(modelViewer);
        
        // Add add-to-cart button if not exists
        this.addCartButton(container, productName);
    }

    setupVariantSwitching(modelViewer, colorBar, productName) {
        const swatches = colorBar.querySelectorAll('.color-swatch');
        
        swatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                // Remove active class from all swatches
                swatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');

                // Determine variant based on swatch class
                let variant = 'black';
                if (swatch.classList.contains('walnut') || swatch.dataset.color === '0x8b4513') {
                    variant = 'walnut';
                } else if (swatch.classList.contains('steel') || swatch.dataset.color === '0xc0c0c0') {
                    variant = 'steel';
                }

                // Update model source
                const newSrc = `/models/${productName}-${variant}.glb`;
                const newPoster = `/images/${productName}-${variant}-poster.jpg`;
                
                modelViewer.src = newSrc;
                modelViewer.poster = newPoster;
                
                console.log(`🔄 Switched ${productName} to ${variant} variant`);
            });
        });

        // Set first swatch as active
        if (swatches.length > 0) {
            swatches[0].classList.add('active');
        }
    }

    addCartButton(container, productName) {
        const existingBtn = container.querySelector('.add-to-cart-btn');
        if (existingBtn) return;

        const cartBtn = document.createElement('button');
        cartBtn.className = 'add-to-cart-btn';
        cartBtn.innerHTML = '🛒 Add to Cart';
        
        cartBtn.addEventListener('click', () => {
            // Use existing addToCart function if available
            if (typeof addToCart === 'function') {
                addToCart(productName);
            } else {
                console.log(`Added ${productName} to cart`);
                cartBtn.innerHTML = '✅ Added!';
                setTimeout(() => {
                    cartBtn.innerHTML = '🛒 Add to Cart';
                }, 2000);
            }
        });

        container.appendChild(cartBtn);
    }
}

// Load model-viewer script if not already loaded
function loadModelViewerScript() {
    if (customElements.get('model-viewer')) {
        // Already loaded
        new ModelViewerIntegration();
        return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    
    script.onload = () => {
        console.log('✅ Model-viewer script loaded');
        new ModelViewerIntegration();
    };
    
    script.onerror = () => {
        console.error('❌ Failed to load model-viewer script');
    };
    
    document.head.appendChild(script);
}

// Initialize
loadModelViewerScript();

// Export for global access
window.ModelViewerIntegration = ModelViewerIntegration;
