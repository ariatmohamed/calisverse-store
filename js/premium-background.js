// Premium Animated Background with Particles and Mouse Parallax
class PremiumBackground {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        this.particles = [];
        this.isLowPowerMode = this.detectLowPowerMode();
        
        this.init();
    }
    
    detectLowPowerMode() {
        // Detect mobile or low-power devices
        const isMobile = window.innerWidth < 768;
        const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        return isMobile || isLowEnd || prefersReducedMotion;
    }
    
    init() {
        this.createBackground();
        this.createParticles();
        this.setupMouseTracking();
        this.startAnimation();
        this.handleResize();
    }
    
    createBackground() {
        // Remove existing background if any
        const existing = document.querySelector('.premium-animated-bg');
        if (existing) existing.remove();
        
        const background = document.createElement('div');
        background.className = 'premium-animated-bg';
        background.innerHTML = `
            <div class="gradient-layer layer-1"></div>
            <div class="gradient-layer layer-2"></div>
            <div class="gradient-layer layer-3"></div>
            <div class="parallax-layer"></div>
        `;
        
        document.body.insertBefore(background, document.body.firstChild);
        
        // Add CSS styles
        this.addStyles();
    }
    
    createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'premium-particles';
        document.body.appendChild(particleContainer);
        
        const particleCount = this.isLowPowerMode ? 15 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.createParticle();
            particleContainer.appendChild(particle.element);
            this.particles.push(particle);
        }
    }
    
    createParticle() {
        const element = document.createElement('div');
        element.className = 'premium-particle';
        
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.4 + 0.1;
        const hue = Math.random() * 60 + 240; // Blue to purple range
        
        const particle = {
            element,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size,
            opacity,
            hue,
            life: Math.random() * 1000 + 2000
        };
        
        element.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: hsl(${hue}, 70%, 60%);
            border-radius: 50%;
            box-shadow: 0 0 ${size * 3}px hsl(${hue}, 70%, 60%);
            opacity: ${opacity};
            pointer-events: none;
            z-index: -1;
            transform: translate(${particle.x}px, ${particle.y}px);
            transition: transform 0.1s ease-out;
        `;
        
        return particle;
    }
    
    setupMouseTracking() {
        let ticking = false;
        
        const updateMouse = (e) => {
            this.targetMouseX = (e.clientX / window.innerWidth) * 100;
            this.targetMouseY = (e.clientY / window.innerHeight) * 100;
            
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        document.addEventListener('mousemove', updateMouse);
        
        // Touch support
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                updateMouse({
                    clientX: e.touches[0].clientX,
                    clientY: e.touches[0].clientY
                });
            }
        });
    }
    
    updateParallax() {
        // Smooth mouse following
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.targetMouseY) * 0.05;
        
        const parallaxLayer = document.querySelector('.parallax-layer');
        if (parallaxLayer) {
            parallaxLayer.style.background = `
                radial-gradient(circle at ${this.mouseX}% ${this.mouseY}%, 
                    rgba(139, 92, 246, 0.15) 0%, 
                    rgba(59, 130, 246, 0.08) 30%, 
                    transparent 60%)
            `;
        }
        
        // Update CSS custom properties for other elements
        document.documentElement.style.setProperty('--mouse-x', `${this.mouseX}%`);
        document.documentElement.style.setProperty('--mouse-y', `${this.mouseY}%`);
    }
    
    animateParticles() {
        if (this.isLowPowerMode) return; // Skip particle animation on low-power devices
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary wrapping
            if (particle.x < -10) particle.x = window.innerWidth + 10;
            if (particle.x > window.innerWidth + 10) particle.x = -10;
            if (particle.y < -10) particle.y = window.innerHeight + 10;
            if (particle.y > window.innerHeight + 10) particle.y = -10;
            
            // Mouse interaction
            const mouseDistance = Math.sqrt(
                Math.pow(particle.x - (this.mouseX / 100) * window.innerWidth, 2) +
                Math.pow(particle.y - (this.mouseY / 100) * window.innerHeight, 2)
            );
            
            if (mouseDistance < 100) {
                const force = (100 - mouseDistance) / 100;
                particle.vx += (particle.x - (this.mouseX / 100) * window.innerWidth) * force * 0.001;
                particle.vy += (particle.y - (this.mouseY / 100) * window.innerHeight) * force * 0.001;
            }
            
            // Apply velocity damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Update DOM element
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
            
            // Subtle pulsing
            const pulse = Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.1 + 0.9;
            particle.element.style.opacity = particle.opacity * pulse;
        });
    }
    
    startAnimation() {
        const animate = () => {
            this.animateParticles();
            requestAnimationFrame(animate);
        };
        
        if (!this.isLowPowerMode) {
            animate();
        }
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            // Redistribute particles on resize
            this.particles.forEach(particle => {
                if (particle.x > window.innerWidth) particle.x = window.innerWidth;
                if (particle.y > window.innerHeight) particle.y = window.innerHeight;
            });
        });
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .premium-animated-bg {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: -2;
                overflow: hidden;
            }
            
            .gradient-layer {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            .layer-1 {
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
            }
            
            .layer-2 {
                background: 
                    radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
                animation: gradientShift 25s ease-in-out infinite;
                mix-blend-mode: screen;
            }
            
            .layer-3 {
                background: 
                    radial-gradient(circle at 60% 30%, rgba(168, 85, 247, 0.08) 0%, transparent 40%),
                    radial-gradient(circle at 30% 70%, rgba(14, 165, 233, 0.06) 0%, transparent 40%);
                animation: gradientShift 30s ease-in-out infinite reverse;
                mix-blend-mode: overlay;
            }
            
            .parallax-layer {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transition: background 0.3s ease;
                mix-blend-mode: screen;
            }
            
            .premium-particles {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            }
            
            .premium-particle {
                filter: blur(0.5px);
            }
            
            @keyframes gradientShift {
                0%, 100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                }
                25% {
                    transform: scale(1.1) rotate(90deg);
                    opacity: 0.8;
                }
                50% {
                    transform: scale(0.9) rotate(180deg);
                    opacity: 1;
                }
                75% {
                    transform: scale(1.05) rotate(270deg);
                    opacity: 0.9;
                }
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .gradient-layer {
                    animation: none !important;
                }
                .premium-particle {
                    display: none !important;
                }
                .parallax-layer {
                    transition: none !important;
                }
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .layer-2, .layer-3 {
                    animation-duration: 40s;
                }
                .premium-particle {
                    filter: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize premium background
let premiumBg;

function initPremiumBackground() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            premiumBg = new PremiumBackground();
        });
    } else {
        premiumBg = new PremiumBackground();
    }
}

// Auto-initialize
initPremiumBackground();

// Export for manual control if needed
window.PremiumBackground = PremiumBackground;
