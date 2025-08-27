// Premium Igloo-Style Animated Background
class IglooAnimatedBackground {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        this.particles = [];
        this.isLowPowerMode = this.detectLowPowerMode();
        this.animationId = null;
        
        this.init();
    }
    
    detectLowPowerMode() {
        const isMobile = window.innerWidth < 768;
        const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        return isMobile || isLowEnd || prefersReducedMotion || isSafari;
    }
    
    init() {
        this.createBackground();
        this.createParticles();
        this.setupMouseTracking();
        this.startAnimation();
        this.handleResize();
        this.handleVisibilityChange();
    }
    
    createBackground() {
        // Remove existing background
        const existing = document.querySelector('.igloo-animated-bg');
        if (existing) existing.remove();
        
        const background = document.createElement('div');
        background.className = 'igloo-animated-bg';
        background.innerHTML = `
            <div class="gradient-base"></div>
            <div class="gradient-flow layer-1"></div>
            <div class="gradient-flow layer-2"></div>
            <div class="gradient-flow layer-3"></div>
            <div class="mouse-parallax-layer"></div>
            <canvas class="particle-canvas"></canvas>
        `;
        
        document.body.insertBefore(background, document.body.firstChild);
        this.addStyles();
        this.setupCanvas();
    }
    
    setupCanvas() {
        this.canvas = document.querySelector('.particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        if (!this.isLowPowerMode) {
            this.initParticles();
        }
    }
    
    resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.scale(dpr, dpr);
    }
    
    initParticles() {
        this.particles = [];
        const particleCount = this.isLowPowerMode ? 8 : 20;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const colors = [
            { r: 139, g: 92, b: 246 },   // Electric purple
            { r: 59, g: 130, b: 246 },   // Blue
            { r: 6, g: 182, b: 212 },    // Teal
            { r: 168, g: 85, b: 247 }    // Light purple
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.3 + 0.1,
            color: color,
            life: Math.random() * 1000 + 2000,
            maxLife: Math.random() * 1000 + 2000
        };
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
        
        document.addEventListener('mousemove', updateMouse, { passive: true });
        
        // Touch support
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                updateMouse({
                    clientX: e.touches[0].clientX,
                    clientY: e.touches[0].clientY
                });
            }
        }, { passive: true });
    }
    
    updateParallax() {
        // Smooth mouse following with subtle drift
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.02;
        this.mouseY += (this.targetMouseY - this.targetMouseY) * 0.02;
        
        const parallaxLayer = document.querySelector('.mouse-parallax-layer');
        if (parallaxLayer) {
            const intensity = this.isLowPowerMode ? 0.05 : 0.1;
            parallaxLayer.style.background = `
                radial-gradient(circle at ${this.mouseX}% ${this.mouseY}%, 
                    rgba(139, 92, 246, ${intensity}) 0%, 
                    rgba(59, 130, 246, ${intensity * 0.6}) 30%, 
                    transparent 60%)
            `;
        }
    }
    
    animateParticles() {
        if (!this.ctx || this.isLowPowerMode) return;
        
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary wrapping
            if (particle.x < -10) particle.x = window.innerWidth + 10;
            if (particle.x > window.innerWidth + 10) particle.x = -10;
            if (particle.y < -10) particle.y = window.innerHeight + 10;
            if (particle.y > window.innerHeight + 10) particle.y = -10;
            
            // Mouse interaction (subtle)
            const mouseDistance = Math.sqrt(
                Math.pow(particle.x - (this.mouseX / 100) * window.innerWidth, 2) +
                Math.pow(particle.y - (this.mouseY / 100) * window.innerHeight, 2)
            );
            
            if (mouseDistance < 150) {
                const force = (150 - mouseDistance) / 150;
                const angle = Math.atan2(
                    particle.y - (this.mouseY / 100) * window.innerHeight,
                    particle.x - (this.mouseX / 100) * window.innerWidth
                );
                particle.vx += Math.cos(angle) * force * 0.001;
                particle.vy += Math.sin(angle) * force * 0.001;
            }
            
            // Apply velocity damping
            particle.vx *= 0.995;
            particle.vy *= 0.995;
            
            // Life cycle
            particle.life -= 1;
            if (particle.life <= 0) {
                this.particles[index] = this.createParticle();
                return;
            }
            
            // Render particle
            const alpha = (particle.life / particle.maxLife) * particle.opacity;
            const pulse = Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.1 + 0.9;
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha * pulse;
            
            // Glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.8)`);
            gradient.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.3)`);
            gradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Core particle
            this.ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 1)`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    startAnimation() {
        const animate = () => {
            this.animateParticles();
            this.animationId = requestAnimationFrame(animate);
        };
        
        if (!this.isLowPowerMode) {
            animate();
        }
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.initParticles();
        });
    }
    
    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else if (!this.isLowPowerMode) {
                this.startAnimation();
            }
        });
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .igloo-animated-bg {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: -10;
                overflow: hidden;
                pointer-events: none;
            }
            
            .gradient-base {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 100%);
            }
            
            .gradient-flow {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                mix-blend-mode: screen;
                opacity: 0.6;
            }
            
            .layer-1 {
                background: 
                    radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.12) 0%, transparent 50%);
                animation: gradientFlow1 25s ease-in-out infinite;
            }
            
            .layer-2 {
                background: 
                    radial-gradient(circle at 60% 30%, rgba(6, 182, 212, 0.1) 0%, transparent 40%),
                    radial-gradient(circle at 30% 70%, rgba(168, 85, 247, 0.08) 0%, transparent 40%);
                animation: gradientFlow2 30s ease-in-out infinite reverse;
            }
            
            .layer-3 {
                background: 
                    radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.06) 0%, transparent 35%),
                    radial-gradient(circle at 70% 40%, rgba(59, 130, 246, 0.04) 0%, transparent 35%);
                animation: gradientFlow3 35s ease-in-out infinite;
            }
            
            .mouse-parallax-layer {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transition: background 0.3s ease;
                mix-blend-mode: screen;
            }
            
            .particle-canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                mix-blend-mode: screen;
            }
            
            @keyframes gradientFlow1 {
                0%, 100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 0.6;
                }
                25% {
                    transform: scale(1.1) rotate(90deg);
                    opacity: 0.4;
                }
                50% {
                    transform: scale(0.9) rotate(180deg);
                    opacity: 0.7;
                }
                75% {
                    transform: scale(1.05) rotate(270deg);
                    opacity: 0.5;
                }
            }
            
            @keyframes gradientFlow2 {
                0%, 100% {
                    transform: scale(1) rotate(0deg) translateX(0);
                    opacity: 0.5;
                }
                33% {
                    transform: scale(1.2) rotate(120deg) translateX(10px);
                    opacity: 0.3;
                }
                66% {
                    transform: scale(0.8) rotate(240deg) translateX(-10px);
                    opacity: 0.6;
                }
            }
            
            @keyframes gradientFlow3 {
                0%, 100% {
                    transform: scale(1) rotate(0deg) translateY(0);
                    opacity: 0.4;
                }
                50% {
                    transform: scale(1.15) rotate(180deg) translateY(15px);
                    opacity: 0.2;
                }
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .gradient-flow {
                    animation: none !important;
                }
                .particle-canvas {
                    display: none !important;
                }
                .mouse-parallax-layer {
                    transition: none !important;
                }
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .gradient-flow {
                    animation-duration: 40s;
                    opacity: 0.4;
                }
                .particle-canvas {
                    display: none;
                }
            }
            
            /* High contrast mode */
            @media (prefers-contrast: high) {
                .gradient-base {
                    background: #000000;
                }
                .gradient-flow {
                    opacity: 0.2;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    destroy() {
        this.stopAnimation();
        const background = document.querySelector('.igloo-animated-bg');
        if (background) background.remove();
    }
}

// Initialize Igloo background
let iglooBackground;

function initIglooBackground() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            iglooBackground = new IglooAnimatedBackground();
        });
    } else {
        iglooBackground = new IglooAnimatedBackground();
    }
}

// Auto-initialize
initIglooBackground();

// Export for global access
window.IglooAnimatedBackground = IglooAnimatedBackground;
window.iglooBackground = iglooBackground;
