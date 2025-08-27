// Mobile Optimization System
class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.touchSupported = 'ontouchstart' in window;
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    detectTablet() {
        return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    }

    init() {
        if (this.isMobile || this.isTablet) {
            this.optimizeForMobile();
            this.setupTouchControls();
            this.optimizeViewport();
            this.preventZoom();
        }
    }

    optimizeForMobile() {
        // Add mobile-specific CSS class
        document.body.classList.add('mobile-device');
        
        // Reduce particle count on mobile
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index > 10) particle.remove();
        });

        // Disable expensive animations
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        
        // Optimize 3D viewers for mobile
        this.optimize3DViewers();
    }

    optimize3DViewers() {
        const viewers = document.querySelectorAll('[id$="-viewer"]');
        viewers.forEach(viewer => {
            // Add mobile-optimized class
            viewer.classList.add('mobile-viewer');
            
            // Reduce size on very small screens
            if (window.innerWidth < 480) {
                viewer.style.height = '250px';
            }
        });
    }

    setupTouchControls() {
        // Enhanced touch controls for 3D viewers
        const viewers = document.querySelectorAll('[id$="-viewer"]');
        
        viewers.forEach(viewer => {
            let isTouch = false;
            let startY = 0;
            
            viewer.addEventListener('touchstart', (e) => {
                isTouch = true;
                startY = e.touches[0].clientY;
                viewer.classList.add('touching');
            }, { passive: true });
            
            viewer.addEventListener('touchmove', (e) => {
                if (isTouch) {
                    // Prevent page scroll when interacting with 3D viewer
                    const currentY = e.touches[0].clientY;
                    const deltaY = Math.abs(currentY - startY);
                    
                    if (deltaY > 10) {
                        e.preventDefault();
                    }
                }
            }, { passive: false });
            
            viewer.addEventListener('touchend', () => {
                isTouch = false;
                viewer.classList.remove('touching');
            }, { passive: true });
        });

        // Optimize cart for touch
        this.optimizeCartForTouch();
        
        // Optimize color picker for touch
        this.optimizeColorPickerForTouch();
    }

    optimizeCartForTouch() {
        // Larger touch targets for cart buttons
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .quantity-btn {
                    min-width: 44px !important;
                    min-height: 44px !important;
                    font-size: 1.2rem !important;
                }
                
                .cart-item-remove {
                    min-width: 44px !important;
                    min-height: 44px !important;
                }
                
                .color-swatch {
                    min-width: 44px !important;
                    min-height: 44px !important;
                }
                
                .btn-primary, .btn-secondary {
                    min-height: 48px !important;
                    padding: 12px 24px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    optimizeColorPickerForTouch() {
        // Add touch-friendly spacing for color swatches
        const colorBars = document.querySelectorAll('.color-bar');
        colorBars.forEach(bar => {
            bar.classList.add('touch-optimized');
        });
    }

    optimizeViewport() {
        // Ensure proper viewport scaling
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    }

    preventZoom() {
        // Prevent zoom on double tap for better UX
        document.addEventListener('touchend', (e) => {
            const now = new Date().getTime();
            const timeSince = now - this.lastTouchEnd;
            
            if (timeSince < 300 && timeSince > 0) {
                e.preventDefault();
            }
            
            this.lastTouchEnd = now;
        }, false);
        
        this.lastTouchEnd = 0;
    }

    // Handle orientation changes
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // Recalculate 3D viewer dimensions
                const viewers = document.querySelectorAll('[id$="-viewer"]');
                viewers.forEach(viewer => {
                    const event = new Event('resize');
                    window.dispatchEvent(event);
                });
                
                // Update cart modal positioning
                const cartModal = document.getElementById('cart-modal');
                if (cartModal && cartModal.style.display !== 'none') {
                    cartModal.style.height = `${window.innerHeight}px`;
                }
            }, 100);
        });
    }

    // Optimize scrolling performance
    optimizeScrolling() {
        let ticking = false;
        
        const updateScrollElements = () => {
            // Update scroll-dependent elements efficiently
            const scrollY = window.pageYOffset;
            
            // Update navigation background
            const nav = document.querySelector('.nav');
            if (nav) {
                nav.style.background = scrollY > 50 ? 
                    'rgba(26, 26, 46, 0.95)' : 
                    'rgba(26, 26, 46, 0.8)';
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollElements);
                ticking = true;
            }
        }, { passive: true });
    }

    // Add haptic feedback for supported devices
    addHapticFeedback() {
        if ('vibrate' in navigator) {
            // Add vibration feedback for button presses
            const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary');
            buttons.forEach(button => {
                button.addEventListener('touchstart', () => {
                    navigator.vibrate(10); // Short vibration
                }, { passive: true });
            });
            
            // Add feedback for cart actions
            document.addEventListener('cartUpdated', () => {
                navigator.vibrate([50, 50, 50]); // Success pattern
            });
        }
    }

    // Optimize form inputs for mobile
    optimizeForms() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Prevent zoom on focus for iOS
            if (this.isMobile) {
                input.style.fontSize = '16px';
            }
            
            // Add better mobile keyboard types
            if (input.type === 'email') {
                input.setAttribute('inputmode', 'email');
            } else if (input.type === 'tel') {
                input.setAttribute('inputmode', 'tel');
            } else if (input.type === 'number') {
                input.setAttribute('inputmode', 'numeric');
            }
        });
    }

    // Add pull-to-refresh functionality
    addPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let pullDistance = 0;
        const threshold = 100;
        
        document.addEventListener('touchstart', (e) => {
            if (window.pageYOffset === 0) {
                startY = e.touches[0].clientY;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (window.pageYOffset === 0 && startY) {
                currentY = e.touches[0].clientY;
                pullDistance = currentY - startY;
                
                if (pullDistance > 0) {
                    // Show pull indicator
                    this.showPullIndicator(Math.min(pullDistance / threshold, 1));
                }
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            if (pullDistance > threshold) {
                this.refreshPage();
            }
            this.hidePullIndicator();
            startY = 0;
            pullDistance = 0;
        }, { passive: true });
    }

    showPullIndicator(progress) {
        let indicator = document.getElementById('pull-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pull-indicator';
            indicator.innerHTML = '↓ Pull to refresh';
            indicator.style.cssText = `
                position: fixed;
                top: -50px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(139, 92, 246, 0.9);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 14px;
                z-index: 10000;
                transition: top 0.3s ease;
            `;
            document.body.appendChild(indicator);
        }
        
        indicator.style.top = `${-50 + (progress * 60)}px`;
    }

    hidePullIndicator() {
        const indicator = document.getElementById('pull-indicator');
        if (indicator) {
            indicator.style.top = '-50px';
            setTimeout(() => indicator.remove(), 300);
        }
    }

    refreshPage() {
        // Show loading and refresh content
        this.showPullIndicator(1);
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

// Initialize mobile optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.mobileOptimizer = new MobileOptimizer();
});
