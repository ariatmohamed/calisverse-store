/* Premium Animated Background Controller */

class PremiumAnimatedBackground {
    constructor() {
        this.mouseX = 50;
        this.mouseY = 50;
        this.particles = [];
        this.isInitialized = false;
        this.isMobile = window.innerWidth <= 768;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.createBackgroundStructure();
        
        if (!this.isMobile && !this.reducedMotion) {
            this.createParticles();
            this.setupMouseTracking();
            this.setupParallax();
        }
        
        this.setupResizeHandler();
        this.isInitialized = true;
        
        console.log('✨ Premium animated background initialized');
    }
    
    createBackgroundStructure() {
        // Create main background container
        const backgroundContainer = document.createElement('div');
        backgroundContainer.className = 'premium-animated-background';
        backgroundContainer.innerHTML = `
            <div class="background-gradient"></div>
            <div class="parallax-layer layer-1"></div>
            <div class="parallax-layer layer-2"></div>
            <div class="parallax-layer layer-3"></div>
            <div class="background-particles"></div>
        `;
        
        // Insert at the beginning of body
        document.body.insertBefore(backgroundContainer, document.body.firstChild);
        
        this.backgroundContainer = backgroundContainer;
        this.particlesContainer = backgroundContainer.querySelector('.background-particles');
        this.parallaxLayers = backgroundContainer.querySelectorAll('.parallax-layer');
    }
    
    createParticles() {
        if (this.isMobile || this.reducedMotion) return;
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random starting positions
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Random animation delay
            particle.style.animationDelay = Math.random() * 20 + 's';
            
            // Random size variation
            const size = Math.random() * 2 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            this.particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    setupMouseTracking() {
        if (this.isMobile || this.reducedMotion) return;
        
        let ticking = false;
        
        const updateMousePosition = (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 100;
            this.mouseY = (e.clientY / window.innerHeight) * 100;
            
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        document.addEventListener('mousemove', updateMousePosition, { passive: true });
        
        // Touch support for tablets
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                updateMousePosition({
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
            }
        }, { passive: true });
    }
    
    setupParallax() {
        if (this.isMobile || this.reducedMotion) return;
        
        this.parallaxLayers.forEach((layer, index) => {
            const intensity = (index + 1) * 0.02;
            layer.style.setProperty('--parallax-intensity', intensity);
        });
    }
    
    updateParallax() {
        if (this.isMobile || this.reducedMotion) return;
        
        this.parallaxLayers.forEach((layer, index) => {
            const intensity = (index + 1) * 0.5;
            const offsetX = (this.mouseX - 50) * intensity * 0.1;
            const offsetY = (this.mouseY - 50) * intensity * 0.1;
            
            layer.style.setProperty('--mouse-x', this.mouseX + '%');
            layer.style.setProperty('--mouse-y', this.mouseY + '%');
            layer.style.setProperty('--parallax-x', offsetX + 'px');
            layer.style.setProperty('--parallax-y', offsetY + 'px');
        });
    }
    
    setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 768;
                
                // Reinitialize if mobile state changed
                if (wasMobile !== this.isMobile) {
                    this.destroy();
                    this.isInitialized = false;
                    setTimeout(() => this.init(), 100);
                }
            }, 250);
        });
    }
    
    destroy() {
        if (this.backgroundContainer) {
            this.backgroundContainer.remove();
        }
        this.particles = [];
        this.isInitialized = false;
    }
    
    // Method to ensure 3D canvases stay above background
    ensureCanvasLayering() {
        const modelViewers = document.querySelectorAll('model-viewer');
        const canvases = document.querySelectorAll('canvas');
        
        modelViewers.forEach(viewer => {
            viewer.style.position = 'relative';
            viewer.style.zIndex = '10';
        });
        
        canvases.forEach(canvas => {
            if (canvas.closest('model-viewer') || canvas.closest('[id$="-viewer"]')) {
                canvas.style.position = 'relative';
                canvas.style.zIndex = '10';
            }
        });
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.premiumBackground = new PremiumAnimatedBackground();
    
    // Ensure 3D viewers stay above background
    setTimeout(() => {
        window.premiumBackground.ensureCanvasLayering();
    }, 1000);
});

// Re-ensure layering when model viewers load
document.addEventListener('model-viewer-loaded', () => {
    if (window.premiumBackground) {
        window.premiumBackground.ensureCanvasLayering();
    }
});

export default PremiumAnimatedBackground;
