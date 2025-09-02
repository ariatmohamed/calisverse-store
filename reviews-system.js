// Product Reviews and Ratings System for CalisVerse
class ReviewsSystem {
    constructor() {
        this.reviews = this.loadReviews();
        this.init();
    }

    init() {
        this.generateSampleReviews();
        this.addReviewsToProducts();
    }

    loadReviews() {
        // Load from localStorage or return sample data
        const stored = localStorage.getItem('calisverse-reviews');
        return stored ? JSON.parse(stored) : {};
    }

    saveReviews() {
        localStorage.setItem('calisverse-reviews', JSON.stringify(this.reviews));
    }

    generateSampleReviews() {
        if (Object.keys(this.reviews).length > 0) return;

        this.reviews = {
            'pullup-bar': [
                {
                    id: 1,
                    name: 'Alex M.',
                    rating: 5,
                    date: '2024-08-15',
                    comment: 'Absolutely fantastic pull-up bar! The build quality is exceptional and it can handle my 200lb frame with ease. Installation was straightforward.',
                    verified: true
                },
                {
                    id: 2,
                    name: 'Sarah K.',
                    rating: 4,
                    date: '2024-08-10',
                    comment: 'Great product overall. Very sturdy and well-made. Only minor complaint is that the grip could be slightly more textured.',
                    verified: true
                },
                {
                    id: 3,
                    name: 'Mike R.',
                    rating: 5,
                    date: '2024-08-05',
                    comment: 'Best investment for my home gym! The multiple grip positions are perfect for different exercises. Highly recommend!',
                    verified: false
                }
            ],
            'gymnastic-rings': [
                {
                    id: 1,
                    name: 'Emma L.',
                    rating: 5,
                    date: '2024-08-12',
                    comment: 'These rings are incredible! The wood quality is premium and the straps are very durable. Perfect for muscle-ups and ring dips.',
                    verified: true
                },
                {
                    id: 2,
                    name: 'David P.',
                    rating: 4,
                    date: '2024-08-08',
                    comment: 'Excellent rings with smooth finish. The cam buckle system works great. Would definitely buy again.',
                    verified: true
                }
            ],
            'parallel-bars': [
                {
                    id: 1,
                    name: 'Jessica T.',
                    rating: 5,
                    date: '2024-08-14',
                    comment: 'Perfect for dips and L-sits! The adjustable height feature is amazing and the stability is outstanding.',
                    verified: true
                },
                {
                    id: 2,
                    name: 'Ryan C.',
                    rating: 4,
                    date: '2024-08-09',
                    comment: 'Solid construction and great value. The rubber base prevents any sliding during workouts.',
                    verified: true
                }
            ],
            'resistance-bands': [
                {
                    id: 1,
                    name: 'Lisa H.',
                    rating: 5,
                    date: '2024-08-11',
                    comment: 'Complete set with everything you need! The resistance levels are perfect for progressive training.',
                    verified: true
                },
                {
                    id: 2,
                    name: 'Tom W.',
                    rating: 4,
                    date: '2024-08-07',
                    comment: 'Great quality bands that have held up well. The carrying case is a nice touch.',
                    verified: false
                }
            ],
            'ab-wheel': [
                {
                    id: 1,
                    name: 'Maria S.',
                    rating: 5,
                    date: '2024-08-13',
                    comment: 'Dual wheels make it much more stable than single wheel versions. Great for core training!',
                    verified: true
                },
                {
                    id: 2,
                    name: 'Chris B.',
                    rating: 4,
                    date: '2024-08-06',
                    comment: 'Solid build quality and the knee pad is comfortable. Definitely feel the burn!',
                    verified: true
                }
            ]
        };

        this.saveReviews();
    }

    getAverageRating(productId) {
        const productReviews = this.reviews[productId] || [];
        if (productReviews.length === 0) return 0;
        
        const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / productReviews.length).toFixed(1);
    }

    getReviewCount(productId) {
        return (this.reviews[productId] || []).length;
    }

    addReviewsToProducts() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach((card, index) => {
            const productIds = ['pullup-bar', 'gymnastic-rings', 'parallel-bars', 'resistance-bands', 'ab-wheel'];
            const productId = productIds[index];
            
            if (!productId) return;

            const productDetails = card.querySelector('.product-details');
            const priceElement = productDetails.querySelector('.product-price');
            
            // Create reviews section
            const reviewsSection = document.createElement('div');
            reviewsSection.className = 'product-reviews';
            reviewsSection.innerHTML = this.createReviewsHTML(productId);
            
            // Insert before price
            productDetails.insertBefore(reviewsSection, priceElement);
        });
    }

    createReviewsHTML(productId) {
        const avgRating = this.getAverageRating(productId);
        const reviewCount = this.getReviewCount(productId);
        const reviews = this.reviews[productId] || [];
        
        return `
            <div class="rating-summary">
                <div class="stars">${this.createStarsHTML(avgRating)}</div>
                <span class="rating-text">${avgRating}/5 (${reviewCount} reviews)</span>
                <button class="show-reviews-btn" onclick="reviewsSystem.showReviewsModal('${productId}')">
                    View Reviews
                </button>
            </div>
        `;
    }

    createStarsHTML(rating) {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHTML += '<span class="star filled">★</span>';
            } else if (i === fullStars && hasHalfStar) {
                starsHTML += '<span class="star half">★</span>';
            } else {
                starsHTML += '<span class="star empty">☆</span>';
            }
        }
        
        return starsHTML;
    }

    showReviewsModal(productId) {
        const reviews = this.reviews[productId] || [];
        const productName = this.getProductName(productId);
        
        const modal = document.createElement('div');
        modal.className = 'reviews-modal';
        modal.innerHTML = `
            <div class="reviews-container">
                <div class="reviews-header">
                    <h2>Reviews for ${productName}</h2>
                    <button class="close-reviews" onclick="this.closest('.reviews-modal').remove()">×</button>
                </div>
                <div class="reviews-content">
                    <div class="reviews-summary">
                        <div class="rating-overview">
                            <div class="avg-rating">${this.getAverageRating(productId)}</div>
                            <div class="stars-large">${this.createStarsHTML(this.getAverageRating(productId))}</div>
                            <div class="total-reviews">${reviews.length} reviews</div>
                        </div>
                        <button class="write-review-btn" onclick="reviewsSystem.showWriteReviewForm('${productId}')">
                            Write a Review
                        </button>
                    </div>
                    <div class="reviews-list">
                        ${reviews.map(review => this.createReviewHTML(review)).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animate modal appearance
        gsap.from('.reviews-container', {
            duration: 0.5,
            scale: 0.9,
            opacity: 0,
            ease: 'power3.out'
        });
    }

    createReviewHTML(review) {
        return `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <span class="reviewer-name">${review.name}</span>
                        ${review.verified ? '<span class="verified-badge">✓ Verified Purchase</span>' : ''}
                    </div>
                    <div class="review-meta">
                        <div class="review-stars">${this.createStarsHTML(review.rating)}</div>
                        <span class="review-date">${this.formatDate(review.date)}</span>
                    </div>
                </div>
                <div class="review-comment">${review.comment}</div>
            </div>
        `;
    }

    showWriteReviewForm(productId) {
        // Prevent background scrolling
        document.body.classList.add('modal-open');
        
        const form = document.createElement('div');
        form.className = 'write-review-form';
        form.innerHTML = `
            <div class="form-overlay" onclick="this.closeReviewForm()"></div>
            <div class="form-container">
                <h3>Write a Review</h3>
                <form onsubmit="reviewsSystem.submitReview(event, '${productId}')">
                    <div class="form-group">
                        <label>Your Name</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Rating</label>
                        <div class="rating-input">
                            ${[5,4,3,2,1].map(i => `
                                <input type="radio" name="rating" value="${i}" id="star${i}" required>
                                <label for="star${i}">★</label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Your Review</label>
                        <textarea name="comment" rows="4" required placeholder="Share your experience with this product..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="reviewsSystem.closeReviewForm()">Cancel</button>
                        <button type="submit">Submit Review</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(form);
    }

    closeReviewForm() {
        document.body.classList.remove('modal-open');
        const form = document.querySelector('.write-review-form');
        if (form) {
            form.remove();
        }
    }

    submitReview(event, productId) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const newReview = {
            id: Date.now(),
            name: formData.get('name'),
            rating: parseInt(formData.get('rating')),
            comment: formData.get('comment'),
            date: new Date().toISOString(),
            verified: Math.random() > 0.5
        };

        // Add to reviews
        if (!this.reviews[productId]) {
            this.reviews[productId] = [];
        }
        this.reviews[productId].push(newReview);
        
        // Save to localStorage
        localStorage.setItem('calisverse-reviews', JSON.stringify(this.reviews));
        
        // Send email notification
        this.sendEmailNotification(newReview, productId);
        
        // Update display
        this.addReviewsToProducts();
        
        // Close form
        event.target.closest('.write-review-form').remove();
        
        // Show success message
        this.showNotification('Review submitted successfully! Thank you for your feedback.');
    }

    sendEmailNotification(review, productId) {
        const emailData = {
            to: 'mohamedhajamer7@gmail.com',
            subject: `New Review for ${productId}`,
            body: `
                New review submitted:
                
                Product: ${productId}
                Customer: ${review.name}
                Rating: ${review.rating}/5 stars
                Comment: ${review.comment}
                Date: ${new Date(review.date).toLocaleString()}
                
                Review ID: ${review.id}
            `
        };
        
        // In a real implementation, this would make an API call to your backend
        console.log('Email notification would be sent:', emailData);
        
        // Simulate email sending with a mock API call
        fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        }).catch(error => {
            console.log('Email service not available (expected in demo mode)');
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        // Animate notification appearance
        gsap.from('.notification', {
            duration: 0.5,
            scale: 0.9,
            opacity: 0,
            ease: 'power3.out'
        });
        
        // Auto-remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateProductReviews() {
        const reviewsSections = document.querySelectorAll('.product-reviews');
        reviewsSections.forEach((section, index) => {
            const productIds = ['pullup-bar', 'gymnastic-rings', 'parallel-bars', 'resistance-bands', 'ab-wheel'];
            const productId = productIds[index];
            
            if (productId) {
                section.innerHTML = this.createReviewsHTML(productId);
            }
        });
    }

    getProductName(productId) {
        const names = {
            'pullup-bar': 'Professional Pull-Up Bar',
            'gymnastic-rings': 'Professional Gymnastic Rings',
            'parallel-bars': 'Parallel Bars Set',
            'resistance-bands': 'Premium Resistance Bands Set',
            'ab-wheel': 'Professional Ab Wheel'
        };
        return names[productId] || 'Product';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// Initialize reviews system
const reviewsSystem = new ReviewsSystem();
