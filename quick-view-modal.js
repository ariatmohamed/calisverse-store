// Quick View Modal for CalisVerse Products
class QuickViewModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.currentProduct = null;
        this.init();
    }
    
    init() {
        this.createModal();
        this.setupEventListeners();
    }
    
    createModal() {
        const modalHTML = `
            <div id="cv-quick-view-modal" class="cv-modal" style="display: none;">
                <div class="cv-modal-overlay" onclick="closeQuickView()"></div>
                <div class="cv-modal-content">
                    <button class="cv-modal-close" onclick="closeQuickView()" aria-label="Close modal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    <div class="cv-modal-body">
                        <div class="cv-modal-3d">
                            <div id="cv-modal-3d-container"></div>
                            <div class="cv-modal-fallback" style="display: none;">
                                <img id="cv-modal-fallback-img" src="" alt="" />
                            </div>
                        </div>
                        
                        <div class="cv-modal-details">
                            <h3 id="cv-modal-title"></h3>
                            <p id="cv-modal-description"></p>
                            <div id="cv-modal-price" class="cv-modal-price"></div>
                            
                            <div class="cv-modal-tabs">
                                <button class="cv-tab-btn active" data-tab="overview">Overview</button>
                                <button class="cv-tab-btn" data-tab="specs">Specs</button>
                                <button class="cv-tab-btn" data-tab="howto">How to Use</button>
                                <button class="cv-tab-btn" data-tab="reviews">Reviews</button>
                            </div>
                            
                            <div class="cv-tab-content">
                                <div id="tab-overview" class="cv-tab-panel active">
                                    <ul id="cv-modal-features"></ul>
                                </div>
                                <div id="tab-specs" class="cv-tab-panel">
                                    <div id="cv-modal-specs"></div>
                                </div>
                                <div id="tab-howto" class="cv-tab-panel">
                                    <div id="cv-modal-howto"></div>
                                </div>
                                <div id="tab-reviews" class="cv-tab-panel">
                                    <div id="cv-modal-reviews">
                                        <div class="cv-review">
                                            <div class="cv-review-stars">★★★★★</div>
                                            <p>"Excellent build quality and perfect for home workouts!"</p>
                                            <cite>- Alex M.</cite>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="cv-modal-actions">
                                <button id="cv-modal-add-cart" class="cv-btn cv-btn-primary">
                                    Add to Cart
                                </button>
                                <button class="cv-btn cv-btn-secondary" onclick="closeQuickView()">
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('cv-quick-view-modal');
    }
    
    setupEventListeners() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cv-tab-btn')) {
                this.switchTab(e.target.dataset.tab);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isOpen && e.key === 'Escape') {
                this.close();
            }
        });
    }
    
    switchTab(tabName) {
        // Remove active class from all tabs and panels
        document.querySelectorAll('.cv-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.cv-tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // Add active class to selected tab and panel
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    }
    
    open(productId) {
        const productData = this.getProductData(productId);
        if (!productData) return;
        
        this.currentProduct = productData;
        this.populateModal(productData);
        this.modal.style.display = 'flex';
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Initialize 3D viewer if available
        this.init3DViewer(productId);
    }
    
    close() {
        this.modal.style.display = 'none';
        this.isOpen = false;
        document.body.style.overflow = '';
        
        // Cleanup 3D viewer
        this.cleanup3DViewer();
    }
    
    getProductData(productId) {
        const products = {
            'pullup-bar': {
                name: 'Professional Pull-Up Bar',
                description: 'Heavy-duty steel construction with ergonomic grip design. Perfect for home and gym use.',
                price: '$299.99',
                features: [
                    'Maximum weight capacity: 300kg',
                    'Powder-coated finish',
                    'Easy installation',
                    'Multiple grip positions'
                ],
                specs: {
                    'Material': 'Heavy-duty steel',
                    'Weight Capacity': '300kg (660 lbs)',
                    'Dimensions': '120cm x 30cm x 25cm',
                    'Finish': 'Powder-coated',
                    'Installation': 'Wall-mounted'
                },
                howto: 'Mount securely to wall studs. Use proper form with controlled movements. Start with assisted pull-ups if needed.',
                fallbackImage: './assets/pullup-bar.jpg'
            },
            'gymnastic-rings': {
                name: 'Professional Gymnastic Rings',
                description: 'Olympic-grade gymnastic rings with adjustable straps. Perfect for muscle-ups, ring dips, and advanced movements.',
                price: '$149.99',
                features: [
                    'Premium birch wood construction',
                    'Adjustable straps up to 5 meters',
                    'Cam buckle system',
                    '32mm diameter rings'
                ],
                specs: {
                    'Material': 'Premium birch wood',
                    'Ring Diameter': '32mm',
                    'Strap Length': 'Up to 5 meters',
                    'Weight Capacity': '250kg (550 lbs)',
                    'Buckle System': 'Cam buckle'
                },
                howto: 'Adjust height for exercise. Maintain straight body alignment. Progress gradually from basic holds to dynamic movements.',
                fallbackImage: './assets/gymnastic-rings.jpg'
            },
            'parallettes': {
                name: 'Professional Parallettes',
                description: 'Professional-grade parallel bars for dips, L-sits, and advanced calisthenics movements.',
                price: '$199.99',
                features: [
                    'Adjustable height: 70-100cm',
                    'Non-slip rubber base',
                    'Ergonomic grip design',
                    'Portable and stable'
                ],
                specs: {
                    'Material': 'Steel frame with rubber grips',
                    'Height Range': '70-100cm adjustable',
                    'Base Width': '60cm',
                    'Weight Capacity': '200kg (440 lbs)',
                    'Weight': '8kg per pair'
                },
                howto: 'Set appropriate height for exercise. Keep shoulders stable. Focus on controlled movements and proper form.',
                fallbackImage: './assets/parallettes.jpg'
            },
            'resistance-bands': {
                name: 'Premium Resistance Bands',
                description: 'Complete resistance training system with multiple resistance levels and accessories for full-body workouts.',
                price: '$89.99',
                features: [
                    '5 resistance levels (10-150 lbs)',
                    'Door anchor and handles included',
                    'Ankle straps and protective sleeves',
                    'Portable carrying case'
                ],
                specs: {
                    'Resistance Levels': '5 bands (10-150 lbs total)',
                    'Material': 'Natural latex',
                    'Accessories': 'Door anchor, handles, ankle straps',
                    'Case': 'Portable carrying case',
                    'Length': '120cm per band'
                },
                howto: 'Secure door anchor properly. Check bands for wear before use. Maintain tension throughout movement range.',
                fallbackImage: './assets/resistance-bands.jpg'
            }
        };
        
        return products[productId];
    }
    
    populateModal(product) {
        document.getElementById('cv-modal-title').textContent = product.name;
        document.getElementById('cv-modal-description').textContent = product.description;
        document.getElementById('cv-modal-price').textContent = product.price;
        
        // Features
        const featuresList = document.getElementById('cv-modal-features');
        featuresList.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
        
        // Specs
        const specsDiv = document.getElementById('cv-modal-specs');
        specsDiv.innerHTML = Object.entries(product.specs)
            .map(([key, value]) => `<div class="cv-spec-row"><strong>${key}:</strong> ${value}</div>`)
            .join('');
        
        // How to use
        document.getElementById('cv-modal-howto').innerHTML = `<p>${product.howto}</p>`;
        
        // Set fallback image
        document.getElementById('cv-modal-fallback-img').src = product.fallbackImage;
        document.getElementById('cv-modal-fallback-img').alt = product.name;
        
        // Add to cart button
        document.getElementById('cv-modal-add-cart').onclick = () => {
            addToCart(this.currentProduct.id, this.currentProduct.name, parseFloat(this.currentProduct.price.replace('$', '')));
            this.close();
        };
    }
    
    init3DViewer(productId) {
        // Try to initialize 3D viewer, fallback to image if failed
        const container = document.getElementById('cv-modal-3d-container');
        const fallback = document.querySelector('.cv-modal-fallback');
        
        // For now, show fallback image
        // In a real implementation, you'd initialize Three.js here
        container.style.display = 'none';
        fallback.style.display = 'block';
    }
    
    cleanup3DViewer() {
        // Cleanup 3D resources if any
        const container = document.getElementById('cv-modal-3d-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}

// Global functions
function openQuickView(productId) {
    if (!window.quickViewModal) {
        window.quickViewModal = new QuickViewModal();
    }
    window.quickViewModal.open(productId);
}

function closeQuickView() {
    if (window.quickViewModal) {
        window.quickViewModal.close();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.quickViewModal = new QuickViewModal();
});
