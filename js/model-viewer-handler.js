// Model Viewer Handler - Manages loading states and interactions
class ModelViewerHandler {
    constructor() {
        this.viewers = new Map();
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupViewers();
        });
    }

    setupViewers() {
        const viewers = document.querySelectorAll('model-viewer');
        
        viewers.forEach(viewer => {
            const container = viewer.closest('.product-3d-container');
            const loadingText = container?.querySelector('.loading-text');
            
            // Hide loading text when model loads
            viewer.addEventListener('load', () => {
                if (loadingText) {
                    loadingText.style.display = 'none';
                }
                console.log(`✅ Model loaded: ${viewer.src}`);
            });

            // Hide loading text when model becomes visible
            viewer.addEventListener('model-visibility', () => {
                if (loadingText) {
                    loadingText.style.display = 'none';
                }
            });

            // Set default variant to prevent black render
            viewer.addEventListener('load', () => {
                // Try to set a default variant if available
                const availableVariants = viewer.availableVariants;
                if (availableVariants && availableVariants.length > 0) {
                    // Prefer steel or walnut variants
                    const preferredVariant = availableVariants.find(v => 
                        v.name.toLowerCase().includes('steel') || 
                        v.name.toLowerCase().includes('walnut')
                    ) || availableVariants[0];
                    
                    viewer.variantName = preferredVariant.name;
                }
            });

            // Debug asset loading
            viewer.addEventListener('error', (event) => {
                console.error(`❌ Model failed to load: ${viewer.src}`, event);
            });

            // Store reference
            this.viewers.set(viewer.id || viewer.src, viewer);
        });
    }

    // Method to change variants programmatically
    changeVariant(viewerId, variantName) {
        const viewer = this.viewers.get(viewerId);
        if (viewer && viewer.availableVariants) {
            const variant = viewer.availableVariants.find(v => 
                v.name.toLowerCase().includes(variantName.toLowerCase())
            );
            if (variant) {
                viewer.variantName = variant.name;
            }
        }
    }
}

// Initialize handler
window.modelViewerHandler = new ModelViewerHandler();

// Debug asset checker for development
class AssetDebugger {
    constructor() {
        this.missingAssets = [];
        this.init();
    }

    init() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.checkAssets();
        }
    }

    async checkAssets() {
        const viewers = document.querySelectorAll('model-viewer');
        
        for (const viewer of viewers) {
            await this.checkAsset(viewer.src);
            if (viewer.poster) {
                await this.checkAsset(viewer.poster);
            }
        }

        if (this.missingAssets.length > 0) {
            this.showDebugOverlay();
        }
    }

    async checkAsset(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (!response.ok) {
                this.missingAssets.push(url);
                console.error(`❌ Asset not found: ${url}`);
            } else {
                console.log(`✅ Asset found: ${url}`);
            }
        } catch (error) {
            this.missingAssets.push(url);
            console.error(`❌ Asset check failed: ${url}`, error);
        }
    }

    showDebugOverlay() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        overlay.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">⚠️ Missing Assets (Dev Only)</div>
            ${this.missingAssets.map(asset => `<div>• ${asset}</div>`).join('')}
            <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px; background: white; color: black; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        `;
        
        document.body.appendChild(overlay);
    }
}

// Initialize asset debugger
window.assetDebugger = new AssetDebugger();
