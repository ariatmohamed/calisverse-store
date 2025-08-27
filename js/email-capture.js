/* Email Capture System with Lead Magnets */

class EmailCapture {
    constructor() {
        this.isVisible = false;
        this.hasShown = false;
        this.init();
    }
    
    init() {
        this.createEmailModal();
        this.setupTriggers();
        this.setupEventListeners();
    }
    
    createEmailModal() {
        const modal = document.createElement('div');
        modal.className = 'email-capture-modal';
        modal.id = 'email-capture-modal';
        modal.innerHTML = `
            <div class="email-capture-overlay" onclick="emailCapture.hideModal()"></div>
            <div class="email-capture-content">
                <button class="email-close-btn" onclick="emailCapture.hideModal()">&times;</button>
                
                <div class="email-capture-header">
                    <h2>🎯 Free Elite Training Guide</h2>
                    <p>Get our complete calisthenics workout plan used by Olympic athletes</p>
                </div>
                
                <div class="lead-magnets">
                    <div class="lead-magnet">
                        <div class="magnet-icon">📋</div>
                        <div class="magnet-content">
                            <h3>12-Week Progressive Program</h3>
                            <p>From beginner to advanced movements</p>
                        </div>
                    </div>
                    <div class="lead-magnet">
                        <div class="magnet-icon">🔧</div>
                        <div class="magnet-content">
                            <h3>Equipment Maintenance Guide</h3>
                            <p>Keep your gear in perfect condition</p>
                        </div>
                    </div>
                    <div class="lead-magnet">
                        <div class="magnet-icon">💪</div>
                        <div class="magnet-content">
                            <h3>Injury Prevention Tips</h3>
                            <p>Train safely for long-term success</p>
                        </div>
                    </div>
                </div>
                
                <form class="email-capture-form" onsubmit="emailCapture.submitEmail(event)">
                    <div class="form-group">
                        <input type="email" id="email-input" placeholder="Enter your email address" required>
                        <button type="submit" class="email-submit-btn">
                            Get Free Guide
                        </button>
                    </div>
                    <div class="email-privacy">
                        <small>🔒 We respect your privacy. Unsubscribe anytime.</small>
                    </div>
                </form>
                
                <div class="social-proof">
                    <div class="proof-item">
                        <span class="proof-number">12,847</span>
                        <span class="proof-text">athletes trained</span>
                    </div>
                    <div class="proof-item">
                        <span class="proof-number">4.9★</span>
                        <span class="proof-text">average rating</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
    }
    
    setupTriggers() {
        // Exit intent trigger
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !this.hasShown) {
                this.showModal();
            }
        });
        
        // Scroll trigger (70% of page)
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > 70 && !this.hasShown) {
                this.showModal();
            }
        });
        
        // Time-based trigger (30 seconds)
        setTimeout(() => {
            if (!this.hasShown) {
                this.showModal();
            }
        }, 30000);
    }
    
    setupEventListeners() {
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideModal();
            }
        });
    }
    
    showModal() {
        if (this.hasShown) return;
        
        this.modal.classList.add('active');
        this.isVisible = true;
        this.hasShown = true;
        document.body.style.overflow = 'hidden';
        
        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'email_popup_shown', {
                event_category: 'engagement',
                event_label: 'email_capture'
            });
        }
    }
    
    hideModal() {
        this.modal.classList.remove('active');
        this.isVisible = false;
        document.body.style.overflow = '';
    }
    
    submitEmail(event) {
        event.preventDefault();
        
        const email = document.getElementById('email-input').value;
        const submitBtn = event.target.querySelector('.email-submit-btn');
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual endpoint)
        setTimeout(() => {
            // Success state
            this.showSuccessMessage();
            
            // Track conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_signup', {
                    event_category: 'conversion',
                    event_label: 'lead_magnet',
                    value: 1
                });
            }
            
            // Store in localStorage
            localStorage.setItem('calisverse_email_signup', email);
            
            // Hide modal after delay
            setTimeout(() => {
                this.hideModal();
            }, 2000);
            
        }, 1500);
    }
    
    showSuccessMessage() {
        const form = this.modal.querySelector('.email-capture-form');
        form.innerHTML = `
            <div class="success-message">
                <div class="success-icon">✅</div>
                <h3>Welcome to the CalisVerse Family!</h3>
                <p>Check your email for your free training guide.</p>
            </div>
        `;
    }
}

// Initialize email capture when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.emailCapture = new EmailCapture();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailCapture;
}
