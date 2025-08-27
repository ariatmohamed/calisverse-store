// Fixed Cart System - Unified cart with individual product display
// Fixed Cart System - Unified cart display with individual product cards

class FixedCartSystem {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeSystem());
        } else {
            this.initializeSystem();
        }
    }

    initializeSystem() {
        this.products = {
            'pullup': {
                id: 'pullup',
                name: 'Professional Pull-Up Bar',
                price: 299.99,
                emoji: '🏋️‍♂️',
                image: 'pullup-bar.jpg'
            },
            'rings': {
                id: 'rings',
                name: 'Gymnastics Rings',
                price: 149.99,
                emoji: '💍',
                image: 'gymnastics-rings.jpg'
            },
            'parallettes': {
                id: 'parallettes',
                name: 'Parallettes Set',
                price: 89.99,
                emoji: '🤸‍♂️',
                image: 'parallettes.jpg'
            },
            'dipbars': {
                id: 'dipbars',
                name: 'Dip Bars Station',
                price: 329.99,
                emoji: '💪',
                image: 'dip-bars.jpg'
            }
        };
        
        // Load cart data from both storage systems and merge
        this.loadCartData();
        
        // Override global cart functions
        this.overrideGlobalFunctions();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Make globally accessible
        window.fixedCartSystem = this;
        
        // Initial display update
        this.updateCartDisplay();
        
        console.log('Fixed Cart System initialized with', this.cart.length, 'items');
    }

    loadCartData() {
        // Try to load from both storage systems and merge
        let cart = [];
        
        // Load from localStorage (enhanced cart)
        const localStorageCart = localStorage.getItem('calisverse-cart');
        if (localStorageCart) {
            try {
                cart = JSON.parse(localStorageCart);
            } catch (e) {
                console.warn('Failed to parse localStorage cart:', e);
            }
        }
        
        // Load from sessionStorage (original cart) and merge
        const sessionStorageCart = sessionStorage.getItem('calisverse_cart');
        if (sessionStorageCart) {
            try {
                const sessionCart = JSON.parse(sessionStorageCart);
                // Merge session cart items
                sessionCart.forEach(sessionItem => {
                    const existingItem = cart.find(item => item.id === sessionItem.id);
                    if (existingItem) {
                        existingItem.quantity += sessionItem.quantity;
                    } else {
                        cart.push({
                            id: sessionItem.id,
                            name: sessionItem.name,
                            price: sessionItem.price,
                            quantity: sessionItem.quantity,
                            variant: sessionItem.variant || 'Standard',
                            emoji: sessionItem.emoji
                        });
                    }
                });
            } catch (e) {
                console.warn('Failed to parse sessionStorage cart:', e);
            }
        }
        
        return cart;
    }

    saveCart() {
        // Save to both storage systems for compatibility
        localStorage.setItem('calisverse-cart', JSON.stringify(this.cart));
        sessionStorage.setItem('calisverse_cart', JSON.stringify(this.cart));
        
        // Update legacy counters
        const cartCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartTotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        sessionStorage.setItem('calisverse_cart_count', cartCount.toString());
        sessionStorage.setItem('calisverse_cart_total', cartTotal.toString());
    }

    addToCart(productId) {
        console.log('Adding to cart:', productId);
        const product = this.products[productId];
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                emoji: product.emoji,
                quantity: 1,
                variant: 'Standard',
                addedAt: Date.now()
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.updateCartBadge();
        this.showSuccessMessage(`${product.name} added to cart!`);
        
        console.log('Cart after adding:', this.cart);
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        if (newQuantity > 10) {
            this.showErrorMessage('Maximum quantity is 10');
            return;
        }

        item.quantity = newQuantity;
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartBadge();
    }

    removeItem(productId) {
        const itemIndex = this.cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;

        // Animate removal
        const itemElement = document.querySelector(`[data-product-id="${productId}"]`);
        if (itemElement) {
            const cardElement = itemElement.closest('.cart-product-card');
            if (cardElement) {
                cardElement.style.transform = 'translateX(100%)';
                cardElement.style.opacity = '0';
                
                setTimeout(() => {
                    this.cart.splice(itemIndex, 1);
                    this.saveCart();
                    this.updateCartDisplay();
                    this.updateCartBadge();
                }, 300);
                return;
            }
        }

        // Fallback if animation fails
        this.cart.splice(itemIndex, 1);
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartBadge();
    }

    updateCartDisplay() {
        const cartContent = document.getElementById('cart-content');
        const cartEmpty = document.getElementById('cart-empty');
        const cartItems = document.getElementById('cart-items');
        const cartFooter = document.getElementById('cart-footer');

        if (!cartContent) {
            console.warn('Cart content element not found');
            return;
        }

        console.log('Updating cart display with items:', this.cart);

        if (this.cart.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (cartItems) cartItems.style.display = 'none';
            if (cartFooter) cartFooter.style.display = 'none';
            return;
        }

        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartItems) {
            cartItems.style.display = 'block';
            cartItems.innerHTML = this.cart.map(item => this.createProductCard(item)).join('');
        }
        if (cartFooter) {
            cartFooter.style.display = 'block';
            this.updateCartSummary();
        }

        // Initialize mini 3D viewers after DOM update
        setTimeout(() => this.initializeMini3DViewers(), 100);
    }

    createProductCard(item) {
        const subtotal = item.price * item.quantity;
        const variants = this.getProductVariants(item.id);
        
        return `
            <div class="cart-product-card" data-product-id="${item.id}">
                <div class="product-card-content">
                    <!-- 3D Thumbnail -->
                    <div class="product-thumbnail">
                        <div class="mini-3d-viewer" id="mini-viewer-${item.id}" data-equipment-type="${item.id}">
                            <div class="loading-mini">
                                <div class="loading-spinner"></div>
                            </div>
                        </div>
                        <div class="product-badge">${item.quantity}</div>
                    </div>

                    <!-- Product Details -->
                    <div class="product-details">
                        <div class="product-header">
                            <h3 class="product-name">${item.name}</h3>
                            <button class="remove-item" data-product-id="${item.id}" title="Remove item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/>
                                    <path d="M10 11v6M14 11v6"/>
                                </svg>
                            </button>
                        </div>

                        <div class="product-meta">
                            <div class="product-price">$${item.price.toFixed(2)}</div>
                            <div class="variant-info">
                                <span class="variant-label">Color:</span>
                                <span class="variant-name">${item.variant}</span>
                                <div class="color-indicator" style="background-color: ${this.getVariantColor(item.variant)}"></div>
                            </div>
                        </div>

                        <!-- Quantity Controls -->
                        <div class="quantity-controls">
                            <label>Quantity:</label>
                            <div class="quantity-input-group">
                                <button class="quantity-btn quantity-decrease" data-product-id="${item.id}">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M5 12h14"/>
                                    </svg>
                                </button>
                                <div class="quantity-display" data-product-id="${item.id}">${item.quantity}</div>
                                <button class="quantity-btn quantity-increase" data-product-id="${item.id}">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 5v14M5 12h14"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Item Subtotal -->
                        <div class="item-subtotal">
                            <span class="subtotal-label">Subtotal:</span>
                            <span class="subtotal-amount">$${subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getProductVariants(productId) {
        const variants = {
            'pullup': [
                { value: 'Standard', name: 'Standard', color: '#8B5CF6' },
                { value: 'Black', name: 'Matte Black', color: '#2d3748' },
                { value: 'Silver', name: 'Brushed Silver', color: '#e2e8f0' }
            ],
            'rings': [
                { value: 'Standard', name: 'Standard', color: '#8B5CF6' },
                { value: 'Wood', name: 'Natural Wood', color: '#8B4513' }
            ],
            'parallettes': [
                { value: 'Standard', name: 'Standard', color: '#8B5CF6' },
                { value: 'Black', name: 'Matte Black', color: '#2d3748' }
            ],
            'dipbars': [
                { value: 'Standard', name: 'Standard', color: '#8B5CF6' },
                { value: 'Silver', name: 'Brushed Silver', color: '#e2e8f0' }
            ]
        };
        return variants[productId] || [{ value: 'Standard', name: 'Standard', color: '#8B5CF6' }];
    }

    getVariantColor(variant) {
        const colorMap = {
            'Standard': '#8B5CF6',
            'Black': '#2d3748',
            'Silver': '#e2e8f0',
            'Wood': '#8B4513'
        };
        return colorMap[variant] || '#8B5CF6';
    }

    updateCartSummary() {
        const subtotal = this.getSubtotal();
        const shipping = this.getShippingCost();
        const tax = this.getTax(subtotal);
        const total = subtotal + shipping + tax;

        const cartFooter = document.getElementById('cart-footer');
        if (!cartFooter) return;

        cartFooter.innerHTML = `
            <div class="cart-summary">
                <div class="summary-line">
                    <span>Items (${this.getTotalItems()}):</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-line">
                    <span>Shipping:</span>
                    <span class="${shipping === 0 ? 'free-shipping' : ''}">
                        ${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}
                    </span>
                </div>
                <div class="summary-line">
                    <span>Tax:</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="summary-line total-line">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            </div>
            <div class="cart-actions">
                <button class="cart-btn-primary" id="checkout-btn">
                    <span>Secure Checkout</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12z"/>
                    </svg>
                </button>
                <button class="cart-btn-secondary" onclick="closeCart()">Continue Shopping</button>
            </div>
        `;

        // Update cart subtotal in header
        const cartSubtotalElement = document.getElementById('cart-subtotal');
        if (cartSubtotalElement) {
            cartSubtotalElement.textContent = `$${total.toFixed(2)}`;
        }
    }

    initializeMini3DViewers() {
        this.cart.forEach(item => {
            const viewerId = `mini-viewer-${item.id}`;
            const container = document.getElementById(viewerId);
            if (container && !container.querySelector('canvas')) {
                this.createMini3DViewer(container, item.id);
            }
        });
    }

    createMini3DViewer(container, equipmentType) {
        // Mini 3D viewer setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0f);

        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        camera.position.set(0, 1, 4);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(80, 80);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Clear loading and add canvas
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(2, 2, 2);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const accentLight = new THREE.DirectionalLight(0x8B5CF6, 0.3);
        accentLight.position.set(-1, 1, -1);
        scene.add(accentLight);

        // Create equipment model (simplified version)
        const equipment = this.createSimplifiedModel(equipmentType);
        scene.add(equipment);

        // Auto-rotate
        const animate = () => {
            requestAnimationFrame(animate);
            equipment.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    }

    createSimplifiedModel(type) {
        const group = new THREE.Group();
        const material = new THREE.MeshPhongMaterial({ color: 0x8B5CF6 });

        switch (type) {
            case 'pullup':
                const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2, 16), material);
                bar.rotation.z = Math.PI / 2;
                group.add(bar);
                break;
            case 'rings':
                const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 16), material);
                ring1.position.x = -0.5;
                const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 16), material);
                ring2.position.x = 0.5;
                group.add(ring1, ring2);
                break;
            case 'parallettes':
                const handle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16), material);
                handle1.rotation.z = Math.PI / 2;
                handle1.position.x = -0.4;
                const handle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16), material);
                handle2.rotation.z = Math.PI / 2;
                handle2.position.x = 0.4;
                group.add(handle1, handle2);
                break;
            case 'dipbars':
                const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1), material);
                base.position.y = -0.5;
                const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 16), material);
                handle.rotation.x = Math.PI / 2;
                handle.position.y = 0.2;
                group.add(base, handle);
                break;
        }

        return group;
    }

    setupEventListeners() {
        // Quantity control handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-decrease')) {
                const productId = e.target.dataset.productId;
                this.updateQuantity(productId, -1);
            } else if (e.target.classList.contains('quantity-increase')) {
                const productId = e.target.dataset.productId;
                this.updateQuantity(productId, 1);
            } else if (e.target.classList.contains('remove-item')) {
                const productId = e.target.dataset.productId;
                this.removeItem(productId);
            }
        });
    }

    getSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getShippingCost() {
        return this.getSubtotal() >= 100 ? 0 : 15;
    }

    getTax(subtotal) {
        return subtotal * 0.08;
    }

    getTotalItems() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        const totalItems = this.getTotalItems();
        
        if (badge) {
            badge.textContent = totalItems;
            badge.classList.toggle('show', totalItems > 0);
        }

        // Update legacy cart count display
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    showSuccessMessage(message) {
        const successElement = document.getElementById('cart-success');
        if (successElement) {
            successElement.style.display = 'flex';
            successElement.innerHTML = `<span>✅</span><span>${message}</span>`;
            setTimeout(() => {
                successElement.style.display = 'none';
            }, 3000);
        }
    }

    showErrorMessage(message) {
        console.warn('Cart error:', message);
        // Create temporary error message
        const errorElement = document.createElement('div');
        errorElement.className = 'cart-error';
        errorElement.innerHTML = `<span>⚠️</span><span>${message}</span>`;
        
        const cartHeader = document.querySelector('.cart-header');
        if (cartHeader) {
            cartHeader.appendChild(errorElement);
            setTimeout(() => {
                errorElement.remove();
            }, 3000);
        }
    }

    openCart() {
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.classList.add('active');
            this.updateCartDisplay(); // Refresh display when opening
        }
    }

    closeCart() {
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.classList.remove('active');
        }
    }
}

// Initialize the fixed cart system when the script loads
document.addEventListener('DOMContentLoaded', function() {
    new FixedCartSystem();
});

// Override global functions
window.addToCart = (productId) => window.fixedCart.addToCart(productId);
window.closeCart = () => window.fixedCart.closeCart();
window.openCart = () => window.fixedCart.openCart();

// Override the cart icon click to use the fixed system
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => window.fixedCart.openCart());
    }
});

console.log('Fixed cart system loaded and ready!');
