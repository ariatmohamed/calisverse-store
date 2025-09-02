// Enhanced Color Switcher with Product Variant Management
class ProductVariantManager {
    constructor() {
        this.productVariants = new Map();
        this.init();
    }

    init() {
        this.setupProductVariants();
        this.setupColorSwitching();
        this.setupAccessibility();
    }

    // Define product variants with images and details
    setupProductVariants() {
        this.productVariants.set('pullup-bar', {
            colors: {
                black: {
                    name: 'Matte Black Pull-Up Bar',
                    price: 299.99,
                    image: 'models/pullup-bar-realistic.glb',
                    description: 'Heavy-duty steel construction with matte black powder coating.',
                    features: ['300kg capacity', 'Matte black finish', 'Easy installation', 'Multiple grips']
                },
                silver: {
                    name: 'Chrome Silver Pull-Up Bar',
                    price: 319.99,
                    image: 'models/pullup-bar-realistic.glb',
                    description: 'Premium chrome-plated steel with mirror finish.',
                    features: ['300kg capacity', 'Chrome finish', 'Easy installation', 'Multiple grips']
                },
                'luxury-purple': {
                    name: 'Luxury Purple Pull-Up Bar',
                    price: 349.99,
                    image: 'models/pullup-bar-realistic.glb',
                    description: 'Exclusive purple anodized finish for premium aesthetics.',
                    features: ['300kg capacity', 'Anodized finish', 'Easy installation', 'Multiple grips']
                }
            }
        });

        this.productVariants.set('gymnastic-rings', {
            colors: {
                natural: {
                    name: 'Natural Birch Gymnastic Rings',
                    price: 149.99,
                    image: 'models/gymnastic-rings-realistic.glb',
                    description: 'Premium natural birch wood with smooth finish.',
                    features: ['Birch wood', '5m straps', 'Cam buckles', '32mm diameter']
                },
                dark: {
                    name: 'Dark Walnut Gymnastic Rings',
                    price: 169.99,
                    image: 'models/gymnastic-rings-realistic.glb',
                    description: 'Rich dark walnut finish for sophisticated training.',
                    features: ['Walnut wood', '5m straps', 'Cam buckles', '32mm diameter']
                }
            }
        });
    }

    // Enhanced color switching with variant updates
    switchProductVariant(productId, colorKey) {
        const product = this.productVariants.get(productId);
        if (!product || !product.colors[colorKey]) {
            console.warn(`Variant not found: ${productId} - ${colorKey}`);
            return;
        }

        const variant = product.colors[colorKey];
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        
        if (!productCard) return;

        // Update product details with smooth animation
        this.updateProductDetails(productCard, variant);
        
        // Update 3D model color
        this.updateModelColor(productId, colorKey);
        
        // Update UI state
        this.updateColorSwatchState(productCard, colorKey);
        
        // Update cart button
        this.updateCartButton(productCard, productId, variant);
        
        // Announce change to screen readers
        this.announceVariantChange(variant.name);
    }

    updateProductDetails(productCard, variant) {
        const elements = {
            name: productCard.querySelector('.product-name'),
            description: productCard.querySelector('.product-description'),
            price: productCard.querySelector('.product-price'),
            features: productCard.querySelector('.product-features ul')
        };

        // Animate changes
        const timeline = gsap.timeline();
        
        timeline.to(Object.values(elements), {
            opacity: 0,
            y: -10,
            duration: 0.2,
            ease: 'power2.out'
        })
        .call(() => {
            // Update content
            if (elements.name) elements.name.textContent = variant.name;
            if (elements.description) elements.description.textContent = variant.description;
            if (elements.price) elements.price.textContent = `$${variant.price}`;
            
            if (elements.features && variant.features) {
                elements.features.innerHTML = variant.features
                    .map(feature => `<li>${feature}</li>`)
                    .join('');
            }
        })
        .to(Object.values(elements), {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    updateModelColor(productId, colorKey) {
        const modelId = this.getModelIdFromProduct(productId);
        if (modelId && window.enhanced3DManager) {
            window.enhanced3DManager.instantColorChange(modelId, colorKey);
        }
    }

    getModelIdFromProduct(productId) {
        const mapping = {
            'pullup-bar': 'pullup-model',
            'gymnastic-rings': 'rings-model',
            'parallel-bars': 'parallel-model',
            'resistance-bands': 'bands-model',
            'weighted-vest': 'vest-model',
            'ab-wheel': 'wheel-model'
        };
        return mapping[productId];
    }

    updateColorSwatchState(productCard, selectedColor) {
        const swatches = productCard.querySelectorAll('.color-swatch');
        
        swatches.forEach(swatch => {
            const isSelected = swatch.getAttribute('data-color') === selectedColor;
            swatch.classList.toggle('active', isSelected);
            swatch.setAttribute('aria-pressed', isSelected.toString());
            
            // Add selection animation
            if (isSelected) {
                gsap.fromTo(swatch, 
                    { scale: 1 },
                    { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1 }
                );
            }
        });
    }

    updateCartButton(productCard, productId, variant) {
        const cartBtn = productCard.querySelector('.add-to-cart-btn');
        if (cartBtn) {
            cartBtn.setAttribute('onclick', 
                `addToCart('${productId}', '${variant.name}', ${variant.price})`
            );
            cartBtn.setAttribute('aria-label', 
                `Add ${variant.name} to cart for $${variant.price}`
            );
        }
    }

    announceVariantChange(variantName) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Selected ${variantName}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    setupColorSwitching() {
        // Override global instantColorChange function
        window.instantColorChange = (modelId, color) => {
            const productId = this.getProductIdFromModel(modelId);
            if (productId) {
                this.switchProductVariant(productId, color);
            } else {
                // Fallback to original 3D color change
                if (window.enhanced3DManager) {
                    window.enhanced3DManager.instantColorChange(modelId, color);
                }
            }
        };
    }

    getProductIdFromModel(modelId) {
        const mapping = {
            'pullup-model': 'pullup-bar',
            'rings-model': 'gymnastic-rings',
            'parallel-model': 'parallel-bars',
            'bands-model': 'resistance-bands',
            'vest-model': 'weighted-vest',
            'wheel-model': 'ab-wheel'
        };
        return mapping[modelId];
    }

    setupAccessibility() {
        // Add keyboard navigation for color swatches
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('color-swatch')) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.target.click();
                }
                
                // Arrow key navigation
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const swatches = Array.from(e.target.parentNode.querySelectorAll('.color-swatch'));
                    const currentIndex = swatches.indexOf(e.target);
                    const nextIndex = e.key === 'ArrowRight' 
                        ? (currentIndex + 1) % swatches.length
                        : (currentIndex - 1 + swatches.length) % swatches.length;
                    
                    swatches[nextIndex].focus();
                }
            }
        });
    }

    // Error handling for missing variants
    handleMissingVariant(productId, colorKey) {
        console.warn(`Missing variant: ${productId} - ${colorKey}`);
        
        // Show user-friendly message
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (productCard) {
            const notification = document.createElement('div');
            notification.className = 'variant-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-info-circle"></i>
                    <span>This color option is coming soon!</span>
                </div>
            `;
            
            productCard.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }

    // Preload variant images for faster switching
    preloadVariantImages() {
        this.productVariants.forEach((product, productId) => {
            Object.values(product.colors).forEach(variant => {
                if (variant.image && variant.image.endsWith('.jpg') || variant.image.endsWith('.png')) {
                    const img = new Image();
                    img.src = variant.image;
                }
            });
        });
    }
}

// Initialize variant manager
document.addEventListener('DOMContentLoaded', () => {
    window.productVariantManager = new ProductVariantManager();
    console.log('Product Variant Manager initialized');
});
