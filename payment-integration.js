// Stripe Payment Integration for CalisVerse
class PaymentProcessor {
    constructor() {
        // Initialize Stripe (replace with your actual publishable key)
        this.stripe = null;
        this.elements = null;
        this.card = null;
        this.initStripe();
    }

    async initStripe() {
        // Load Stripe.js dynamically
        if (!window.Stripe) {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.onload = () => this.setupStripe();
            document.head.appendChild(script);
        } else {
            this.setupStripe();
        }
    }

    setupStripe() {
        // Replace 'pk_test_...' with your actual Stripe publishable key
        this.stripe = Stripe('pk_test_51234567890abcdef'); // Demo key - replace with real key
        this.elements = this.stripe.elements();
        
        // Create card element
        this.card = this.elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '::placeholder': {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                invalid: {
                    color: '#ef4444',
                },
            },
        });
    }

    mountCardElement() {
        if (this.card) {
            const cardElement = document.getElementById('card-element');
            if (cardElement && !cardElement.hasChildNodes()) {
                this.card.mount('#card-element');
                
                // Handle real-time validation errors from the card Element
                this.card.on('change', ({error}) => {
                    const displayError = document.getElementById('card-errors');
                    if (error) {
                        displayError.textContent = error.message;
                    } else {
                        displayError.textContent = '';
                    }
                });
            }
        }
    }

    async processPayment(amount, currency = 'usd') {
        if (!this.stripe || !this.card) {
            throw new Error('Stripe not initialized');
        }

        // Create payment intent on your server
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: Math.round(amount * 100), // Convert to cents
                currency: currency,
                items: store.cart
            }),
        });

        const { client_secret } = await response.json();

        // Confirm payment with Stripe
        const result = await this.stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: this.card,
                billing_details: {
                    name: document.querySelector('input[name="name"]').value,
                    email: document.querySelector('input[name="email"]').value,
                }
            }
        });

        if (result.error) {
            throw new Error(result.error.message);
        }

        return result.paymentIntent;
    }

    // PayPal integration
    initPayPal() {
        // Load PayPal SDK
        if (!window.paypal) {
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD';
            script.onload = () => this.setupPayPal();
            document.head.appendChild(script);
        }
    }

    setupPayPal() {
        paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
                        }
                    }]
                });
            },
            onApprove: async (data, actions) => {
                const order = await actions.order.capture();
                this.handlePaymentSuccess(order);
            },
            onError: (err) => {
                console.error('PayPal error:', err);
                store.showNotification('Payment failed. Please try again.');
            }
        }).render('#paypal-button-container');
    }

    handlePaymentSuccess(paymentData) {
        // Clear cart and show success
        store.cart = [];
        store.updateCartDisplay();
        store.showNotification('Payment successful! Order confirmation sent to your email.');
        
        // Close payment modal
        closePayment();
        
        // Redirect to success page or show order details
        this.showOrderConfirmation(paymentData);
    }

    showOrderConfirmation(paymentData) {
        const confirmation = document.createElement('div');
        confirmation.className = 'order-confirmation';
        confirmation.innerHTML = `
            <div class="confirmation-content">
                <div class="success-icon">✅</div>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your purchase. Your order has been processed successfully.</p>
                <div class="order-details">
                    <p><strong>Order ID:</strong> ${paymentData.id || 'CV-' + Date.now()}</p>
                    <p><strong>Amount:</strong> $${paymentData.amount || 'N/A'}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="close-confirmation">Continue Shopping</button>
            </div>
        `;
        
        document.body.appendChild(confirmation);
        
        // Add confirmation styles
        const confirmationStyles = `
            .order-confirmation {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .confirmation-content {
                background: var(--dark-light);
                border: 1px solid var(--glass-border);
                border-radius: 24px;
                padding: 40px;
                text-align: center;
                max-width: 500px;
            }
            .success-icon {
                font-size: 4rem;
                margin-bottom: 20px;
            }
            .order-details {
                background: var(--glass);
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
            }
            .close-confirmation {
                background: linear-gradient(135deg, var(--primary), var(--primary-light));
                border: none;
                border-radius: 12px;
                padding: 12px 24px;
                color: white;
                cursor: pointer;
                font-weight: 600;
            }
        `;
        
        if (!document.querySelector('#confirmation-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'confirmation-styles';
            styleSheet.textContent = confirmationStyles;
            document.head.appendChild(styleSheet);
        }
    }
}

// Initialize payment processor
const paymentProcessor = new PaymentProcessor();
