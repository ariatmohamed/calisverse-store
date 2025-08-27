// Cart Override System - Fix cart display issues
console.log('Cart Override System loading...');

// Wait for both DOM and fixed cart system to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up cart overrides...');
    
    // Wait a bit for other scripts to load
    setTimeout(() => {
        setupCartOverrides();
    }, 500);
});

function setupCartOverrides() {
    console.log('Setting up cart overrides...');
    
    // Override the viewCart function to use fixed cart system
    window.viewCart = function() {
        console.log('viewCart called - opening cart modal');
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.classList.add('active');
            
            // Prevent body scroll when cart is open
            document.body.classList.add('cart-open');
            
            // Force update cart display
            if (window.fixedCartSystem) {
                window.fixedCartSystem.updateCartDisplay();
            } else {
                // Fallback: manually update cart display
                updateCartDisplayFallback();
            }
        }
    };
    
    // Override closeCart to restore body scroll
    window.closeCart = function() {
        console.log('closeCart called');
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.classList.remove('active');
            
            // Restore body scroll when cart is closed
            document.body.classList.remove('cart-open');
        }
    };
    
    // Override cart icon click handler
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        // Remove existing event listeners
        cartIcon.onclick = null;
        
        // Add new event listener
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Cart icon clicked');
            window.viewCart();
        });
    }
    
    console.log('Cart overrides setup complete');
}

function updateCartDisplayFallback() {
    console.log('Using fallback cart display update');
    
    // Get cart data from storage
    let cart = [];
    const sessionCart = sessionStorage.getItem('calisverse_cart');
    if (sessionCart) {
        try {
            cart = JSON.parse(sessionCart);
        } catch (e) {
            console.error('Failed to parse cart data:', e);
        }
    }
    
    console.log('Cart data loaded:', cart);
    
    const cartEmpty = document.getElementById('cart-empty');
    const cartItems = document.getElementById('cart-items');
    const cartFooter = document.getElementById('cart-footer');
    const cartSubtotal = document.getElementById('cart-subtotal');
    
    if (!cartItems) {
        console.error('Cart items container not found');
        return;
    }
    
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'flex';
        cartItems.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        if (cartEmpty) cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        if (cartFooter) cartFooter.style.display = 'block';
        
        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartSubtotal) cartSubtotal.textContent = `$${total.toFixed(2)}`;
        
        // Render cart items with proper event handlers
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-product-card" data-product-id="${item.id}">
                <div class="product-card-content">
                    <div class="product-thumbnail">
                        <div class="product-emoji">${item.emoji || '🏋️'}</div>
                        <div class="product-badge">${item.quantity}</div>
                    </div>
                    <div class="product-details">
                        <div class="product-header">
                            <h3 class="product-name">${item.name}</h3>
                            <button class="remove-item" data-product-id="${item.id}" title="Remove item">×</button>
                        </div>
                        <div class="product-meta">
                            <div class="product-price">$${item.price.toFixed(2)}</div>
                            <div class="variant-info">
                                <span class="variant-label">${item.variant || 'Standard'}</span>
                            </div>
                        </div>
                        <div class="product-controls">
                            <div class="quantity-controls">
                                <button class="quantity-btn minus" data-product-id="${item.id}" data-action="decrease" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                                <span class="quantity-value" data-product-id="${item.id}">${item.quantity}</span>
                                <button class="quantity-btn plus" data-product-id="${item.id}" data-action="increase" ${item.quantity >= 10 ? 'disabled' : ''}>+</button>
                            </div>
                            <div class="item-subtotal" data-product-id="${item.id}">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners for quantity controls
        setupQuantityControls();
        setupRemoveButtons();
    }
}

// Professional quantity control system
function setupQuantityControls() {
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    
    quantityButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.getAttribute('data-product-id');
            const action = this.getAttribute('data-action');
            const isIncrease = action === 'increase';
            
            if (this.disabled) return;
            
            // Add loading state
            this.classList.add('loading');
            this.disabled = true;
            
            // Update quantity with animation
            updateQuantityProfessional(productId, isIncrease ? 1 : -1, this);
        });
        
        // Add hover effects
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(1.1)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-item');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.getAttribute('data-product-id');
            removeFromCartProfessional(productId, this);
        });
    });
}

function updateQuantityProfessional(productId, change, buttonElement) {
    // Get current cart
    let cart = [];
    const sessionCart = sessionStorage.getItem('calisverse_cart');
    if (sessionCart) {
        try {
            cart = JSON.parse(sessionCart);
        } catch (e) {
            console.error('Failed to parse cart data:', e);
            return;
        }
    }
    
    // Find item
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    // Validation
    if (newQuantity < 1) {
        removeFromCartProfessional(productId);
        return;
    }
    
    if (newQuantity > 10) {
        showErrorMessage('Maximum quantity is 10');
        buttonElement.classList.remove('loading');
        buttonElement.disabled = false;
        return;
    }
    
    // Update quantity
    item.quantity = newQuantity;
    
    // Save to storage
    sessionStorage.setItem('calisverse_cart', JSON.stringify(cart));
    
    // Update counters for legacy compatibility
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    sessionStorage.setItem('calisverse_cart_count', cartCount.toString());
    sessionStorage.setItem('calisverse_cart_total', cartTotal.toString());
    
    // Animate quantity update
    setTimeout(() => {
        const quantityElement = document.querySelector(`.quantity-value[data-product-id="${productId}"]`);
        const subtotalElement = document.querySelector(`.item-subtotal[data-product-id="${productId}"]`);
        const badgeElement = document.querySelector(`[data-product-id="${productId}"] .product-badge`);
        
        if (quantityElement) {
            quantityElement.style.transform = 'scale(1.2)';
            quantityElement.textContent = newQuantity;
            setTimeout(() => {
                quantityElement.style.transform = 'scale(1)';
            }, 200);
        }
        
        if (subtotalElement) {
            subtotalElement.style.transform = 'scale(1.1)';
            subtotalElement.textContent = `$${(item.price * newQuantity).toFixed(2)}`;
            setTimeout(() => {
                subtotalElement.style.transform = 'scale(1)';
            }, 200);
        }
        
        if (badgeElement) {
            badgeElement.style.transform = 'scale(1.2)';
            badgeElement.textContent = newQuantity;
            setTimeout(() => {
                badgeElement.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Update cart total
        const cartSubtotal = document.getElementById('cart-subtotal');
        if (cartSubtotal) {
            cartSubtotal.style.transform = 'scale(1.05)';
            cartSubtotal.textContent = `$${cartTotal.toFixed(2)}`;
            setTimeout(() => {
                cartSubtotal.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Update button states
        updateButtonStates(productId, newQuantity);
        
        // Update cart badge
        updateCartBadge(cartCount);
        
        // Remove loading state
        buttonElement.classList.remove('loading');
        buttonElement.disabled = false;
        
    }, 100);
}

function updateButtonStates(productId, quantity) {
    const minusButton = document.querySelector(`.quantity-btn.minus[data-product-id="${productId}"]`);
    const plusButton = document.querySelector(`.quantity-btn.plus[data-product-id="${productId}"]`);
    
    if (minusButton) {
        minusButton.disabled = quantity <= 1;
        minusButton.classList.toggle('disabled', quantity <= 1);
    }
    
    if (plusButton) {
        plusButton.disabled = quantity >= 10;
        plusButton.classList.toggle('disabled', quantity >= 10);
    }
}

function removeFromCartProfessional(productId, buttonElement) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    
    if (productCard) {
        // Animate removal
        productCard.style.transform = 'translateX(100%)';
        productCard.style.opacity = '0';
        
        setTimeout(() => {
            // Update cart data
            let cart = [];
            const sessionCart = sessionStorage.getItem('calisverse_cart');
            if (sessionCart) {
                try {
                    cart = JSON.parse(sessionCart);
                } catch (e) {
                    console.error('Failed to parse cart data:', e);
                    return;
                }
            }
            
            // Remove item
            cart = cart.filter(item => item.id !== productId);
            
            // Save updated cart
            sessionStorage.setItem('calisverse_cart', JSON.stringify(cart));
            
            // Update counters
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            sessionStorage.setItem('calisverse_cart_count', cartCount.toString());
            sessionStorage.setItem('calisverse_cart_total', cartTotal.toString());
            
            // Refresh display
            updateCartDisplayFallback();
            updateCartBadge(cartCount);
            
        }, 300);
    }
}

function updateCartBadge(count) {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = count;
        badge.classList.toggle('show', count > 0);
        
        // Bounce animation
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 200);
    }
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'cart-error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        errorDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 300);
    }, 3000);
}

// Ensure functions are globally accessible
window.updateCartDisplayFallback = updateCartDisplayFallback;
