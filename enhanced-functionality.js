// Enhanced CalisVerse Functionality
class CalisVerseStore {
    constructor() {
        this.cart = [];
        this.currentColors = {};
        this.init();
    }

    init() {
        // Wrap in DOMContentLoaded to ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            this.initAnimations();
            this.initColorTooltips();
            this.updateCartDisplay();
        } catch (error) {
            console.error('CalisVerse initialization error:', error);
        }
    }

    // Initialize GSAP animations
    initAnimations() {
        // Animate particles with more sophisticated movement
        gsap.set('.particle', {
            y: '100vh',
            opacity: 0,
            scale: 0
        });

        gsap.to('.particle', {
            y: '-100vh',
            opacity: 0.6,
            scale: 1,
            duration: 25,
            ease: 'none',
            repeat: -1,
            stagger: {
                each: 5,
                repeat: -1
            }
        });

        // Hero section animation
        gsap.timeline()
            .from('.hero-title', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' })
            .from('.hero-subtitle', { duration: 1, y: 30, opacity: 0, ease: 'power3.out' }, '-=0.5')
            .from('.cta-btn', { duration: 1, y: 20, opacity: 0, ease: 'power3.out' }, '-=0.5');

        // Product cards animation on scroll - one-time trigger
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.utils.toArray('.product-card').forEach((card, i) => {
            // Add a data attribute to track animation state
            card.dataset.animated = 'false';
            
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none none',
                    once: true, // This ensures animation only happens once
                    onEnter: () => {
                        if (card.dataset.animated === 'false') {
                            card.dataset.animated = 'true';
                        }
                    }
                },
                duration: 1,
                y: 100,
                opacity: 0,
                ease: 'power3.out',
                delay: i * 0.2
            });
        });
    }

    // Initialize color swatch tooltips
    initColorTooltips() {
        const swatches = document.querySelectorAll('.color-swatch');
        
        swatches.forEach(swatch => {
            const tooltip = document.createElement('div');
            tooltip.className = 'color-tooltip';
            tooltip.textContent = swatch.dataset.name;
            document.body.appendChild(tooltip);

            swatch.addEventListener('mouseenter', (e) => {
                const rect = swatch.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width / 2 + 'px';
                tooltip.style.top = rect.top - 40 + 'px';
                tooltip.classList.add('visible');
                
                // Hover animation
                gsap.to(swatch, {
                    duration: 0.3,
                    scale: 1.15,
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.6)',
                    ease: 'power2.out'
                });
            });

            swatch.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
                
                // Reset animation
                gsap.to(swatch, {
                    duration: 0.3,
                    scale: 1,
                    boxShadow: swatch.classList.contains('active') 
                        ? '0 0 20px rgba(139, 92, 246, 0.6)' 
                        : 'none',
                    ease: 'power2.out'
                });
            });
        });

        // Add tooltip styles
        const tooltipStyles = `
            .color-tooltip {
                position: fixed;
                background: rgba(15, 15, 35, 0.95);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                pointer-events: none;
                z-index: 10000;
                opacity: 0;
                transform: translateX(-50%) translateY(-5px);
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .color-tooltip.visible {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = tooltipStyles;
        document.head.appendChild(styleSheet);
    }

    // Add item to cart with animation
    addToCart(id, name, price, color = null) {
        console.log('addToCart called with:', { id, name, price, color });
        
        const selectedColor = color || this.currentColors[id] || 'black';
        
        // Check inventory before adding
        if (!inventoryManager.reserveStock(id, selectedColor, 1)) {
            this.showNotification('Sorry, this item is out of stock in the selected color.', 'error');
            return false;
        }
        
        const existingItem = this.cart.find(item => item.id === id && item.color === selectedColor);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: id,
                name: name,
                price: price,
                color: selectedColor,
                quantity: 1
            });
        }
        
        this.updateCartDisplay();
        this.animateAddToCart();
        this.showNotification(`${name} (${this.getColorName(selectedColor)}) added to cart!`, 'success');
        
        // Track analytics
        if (typeof trackAddToCart === 'function') {
            trackAddToCart(id, name, price);
        }
    }

    // Remove item from cart
    removeFromCart(id, color) {
        this.cart = this.cart.filter(item => !(item.id === id && item.color === color));
        this.updateCartDisplay();
    }

    // Update item quantity
    updateQuantity(id, color, change) {
        const item = this.cart.find(item => item.id === id && item.color === color);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(id, color);
            } else {
                this.updateCartDisplay();
            }
        }
    }

    // Update cart display with product images
    updateCartDisplay() {
        console.log('updateCartDisplay called, cart:', this.cart);
        
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        console.log('Cart elements found:', { cartCount, cartItems, cartTotal });

        if (!cartCount || !cartItems || !cartTotal) {
            console.error('Cart elements not found in DOM');
            return;
        }

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        console.log('Cart totals:', { totalItems, totalPrice });

        cartCount.textContent = totalItems;
        cartTotal.textContent = totalPrice.toFixed(2);

        cartItems.innerHTML = '';
        
        this.cart.forEach(item => {
            const productImage = this.getProductImage(item.id);
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${productImage}" alt="${item.name}" />
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <div class="cart-item-name">${item.name}</div>
                        <button class="remove-item" onclick="store.removeFromCart('${item.id}', '${item.color}')">×</button>
                    </div>
                    <div class="cart-item-color">Color: ${this.getColorName(item.color)}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="store.updateQuantity('${item.id}', '${item.color}', -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="store.updateQuantity('${item.id}', '${item.color}', 1)">+</button>
                        </div>
                        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    // Get product image based on product ID
    getProductImage(productId) {
        const productImages = {
            'pullup-bar': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',
            'gymnastic-rings': 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=150&h=150&fit=crop&crop=center',
            'parallel-bars': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',
            'resistance-bands': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=150&h=150&fit=crop&crop=center',
            'ab-wheel': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center'
        };
        return productImages[productId] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center';
    }

    // Get color display name
    getColorName(color) {
        const colorNames = {
            black: 'Matte Black',
            silver: 'Chrome Silver',
            red: 'Racing Red',
            blue: 'Ocean Blue',
            purple: 'Royal Purple',
            green: 'Forest Green'
        };
        return colorNames[color] || color;
    }

    // Animate add to cart
    animateAddToCart() {
        const cartBtn = document.querySelector('.cart-btn');
        
        gsap.timeline()
            .to(cartBtn, {
                duration: 0.1,
                scale: 1.2,
                ease: 'power2.out'
            })
            .to(cartBtn, {
                duration: 0.3,
                scale: 1,
                ease: 'elastic.out(1, 0.5)'
            });

        // Animate cart count
        const cartCount = document.querySelector('.cart-count');
        gsap.fromTo(cartCount, 
            { scale: 1 },
            { 
                duration: 0.5,
                scale: 1.3,
                ease: 'elastic.out(1, 0.3)',
                yoyo: true,
                repeat: 1
            }
        );
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        gsap.timeline()
            .set(notification, { y: -100, opacity: 0 })
            .to(notification, { duration: 0.5, y: 20, opacity: 1, ease: 'power3.out' })
            .to(notification, { duration: 0.5, y: -100, opacity: 0, ease: 'power3.in', delay: 2 })
            .call(() => notification.remove());

        // Add notification styles
        if (!document.querySelector('#notification-styles')) {
            const notificationStyles = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: linear-gradient(135deg, #8B5CF6, #A855F7);
                    color: white;
                    padding: 16px 24px;
                    border-radius: 12px;
                    font-weight: 600;
                    z-index: 10000;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    backdrop-filter: blur(20px);
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = notificationStyles;
}

// Initialize store after DOM is loaded
let store;

document.addEventListener('DOMContentLoaded', () => {
    store = new CalisVerseStore();
    window.store = store; // Make globally accessible for debugging
    console.log('Store initialized:', store);
    
    // Initialize default colors for models
    const models = {
        'pullup-model': 'black',
        'rings-model': 'natural',
        'parallel-model': 'black',
        'bands-model': 'rainbow',
        'abwheel-model': 'black'
    };
    
    Object.entries(models).forEach(([modelId, defaultColor]) => {
        store.currentColors[modelId] = defaultColor;
    });
    
    console.log('Default colors set:', store.currentColors);
});

// Global functions
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function toggleCart() {
    const cart = document.getElementById('shopping-cart');
    const overlay = document.getElementById('cart-overlay');
    
    cart.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (cart.classList.contains('active')) {
        gsap.from('.cart-item', {
            duration: 0.5,
            x: 50,
            opacity: 0,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }
}

function closeCart() {
    document.getElementById('shopping-cart').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
}

function changeColor(modelId, color) {
    if (window.enhanced3DManager) {
        window.enhanced3DManager.changeColor(modelId, color);
    }
}

// Global function for instant color changes
function instantColorChange(modelId, color) {
    console.log(`instantColorChange called: ${modelId} -> ${color}`);
    
    // Ensure manager is available
    const manager = window.enhanced3DManager || window.getEnhanced3DManager();
    
    if (manager) {
        console.log('Manager found, calling instantColorChange');
        manager.instantColorChange(modelId, color);
    } else {
        console.error('Enhanced 3D Manager not available');
        // Fallback: try to initialize and retry
        setTimeout(() => {
            const retryManager = window.getEnhanced3DManager();
            if (retryManager) {
                retryManager.instantColorChange(modelId, color);
            }
        }, 500);
    }
}

function addToCart(id, name, price) {
    console.log('addToCart called with:', { id, name, price });
    console.log('Store object:', store);
    
    // Check if store is initialized
    if (!store) {
        console.error('Store not initialized yet');
        return;
    }
    
    // Map product IDs to their corresponding model IDs
    const modelMapping = {
        'pullup-bar': 'pullup-model',
        'gymnastic-rings': 'rings-model',
        'parallel-bars': 'parallel-model',
        'resistance-bands': 'bands-model',
        'ab-wheel': 'abwheel-model'
    };
    
    const modelId = modelMapping[id] || 'pullup-model';
    const color = store.currentColors[modelId] || 'black';
    
    console.log('Adding to cart:', { id, name, price, color, modelId });
    
    try {
        store.addToCart(id, name, price, color);
        console.log('Cart after addition:', store.cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

function proceedToCheckout() {
    if (store.cart.length === 0) {
        store.showNotification('Your cart is empty!');
        return;
    }

    closeCart();
    
    const paymentModal = document.getElementById('payment-modal');
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');

    // Populate order summary
    orderItems.innerHTML = '';
    let total = 0;

    store.cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div>
                <div>${item.name}</div>
                <div style="font-size: 0.9rem; color: var(--text-muted);">
                    ${store.getColorName(item.color)} × ${item.quantity}
                </div>
            </div>
            <div>$${(item.price * item.quantity).toFixed(2)}</div>
        `;
        orderItems.appendChild(orderItem);
        total += item.price * item.quantity;
    });

    orderTotal.textContent = total.toFixed(2);
    paymentModal.classList.add('active');

    // Animate modal appearance
    gsap.from('.payment-container', {
        duration: 0.5,
        scale: 0.9,
        opacity: 0,
        ease: 'power3.out'
    });
}

function closePayment() {
    document.getElementById('payment-modal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function showAboutSection() {
    document.getElementById('about-modal').style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closeAboutSection() {
    document.getElementById('about-modal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Payment method selection
function selectPaymentMethod(method) {
    // Update active payment method
    document.querySelectorAll('.payment-method').forEach(pm => pm.classList.remove('active'));
    event.target.closest('.payment-method').classList.add('active');
    
    // Show/hide payment sections
    const cardSection = document.getElementById('card-payment');
    const paypalSection = document.getElementById('paypal-payment');
    const cardBtn = document.getElementById('card-pay-btn');
    
    if (method === 'card') {
        cardSection.style.display = 'block';
        paypalSection.style.display = 'none';
        cardBtn.style.display = 'block';
        
        // Mount Stripe card element
        setTimeout(() => paymentProcessor.mountCardElement(), 100);
    } else {
        cardSection.style.display = 'none';
        paypalSection.style.display = 'block';
        cardBtn.style.display = 'none';
        
        // Initialize PayPal
        paymentProcessor.initPayPal();
    }
}

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const payBtn = document.querySelector('.pay-btn');
            const originalText = payBtn.textContent;
            
            try {
                payBtn.textContent = 'Processing...';
                payBtn.disabled = true;
                
                // Calculate total
                const total = store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                // Process payment with Stripe
                await paymentProcessor.processPayment(total);
                
                // Success
                paymentProcessor.handlePaymentSuccess({ 
                    id: 'CV-' + Date.now(), 
                    amount: total.toFixed(2) 
                });
                
            } catch (error) {
                console.error('Payment error:', error);
                store.showNotification('Payment failed: ' + error.message);
                
                payBtn.textContent = originalText;
                payBtn.disabled = false;
            }
        });
    }
    
    // Initialize Stripe card element on payment modal open
    const originalProceedToCheckout = window.proceedToCheckout;
    window.proceedToCheckout = function() {
        originalProceedToCheckout();
        setTimeout(() => {
            if (window.paymentProcessor) {
                paymentProcessor.mountCardElement();
            }
        }, 500);
    };
    
    // Update addToCart to save orders for logged-in users
    const originalHandlePaymentSuccess = function(paymentData) {
        if (userAuth && userAuth.currentUser) {
            userAuth.addOrder(paymentData);
        }
        
        store.cart = [];
        store.updateCartDisplay();
        store.showNotification('Payment successful! Order confirmation sent to your email.');
        
        closePayment();
    };
    
    // Override payment success handler
    if (window.paymentProcessor) {
        paymentProcessor.handlePaymentSuccess = originalHandlePaymentSuccess;
    }
});

// Close modals on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
        closePayment();
    }
});

// Initialize color swatches as default colors - moved into main DOMContentLoaded
// This is now handled in the main store initialization above
