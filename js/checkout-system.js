// Professional Checkout System
class CheckoutSystem {
    constructor() {
        this.currentStep = 1;
        this.orderData = {
            items: [],
            shipping: {},
            payment: {},
            total: 0
        };
        this.init();
    }

    init() {
        this.createCheckoutModal();
        this.setupEventListeners();
    }

    createCheckoutModal() {
        const checkoutHTML = `
            <div id="checkout-modal" class="checkout-modal">
                <div class="checkout-container">
                    <div class="checkout-header">
                        <h2>Checkout</h2>
                        <button class="close-checkout" onclick="closeCheckout()">&times;</button>
                    </div>
                    
                    <div class="checkout-progress">
                        <div class="progress-step active" data-step="1">
                            <div class="step-number">1</div>
                            <div class="step-label">Cart Review</div>
                        </div>
                        <div class="progress-step" data-step="2">
                            <div class="step-number">2</div>
                            <div class="step-label">Shipping</div>
                        </div>
                        <div class="progress-step" data-step="3">
                            <div class="step-number">3</div>
                            <div class="step-label">Payment</div>
                        </div>
                        <div class="progress-step" data-step="4">
                            <div class="step-number">4</div>
                            <div class="step-label">Confirmation</div>
                        </div>
                    </div>

                    <div class="checkout-content">
                        <!-- Step 1: Cart Review -->
                        <div id="checkout-step-1" class="checkout-step active">
                            <h3>Review Your Order</h3>
                            <div id="checkout-items"></div>
                            <div class="order-summary">
                                <div class="summary-row">
                                    <span>Subtotal:</span>
                                    <span id="checkout-subtotal">$0.00</span>
                                </div>
                                <div class="summary-row">
                                    <span>Shipping:</span>
                                    <span id="checkout-shipping">$15.00</span>
                                </div>
                                <div class="summary-row">
                                    <span>Tax:</span>
                                    <span id="checkout-tax">$0.00</span>
                                </div>
                                <div class="summary-row total">
                                    <span>Total:</span>
                                    <span id="checkout-total">$0.00</span>
                                </div>
                            </div>
                            <button class="btn-primary checkout-next" onclick="nextCheckoutStep()">Continue to Shipping</button>
                        </div>

                        <!-- Step 2: Shipping Information -->
                        <div id="checkout-step-2" class="checkout-step">
                            <h3>Shipping Information</h3>
                            <form id="shipping-form" class="checkout-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="first-name">First Name *</label>
                                        <input type="text" id="first-name" name="firstName" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="last-name">Last Name *</label>
                                        <input type="text" id="last-name" name="lastName" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="email">Email Address *</label>
                                    <input type="email" id="email" name="email" required>
                                </div>
                                <div class="form-group">
                                    <label for="phone">Phone Number</label>
                                    <input type="tel" id="phone" name="phone">
                                </div>
                                <div class="form-group">
                                    <label for="address">Street Address *</label>
                                    <input type="text" id="address" name="address" required>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="city">City *</label>
                                        <input type="text" id="city" name="city" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="state">State *</label>
                                        <select id="state" name="state" required>
                                            <option value="">Select State</option>
                                            <option value="CA">California</option>
                                            <option value="NY">New York</option>
                                            <option value="TX">Texas</option>
                                            <option value="FL">Florida</option>
                                            <!-- Add more states as needed -->
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="zip">ZIP Code *</label>
                                        <input type="text" id="zip" name="zip" required>
                                    </div>
                                </div>
                            </form>
                            <div class="checkout-actions">
                                <button class="btn-secondary checkout-back" onclick="prevCheckoutStep()">Back to Cart</button>
                                <button class="btn-primary checkout-next" onclick="nextCheckoutStep()">Continue to Payment</button>
                            </div>
                        </div>

                        <!-- Step 3: Payment Information -->
                        <div id="checkout-step-3" class="checkout-step">
                            <h3>Payment Information</h3>
                            <div class="payment-methods">
                                <div class="payment-method active" data-method="card">
                                    <div class="payment-icon">💳</div>
                                    <span>Credit/Debit Card</span>
                                </div>
                                <div class="payment-method" data-method="paypal">
                                    <div class="payment-icon">🅿️</div>
                                    <span>PayPal</span>
                                </div>
                                <div class="payment-method" data-method="apple">
                                    <div class="payment-icon">🍎</div>
                                    <span>Apple Pay</span>
                                </div>
                            </div>
                            
                            <form id="payment-form" class="checkout-form">
                                <div class="form-group">
                                    <label for="card-number">Card Number *</label>
                                    <input type="text" id="card-number" name="cardNumber" placeholder="1234 5678 9012 3456" required>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="expiry">Expiry Date *</label>
                                        <input type="text" id="expiry" name="expiry" placeholder="MM/YY" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="cvv">CVV *</label>
                                        <input type="text" id="cvv" name="cvv" placeholder="123" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="card-name">Name on Card *</label>
                                    <input type="text" id="card-name" name="cardName" required>
                                </div>
                            </form>
                            
                            <div class="security-info">
                                <div class="security-icon">🔒</div>
                                <span>Your payment information is encrypted and secure</span>
                            </div>
                            
                            <div class="checkout-actions">
                                <button class="btn-secondary checkout-back" onclick="prevCheckoutStep()">Back to Shipping</button>
                                <button class="btn-primary checkout-next" onclick="processPayment()">Complete Order</button>
                            </div>
                        </div>

                        <!-- Step 4: Order Confirmation -->
                        <div id="checkout-step-4" class="checkout-step">
                            <div class="confirmation-content">
                                <div class="success-icon">✅</div>
                                <h3>Order Confirmed!</h3>
                                <p>Thank you for your purchase. Your order has been successfully placed.</p>
                                
                                <div class="order-details">
                                    <h4>Order Summary</h4>
                                    <div class="order-number">Order #: <span id="order-number"></span></div>
                                    <div class="order-total">Total: <span id="final-total"></span></div>
                                </div>
                                
                                <div class="next-steps">
                                    <h4>What's Next?</h4>
                                    <ul>
                                        <li>You'll receive an email confirmation shortly</li>
                                        <li>Your order will be processed within 1-2 business days</li>
                                        <li>Shipping typically takes 3-5 business days</li>
                                        <li>You'll receive tracking information once shipped</li>
                                    </ul>
                                </div>
                                
                                <button class="btn-primary" onclick="closeCheckout()">Continue Shopping</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', checkoutHTML);
    }

    setupEventListeners() {
        // Payment method selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.payment-method')) {
                const method = e.target.closest('.payment-method');
                document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
                method.classList.add('active');
            }
        });

        // Form validation
        const forms = document.querySelectorAll('.checkout-form');
        forms.forEach(form => {
            form.addEventListener('input', this.validateForm.bind(this));
        });
    }

    validateForm(e) {
        const form = e.target.closest('form');
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        const nextButton = form.closest('.checkout-step').querySelector('.checkout-next');
        if (nextButton) {
            nextButton.disabled = !isValid;
        }
    }

    showCheckout() {
        this.loadCartItems();
        this.calculateTotals();
        document.getElementById('checkout-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    loadCartItems() {
        const cart = JSON.parse(sessionStorage.getItem('calisverse_cart') || '[]');
        const itemsContainer = document.getElementById('checkout-items');
        
        itemsContainer.innerHTML = cart.map(item => `
            <div class="checkout-item">
                <div class="item-info">
                    <span class="item-emoji">${item.emoji}</span>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-variant">${item.variant}</div>
                    </div>
                </div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
    }

    calculateTotals() {
        const cart = JSON.parse(sessionStorage.getItem('calisverse_cart') || '[]');
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 100 ? 0 : 15;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
        document.getElementById('final-total').textContent = `$${total.toFixed(2)}`;
    }

    nextStep() {
        if (this.currentStep < 4) {
            // Hide current step
            document.getElementById(`checkout-step-${this.currentStep}`).classList.remove('active');
            document.querySelector(`[data-step="${this.currentStep}"]`).classList.remove('active');
            
            // Show next step
            this.currentStep++;
            document.getElementById(`checkout-step-${this.currentStep}`).classList.add('active');
            document.querySelector(`[data-step="${this.currentStep}"]`).classList.add('active');
            
            if (this.currentStep === 4) {
                this.generateOrderNumber();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            // Hide current step
            document.getElementById(`checkout-step-${this.currentStep}`).classList.remove('active');
            document.querySelector(`[data-step="${this.currentStep}"]`).classList.remove('active');
            
            // Show previous step
            this.currentStep--;
            document.getElementById(`checkout-step-${this.currentStep}`).classList.add('active');
            document.querySelector(`[data-step="${this.currentStep}"]`).classList.add('active');
        }
    }

    processPayment() {
        // Simulate payment processing
        const paymentButton = document.querySelector('#checkout-step-3 .checkout-next');
        paymentButton.textContent = 'Processing...';
        paymentButton.disabled = true;
        
        setTimeout(() => {
            this.nextStep();
            this.clearCart();
        }, 2000);
    }

    generateOrderNumber() {
        const orderNumber = 'CV' + Date.now().toString().slice(-8);
        document.getElementById('order-number').textContent = orderNumber;
    }

    clearCart() {
        sessionStorage.removeItem('calisverse_cart');
        sessionStorage.removeItem('calisverse_cart_count');
        sessionStorage.removeItem('calisverse_cart_total');
        
        // Update cart UI
        if (typeof updateCartUI === 'function') {
            updateCartUI();
        }
    }

    close() {
        document.getElementById('checkout-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset to first step
        document.querySelectorAll('.checkout-step').forEach(step => step.classList.remove('active'));
        document.querySelectorAll('.progress-step').forEach(step => step.classList.remove('active'));
        document.getElementById('checkout-step-1').classList.add('active');
        document.querySelector('[data-step="1"]').classList.add('active');
        this.currentStep = 1;
    }
}

// Global functions
function showCheckout() {
    if (!window.checkoutSystem) {
        window.checkoutSystem = new CheckoutSystem();
    }
    window.checkoutSystem.showCheckout();
}

function closeCheckout() {
    if (window.checkoutSystem) {
        window.checkoutSystem.close();
    }
}

function nextCheckoutStep() {
    if (window.checkoutSystem) {
        window.checkoutSystem.nextStep();
    }
}

function prevCheckoutStep() {
    if (window.checkoutSystem) {
        window.checkoutSystem.prevStep();
    }
}

function processPayment() {
    if (window.checkoutSystem) {
        window.checkoutSystem.processPayment();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutSystem = new CheckoutSystem();
});
