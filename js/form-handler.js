// Professional Form Handler
class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupNewsletterForm();
        this.setupFormValidation();
    }

    setupContactForm() {
        const contactForm = document.querySelector('#contact form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }
    }

    setupNewsletterForm() {
        // Add newsletter form if needed
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
        });
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearErrors.bind(this));
            });
        });
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    clearErrors(e) {
        this.clearFieldError(e.target);
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        // Insert after the field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Validate all fields
        let isFormValid = true;
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            if (!this.validateField({ target: field })) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Simulate form submission
            await this.simulateFormSubmission(formData);
            
            // Show success message
            this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
            
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    async handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!email) {
            this.showNotification('Please enter your email address', 'error');
            return;
        }

        // Show loading state
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;

        try {
            // Simulate newsletter subscription
            await this.simulateFormSubmission({ email });
            
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            form.reset();
            
        } catch (error) {
            this.showNotification('Failed to subscribe. Please try again.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    async simulateFormSubmission(data) {
        // Simulate API call delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 90% success rate for demo
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 1500);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }
}

// Global form submission handler
function handleFormSubmit(event) {
    if (window.formHandler) {
        window.formHandler.handleContactSubmit(event);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.formHandler = new FormHandler();
});
