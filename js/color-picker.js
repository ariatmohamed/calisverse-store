// Color Picker System for 3D Equipment
class ColorPicker {
    constructor() {
        this.currentEquipment = null;
        this.currentViewer = null;
        this.init();
    }

    init() {
        this.setupColorSwatches();
    }

    setupColorSwatches() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeSwatches());
        } else {
            this.initializeSwatches();
        }
    }

    initializeSwatches() {
        const colorSwatches = document.querySelectorAll('.color-swatch');
        
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                const colorValue = e.target.getAttribute('data-color');
                const colorName = e.target.getAttribute('title').toLowerCase();
                const section = e.target.closest('.product-section');
                
                if (section) {
                    const equipmentType = this.getEquipmentTypeFromSection(section);
                    this.changeEquipmentColor(equipmentType, colorName, colorValue);
                    this.updateActiveSwatchUI(e.target);
                }
            });

            // Add hover effects
            swatch.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'scale(1.2)';
                e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
            });

            swatch.addEventListener('mouseleave', (e) => {
                if (!e.target.classList.contains('active')) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                }
            });
        });
    }

    getEquipmentTypeFromSection(section) {
        const id = section.id;
        if (id.includes('pullup')) return 'pullup';
        if (id.includes('rings')) return 'rings';
        if (id.includes('parallettes')) return 'parallettes';
        if (id.includes('dipbars')) return 'dipbars';
        return null;
    }

    changeEquipmentColor(equipmentType, colorName, colorValue) {
        const viewerId = `${equipmentType}-viewer`;
        const viewer = document.getElementById(viewerId);
        
        if (!viewer) return;

        // Add loading animation
        viewer.classList.add('color-changing');
        
        // Find the 3D scene for this viewer
        const scene = scenes[viewerId];
        if (!scene) return;

        // Remove existing equipment with fade out
        const existingEquipment = scene.getObjectByName('equipment');
        if (existingEquipment) {
            // Animate fade out
            const fadeOut = () => {
                existingEquipment.traverse((child) => {
                    if (child.material) {
                        child.material.transparent = true;
                        child.material.opacity = Math.max(0, child.material.opacity - 0.1);
                    }
                });
                
                if (existingEquipment.children[0]?.material?.opacity > 0) {
                    requestAnimationFrame(fadeOut);
                } else {
                    scene.remove(existingEquipment);
                    
                    // Create new equipment with selected color
                    const newEquipment = createEquipment(equipmentType, colorName);
                    newEquipment.name = 'equipment';
                    
                    // Start with transparent and fade in
                    newEquipment.traverse((child) => {
                        if (child.material) {
                            child.material.transparent = true;
                            child.material.opacity = 0;
                        }
                    });
                    
                    scene.add(newEquipment);
                    
                    // Animate fade in
                    const fadeIn = () => {
                        newEquipment.traverse((child) => {
                            if (child.material) {
                                child.material.opacity = Math.min(1, child.material.opacity + 0.1);
                            }
                        });
                        
                        if (newEquipment.children[0]?.material?.opacity < 1) {
                            requestAnimationFrame(fadeIn);
                        } else {
                            // Reset transparency
                            newEquipment.traverse((child) => {
                                if (child.material) {
                                    child.material.transparent = false;
                                    child.material.opacity = 1;
                                }
                            });
                            viewer.classList.remove('color-changing');
                        }
                    };
                    
                    setTimeout(fadeIn, 100);
                }
            };
            
            fadeOut();
        } else {
            // No existing equipment, just create new one
            const newEquipment = createEquipment(equipmentType, colorName);
            newEquipment.name = 'equipment';
            scene.add(newEquipment);
            viewer.classList.remove('color-changing');
        }

        console.log(`Changed ${equipmentType} color to ${colorName}`);
    }

    updateActiveSwatchUI(activeSwatch) {
        // Remove active class from siblings
        const siblings = activeSwatch.parentNode.querySelectorAll('.color-swatch');
        siblings.forEach(swatch => {
            swatch.classList.remove('active');
            swatch.style.transform = 'scale(1)';
            swatch.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        });

        // Add active class to clicked swatch
        activeSwatch.classList.add('active');
        activeSwatch.style.transform = 'scale(1.1)';
        activeSwatch.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.6)';
    }
}

// Enhanced color palette with proper hex values
const colorPalettes = {
    pullup: {
        'matte black': { color: 0x1A1A1A, emissive: 0x0A0A0A, metalness: 0.1, roughness: 0.9 },
        'gunmetal gray': { color: 0x2C3539, emissive: 0x1A1F22, metalness: 0.8, roughness: 0.3 },
        'chrome silver': { color: 0xE8E8E8, emissive: 0xC0C0C0, metalness: 0.95, roughness: 0.05 },
        'purple': { color: 0x8B5CF6, emissive: 0x4C1D95, metalness: 0.7, roughness: 0.2 },
        'white': { color: 0xF8F8F8, emissive: 0xE0E0E0, metalness: 0.1, roughness: 0.1 },
        'bronze': { color: 0xCD7F32, emissive: 0x8B4513, metalness: 0.8, roughness: 0.25 }
    },
    rings: {
        'matte black': { color: 0x1A1A1A, emissive: 0x0A0A0A, metalness: 0.1, roughness: 0.9 },
        'gunmetal gray': { color: 0x2C3539, emissive: 0x1A1F22, metalness: 0.8, roughness: 0.3 },
        'chrome silver': { color: 0xE8E8E8, emissive: 0xC0C0C0, metalness: 0.95, roughness: 0.05 },
        'purple': { color: 0x8B5CF6, emissive: 0x4C1D95, metalness: 0.7, roughness: 0.2 },
        'white': { color: 0xF8F8F8, emissive: 0xE0E0E0, metalness: 0.1, roughness: 0.1 },
        'bronze': { color: 0xCD7F32, emissive: 0x8B4513, metalness: 0.8, roughness: 0.25 }
    },
    parallettes: {
        'matte black': { color: 0x1A1A1A, emissive: 0x0A0A0A, metalness: 0.1, roughness: 0.9 },
        'gunmetal gray': { color: 0x2C3539, emissive: 0x1A1F22, metalness: 0.8, roughness: 0.3 },
        'chrome silver': { color: 0xE8E8E8, emissive: 0xC0C0C0, metalness: 0.95, roughness: 0.05 },
        'purple': { color: 0x8B5CF6, emissive: 0x4C1D95, metalness: 0.7, roughness: 0.2 },
        'white': { color: 0xF8F8F8, emissive: 0xE0E0E0, metalness: 0.1, roughness: 0.1 },
        'bronze': { color: 0xCD7F32, emissive: 0x8B4513, metalness: 0.8, roughness: 0.25 }
    },
    dipbars: {
        'matte black': { color: 0x1A1A1A, emissive: 0x0A0A0A, metalness: 0.1, roughness: 0.9 },
        'gunmetal gray': { color: 0x2C3539, emissive: 0x1A1F22, metalness: 0.8, roughness: 0.3 },
        'chrome silver': { color: 0xE8E8E8, emissive: 0xC0C0C0, metalness: 0.95, roughness: 0.05 },
        'purple': { color: 0x8B5CF6, emissive: 0x4C1D95, metalness: 0.7, roughness: 0.2 },
        'white': { color: 0xF8F8F8, emissive: 0xE0E0E0, metalness: 0.1, roughness: 0.1 },
        'bronze': { color: 0xCD7F32, emissive: 0x8B4513, metalness: 0.8, roughness: 0.25 }
    }
};

// Initialize color picker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.colorPicker = new ColorPicker();
});

// Make colorPalettes globally accessible
window.colorPalettes = colorPalettes;
