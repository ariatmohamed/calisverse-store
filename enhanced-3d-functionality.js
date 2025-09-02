// Enhanced 3D Model Functionality with PBR Material Support
class Enhanced3DModelManager {
    constructor() {
        this.modelViewers = new Map();
        this.colorMappings = {
            black: { color: [0.1, 0.1, 0.1], metallic: 0.1, roughness: 0.8 },
            silver: { color: [0.9, 0.9, 0.9], metallic: 0.9, roughness: 0.1 },
            red: { color: [0.8, 0.2, 0.2], metallic: 0.2, roughness: 0.6 },
            blue: { color: [0.2, 0.4, 0.8], metallic: 0.2, roughness: 0.6 },
            purple: { color: [0.6, 0.2, 0.8], metallic: 0.3, roughness: 0.5 },
            'luxury-purple': { color: [0.4, 0.1, 0.6], metallic: 0.4, roughness: 0.3 },
            gray: { color: [0.5, 0.5, 0.5], metallic: 0.2, roughness: 0.7 },
            white: { color: [0.95, 0.95, 0.95], metallic: 0.1, roughness: 0.4 },
            green: { color: [0.2, 0.6, 0.2], metallic: 0.2, roughness: 0.6 },
            natural: { color: [0.8, 0.6, 0.4], metallic: 0.0, roughness: 0.9 },
            dark: { color: [0.3, 0.2, 0.1], metallic: 0.0, roughness: 0.8 },
            cherry: { color: [0.6, 0.3, 0.2], metallic: 0.0, roughness: 0.7 },
            rainbow: { color: [0.5, 0.5, 0.5], metallic: 0.3, roughness: 0.5 },
            // Wood finishes for rings
            oak: { color: [0.7, 0.5, 0.3], metallic: 0.0, roughness: 0.9 },
            walnut: { color: [0.4, 0.3, 0.2], metallic: 0.0, roughness: 0.8 },
            birch: { color: [0.9, 0.8, 0.6], metallic: 0.0, roughness: 0.9 }
        };
        this.init();
    }

    init() {
        this.setupModelViewers();
        this.setupPerformanceOptimization();
        this.setupColorCustomization();
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
        
        // Initialize PBR materials if available
        this.initializePBRMaterials(viewer);
        
        console.log(`Model loaded: ${viewer.id}`);
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
        // Enhanced color change functionality
        window.changeColor = (modelId, color) => {
            this.changeModelColor(modelId, color);
        };
        
        // Custom color picker functionality
        window.openColorPicker = (modelId) => {
            this.openCustomColorPicker(modelId);
        };
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

    // Enhanced color change with instant response
    async instantColorChange(modelId, color) {
        const modelViewer = this.modelViewers.get(modelId);
        if (!modelViewer) return;

        // Immediate UI feedback
        this.updateColorSwatches(modelId, color);
        
        try {
            await modelViewer.updateComplete;
            const model = modelViewer.model;
            if (!model) return;

            const colorablePartsAttr = modelViewer.getAttribute('data-colorable-parts');
            const colorableParts = colorablePartsAttr ? colorablePartsAttr.split(',') : [];
            
            const colorConfig = this.colorMappings[color] || this.colorMappings.black;

            // Direct material property updates for instant response
            model.traverse((child) => {
                if (child.isMesh && child.material) {
                    const materialName = child.material.name ? child.material.name.toLowerCase() : '';
                    const meshName = child.name ? child.name.toLowerCase() : '';
                    
                    const shouldColor = colorableParts.some(part => 
                        materialName.includes(part.toLowerCase()) || 
                        meshName.includes(part.toLowerCase())
                    );
                    
                    if (shouldColor) {
                        // Instant color update
                        if (child.material.color) {
                            child.material.color.setRGB(colorConfig.color[0], colorConfig.color[1], colorConfig.color[2]);
                        }
                        
                        // Preserve PBR properties for realistic materials
                        if (child.material.metalness !== undefined) {
                            child.material.metalness = colorConfig.metallic;
                        }
                        if (child.material.roughness !== undefined) {
                            child.material.roughness = colorConfig.roughness;
                        }
                        
                        child.material.needsUpdate = true;
                    }
                }
            });
            
            // Store current color
            if (typeof store !== 'undefined') {
                store.currentColors[modelId] = color;
            }
            
        } catch (error) {
            console.error('Error in instant color change:', error);
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
        // Implement level-of-detail (LOD) based on distance
        this.modelViewers.forEach(viewer => {
            viewer.addEventListener('camera-change', () => {
                this.adjustLOD(viewer);
            });
        });
        
        // Memory management
        this.setupMemoryManagement();
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

// Initialize enhanced 3D functionality
let enhanced3DManager;

document.addEventListener('DOMContentLoaded', () => {
    enhanced3DManager = new Enhanced3DModelManager();
    window.enhanced3DManager = enhanced3DManager; // Make globally accessible
    
    console.log('Enhanced 3D Model Manager initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Enhanced3DModelManager;
}
