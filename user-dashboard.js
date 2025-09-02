// User Dashboard System for CalisVerse
class UserDashboard {
    constructor() {
        this.init();
    }

    init() {
        // Dashboard will be initialized when needed
    }

    show() {
        if (!userAuth.currentUser) {
            userAuth.showLoginModal();
            return;
        }

        const dashboard = document.createElement('div');
        dashboard.className = 'dashboard-modal';
        dashboard.innerHTML = `
            <div class="dashboard-overlay" onclick="this.parentElement.remove()"></div>
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <h2>My Dashboard</h2>
                    <button class="close-dashboard" onclick="this.closest('.dashboard-modal').remove()">×</button>
                </div>
                <div class="dashboard-content">
                    <div class="dashboard-sidebar">
                        <div class="user-info">
                            <div class="user-avatar-large">${userAuth.currentUser.avatar}</div>
                            <h3>${userAuth.currentUser.name}</h3>
                            <p>${userAuth.currentUser.email}</p>
                        </div>
                        <nav class="dashboard-nav">
                            <a href="#" class="nav-item active" onclick="userDashboard.showOverview()">Overview</a>
                            <a href="#" class="nav-item" onclick="userDashboard.showOrderHistory()">Orders</a>
                            <a href="#" class="nav-item" onclick="userDashboard.showWishlist()">Wishlist</a>
                            <a href="#" class="nav-item" onclick="userDashboard.showProfile()">Profile</a>
                        </nav>
                    </div>
                    <div class="dashboard-main" id="dashboard-main">
                        ${this.getOverviewHTML()}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(dashboard);

        // Animate dashboard
        gsap.from('.dashboard-container', {
            duration: 0.5,
            scale: 0.95,
            opacity: 0,
            ease: 'power3.out'
        });
    }

    getOverviewHTML() {
        const user = userAuth.currentUser;
        const totalOrders = user.orders.length;
        const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
        const wishlistCount = user.wishlist.length;

        return `
            <div class="dashboard-overview">
                <h3>Welcome back, ${user.name}!</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📦</div>
                        <div class="stat-info">
                            <div class="stat-number">${totalOrders}</div>
                            <div class="stat-label">Total Orders</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-info">
                            <div class="stat-number">$${totalSpent.toFixed(2)}</div>
                            <div class="stat-label">Total Spent</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">❤️</div>
                        <div class="stat-info">
                            <div class="stat-number">${wishlistCount}</div>
                            <div class="stat-label">Wishlist Items</div>
                        </div>
                    </div>
                </div>
                
                <div class="recent-activity">
                    <h4>Recent Activity</h4>
                    ${this.getRecentActivityHTML()}
                </div>
            </div>
        `;
    }

    getRecentActivityHTML() {
        const user = userAuth.currentUser;
        const recentOrders = user.orders.slice(0, 3);

        if (recentOrders.length === 0) {
            return `
                <div class="no-activity">
                    <p>No recent orders. Start shopping to see your activity here!</p>
                    <button class="browse-btn" onclick="document.querySelector('.dashboard-modal').remove(); scrollToProducts()">
                        Browse Products
                    </button>
                </div>
            `;
        }

        return `
            <div class="activity-list">
                ${recentOrders.map(order => `
                    <div class="activity-item">
                        <div class="activity-icon">📦</div>
                        <div class="activity-info">
                            <div class="activity-title">Order ${order.id}</div>
                            <div class="activity-date">${this.formatDate(order.date)}</div>
                        </div>
                        <div class="activity-amount">$${order.total.toFixed(2)}</div>
                        <div class="activity-status status-${order.status.toLowerCase()}">${order.status}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showOrderHistory() {
        this.setActiveNav('Orders');
        const user = userAuth.currentUser;
        
        document.getElementById('dashboard-main').innerHTML = `
            <div class="order-history">
                <h3>Order History</h3>
                ${user.orders.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-icon">📦</div>
                        <h4>No orders yet</h4>
                        <p>When you place your first order, it will appear here.</p>
                        <button class="browse-btn" onclick="document.querySelector('.dashboard-modal').remove(); scrollToProducts()">
                            Start Shopping
                        </button>
                    </div>
                ` : `
                    <div class="orders-list">
                        ${user.orders.map(order => this.getOrderHTML(order)).join('')}
                    </div>
                `}
            </div>
        `;
    }

    getOrderHTML(order) {
        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Order ${order.id}</h4>
                        <p>Placed on ${this.formatDate(order.date)}</p>
                    </div>
                    <div class="order-status">
                        <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
                        <div class="order-total">$${order.total.toFixed(2)}</div>
                    </div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <div class="item-info">
                                <span class="item-name">${item.name}</span>
                                <span class="item-details">Color: ${store.getColorName(item.color)} × ${item.quantity}</span>
                            </div>
                            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-actions">
                    <button class="btn-secondary" onclick="userDashboard.trackOrder('${order.id}')">Track Order</button>
                    <button class="btn-secondary" onclick="userDashboard.reorderItems('${order.id}')">Reorder</button>
                </div>
            </div>
        `;
    }

    showWishlist() {
        this.setActiveNav('Wishlist');
        const user = userAuth.currentUser;
        
        document.getElementById('dashboard-main').innerHTML = `
            <div class="wishlist">
                <h3>My Wishlist</h3>
                ${user.wishlist.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-icon">❤️</div>
                        <h4>Your wishlist is empty</h4>
                        <p>Save items you love to buy them later.</p>
                        <button class="browse-btn" onclick="document.querySelector('.dashboard-modal').remove(); scrollToProducts()">
                            Browse Products
                        </button>
                    </div>
                ` : `
                    <div class="wishlist-grid">
                        ${user.wishlist.map(item => this.getWishlistItemHTML(item)).join('')}
                    </div>
                `}
            </div>
        `;
    }

    getWishlistItemHTML(item) {
        return `
            <div class="wishlist-item">
                <div class="wishlist-item-info">
                    <h4>${item.name}</h4>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                    <p class="date-added">Added ${this.formatDate(item.dateAdded)}</p>
                </div>
                <div class="wishlist-actions">
                    <button class="btn-primary" onclick="userDashboard.addWishlistToCart('${item.id}')">
                        Add to Cart
                    </button>
                    <button class="btn-remove" onclick="userDashboard.removeFromWishlist('${item.id}')">
                        Remove
                    </button>
                </div>
            </div>
        `;
    }

    showProfile() {
        this.setActiveNav('Profile');
        const user = userAuth.currentUser;
        
        document.getElementById('dashboard-main').innerHTML = `
            <div class="profile">
                <h3>Profile Settings</h3>
                <form class="profile-form" onsubmit="userDashboard.updateProfile(event)">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value="${user.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value="${user.email}" required>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" value="${user.phone || ''}" placeholder="Enter your phone number">
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <textarea name="address" rows="3" placeholder="Enter your address">${user.address || ''}</textarea>
                    </div>
                    <div class="profile-actions">
                        <button type="submit" class="btn-primary">Update Profile</button>
                        <button type="button" class="btn-secondary" onclick="userDashboard.changePassword()">
                            Change Password
                        </button>
                    </div>
                </form>
                
                <div class="danger-zone">
                    <h4>Danger Zone</h4>
                    <p>Once you delete your account, there is no going back.</p>
                    <button class="btn-danger" onclick="userDashboard.deleteAccount()">
                        Delete Account
                    </button>
                </div>
            </div>
        `;
    }

    setActiveNav(section) {
        document.querySelectorAll('.dashboard-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const navItems = document.querySelectorAll('.dashboard-nav .nav-item');
        const sectionMap = { 'Overview': 0, 'Orders': 1, 'Wishlist': 2, 'Profile': 3 };
        if (navItems[sectionMap[section]]) {
            navItems[sectionMap[section]].classList.add('active');
        }
    }

    showOverview() {
        this.setActiveNav('Overview');
        document.getElementById('dashboard-main').innerHTML = this.getOverviewHTML();
    }

    updateProfile(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        userAuth.currentUser.name = formData.get('name');
        userAuth.currentUser.email = formData.get('email');
        userAuth.currentUser.phone = formData.get('phone');
        userAuth.currentUser.address = formData.get('address');
        
        userAuth.saveUser(userAuth.currentUser);
        store.showNotification('Profile updated successfully!');
    }

    changePassword() {
        store.showNotification('Password change functionality would be implemented with backend API');
    }

    deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            userAuth.logout();
            document.querySelector('.dashboard-modal').remove();
            store.showNotification('Account deleted successfully');
        }
    }

    trackOrder(orderId) {
        store.showNotification(`Tracking information for order ${orderId} would be displayed here`);
    }

    reorderItems(orderId) {
        const user = userAuth.currentUser;
        const order = user.orders.find(o => o.id === orderId);
        
        if (order) {
            // Add all items from the order to cart
            order.items.forEach(item => {
                store.addToCart(item.id, item.name, item.price, item.color);
            });
            
            document.querySelector('.dashboard-modal').remove();
            store.showNotification('Items added to cart!');
            toggleCart();
        }
    }

    addWishlistToCart(itemId) {
        const user = userAuth.currentUser;
        const item = user.wishlist.find(w => w.id === itemId);
        
        if (item) {
            store.addToCart(item.id, item.name, item.price);
            store.showNotification('Added to cart!');
        }
    }

    removeFromWishlist(itemId) {
        userAuth.removeFromWishlist(itemId);
        this.showWishlist(); // Refresh wishlist display
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

// Initialize user dashboard
const userDashboard = new UserDashboard();
