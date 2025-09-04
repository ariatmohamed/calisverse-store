// Simple SVG-based color system that actually works
class SimpleColorSystem {
    constructor() {
        this.colorMappings = {
            // Metal colors
            black: '#1a1a1a',
            white: '#f8f8f8',
            silver: '#c0c0c0',
            gray: '#666666',
            red: '#dc2626',
            blue: '#2563eb',
            green: '#16a34a',
            purple: '#9333ea',
            'luxury-purple': '#6b21a8',
            
            // Wood colors for rings
            natural: '#d2691e',
            dark: '#654321',
            cherry: '#8b4513',
            oak: '#daa520',
            walnut: '#8b7355',
            birch: '#f5deb3'
        };
        
        this.init();
    }
    
    init() {
        console.log('Simple Color System initialized');
        // No complex initialization needed - just works!
    }
    
    changeColor(modelId, color) {
        console.log(`Changing color: ${modelId} -> ${color}`);
        
        const colorValue = this.colorMappings[color] || this.colorMappings.black;
        const modelElement = document.getElementById(modelId);
        
        if (!modelElement) {
            console.error(`Model element not found: ${modelId}`);
            return;
        }
        
        // Update SVG elements based on model type
        if (modelId === 'pullup-model') {
            this.updatePullupBarColor(modelElement, colorValue);
        } else if (modelId === 'rings-model') {
            this.updateRingsColor(modelElement, colorValue);
        } else if (modelId === 'parallel-model') {
            this.updateParallelBarsColor(modelElement, colorValue);
        }
        
        // Update active color swatch
        this.updateColorSwatches(modelId, color);
        
        console.log(`✅ Color changed successfully: ${modelId} -> ${color}`);
    }
    
    updatePullupBarColor(modelElement, color) {
        const svg = modelElement.querySelector('.pullup-svg');
        if (!svg) return;
        
        // Update all metal parts
        svg.querySelectorAll('.bar-main, .bar-mount, .bracket, .bar-grip').forEach(element => {
            element.setAttribute('fill', color);
        });
        
        // Keep screws slightly different
        const screwColor = this.adjustBrightness(color, -20);
        svg.querySelectorAll('.screw').forEach(element => {
            element.setAttribute('fill', screwColor);
        });
    }
    
    updateRingsColor(modelElement, color) {
        const svg = modelElement.querySelector('.rings-svg');
        if (!svg) return;
        
        // Update rings (wood parts)
        svg.querySelectorAll('.ring-left, .ring-right').forEach(element => {
            element.setAttribute('stroke', color);
        });
        
        // Update connection points
        const connectionColor = this.adjustBrightness(color, -30);
        svg.querySelectorAll('.connection-left, .connection-right').forEach(element => {
            element.setAttribute('fill', connectionColor);
        });
    }
    
    updateParallelBarsColor(modelElement, color) {
        const svg = modelElement.querySelector('.parallel-svg');
        if (!svg) return;
        
        // Update all metal parts
        svg.querySelectorAll('.leg-1, .leg-2, .leg-3, .leg-4, .base-left, .base-right, .post-1, .post-2, .post-3, .post-4').forEach(element => {
            element.setAttribute('fill', color);
        });
        
        // Update bars with slightly different shade
        const barColor = this.adjustBrightness(color, 10);
        svg.querySelectorAll('.bar-left, .bar-right').forEach(element => {
            element.setAttribute('fill', barColor);
        });
    }
    
    updateColorSwatches(modelId, activeColor) {
        // Find the product card containing this model
        const productCard = document.querySelector(`[data-product-id="${modelId.replace('-model', '')}"]`) ||
                           document.querySelector(`#${modelId}`).closest('.product-card');
        
        if (!productCard) return;
        
        // Update color swatch states
        const swatches = productCard.querySelectorAll('.color-swatch');
        swatches.forEach(swatch => {
            const swatchColor = swatch.getAttribute('data-color');
            if (swatchColor === activeColor) {
                swatch.classList.add('active');
                swatch.setAttribute('aria-pressed', 'true');
            } else {
                swatch.classList.remove('active');
                swatch.setAttribute('aria-pressed', 'false');
            }
        });
    }
    
    adjustBrightness(hex, percent) {
        // Convert hex to RGB
        const num = parseInt(hex.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
}

// Initialize the simple color system
let simpleColorSystem;

document.addEventListener('DOMContentLoaded', () => {
    simpleColorSystem = new SimpleColorSystem();
    window.simpleColorSystem = simpleColorSystem;
    console.log('Simple Color System ready!');
});

// Global function that actually works
window.instantColorChange = function(modelId, color) {
    console.log(`instantColorChange called: ${modelId} -> ${color}`);
    
    if (window.simpleColorSystem) {
        window.simpleColorSystem.changeColor(modelId, color);
    } else {
        console.error('Simple Color System not initialized');
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleColorSystem;
}
