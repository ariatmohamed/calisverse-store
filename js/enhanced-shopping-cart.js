// Enhanced Shopping Cart System with Individual Product Cards
// Premium e-commerce functionality with 3D thumbnails and professional design

class EnhancedShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('calisverse-cart')) || [];
        this.taxRate = 0.08; // 8% tax
        this.shippingThreshold = 100; // Free shipping over $100
        this.shippingCost = 15;
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.updateCartBadge();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Cart overlay click handling
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-overlay')) {
                this.closeCart();
            }
        });

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

        // Variant selection
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('variant-select')) {
                const productId = e.target.dataset.productId;
                const newVariant = e.target.value;
                this.updateVariant(productId, newVariant);
            }
        });
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => 
            item.id === product.id && item.variant === product.variant
        );

        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                variant: product.variant || 'default',
                quantity: product.quantity || 1,
                addedAt: Date.now()
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.updateCartBadge();
        this.showSuccessMessage();
        this.animateCartIcon();
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
        this.animateQuantityChange(productId);
    }

    updateVariant(productId, newVariant) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        item.variant = newVariant;
        this.saveCart();
        this.updateCartDisplay();
    }

    removeItem(productId) {
        const itemIndex = this.cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;

        // Animate removal
        const itemElement = document.querySelector(`[data-product-id="${productId}"]`).closest('.cart-product-card');
        if (itemElement) {
            itemElement.style.transform = 'translateX(100%)';
            itemElement.style.opacity = '0';
            
            setTimeout(() => {
                this.cart.splice(itemIndex, 1);
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartBadge();
            }, 300);
        }
    }

    updateCartDisplay() {
        const cartContent = document.getElementById('cart-content');
        const cartEmpty = document.getElementById('cart-empty');
        const cartItems = document.getElementById('cart-items');
        const cartFooter = document.getElementById('cart-footer');

        if (this.cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartItems.style.display = 'none';
            cartFooter.style.display = 'none';
            return;
        }

        cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        cartFooter.style.display = 'block';

        cartItems.innerHTML = this.cart.map(item => this.createProductCard(item)).join('');
        this.updateCartSummary();
        this.initializeMini3DViewers();
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
                            ${variants.length > 1 ? `
                                <div class="variant-selector">
                                    <label>Color:</label>
                                    <select class="variant-select" data-product-id="${item.id}">
                                        ${variants.map(variant => `
                                            <option value="${variant.value}" ${variant.value === item.variant ? 'selected' : ''}>
                                                ${variant.name}
                                            </option>
                                        `).join('')}
                                    </select>
                                    <div class="color-indicator" style="background-color: ${this.getVariantColor(item.variant)}"></div>
                                </div>
                            ` : ''}
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
                { value: 'black', name: 'Matte Black', color: '#2d3748' },
                { value: 'silver', name: 'Brushed Silver', color: '#e2e8f0' },
                { value: 'purple', name: 'Purple Accent', color: '#8B5CF6' }
            ],
            'rings': [
                { value: 'wood', name: 'Natural Wood', color: '#8B4513' },
                { value: 'black', name: 'Black Straps', color: '#2d3748' }
            ],
            'parallettes': [
                { value: 'wood', name: 'Natural Wood', color: '#DEB887' },
                { value: 'black', name: 'Matte Black', color: '#2d3748' },
                { value: 'purple', name: 'Purple Accent', color: '#8B5CF6' }
            ],
            'dipbars': [
                { value: 'black', name: 'Matte Black', color: '#4a5568' },
                { value: 'silver', name: 'Brushed Silver', color: '#e2e8f0' }
            ]
        };
        return variants[productId] || [{ value: 'default', name: 'Default', color: '#8B5CF6' }];
    }

    getVariantColor(variant) {
        const colorMap = {
            'black': '#2d3748',
            'silver': '#e2e8f0',
            'purple': '#8B5CF6',
            'wood': '#8B4513',
            'default': '#8B5CF6'
        };
        return colorMap[variant] || '#8B5CF6';
    }

    updateCartSummary() {
        const subtotal = this.getSubtotal();
        const shipping = this.getShippingCost();
        const tax = this.getTax(subtotal);
        const total = subtotal + shipping + tax;

        const cartFooter = document.getElementById('cart-footer');
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
                ${shipping === 0 ? '' : `
                    <div class="shipping-progress">
                        <div class="progress-text">
                            ${subtotal >= this.shippingThreshold ? 
                                '🎉 You qualify for free shipping!' : 
                                `Add $${(this.shippingThreshold - subtotal).toFixed(2)} more for free shipping`
                            }
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(100, (subtotal / this.shippingThreshold) * 100)}%"></div>
                        </div>
                    </div>
                `}
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

    getSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getShippingCost() {
        return this.getSubtotal() >= this.shippingThreshold ? 0 : this.shippingCost;
    }

    getTax(subtotal) {
        return subtotal * this.taxRate;
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
    }

    saveCart() {
        localStorage.setItem('calisverse-cart', JSON.stringify(this.cart));
    }

    showSuccessMessage() {
        const successElement = document.getElementById('cart-success');
        if (successElement) {
            successElement.style.display = 'flex';
            setTimeout(() => {
                successElement.style.display = 'none';
            }, 3000);
        }
    }

    showErrorMessage(message) {
        // Create temporary error message
        const errorElement = document.createElement('div');
        errorElement.className = 'cart-error';
        errorElement.innerHTML = `<span>⚠️</span><span>${message}</span>`;
        
        const cartHeader = document.querySelector('.cart-header');
        cartHeader.appendChild(errorElement);
        
        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }

    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 200);
        }
    }

    animateQuantityChange(productId) {
        const quantityDisplay = document.querySelector(`[data-product-id="${productId}"].quantity-display`);
        if (quantityDisplay) {
            quantityDisplay.style.transform = 'scale(1.2)';
            quantityDisplay.style.color = '#8B5CF6';
            setTimeout(() => {
                quantityDisplay.style.transform = 'scale(1)';
                quantityDisplay.style.color = '';
            }, 200);
        }
    }

    closeCart() {
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.classList.remove('active');
        }
    }
}

// Initialize enhanced cart
window.enhancedCart = new EnhancedShoppingCart();

// Export for global use
window.addToCart = (product) => window.enhancedCart.addToCart(product);
window.closeCart = () => window.enhancedCart.closeCart();
