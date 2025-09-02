// Advanced Search and Filtering System for CalisVerse
class SearchSystem {
    constructor() {
        this.products = this.getProductsData();
        this.filters = {
            category: 'all',
            priceRange: [0, 500],
            rating: 0,
            inStock: false
        };
        this.sortBy = 'relevance';
        this.init();
    }

    init() {
        this.addSearchBar();
        this.setupSearchListeners();
    }

    getProductsData() {
        return [
            {
                id: 'pullup-bar',
                name: 'Professional Pull-Up Bar',
                category: 'bars',
                price: 299.99,
                rating: 4.8,
                reviews: 3,
                inStock: true,
                tags: ['pullup', 'bar', 'steel', 'heavy-duty', 'home-gym'],
                description: 'Heavy-duty steel construction with ergonomic grip design'
            },
            {
                id: 'gymnastic-rings',
                name: 'Professional Gymnastic Rings',
                category: 'rings',
                price: 149.99,
                rating: 4.9,
                reviews: 2,
                inStock: true,
                tags: ['rings', 'gymnastic', 'wood', 'birch', 'muscle-up'],
                description: 'Olympic-grade gymnastic rings with adjustable straps'
            },
            {
                id: 'parallel-bars',
                name: 'Parallel Bars Set',
                category: 'bars',
                price: 199.99,
                rating: 4.7,
                reviews: 2,
                inStock: true,
                tags: ['parallel', 'bars', 'dips', 'l-sits', 'adjustable'],
                description: 'Professional-grade parallel bars for dips and advanced movements'
            },
            {
                id: 'resistance-bands',
                name: 'Premium Resistance Bands Set',
                category: 'bands',
                price: 89.99,
                rating: 4.6,
                reviews: 2,
                inStock: true,
                tags: ['resistance', 'bands', 'portable', 'full-body', 'training'],
                description: 'Complete resistance training system with multiple levels'
            },
            {
                id: 'ab-wheel',
                name: 'Professional Ab Wheel',
                category: 'core',
                price: 59.99,
                rating: 4.8,
                reviews: 2,
                inStock: true,
                tags: ['ab', 'wheel', 'core', 'dual-wheel', 'stability'],
                description: 'Heavy-duty ab wheel with dual wheels for stability'
            }
        ];
    }

    addSearchBar() {
        const nav = document.querySelector('.nav-links');
        if (!nav) return;

        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-bar">
                <input type="text" id="search-input" placeholder="Search products..." />
                <button class="search-btn" onclick="searchSystem.performSearch()">🔍</button>
            </div>
            <button class="filter-btn" onclick="searchSystem.toggleFilters()">
                <span>Filters</span>
                <span class="filter-count" id="filter-count" style="display: none;">0</span>
            </button>
        `;

        // Insert before cart button
        const cartBtn = nav.querySelector('.cart-btn');
        nav.insertBefore(searchContainer, cartBtn);
    }

    setupSearchListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    if (e.target.value.length > 2 || e.target.value.length === 0) {
                        this.performSearch();
                    }
                });

                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.performSearch();
                    }
                });
            }
        });
    }

    performSearch() {
        const query = document.getElementById('search-input')?.value.toLowerCase() || '';
        const results = this.searchProducts(query);
        this.displayResults(results, query);
    }

    searchProducts(query) {
        if (!query) {
            return this.filterAndSort(this.products);
        }

        const filtered = this.products.filter(product => {
            const searchText = `${product.name} ${product.description} ${product.tags.join(' ')}`.toLowerCase();
            return searchText.includes(query);
        });

        return this.filterAndSort(filtered);
    }

    filterAndSort(products) {
        let filtered = [...products];

        // Apply filters
        if (this.filters.category !== 'all') {
            filtered = filtered.filter(p => p.category === this.filters.category);
        }

        filtered = filtered.filter(p => 
            p.price >= this.filters.priceRange[0] && 
            p.price <= this.filters.priceRange[1]
        );

        if (this.filters.rating > 0) {
            filtered = filtered.filter(p => p.rating >= this.filters.rating);
        }

        if (this.filters.inStock) {
            filtered = filtered.filter(p => p.inStock);
        }

        // Apply sorting
        switch (this.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default: // relevance
                break;
        }

        return filtered;
    }

    displayResults(results, query) {
        const productsSection = document.getElementById('products');
        if (!productsSection) return;

        const container = productsSection.querySelector('.container');
        const sectionTitle = container.querySelector('.section-title');

        // Update section title
        if (query) {
            sectionTitle.textContent = `Search Results for "${query}" (${results.length} found)`;
        } else {
            sectionTitle.textContent = 'Our Products';
        }

        // Remove existing product cards
        const existingCards = container.querySelectorAll('.product-card');
        existingCards.forEach(card => card.remove());

        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <div class="no-results-content">
                    <div class="no-results-icon">🔍</div>
                    <h3>No products found</h3>
                    <p>Try adjusting your search terms or filters</p>
                    <button class="clear-search-btn" onclick="searchSystem.clearSearch()">
                        Clear Search
                    </button>
                </div>
            `;
            container.appendChild(noResults);
            return;
        }

        // Add search results toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'search-toolbar';
        toolbar.innerHTML = `
            <div class="results-info">
                Showing ${results.length} product${results.length !== 1 ? 's' : ''}
            </div>
            <div class="sort-controls">
                <label>Sort by:</label>
                <select id="sort-select" onchange="searchSystem.updateSort(this.value)">
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="name">Name A-Z</option>
                </select>
            </div>
        `;
        container.appendChild(toolbar);

        // Display filtered products
        results.forEach(product => {
            const productCard = this.createProductCard(product);
            container.appendChild(productCard);
        });

        // Animate new cards
        gsap.from('.product-card', {
            duration: 0.6,
            y: 50,
            opacity: 0,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-layout">
                <div class="product-details">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-reviews">
                        <div class="rating-summary">
                            <div class="stars">${this.createStarsHTML(product.rating)}</div>
                            <span class="rating-text">${product.rating}/5 (${product.reviews} reviews)</span>
                        </div>
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">
                            Add to Cart
                        </button>
                        <button class="wishlist-btn" onclick="userAuth.addToWishlist('${product.id}', '${product.name}', ${product.price})">
                            ❤️
                        </button>
                    </div>
                </div>
                <div class="product-visual">
                    <model-viewer
                        id="${product.id}-model"
                        src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                        alt="${product.name}"
                        camera-controls
                        auto-rotate
                        environment-image="neutral"
                        shadow-intensity="1"
                        class="model-viewer">
                    </model-viewer>
                </div>
            </div>
        `;
        return card;
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

    toggleFilters() {
        const existingModal = document.querySelector('.filters-modal');
        if (existingModal) {
            existingModal.remove();
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'filters-modal';
        modal.innerHTML = `
            <div class="filters-overlay" onclick="this.parentElement.remove()"></div>
            <div class="filters-container">
                <div class="filters-header">
                    <h3>Filters</h3>
                    <button class="close-filters" onclick="this.closest('.filters-modal').remove()">×</button>
                </div>
                <div class="filters-content">
                    <div class="filter-group">
                        <h4>Category</h4>
                        <div class="filter-options">
                            <label><input type="radio" name="category" value="all" ${this.filters.category === 'all' ? 'checked' : ''}> All Products</label>
                            <label><input type="radio" name="category" value="bars" ${this.filters.category === 'bars' ? 'checked' : ''}> Pull-up & Parallel Bars</label>
                            <label><input type="radio" name="category" value="rings" ${this.filters.category === 'rings' ? 'checked' : ''}> Gymnastic Rings</label>
                            <label><input type="radio" name="category" value="bands" ${this.filters.category === 'bands' ? 'checked' : ''}> Resistance Bands</label>
                            <label><input type="radio" name="category" value="core" ${this.filters.category === 'core' ? 'checked' : ''}> Core Equipment</label>
                        </div>
                    </div>
                    
                    <div class="filter-group">
                        <h4>Price Range</h4>
                        <div class="price-range">
                            <input type="range" id="price-min" min="0" max="500" value="${this.filters.priceRange[0]}" oninput="searchSystem.updatePriceRange()">
                            <input type="range" id="price-max" min="0" max="500" value="${this.filters.priceRange[1]}" oninput="searchSystem.updatePriceRange()">
                            <div class="price-labels">
                                <span>$<span id="price-min-label">${this.filters.priceRange[0]}</span></span>
                                <span>$<span id="price-max-label">${this.filters.priceRange[1]}</span></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="filter-group">
                        <h4>Minimum Rating</h4>
                        <div class="rating-filter">
                            ${[4, 3, 2, 1].map(rating => `
                                <label>
                                    <input type="radio" name="rating" value="${rating}" ${this.filters.rating === rating ? 'checked' : ''}>
                                    ${this.createStarsHTML(rating)} & up
                                </label>
                            `).join('')}
                            <label>
                                <input type="radio" name="rating" value="0" ${this.filters.rating === 0 ? 'checked' : ''}>
                                All Ratings
                            </label>
                        </div>
                    </div>
                    
                    <div class="filter-group">
                        <label class="checkbox-label">
                            <input type="checkbox" ${this.filters.inStock ? 'checked' : ''} onchange="searchSystem.toggleInStock()">
                            In Stock Only
                        </label>
                    </div>
                </div>
                <div class="filters-actions">
                    <button class="clear-filters-btn" onclick="searchSystem.clearFilters()">Clear All</button>
                    <button class="apply-filters-btn" onclick="searchSystem.applyFilters()">Apply Filters</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup filter listeners
        modal.querySelectorAll('input[name="category"]').forEach(input => {
            input.addEventListener('change', () => {
                this.filters.category = input.value;
            });
        });

        modal.querySelectorAll('input[name="rating"]').forEach(input => {
            input.addEventListener('change', () => {
                this.filters.rating = parseInt(input.value);
            });
        });

        // Animate modal
        gsap.from('.filters-container', {
            duration: 0.4,
            x: 300,
            opacity: 0,
            ease: 'power3.out'
        });
    }

    updatePriceRange() {
        const minInput = document.getElementById('price-min');
        const maxInput = document.getElementById('price-max');
        const minLabel = document.getElementById('price-min-label');
        const maxLabel = document.getElementById('price-max-label');

        if (minInput && maxInput) {
            let min = parseInt(minInput.value);
            let max = parseInt(maxInput.value);

            if (min > max) {
                min = max;
                minInput.value = min;
            }

            this.filters.priceRange = [min, max];
            if (minLabel) minLabel.textContent = min;
            if (maxLabel) maxLabel.textContent = max;
        }
    }

    toggleInStock() {
        this.filters.inStock = !this.filters.inStock;
    }

    applyFilters() {
        this.updateFilterCount();
        this.performSearch();
        document.querySelector('.filters-modal').remove();
    }

    clearFilters() {
        this.filters = {
            category: 'all',
            priceRange: [0, 500],
            rating: 0,
            inStock: false
        };
        this.updateFilterCount();
        this.performSearch();
        document.querySelector('.filters-modal').remove();
    }

    updateFilterCount() {
        let count = 0;
        if (this.filters.category !== 'all') count++;
        if (this.filters.priceRange[0] > 0 || this.filters.priceRange[1] < 500) count++;
        if (this.filters.rating > 0) count++;
        if (this.filters.inStock) count++;

        const filterCount = document.getElementById('filter-count');
        if (filterCount) {
            if (count > 0) {
                filterCount.textContent = count;
                filterCount.style.display = 'inline';
            } else {
                filterCount.style.display = 'none';
            }
        }
    }

    updateSort(sortValue) {
        this.sortBy = sortValue;
        this.performSearch();
    }

    clearSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        this.clearFilters();
    }
}

// Initialize search system
const searchSystem = new SearchSystem();
