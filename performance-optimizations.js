// Performance Optimizations for CalisVerse
class PerformanceOptimizer {
    constructor() {
        this.lazyLoadObserver = null;
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.optimizeImages();
        this.preloadCriticalResources();
        this.setupServiceWorker();
    }

    // Lazy loading for 3D models
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.lazyLoadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const modelViewer = entry.target;
                        if (modelViewer.hasAttribute('data-src')) {
                            modelViewer.src = modelViewer.getAttribute('data-src');
                            modelViewer.removeAttribute('data-src');
                            this.lazyLoadObserver.unobserve(modelViewer);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            // Observe all model-viewers
            document.querySelectorAll('model-viewer[data-src]').forEach(model => {
                this.lazyLoadObserver.observe(model);
            });
        }
    }

    // Optimize image loading
    optimizeImages() {
        // Add loading="lazy" to images
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
        });

        // Preload critical images
        const criticalImages = [
            './assets/calisverse-logo.png',
            './assets/og-banner-1200x630.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            { href: 'enhanced-functionality.js', as: 'script' },
            { href: 'enhanced-3d-functionality.js', as: 'script' },
            { href: 'models/pullup-bar-realistic.glb', as: 'fetch', crossorigin: 'anonymous' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
            document.head.appendChild(link);
        });
    }

    // Service Worker for caching
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
    }

    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Memory cleanup
    cleanup() {
        if (this.lazyLoadObserver) {
            this.lazyLoadObserver.disconnect();
        }
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});

// Web Vitals monitoring
function reportWebVitals() {
    if ('web-vitals' in window) {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = window.webVitals;
        
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
    }
}

// Resource hints
function addResourceHints() {
    const hints = [
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: '//cdnjs.cloudflare.com' },
        { rel: 'dns-prefetch', href: '//unpkg.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
    ];

    hints.forEach(hint => {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
        document.head.appendChild(link);
    });
}

// Initialize on load
window.addEventListener('load', () => {
    reportWebVitals();
    addResourceHints();
});
