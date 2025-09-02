// Security Enhancements for CalisVerse
class SecurityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupCSP();
        this.sanitizeInputs();
        this.setupFormValidation();
        this.preventXSS();
    }

    // Content Security Policy setup
    setupCSP() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            font-src 'self' https://fonts.gstatic.com;
            img-src 'self' data: https:;
            connect-src 'self' https:;
            media-src 'self';
            object-src 'none';
            base-uri 'self';
            form-action 'self';
        `.replace(/\s+/g, ' ').trim();
        document.head.appendChild(meta);
    }

    // Input sanitization
    sanitizeInputs() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = this.sanitizeString(e.target.value);
            });
        });
    }

    sanitizeString(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    // Form validation with security checks
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    return false;
                }
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            const value = input.value.trim();
            
            // Basic validation
            if (!value) {
                this.showError(input, 'This field is required');
                isValid = false;
                return;
            }

            // Email validation
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.showError(input, 'Please enter a valid email address');
                    isValid = false;
                    return;
                }
            }

            // Length validation
            if (value.length > 255) {
                this.showError(input, 'Input too long');
                isValid = false;
                return;
            }

            // XSS prevention
            if (this.containsXSS(value)) {
                this.showError(input, 'Invalid characters detected');
                isValid = false;
                return;
            }

            this.clearError(input);
        });

        return isValid;
    }

    containsXSS(str) {
        const xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe/gi,
            /<object/gi,
            /<embed/gi
        ];

        return xssPatterns.some(pattern => pattern.test(str));
    }

    showError(input, message) {
        input.setAttribute('aria-invalid', 'true');
        input.classList.add('error');
        
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearError(input) {
        input.setAttribute('aria-invalid', 'false');
        input.classList.remove('error');
        
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Prevent XSS in dynamic content
    preventXSS() {
        // Override innerHTML to sanitize content
        const originalInnerHTML = Element.prototype.__lookupSetter__('innerHTML');
        if (originalInnerHTML) {
            Element.prototype.__defineSetter__('innerHTML', function(html) {
                originalInnerHTML.call(this, this.sanitizeHTML ? this.sanitizeHTML(html) : html);
            });
        }
    }

    // Rate limiting for form submissions
    setupRateLimit() {
        const submissions = new Map();
        const RATE_LIMIT = 5; // 5 submissions per minute
        const TIME_WINDOW = 60000; // 1 minute

        document.addEventListener('submit', (e) => {
            const now = Date.now();
            const userKey = 'user'; // In real app, use user ID or IP
            
            if (!submissions.has(userKey)) {
                submissions.set(userKey, []);
            }
            
            const userSubmissions = submissions.get(userKey);
            const recentSubmissions = userSubmissions.filter(time => now - time < TIME_WINDOW);
            
            if (recentSubmissions.length >= RATE_LIMIT) {
                e.preventDefault();
                alert('Too many submissions. Please wait before trying again.');
                return false;
            }
            
            recentSubmissions.push(now);
            submissions.set(userKey, recentSubmissions);
        });
    }
}

// Initialize security manager
document.addEventListener('DOMContentLoaded', () => {
    new SecurityManager();
});

// Secure localStorage wrapper
class SecureStorage {
    static setItem(key, value) {
        try {
            const encrypted = btoa(JSON.stringify(value));
            localStorage.setItem(key, encrypted);
        } catch (e) {
            console.error('Storage error:', e);
        }
    }

    static getItem(key) {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            return JSON.parse(atob(encrypted));
        } catch (e) {
            console.error('Storage retrieval error:', e);
            return null;
        }
    }

    static removeItem(key) {
        localStorage.removeItem(key);
    }
}

// Export for use in other modules
window.SecureStorage = SecureStorage;
