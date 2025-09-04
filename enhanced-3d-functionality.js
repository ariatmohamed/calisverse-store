// Enhanced 3D Model Functionality with PBR Material Support
class Enhanced3DModelManager {
    constructor() {
        this.modelViewers = new Map();
        this.activeColors = new Map();
        this.colorMappings = {
            // Enhanced color mappings with better visibility
            black: { color: [0.05, 0.05, 0.05], metallic: 0.8, roughness: 0.2 },
            white: { color: [0.98, 0.98, 0.98], metallic: 0.1, roughness: 0.3 }, // Fixed white color
            silver: { color: [0.8, 0.8, 0.85], metallic: 0.9, roughness: 0.1 },
            gray: { color: [0.4, 0.4, 0.45], metallic: 0.6, roughness: 0.3 },
            red: { color: [0.8, 0.1, 0.1], metallic: 0.3, roughness: 0.4 },
            blue: { color: [0.1, 0.3, 0.8], metallic: 0.4, roughness: 0.3 },
            green: { color: [0.1, 0.6, 0.2], metallic: 0.2, roughness: 0.5 },
            purple: { color: [0.5, 0.2, 0.8], metallic: 0.4, roughness: 0.3 },
            'luxury-purple': { color: [0.4, 0.1, 0.6], metallic: 0.7, roughness: 0.2 },
            
            // Wood finishes for rings
            natural: { color: [0.8, 0.6, 0.4], metallic: 0.0, roughness: 0.8 },
            dark: { color: [0.3, 0.2, 0.1], metallic: 0.0, roughness: 0.9 },
            cherry: { color: [0.6, 0.3, 0.2], metallic: 0.0, roughness: 0.7 },
            oak: { color: [0.7, 0.5, 0.3], metallic: 0.0, roughness: 0.8 },
            walnut: { color: [0.4, 0.3, 0.2], metallic: 0.0, roughness: 0.9 },
            birch: { color: [0.9, 0.8, 0.7], metallic: 0.0, roughness: 0.6 },
            
            // Special colors
            rainbow: { color: [0.5, 0.5, 0.5], metallic: 0.3, roughness: 0.4 }
        };
        
        // Initialize immediately and set up observers
        this.initializeModelViewers();
        this.setupMutationObserver();
    }

    initializeModelViewers() {
        // Find all model-viewer elements immediately
        const modelViewers = document.querySelectorAll('model-viewer');
        console.log(`Found ${modelViewers.length} model-viewer elements`);
        
        modelViewers.forEach(viewer => {
            const modelId = viewer.id;
            if (modelId) {
                this.modelViewers.set(modelId, viewer);
                console.log(`Registered model viewer: ${modelId}`);
                
                // Set up event listeners
                viewer.addEventListener('load', () => {
                    console.log(`Model loaded: ${modelId}`);
                    this.ensureColorableModel(modelId);
                });
                
                viewer.addEventListener('error', (error) => {
                    console.error(`Model error for ${modelId}:`, error);
                });
            }
        });
        
        // Initialize other components
        this.setupPerformanceOptimization();
        this.setupColorCustomization();
    }

    setupMutationObserver() {
        // Watch for dynamically added model-viewer elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'MODEL-VIEWER') {
                        const modelId = node.id;
                        if (modelId && !this.modelViewers.has(modelId)) {
                            this.modelViewers.set(modelId, node);
                            console.log(`Dynamically registered model viewer: ${modelId}`);
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupModelViewers() {
        const modelViewers = document.querySelectorAll('model-viewer');
        
        modelViewers.forEach(viewer => {
            this.modelViewers.set(viewer.id, viewer);
            
            // Enhanced loading management
            viewer.addEventListener('load', () => {
                this.onModelLoad(viewer);
            });
            
            viewer.addEventListener('progress', (event) => {
                this.updateLoadingProgress(viewer, event);
            });
            
            viewer.addEventListener('error', (event) => {
                this.handleModelError(viewer, event);
            });
            
            // Enhanced interaction
            viewer.addEventListener('camera-change', () => {
                viewer.removeAttribute('interaction-prompt');
            });
            
            // Performance optimization
            this.setupIntersectionObserver(viewer);
            this.setupTouchOptimization(viewer);
        });
    }

    onModelLoad(viewer) {
        viewer.setAttribute('loaded', '');
        viewer.removeAttribute('loading');
        
        // Hide progress bar
        const progressBar = viewer.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.display = 'none';
        }
        
        // Initialize PBR materials and ensure all parts are colorable
        this.initializePBRMaterials(viewer);
        this.ensureColorableModel(viewer);
        
        console.log(`Model loaded: ${viewer.id}`);
    }

    ensureColorableModel(viewer) {
        // Ensure the model is fully colorable by removing any white-only restrictions
        setTimeout(async () => {
            try {
                await viewer.updateComplete;
                const model = viewer.model;
                if (model) {
                    model.traverse((child) => {
                        if (child.isMesh && child.material) {
                            const materials = Array.isArray(child.material) ? child.material : [child.material];
                            
                            materials.forEach(material => {
                                // Remove any color restrictions
                                if (material.color) {
                                    // Ensure material can accept any color
                                    material.transparent = false;
                                    material.opacity = 1.0;
                                    
                                    // Set default properties for better color visibility
                                    if (material.metalness !== undefined) {
                                        material.metalness = 0.2;
                                    }
                                    if (material.roughness !== undefined) {
                                        material.roughness = 0.6;
                                    }
                                    
                                    material.needsUpdate = true;
                                }
                            });
                        }
                    });
                    console.log(`Model ${viewer.id} made fully colorable`);
                }
            } catch (error) {
                console.error(`Error making model ${viewer.id} colorable:`, error);
            }
        }, 100);
    }

    updateLoadingProgress(viewer, event) {
        const progressBar = viewer.querySelector('.update-bar');
        if (progressBar && event.detail.totalProgress !== undefined) {
            const progress = event.detail.totalProgress * 100;
            progressBar.style.width = `${progress}%`;
            
            // Add smooth transition
            progressBar.style.transition = 'width 0.3s ease';
        }
    }

    handleModelError(viewer, event) {
        console.error(`Model loading error for ${viewer.id}:`, event);
        viewer.style.background = 'rgba(255, 68, 68, 0.1)';
        
        // Hide progress bar on error
        const progressBar = viewer.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.display = 'none';
        }
        
        // Show error message
        this.showErrorMessage(viewer);
    }

    showErrorMessage(viewer) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'model-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Model failed to load</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
        viewer.appendChild(errorDiv);
    }

    setupIntersectionObserver(viewer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    viewer.play();
                    // Resume auto-rotate if it was paused
                    if (viewer.hasAttribute('auto-rotate')) {
                        viewer.setAttribute('auto-rotate', '');
                    }
                } else {
                    viewer.pause();
                    // Pause auto-rotate to save resources
                    viewer.removeAttribute('auto-rotate');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        observer.observe(viewer);
    }

    setupTouchOptimization(viewer) {
        let touchStartTime = 0;
        let touchCount = 0;
        
        viewer.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchCount = e.touches.length;
        });
        
        viewer.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            
            // Quick single tap - focus on model
            if (touchDuration < 200 && touchCount === 1) {
                viewer.focus();
                this.highlightModel(viewer);
            }
            
            // Double tap - reset camera
            if (touchDuration < 300 && e.detail === 2) {
                this.resetCamera(viewer);
            }
        });
        
        // Prevent context menu on long press
        viewer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    highlightModel(viewer) {
        viewer.style.transform = 'scale(1.02)';
        viewer.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            viewer.style.transform = 'scale(1)';
        }, 200);
    }

    resetCamera(viewer) {
        const originalOrbit = viewer.getAttribute('camera-orbit');
        viewer.setAttribute('camera-orbit', originalOrbit);
        
        // Add visual feedback
        viewer.style.filter = 'brightness(1.1)';
        setTimeout(() => {
            viewer.style.filter = 'brightness(1)';
        }, 300);
    }

    setupColorCustomization() {
        // Enhanced color change functionality - make globally accessible
        window.changeColor = (modelId, color) => {
            this.instantColorChange(modelId, color);
        };
        
        // Override instantColorChange globally
        window.instantColorChange = (modelId, color) => {
            this.instantColorChange(modelId, color);
        };
        
        // Custom color picker functionality
        window.openColorPicker = (modelId) => {
            this.openCustomColorPicker(modelId);
        };
        
        // Add fallback for missing models
        this.setupModelFallbacks();
    }

    setupModelFallbacks() {
        // Ensure all models are properly initialized
        const expectedModels = ['pullup-model', 'rings-model', 'parallel-model', 'bands-model', 'vest-model', 'wheel-model'];
        
        expectedModels.forEach(modelId => {
            if (!this.modelViewers.has(modelId)) {
                const element = document.getElementById(modelId);
                if (element) {
                    this.modelViewers.set(modelId, element);
                    console.log(`Added fallback for model: ${modelId}`);
                }
            }
        });
    }

    openCustomColorPicker(modelId) {
        // Create color picker modal
        const modal = document.createElement('div');
        modal.className = 'color-picker-modal';
        modal.innerHTML = `
            <div class="color-picker-content">
                <div class="color-picker-header">
                    <h3>Choose Custom Color</h3>
                    <button class="close-picker" onclick="this.closest('.color-picker-modal').remove()">×</button>
                </div>
                <div class="color-picker-body">
                    <input type="color" id="custom-color-input" value="#333333">
                    <div class="color-presets">
                        <div class="preset-color" data-color="#1a1a1a" style="background: #1a1a1a"></div>
                        <div class="preset-color" data-color="#c0c0c0" style="background: #c0c0c0"></div>
                        <div class="preset-color" data-color="#ff4444" style="background: #ff4444"></div>
                        <div class="preset-color" data-color="#4444ff" style="background: #4444ff"></div>
                        <div class="preset-color" data-color="#44ff44" style="background: #44ff44"></div>
                        <div class="preset-color" data-color="#ffff44" style="background: #ffff44"></div>
                        <div class="preset-color" data-color="#ff44ff" style="background: #ff44ff"></div>
                        <div class="preset-color" data-color="#44ffff" style="background: #44ffff"></div>
                    </div>
                    <div class="color-picker-actions">
                        <button class="apply-color-btn" onclick="enhanced3DManager.applyCustomColor('${modelId}')">Apply Color</button>
                        <button class="cancel-color-btn" onclick="this.closest('.color-picker-modal').remove()">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners for preset colors
        modal.querySelectorAll('.preset-color').forEach(preset => {
            preset.addEventListener('click', () => {
                const color = preset.getAttribute('data-color');
                modal.querySelector('#custom-color-input').value = color;
            });
        });
        
        // Prevent background scroll
        document.body.style.overflow = 'hidden';
        
        // Remove on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });
    }

    applyCustomColor(modelId) {
        const colorInput = document.querySelector('#custom-color-input');
        const hexColor = colorInput.value;
        
        // Convert hex to RGB for 3D model
        const rgb = this.hexToRgb(hexColor);
        if (rgb) {
            this.applyCustomColorToModel(modelId, rgb, hexColor);
        }
        
        // Close modal
        document.querySelector('.color-picker-modal').remove();
        document.body.style.overflow = 'auto';
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
        ] : null;
    }

    async applyCustomColorToModel(modelId, rgbColor, hexColor) {
        const viewer = this.modelViewers.get(modelId);
        if (!viewer) return;

        try {
            await viewer.updateComplete;
            const model = viewer.model;
            if (!model) return;

            const colorableParts = viewer.getAttribute('data-colorable-parts');
            
            if (colorableParts) {
                const parts = colorableParts.split(',');
                
                model.materials.forEach(material => {
                    const materialName = material.name.toLowerCase();
                    
                    if (parts.some(part => materialName.includes(part.trim()))) {
                        this.applyColorToMaterial(material, rgbColor, 'custom');
                    }
                });
            }
            
            // Update UI to show custom color
            this.updateCustomColorSwatch(modelId, hexColor);
            
            // Store current color
            if (!window.store) window.store = {};
            if (!window.store.currentColors) window.store.currentColors = {};
            window.store.currentColors[modelId] = hexColor;
            
        } catch (error) {
            console.error(`Error applying custom color to ${modelId}:`, error);
        }
    }

    updateCustomColorSwatch(modelId, hexColor) {
        const productCard = document.getElementById(modelId).closest('.product-card');
        if (!productCard) return;
        
        // Remove active from all swatches
        const swatches = productCard.querySelectorAll('.color-swatch');
        swatches.forEach(swatch => swatch.classList.remove('active'));
        
        // Update custom color swatch
        const customSwatch = productCard.querySelector('.custom-color');
        if (customSwatch) {
            customSwatch.classList.add('active');
            customSwatch.style.background = hexColor;
            customSwatch.setAttribute('data-color', hexColor);
        }
    }

    async changeModelColor(modelId, color) {
        const modelViewer = this.modelViewers.get(modelId);
        if (!modelViewer) return;

        try {
            await modelViewer.updateComplete;
            const model = modelViewer.model;
            if (!model) return;

            const colorablePartsAttr = modelViewer.getAttribute('data-colorable-parts');
            const colorableParts = colorablePartsAttr ? colorablePartsAttr.split(',') : [];
            
            const colorConfig = this.colorMappings[color] || this.colorMappings.black;

            // Batch material updates for smooth transition
            const materialsToUpdate = [];

            model.traverse((child) => {
                if (child.isMesh && child.material) {
                    const materialName = child.material.name ? child.material.name.toLowerCase() : '';
                    const meshName = child.name ? child.name.toLowerCase() : '';
                    
                    // Check if this part should be colored
                    const shouldColor = colorableParts.some(part => 
                        materialName.includes(part.toLowerCase()) || 
                        meshName.includes(part.toLowerCase())
                    );
                    
                    if (shouldColor) {
                        materialsToUpdate.push(child.material);
                    }
                }
            });

            // Apply all material changes in a single frame for smooth transition
            requestAnimationFrame(() => {
                materialsToUpdate.forEach(material => {
                    if (material.color) {
                        material.color.setRGB(colorConfig.color[0], colorConfig.color[1], colorConfig.color[2]);
                    }
                    
                    // Maintain PBR properties based on material type
                    if (material.metalness !== undefined) {
                        material.metalness = colorConfig.metallic;
                    }
                    if (material.roughness !== undefined) {
                        material.roughness = colorConfig.roughness;
                    }
                    
                    material.needsUpdate = true;
                });
                
                // Force immediate render update without camera movement
                if (modelViewer.scene) {
                    modelViewer.scene.needsUpdate = true;
                }
            });

            // Update UI with smooth animation
            this.updateColorSwatches(modelId, color);
            
            // Store current color
            if (typeof store !== 'undefined') {
                store.currentColors[modelId] = color;
            }
            
        } catch (error) {
            console.error('Error changing color:', error);
        }
    }

    // Enhanced color change with instant response - FIXED for all colors including white
    async instantColorChange(modelId, color) {
        const modelViewer = this.modelViewers.get(modelId);
        if (!modelViewer) {
            console.warn(`Model viewer not found: ${modelId}`);
            return;
        }

        // Store active color
        this.activeColors.set(modelId, color);

        // Immediate UI feedback
        this.updateColorSwatches(modelId, color);
        
        try {
            // Wait for model to be ready
            await modelViewer.updateComplete;
            const model = modelViewer.model;
            if (!model) {
                console.warn(`Model not loaded yet: ${modelId}`);
                return;
            }

            const colorablePartsAttr = modelViewer.getAttribute('data-colorable-parts');
            const colorableParts = colorablePartsAttr ? colorablePartsAttr.split(',').map(p => p.trim()) : ['all'];
            
            const colorConfig = this.colorMappings[color] || this.colorMappings.black;
            console.log(`Applying color ${color} to ${modelId}:`, colorConfig);

            // Enhanced material traversal with better part matching
            const materialsUpdated = [];
            
            model.traverse((child) => {
                if (child.isMesh && child.material) {
                    const materials = Array.isArray(child.material) ? child.material : [child.material];
                    
                    materials.forEach(material => {
                        const materialName = material.name ? material.name.toLowerCase() : '';
                        const meshName = child.name ? child.name.toLowerCase() : '';
                        
                        // Enhanced part matching - more flexible
                        const shouldColor = colorableParts.includes('all') || 
                            colorableParts.some(part => {
                                const partLower = part.toLowerCase();
                                return materialName.includes(partLower) || 
                                       meshName.includes(partLower) ||
                                       materialName.includes('material') ||
                                       meshName.includes('mesh');
                            });
                        
                        if (shouldColor && material.color) {
                            // Force color update with enhanced visibility
                            material.color.setRGB(colorConfig.color[0], colorConfig.color[1], colorConfig.color[2]);
                            
                            // Enhanced PBR properties
                            if (material.metalness !== undefined) {
                                material.metalness = colorConfig.metallic;
                            }
                            if (material.roughness !== undefined) {
                                material.roughness = colorConfig.roughness;
                            }
                            
                            // Force material update
                            material.needsUpdate = true;
                            materialsUpdated.push(material.name || 'unnamed');
                        }
                    });
                }
            });
            
            console.log(`Updated materials for ${modelId}:`, materialsUpdated);
            
            // Force scene update
            if (modelViewer.scene) {
                modelViewer.scene.needsUpdate = true;
            }
            
            // Store current color
            if (typeof store !== 'undefined') {
                if (!store.currentColors) store.currentColors = {};
                store.currentColors[modelId] = color;
            }
            
        } catch (error) {
            console.error(`Error in instant color change for ${modelId}:`, error);
        }
    }

    applyColorToMaterial(material, colorValue, colorName) {
        if (material.pbrMetallicRoughness) {
            // PBR material
            material.pbrMetallicRoughness.setBaseColorFactor([
                colorValue[0],
                colorValue[1], 
                colorValue[2],
                1.0
            ]);
            
            // Adjust metallic and roughness based on color
            if (colorName === 'silver') {
                material.pbrMetallicRoughness.setMetallicFactor(0.9);
                material.pbrMetallicRoughness.setRoughnessFactor(0.1);
            } else if (colorName === 'black') {
                material.pbrMetallicRoughness.setMetallicFactor(0.2);
                material.pbrMetallicRoughness.setRoughnessFactor(0.8);
            } else {
                material.pbrMetallicRoughness.setMetallicFactor(0.1);
                material.pbrMetallicRoughness.setRoughnessFactor(0.6);
            }
        }
    }

    updateColorSwatches(modelId, selectedColor) {
        const productCard = document.getElementById(modelId).closest('.product-card');
        if (!productCard) return;
        
        const swatches = productCard.querySelectorAll('.color-swatch');
        swatches.forEach(swatch => {
            swatch.classList.remove('active');
            if (swatch.getAttribute('data-color') === selectedColor) {
                swatch.classList.add('active');
            }
        });
        
        // Add selection animation
        const activeSwatch = productCard.querySelector(`.color-swatch[data-color="${selectedColor}"]`);
        if (activeSwatch) {
            activeSwatch.style.transform = 'scale(1.1)';
            setTimeout(() => {
                activeSwatch.style.transform = 'scale(1)';
            }, 200);
        }
    }

    initializePBRMaterials(viewer) {
        // This method would be called when the model loads
        // to set up initial PBR material properties
        viewer.addEventListener('load', async () => {
            try {
                const model = viewer.model;
                if (model && model.materials) {
                    model.materials.forEach(material => {
                        // Set default PBR properties for better rendering
                        if (material.pbrMetallicRoughness) {
                            // Ensure proper PBR workflow
                            material.pbrMetallicRoughness.setMetallicFactor(0.1);
                            material.pbrMetallicRoughness.setRoughnessFactor(0.6);
                        }
                    });
                }
            } catch (error) {
                console.error('Error initializing PBR materials:', error);
            }
        });
    }

    setupPerformanceOptimization() {
        // Enhanced performance optimization for mobile and desktop
        this.modelViewers.forEach(viewer => {
            // Throttled camera change handler for better performance
            let cameraChangeTimeout;
            viewer.addEventListener('camera-change', () => {
                clearTimeout(cameraChangeTimeout);
                cameraChangeTimeout = setTimeout(() => {
                    this.adjustLOD(viewer);
                }, 100); // Throttle to 10fps
            });
            
            // Mobile-specific optimizations
            if (this.isMobileDevice()) {
                this.applyMobileOptimizations(viewer);
            }
        });
        
        // Memory management
        this.setupMemoryManagement();
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    }

    applyMobileOptimizations(viewer) {
        // Reduce quality settings for mobile
        viewer.setAttribute('shadow-intensity', '0.5');
        viewer.setAttribute('exposure', '0.8');
        viewer.removeAttribute('auto-rotate'); // Disable auto-rotate on mobile to save battery
        
        // Reduce interaction sensitivity
        viewer.style.touchAction = 'pan-y pinch-zoom';
        
        console.log(`Applied mobile optimizations to ${viewer.id}`);
    }

    setupPerformanceMonitoring() {
        // Monitor frame rate and adjust quality accordingly
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitorPerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    this.reduceMobileQuality();
                } else if (fps > 50) {
                    this.increaseMobileQuality();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitorPerformance);
        };
        
        if (this.isMobileDevice()) {
            requestAnimationFrame(monitorPerformance);
        }
    }

    reduceMobileQuality() {
        this.modelViewers.forEach(viewer => {
            viewer.setAttribute('shadow-intensity', '0.3');
            viewer.setAttribute('exposure', '0.6');
        });
    }

    increaseMobileQuality() {
        this.modelViewers.forEach(viewer => {
            viewer.setAttribute('shadow-intensity', '0.8');
            viewer.setAttribute('exposure', '1.0');
        });
    }

    adjustLOD(viewer) {
        // This would adjust model quality based on camera distance
        // For now, we'll adjust shadow quality
        const cameraOrbit = viewer.getCameraOrbit();
        const distance = cameraOrbit.radius;
        
        if (distance > 4) {
            viewer.setAttribute('shadow-intensity', '0.8');
        } else if (distance > 2) {
            viewer.setAttribute('shadow-intensity', '1.2');
        } else {
            viewer.setAttribute('shadow-intensity', '1.5');
        }
    }

    setupMemoryManagement() {
        // Clean up resources when models are not visible for extended periods
        setInterval(() => {
            this.modelViewers.forEach(viewer => {
                if (!this.isViewerVisible(viewer)) {
                    // Pause expensive operations
                    viewer.removeAttribute('auto-rotate');
                }
            });
        }, 5000);
    }

    isViewerVisible(viewer) {
        const rect = viewer.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    // Public API methods
    getModelViewer(id) {
        return this.modelViewers.get(id);
    }

    getAllModelViewers() {
        return Array.from(this.modelViewers.values());
    }

    resetAllModels() {
        this.modelViewers.forEach(viewer => {
            this.resetCamera(viewer);
        });
    }
}

// Initialize enhanced 3D functionality immediately
let enhanced3DManager;

// Initialize as soon as the script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeManager);
} else {
    // DOM is already loaded
    initializeManager();
}

function initializeManager() {
    if (!enhanced3DManager) {
        enhanced3DManager = new Enhanced3DModelManager();
        window.enhanced3DManager = enhanced3DManager; // Make globally accessible
        
        console.log('Enhanced 3D Model Manager initialized');
        
        // Set up periodic checks for model viewers
        const checkInterval = setInterval(() => {
            const modelViewers = document.querySelectorAll('model-viewer');
            if (modelViewers.length > 0) {
                enhanced3DManager.initializeModelViewers();
                clearInterval(checkInterval);
            }
        }, 100);
        
        // Clear interval after 10 seconds to avoid infinite checking
        setTimeout(() => clearInterval(checkInterval), 10000);
    }
}

// Also initialize on window load as additional fallback
window.addEventListener('load', () => {
    if (!enhanced3DManager) {
        initializeManager();
    }
});

// Global function to ensure manager is available
window.getEnhanced3DManager = () => {
    if (!enhanced3DManager) {
        initializeManager();
    }
    return enhanced3DManager;
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Enhanced3DModelManager;
}
