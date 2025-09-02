// User Authentication System for CalisVerse
class UserAuth {
    constructor() {
        this.currentUser = this.loadUser();
        this.init();
    }

    init() {
        this.updateAuthUI();
        this.setupAuthListeners();
    }

    loadUser() {
        const stored = localStorage.getItem('calisverse-user');
        return stored ? JSON.parse(stored) : null;
    }

    saveUser(user) {
        localStorage.setItem('calisverse-user', JSON.stringify(user));
        this.currentUser = user;
        this.updateAuthUI();
    }

    logout() {
        localStorage.removeItem('calisverse-user');
        this.currentUser = null;
        this.updateAuthUI();
        store.showNotification('Logged out successfully');
    }

    updateAuthUI() {
        const authContainer = document.querySelector('.auth-container');
        if (!authContainer) return;

        if (this.currentUser) {
            authContainer.innerHTML = `
                <div class="user-menu">
                    <button class="user-btn" onclick="userAuth.toggleUserMenu()">
                        <span class="user-avatar">${this.currentUser.name.charAt(0).toUpperCase()}</span>
                        <span class="user-name">${this.currentUser.name}</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="user-dropdown" id="user-dropdown">
                        <a href="#" onclick="userAuth.showDashboard()">Dashboard</a>
                        <a href="#" onclick="userAuth.showOrderHistory()">Order History</a>
                        <a href="#" onclick="userAuth.showWishlist()">Wishlist</a>
                        <a href="#" onclick="userAuth.showProfile()">Profile</a>
                        <hr>
                        <a href="#" onclick="userAuth.logout()">Logout</a>
                    </div>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <button class="login-btn" onclick="userAuth.showLoginModal()">Login</button>
                <button class="signup-btn" onclick="userAuth.showSignupModal()">Sign Up</button>
            `;
        }
    }

    setupAuthListeners() {
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const userMenu = document.querySelector('.user-menu');
            const dropdown = document.getElementById('user-dropdown');
            
            if (userMenu && !userMenu.contains(e.target) && dropdown) {
                dropdown.classList.remove('active');
            }
        });
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-overlay" onclick="this.parentElement.remove()"></div>
            <div class="auth-container-modal">
                <div class="auth-header">
                    <h2>Welcome Back</h2>
                    <button class="close-auth" onclick="this.closest('.auth-modal').remove()">×</button>
                </div>
                <form class="auth-form" onsubmit="userAuth.handleLogin(event)">
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" required placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required placeholder="Enter your password">
                    </div>
                    <button type="submit" class="auth-submit-btn">Sign In</button>
                    <div class="auth-divider">
                        <span>or</span>
                    </div>
                    <button type="button" class="social-btn google-btn" onclick="userAuth.socialLogin('google')">
                        <span>🔍</span> Continue with Google
                    </button>
                    <button type="button" class="social-btn facebook-btn" onclick="userAuth.socialLogin('facebook')">
                        <span>📘</span> Continue with Facebook
                    </button>
                    <div class="auth-switch">
                        Don't have an account? 
                        <a href="#" onclick="userAuth.switchToSignup()">Sign up</a>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animate modal
        gsap.from('.auth-container-modal', {
            duration: 0.5,
            scale: 0.9,
            opacity: 0,
            ease: 'power3.out'
        });
    }

    showSignupModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-overlay" onclick="this.parentElement.remove()"></div>
            <div class="auth-container-modal">
                <div class="auth-header">
                    <h2>Create Account</h2>
                    <button class="close-auth" onclick="this.closest('.auth-modal').remove()">×</button>
                </div>
                <form class="auth-form" onsubmit="userAuth.handleSignup(event)">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" required placeholder="Enter your full name">
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" required placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required placeholder="Create a password">
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" required placeholder="Confirm your password">
                    </div>
                    <button type="submit" class="auth-submit-btn">Create Account</button>
                    <div class="auth-divider">
                        <span>or</span>
                    </div>
                    <button type="button" class="social-btn google-btn" onclick="userAuth.socialLogin('google')">
                        <span>🔍</span> Continue with Google
                    </button>
                    <button type="button" class="social-btn facebook-btn" onclick="userAuth.socialLogin('facebook')">
                        <span>📘</span> Continue with Facebook
                    </button>
                    <div class="auth-switch">
                        Already have an account? 
                        <a href="#" onclick="userAuth.switchToLogin()">Sign in</a>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animate modal
        gsap.from('.auth-container-modal', {
            duration: 0.5,
            scale: 0.9,
            opacity: 0,
            ease: 'power3.out'
        });
    }

    switchToLogin() {
        document.querySelector('.auth-modal').remove();
        this.showLoginModal();
    }

    switchToSignup() {
        document.querySelector('.auth-modal').remove();
        this.showSignupModal();
    }

    handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        // Simulate login (in production, this would be an API call)
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Demo login - accept any email/password
        const user = {
            id: Date.now(),
            name: email.split('@')[0],
            email: email,
            avatar: email.charAt(0).toUpperCase(),
            joinDate: new Date().toISOString(),
            orders: [],
            wishlist: []
        };
        
        this.saveUser(user);
        document.querySelector('.auth-modal').remove();
        store.showNotification(`Welcome back, ${user.name}!`);
    }

    handleSignup(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        if (password !== confirmPassword) {
            store.showNotification('Passwords do not match!');
            return;
        }
        
        // Simulate signup
        const user = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            avatar: formData.get('name').charAt(0).toUpperCase(),
            joinDate: new Date().toISOString(),
            orders: [],
            wishlist: []
        };
        
        this.saveUser(user);
        document.querySelector('.auth-modal').remove();
        store.showNotification(`Welcome to CalisVerse, ${user.name}!`);
    }

    socialLogin(provider) {
        // Simulate social login
        const user = {
            id: Date.now(),
            name: `${provider} User`,
            email: `user@${provider}.com`,
            avatar: provider.charAt(0).toUpperCase(),
            joinDate: new Date().toISOString(),
            orders: [],
            wishlist: []
        };
        
        this.saveUser(user);
        document.querySelector('.auth-modal').remove();
        store.showNotification(`Signed in with ${provider}!`);
    }

    showDashboard() {
        this.toggleUserMenu();
        userDashboard.show();
    }

    showOrderHistory() {
        this.toggleUserMenu();
        userDashboard.showOrderHistory();
    }

    showWishlist() {
        this.toggleUserMenu();
        userDashboard.showWishlist();
    }

    showProfile() {
        this.toggleUserMenu();
        userDashboard.showProfile();
    }

    addToWishlist(productId, productName, price) {
        if (!this.currentUser) {
            this.showLoginModal();
            return;
        }

        const existingItem = this.currentUser.wishlist.find(item => item.id === productId);
        if (existingItem) {
            store.showNotification('Item already in wishlist!');
            return;
        }

        this.currentUser.wishlist.push({
            id: productId,
            name: productName,
            price: price,
            dateAdded: new Date().toISOString()
        });

        this.saveUser(this.currentUser);
        store.showNotification('Added to wishlist!');
    }

    removeFromWishlist(productId) {
        if (!this.currentUser) return;

        this.currentUser.wishlist = this.currentUser.wishlist.filter(item => item.id !== productId);
        this.saveUser(this.currentUser);
        store.showNotification('Removed from wishlist');
    }

    addOrder(orderData) {
        if (!this.currentUser) return;

        const order = {
            id: 'CV-' + Date.now(),
            date: new Date().toISOString(),
            items: [...store.cart],
            total: store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'Processing',
            ...orderData
        };

        this.currentUser.orders.unshift(order);
        this.saveUser(this.currentUser);
    }
}

// Initialize user authentication
const userAuth = new UserAuth();
