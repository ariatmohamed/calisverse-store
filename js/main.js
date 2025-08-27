// CalisVerse - Professional 3D Calisthenics Equipment Platform
// Advanced 3D E-commerce Website with Realistic Equipment Models

class CalisVerse {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.currentProduct = null;
        this.cart = [];
        this.userLevel = 'beginner';
        this.products = {
            // Pull-Up Equipment
            'pullup-bar': { name: 'Professional Pull-up Bar', price: 79.99, category: 'pullup' },
            'doorway-pullup': { name: 'Doorway Pull-up Bar', price: 39.99, category: 'pullup' },
            'wall-mounted-pullup': { name: 'Wall-Mounted Pull-up Bar', price: 129.99, category: 'pullup' },
            'freestanding-station': { name: 'Freestanding Pull-up Station', price: 299.99, category: 'pullup' },
            'power-tower': { name: 'Power Tower Station', price: 399.99, category: 'pullup' },
            
            // Gymnastics & Ring Equipment
            'rings': { name: 'Wooden Gymnastic Rings', price: 49.99, category: 'rings' },
            'plastic-rings': { name: 'Plastic Gymnastic Rings', price: 34.99, category: 'rings' },
            'suspension-trainer': { name: 'Suspension Trainer', price: 149.99, category: 'rings' },
            'battle-ropes': { name: 'Battle Ropes', price: 89.99, category: 'rings' },
            
            // Parallel Bars & Dip Equipment
            'parallettes': { name: 'Wooden Parallette Bars', price: 89.99, category: 'parallel' },
            'metal-parallettes': { name: 'Metal Parallette Bars', price: 79.99, category: 'parallel' },
            'dip-station': { name: 'Dip Station', price: 159.99, category: 'parallel' },
            'push-up-handles': { name: 'Push-up Handles', price: 24.99, category: 'parallel' },
            
            // Resistance & Assistance Equipment
            'resistance-bands': { name: 'Resistance Band Set', price: 29.99, category: 'resistance' },
            'assistance-bands': { name: 'Pull-up Assistance Bands', price: 39.99, category: 'resistance' },
            'loop-bands': { name: 'Loop Resistance Bands', price: 19.99, category: 'resistance' },
            'tube-bands': { name: 'Tube Resistance Bands', price: 34.99, category: 'resistance' },
            
            // Weight & Loading Equipment
            'weighted-vest': { name: 'Weighted Training Vest', price: 89.99, category: 'weight' },
            'dip-belt': { name: 'Dip Belt', price: 29.99, category: 'weight' },
            'ankle-weights': { name: 'Ankle Weights', price: 24.99, category: 'weight' },
            'weighted-chains': { name: 'Weighted Chains', price: 59.99, category: 'weight' },
            
            // Grip & Hand Equipment
            'gymnastics-grips': { name: 'Gymnastics Grips', price: 19.99, category: 'grip' },
            'liquid-chalk': { name: 'Liquid Chalk', price: 12.99, category: 'grip' },
            'fat-grips': { name: 'Fat Grips', price: 29.99, category: 'grip' },
            'wrist-wraps': { name: 'Wrist Wraps', price: 16.99, category: 'grip' },
            
            // Floor & Mat Equipment
            'exercise-mat': { name: 'Exercise Mat', price: 39.99, category: 'floor' },
            'yoga-mat': { name: 'Yoga Mat', price: 29.99, category: 'floor' },
            'thick-mat': { name: 'Thick Training Mat', price: 79.99, category: 'floor' },
            'balance-pad': { name: 'Balance Pad', price: 24.99, category: 'floor' },
            
            // Specialized Training Tools
            'steel-mace': { name: 'Steel Mace', price: 89.99, category: 'specialized' },
            'kettlebell': { name: 'Kettlebell', price: 49.99, category: 'specialized' },
            'medicine-ball': { name: 'Medicine Ball', price: 39.99, category: 'specialized' },
            'jump-rope': { name: 'Speed Jump Rope', price: 19.99, category: 'specialized' },
            
            // Flexibility & Mobility Tools
            'foam-roller': { name: 'Foam Roller', price: 34.99, category: 'mobility' },
            'massage-ball': { name: 'Massage Ball', price: 14.99, category: 'mobility' },
            'stretching-strap': { name: 'Stretching Strap', price: 19.99, category: 'mobility' }
        };
        
        this.init();
    }

    init() {
        this.setupLoading();
        this.setup3D();
        this.setupEventListeners();
        this.loadInitialProduct();
        this.setupCart();
    }

    setupLoading() {
        let progress = 0;
        const progressBar = document.getElementById('loading-progress');
        const loadingScreen = document.getElementById('loading-screen');
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 200);
    }

    setup3D() {
        const container = document.getElementById('product-3d-container');
        if (!container) return;

        // Scene setup with professional environment
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0f);

        // Camera setup with better positioning
        this.camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(3, 2, 5);

        // Advanced renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        container.appendChild(this.renderer.domElement);

        // Enhanced controls
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.minDistance = 2;
            this.controls.maxDistance = 10;
            this.controls.maxPolarAngle = Math.PI / 1.8;
        }

        // Professional lighting setup
        this.setupAdvancedLighting();

        // Add environment
        this.createEnvironment();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start render loop
        this.animate();
    }

    setupAdvancedLighting() {
        // Professional dramatic lighting inspired by Suzuki motorcycle reference
        
        // Low ambient for dramatic shadows
        const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.2);
        this.scene.add(ambientLight);

        // Strong key light (main directional)
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(8, 6, 4);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 4096;
        keyLight.shadow.mapSize.height = 4096;
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 50;
        keyLight.shadow.camera.left = -10;
        keyLight.shadow.camera.right = 10;
        keyLight.shadow.camera.top = 10;
        keyLight.shadow.camera.bottom = -10;
        keyLight.shadow.bias = -0.0001;
        this.scene.add(keyLight);

        // Blue accent rim light (signature Suzuki style)
        const rimLight = new THREE.DirectionalLight(0x4169E1, 0.8);
        rimLight.position.set(-6, 2, -4);
        this.scene.add(rimLight);

        // Blue fill light for depth
        const fillLight = new THREE.DirectionalLight(0x1E90FF, 0.4);
        fillLight.position.set(2, -3, 6);
        this.scene.add(fillLight);

        // Top light for material definition
        const topLight = new THREE.DirectionalLight(0xffffff, 0.3);
        topLight.position.set(0, 10, 0);
        this.scene.add(topLight);

        // Hemisphere light for environment
        const hemiLight = new THREE.HemisphereLight(0x4169E1, 0x0a0a0f, 0.3);
        this.scene.add(hemiLight);
    }

    createEnvironment() {
        // Professional reflective floor
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x0a0a0f,
            metalness: 0.1,
            roughness: 0.8,
            transparent: true,
            opacity: 0.3
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    loadInitialProduct() {
        this.createAdvancedPullUpBar();
    }

    createAdvancedPullUpBar() {
        if (this.currentProduct) {
            this.scene.remove(this.currentProduct);
        }

        const group = new THREE.Group();

        // Main horizontal bar with premium materials
        const barGeometry = new THREE.CylinderGeometry(0.025, 0.025, 1.2, 32);
        const barMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2c2c2c,
            metalness: 0.95,
            roughness: 0.05,
            clearcoat: 1.0,
            clearcoatRoughness: 0.02,
            reflectivity: 0.9,
            envMapIntensity: 2.0,
            emissive: 0x001122,
            emissiveIntensity: 0.1
        });
        const mainBar = new THREE.Mesh(barGeometry, barMaterial);
        mainBar.rotation.z = Math.PI / 2;
        mainBar.position.y = 0.8;
        mainBar.castShadow = true;
        group.add(mainBar);

        // Vertical support posts with enhanced materials
        const postGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.6, 16);
        const postMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2c2c2c,
            metalness: 0.9,
            roughness: 0.1,
            clearcoat: 0.8,
            clearcoatRoughness: 0.05,
            emissive: 0x000811,
            emissiveIntensity: 0.05
        });
        
        const leftPost = new THREE.Mesh(postGeometry, postMaterial);
        leftPost.position.set(-0.5, 0, 0);
        leftPost.castShadow = true;
        group.add(leftPost);

        const rightPost = new THREE.Mesh(postGeometry, postMaterial);
        rightPost.position.set(0.5, 0, 0);
        rightPost.castShadow = true;
        group.add(rightPost);

        // Base plates for stability
        const baseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
        const baseMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a202c,
            metalness: 0.7,
            roughness: 0.3
        });
        
        const leftBase = new THREE.Mesh(baseGeometry, baseMaterial);
        leftBase.position.set(-0.5, -0.8, 0);
        leftBase.castShadow = true;
        group.add(leftBase);

        const rightBase = new THREE.Mesh(baseGeometry, baseMaterial);
        rightBase.position.set(0.5, -0.8, 0);
        rightBase.castShadow = true;
        group.add(rightBase);

        // Grip areas with texture
        const gripGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 16);
        const gripMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a202c,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Add grip texture
        const textureLoader = new THREE.TextureLoader();
        
        const leftGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        leftGrip.position.set(-0.3, 0.8, 0);
        leftGrip.rotation.z = Math.PI / 2;
        group.add(leftGrip);

        const rightGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        rightGrip.position.set(0.3, 0.8, 0);
        rightGrip.rotation.z = Math.PI / 2;
        group.add(rightGrip);

        // Connecting brackets
        const bracketGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.06);
        const bracketMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const leftBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
        leftBracket.position.set(-0.5, 0.75, 0);
        leftBracket.castShadow = true;
        group.add(leftBracket);

        const rightBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
        rightBracket.position.set(0.5, 0.75, 0);
        rightBracket.castShadow = true;
        group.add(rightBracket);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createGymnasticRings() {
        if (this.currentProduct) {
            this.scene.remove(this.currentProduct);
        }

        const group = new THREE.Group();

        // Straps
        const strapGeometry = new THREE.BoxGeometry(0.02, 1.5, 0.005);
        const strapMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        leftStrap.position.set(-0.3, 0.3, 0);
        group.add(leftStrap);

        const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        rightStrap.position.set(0.3, 0.3, 0);
        group.add(rightStrap);

        // Rings
        const ringGeometry = new THREE.TorusGeometry(0.12, 0.015, 8, 32);
        const ringMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x8B4513,
            roughness: 0.7,
            metalness: 0.0
        });
        
        const leftRing = new THREE.Mesh(ringGeometry, ringMaterial);
        leftRing.position.set(-0.3, -0.4, 0);
        leftRing.castShadow = true;
        group.add(leftRing);

        const rightRing = new THREE.Mesh(ringGeometry, ringMaterial);
        rightRing.position.set(0.3, -0.4, 0);
        rightRing.castShadow = true;
        group.add(rightRing);

        // Buckles
        const buckleGeometry = new THREE.BoxGeometry(0.04, 0.06, 0.01);
        const buckleMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const leftBuckle = new THREE.Mesh(buckleGeometry, buckleMaterial);
        leftBuckle.position.set(-0.3, 0.8, 0);
        group.add(leftBuckle);

        const rightBuckle = new THREE.Mesh(buckleGeometry, buckleMaterial);
        rightBuckle.position.set(0.3, 0.8, 0);
        group.add(rightBuckle);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createParallettes() {
        if (this.currentProduct) {
            this.scene.remove(this.currentProduct);
        }

        const group = new THREE.Group();

        // Handles
        const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 16);
        const handleMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.position.set(-0.25, 0.15, 0);
        leftHandle.rotation.z = Math.PI / 2;
        leftHandle.castShadow = true;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.position.set(0.25, 0.15, 0);
        rightHandle.rotation.z = Math.PI / 2;
        rightHandle.castShadow = true;
        group.add(rightHandle);

        // Support legs
        const legGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.3, 12);
        const legMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.7,
            roughness: 0.3
        });
        
        // Left parallette legs
        const leftLeg1 = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg1.position.set(-0.4, -0.05, 0.1);
        group.add(leftLeg1);

        const leftLeg2 = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg2.position.set(-0.4, -0.05, -0.1);
        group.add(leftLeg2);

        const leftLeg3 = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg3.position.set(-0.1, -0.05, 0.1);
        group.add(leftLeg3);

        const leftLeg4 = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg4.position.set(-0.1, -0.05, -0.1);
        group.add(leftLeg4);

        // Right parallette legs
        const rightLeg1 = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg1.position.set(0.1, -0.05, 0.1);
        group.add(rightLeg1);

        const rightLeg2 = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg2.position.set(0.1, -0.05, -0.1);
        group.add(rightLeg2);

        const rightLeg3 = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg3.position.set(0.4, -0.05, 0.1);
        group.add(rightLeg3);

        const rightLeg4 = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg4.position.set(0.4, -0.05, -0.1);
        group.add(rightLeg4);

        this.currentProduct = group;
        this.scene.add(group);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Hero buttons
        const startJourneyBtn = document.getElementById('start-journey-btn');
        if (startJourneyBtn) {
            startJourneyBtn.addEventListener('click', () => {
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            });
        }

        const exploreProductsBtn = document.getElementById('explore-products-btn');
        if (exploreProductsBtn) {
            exploreProductsBtn.addEventListener('click', () => {
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Product navigation buttons
        this.setupProductNavigation();

        // 3D Controls
        const resetViewBtn = document.getElementById('reset-view-btn');
        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => {
                this.resetCameraView();
            });
        }

        // Cart functionality
        const cartBtn = document.getElementById('cart-btn');
        const closeCartBtn = document.getElementById('close-cart-btn');
        const cartOverlay = document.getElementById('cart-overlay');
        const addToCartBtn = document.getElementById('add-to-cart-btn');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.toggleCart());
        }
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => this.closeCart());
        }
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.addToCart());
        }
    }

    setupProductNavigation() {
        // Add comprehensive product navigation with categories
        const productSection = document.getElementById('products');
        if (productSection) {
            const navHTML = `
                <!-- Category Navigation -->
                <div class="mb-8">
                    <h3 class="text-2xl font-bold text-center mb-6">Equipment Categories</h3>
                    <div class="flex justify-center flex-wrap gap-3 mb-6">
                        <button class="category-btn bg-primary text-white px-4 py-2 rounded-lg text-sm transition-all" data-category="pullup">
                            Pull-up Equipment
                        </button>
                        <button class="category-btn bg-white hover:bg-primary hover:text-white border-2 border-primary text-primary px-4 py-2 rounded-lg text-sm transition-all" data-category="rings">
                            Rings & Suspension
                        </button>
                        <button class="category-btn bg-white hover:bg-primary hover:text-white border-2 border-primary text-primary px-4 py-2 rounded-lg text-sm transition-all" data-category="parallel">
                            Parallel & Dip Bars
                        </button>
                        <button class="category-btn bg-white hover:bg-primary hover:text-white border-2 border-primary text-primary px-4 py-2 rounded-lg text-sm transition-all" data-category="resistance">
                            Resistance Equipment
                        </button>
                        <button class="category-btn bg-white hover:bg-primary hover:text-white border-2 border-primary text-primary px-4 py-2 rounded-lg text-sm transition-all" data-category="weight">
                            Weight & Loading
                        </button>
                        <button class="category-btn bg-white hover:bg-primary hover:text-white border-2 border-primary text-primary px-4 py-2 rounded-lg text-sm transition-all" data-category="grip">
                            Grip & Hand
                        </button>
                        <button class="category-btn bg-white hover:bg-primary hover:text-white border-2 border-primary text-primary px-4 py-2 rounded-lg text-sm transition-all" data-category="floor">
                            Floor & Mats
                        </button>
                        <button class="category-btn bg-white hover:bg-primary hover:text-white border-2 border-primary text-primary px-4 py-2 rounded-lg text-sm transition-all" data-category="specialized">
                            Specialized Tools
                        </button>
                        <button class="category-btn bg-white hover:bg-primary hover:text-white border-2 border-primary text-primary px-4 py-2 rounded-lg text-sm transition-all" data-category="mobility">
                            Mobility Tools
                        </button>
                    </div>
                </div>
                
                <!-- Product Navigation -->
                <div id="product-nav-container" class="flex justify-center flex-wrap gap-2 mb-6">
                    <!-- Products will be populated based on selected category -->
                </div>
            `;
            
            productSection.insertAdjacentHTML('beforeend', navHTML);
            
            // Setup category navigation
            this.setupCategoryNavigation();
            
            // Load initial category (pullup)
            this.loadCategoryProducts('pullup');
        }
    }

    setupCategoryNavigation() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.loadCategoryProducts(category);
                
                // Update active category button
                document.querySelectorAll('.category-btn').forEach(b => {
                    b.className = 'category-btn bg-white hover:bg-primary hover:text-white border-2 border-primary text-primary px-4 py-2 rounded-lg text-sm transition-all';
                });
                e.target.className = 'category-btn bg-primary text-white px-4 py-2 rounded-lg text-sm transition-all';
            });
        });
    }

    loadCategoryProducts(category) {
        const container = document.getElementById('product-nav-container');
        if (!container) return;

        // Filter products by category
        const categoryProducts = Object.entries(this.products).filter(([key, product]) => 
            product.category === category
        );

        // Generate product buttons
        const productButtons = categoryProducts.map(([key, product], index) => {
            const isFirst = index === 0;
            const activeClass = isFirst ? 'bg-primary text-white' : 'bg-white hover:bg-primary hover:text-white border-2 border-primary text-primary';
            return `
                <button class="product-nav-btn ${activeClass} px-3 py-2 rounded-lg text-sm transition-all" data-product="${key}">
                    ${product.name}
                </button>
            `;
        }).join('');

        container.innerHTML = productButtons;

        // Add event listeners to product buttons
        container.querySelectorAll('.product-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productType = e.target.dataset.product;
                this.switchProduct(productType);
                
                // Update active product button
                container.querySelectorAll('.product-nav-btn').forEach(b => {
                    b.className = 'product-nav-btn bg-white hover:bg-primary hover:text-white border-2 border-primary text-primary px-3 py-2 rounded-lg text-sm transition-all';
                });
                e.target.className = 'product-nav-btn bg-primary text-white px-3 py-2 rounded-lg text-sm transition-all';
            });
        });

        // Load first product in category
        if (categoryProducts.length > 0) {
            this.switchProduct(categoryProducts[0][0]);
        }
    }

    switchProduct(productType) {
        const productInfo = this.products[productType];
        if (!productInfo) return;

        // Update product info
        document.getElementById('product-title').textContent = productInfo.name;
        document.getElementById('product-price').textContent = `$${productInfo.price}`;
        
        // Update description based on product
        const descriptions = {
            // Pull-up Equipment
            'pullup-bar': 'Professional-grade pull-up bar made from stainless steel, suitable for all training levels',
            'doorway-pullup': 'Convenient doorway pull-up bar that requires no permanent installation',
            'wall-mounted-pullup': 'Heavy-duty wall-mounted pull-up bar for serious training',
            'freestanding-station': 'Complete freestanding pull-up station with multiple grip positions',
            'power-tower': 'Multi-functional power tower for pull-ups, dips, and more',
            
            // Rings & Suspension
            'rings': 'Olympic-style wooden gymnastic rings with adjustable straps',
            'plastic-rings': 'Durable plastic gymnastic rings perfect for beginners',
            'suspension-trainer': 'Versatile suspension trainer for full-body workouts',
            'battle-ropes': 'Heavy-duty battle ropes for intense cardio and strength training',
            
            // Parallel & Dip Equipment
            'parallettes': 'Wooden parallette bars perfect for handstands and L-sits',
            'metal-parallettes': 'Durable metal parallette bars with non-slip grips',
            'dip-station': 'Stable dip station for chest and tricep development',
            'push-up-handles': 'Ergonomic push-up handles to reduce wrist strain',
            
            // Resistance Equipment
            'resistance-bands': 'Complete resistance band set with multiple resistance levels',
            'assistance-bands': 'Pull-up assistance bands to help you progress',
            'loop-bands': 'Compact loop resistance bands for targeted exercises',
            'tube-bands': 'Tube resistance bands with comfortable handles',
            
            // Weight & Loading
            'weighted-vest': 'Adjustable weighted vest for progressive overload training',
            'dip-belt': 'Heavy-duty dip belt for adding weight to bodyweight exercises',
            'ankle-weights': 'Comfortable ankle weights for lower body training',
            'weighted-chains': 'Professional weighted chains for advanced training',
            
            // Grip & Hand Equipment
            'gymnastics-grips': 'Professional gymnastics grips for better bar grip',
            'liquid-chalk': 'High-quality liquid chalk for superior grip',
            'fat-grips': 'Fat grips to increase forearm and grip strength',
            'wrist-wraps': 'Supportive wrist wraps for heavy lifting',
            
            // Floor & Mat Equipment
            'exercise-mat': 'High-density exercise mat for floor exercises',
            'yoga-mat': 'Non-slip yoga mat for stretching and flexibility',
            'thick-mat': 'Extra thick training mat for high-impact exercises',
            'balance-pad': 'Unstable balance pad for core and stability training',
            
            // Specialized Tools
            'steel-mace': 'Traditional steel mace for functional strength training',
            'kettlebell': 'Cast iron kettlebell for dynamic strength training',
            'medicine-ball': 'Weighted medicine ball for explosive power training',
            'jump-rope': 'High-speed jump rope for cardio and coordination',
            
            // Mobility Tools
            'foam-roller': 'High-density foam roller for muscle recovery',
            'massage-ball': 'Targeted massage ball for trigger point therapy',
            'stretching-strap': 'Adjustable stretching strap for flexibility training'
        };
        
        document.getElementById('product-description').textContent = descriptions[productType] || 'Professional calisthenics equipment for all training levels';

        // Switch 3D model based on product type
        this.create3DModel(productType);
    }

    create3DModel(productType) {
        // Clear existing product
        if (this.currentProduct) {
            this.scene.remove(this.currentProduct);
        }

        // Create 3D model based on product type
        switch(productType) {
            // Pull-up Equipment
            case 'pullup-bar':
                this.createAdvancedPullUpBar();
                break;
            case 'doorway-pullup':
                this.createDoorwayPullUpBar();
                break;
            case 'wall-mounted-pullup':
                this.createWallMountedPullUpBar();
                break;
            case 'freestanding-station':
                this.createFreestandingStation();
                break;
            case 'power-tower':
                this.createPowerTower();
                break;
                
            // Rings & Suspension
            case 'rings':
                this.createGymnasticRings();
                break;
            case 'plastic-rings':
                this.createPlasticRings();
                break;
            case 'suspension-trainer':
                this.createSuspensionTrainer();
                break;
            case 'battle-ropes':
                this.createBattleRopes();
                break;
                
            // Parallel & Dip Equipment
            case 'parallettes':
                this.createParallettes();
                break;
            case 'metal-parallettes':
                this.createMetalParallettes();
                break;
            case 'dip-station':
                this.createDipStation();
                break;
            case 'push-up-handles':
                this.createPushUpHandles();
                break;
                
            // Resistance Equipment
            case 'resistance-bands':
                this.createResistanceBands();
                break;
            case 'assistance-bands':
                this.createAssistanceBands();
                break;
            case 'loop-bands':
                this.createLoopBands();
                break;
            case 'tube-bands':
                this.createTubeBands();
                break;
                
            // Weight & Loading
            case 'weighted-vest':
                this.createWeightedVest();
                break;
            case 'dip-belt':
                this.createDipBelt();
                break;
            case 'ankle-weights':
                this.createAnkleWeights();
                break;
            case 'weighted-chains':
                this.createWeightedChains();
                break;
                
            // Grip & Hand Equipment
            case 'gymnastics-grips':
                this.createGymnasticsGrips();
                break;
            case 'liquid-chalk':
                this.createLiquidChalk();
                break;
            case 'fat-grips':
                this.createFatGrips();
                break;
            case 'wrist-wraps':
                this.createWristWraps();
                break;
                
            // Floor & Mat Equipment
            case 'exercise-mat':
                this.createExerciseMat();
                break;
            case 'yoga-mat':
                this.createYogaMat();
                break;
            case 'thick-mat':
                this.createThickMat();
                break;
            case 'balance-pad':
                this.createBalancePad();
                break;
                
            // Specialized Tools
            case 'steel-mace':
                this.createSteelMace();
                break;
            case 'kettlebell':
                this.createKettlebell();
                break;
            case 'medicine-ball':
                this.createMedicineBall();
                break;
            case 'jump-rope':
                this.createJumpRope();
                break;
                
            // Mobility Tools
            case 'foam-roller':
                this.createFoamRoller();
                break;
            case 'massage-ball':
                this.createMassageBall();
                break;
            case 'stretching-strap':
                this.createStretchingStrap();
                break;
                
            default:
                this.createAdvancedPullUpBar();
        }
    }

    // PULL-UP EQUIPMENT MODELS
    createDoorwayPullUpBar() {
        const group = new THREE.Group();

        // Main horizontal bar
        const barGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.8, 32);
        const barMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.9,
            roughness: 0.1
        });
        const mainBar = new THREE.Mesh(barGeometry, barMaterial);
        mainBar.rotation.z = Math.PI / 2;
        mainBar.castShadow = true;
        group.add(mainBar);

        // Door frame clamps
        const clampGeometry = new THREE.BoxGeometry(0.15, 0.08, 0.06);
        const clampMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const leftClamp = new THREE.Mesh(clampGeometry, clampMaterial);
        leftClamp.position.set(-0.35, 0, 0);
        group.add(leftClamp);

        const rightClamp = new THREE.Mesh(clampGeometry, clampMaterial);
        rightClamp.position.set(0.35, 0, 0);
        group.add(rightClamp);

        // Foam padding
        const paddingGeometry = new THREE.BoxGeometry(0.12, 0.06, 0.04);
        const paddingMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.9,
            metalness: 0.0
        });
        
        const leftPadding = new THREE.Mesh(paddingGeometry, paddingMaterial);
        leftPadding.position.set(-0.35, 0, 0.05);
        group.add(leftPadding);

        const rightPadding = new THREE.Mesh(paddingGeometry, paddingMaterial);
        rightPadding.position.set(0.35, 0, 0.05);
        group.add(rightPadding);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createWallMountedPullUpBar() {
        const group = new THREE.Group();

        // Main horizontal bar
        const barGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.0, 32);
        const barMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.9,
            roughness: 0.1
        });
        const mainBar = new THREE.Mesh(barGeometry, barMaterial);
        mainBar.rotation.z = Math.PI / 2;
        mainBar.position.y = 0.3;
        mainBar.castShadow = true;
        group.add(mainBar);

        // Wall mounting brackets
        const bracketGeometry = new THREE.BoxGeometry(0.12, 0.25, 0.08);
        const bracketMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const leftBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
        leftBracket.position.set(-0.4, 0.2, -0.1);
        leftBracket.castShadow = true;
        group.add(leftBracket);

        const rightBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
        rightBracket.position.set(0.4, 0.2, -0.1);
        rightBracket.castShadow = true;
        group.add(rightBracket);

        // Wall plate
        const plateGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.02);
        const plateMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x718096,
            metalness: 0.7,
            roughness: 0.3
        });
        const wallPlate = new THREE.Mesh(plateGeometry, plateMaterial);
        wallPlate.position.set(0, 0.2, -0.15);
        group.add(wallPlate);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createFreestandingStation() {
        const group = new THREE.Group();

        // Main horizontal bar
        const barGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 32);
        const barMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.9,
            roughness: 0.1
        });
        const mainBar = new THREE.Mesh(barGeometry, barMaterial);
        mainBar.rotation.z = Math.PI / 2;
        mainBar.position.y = 1.8;
        mainBar.castShadow = true;
        group.add(mainBar);

        // Vertical posts
        const postGeometry = new THREE.CylinderGeometry(0.025, 0.025, 2.0, 16);
        const postMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const leftPost = new THREE.Mesh(postGeometry, postMaterial);
        leftPost.position.set(-0.5, 0.8, 0);
        leftPost.castShadow = true;
        group.add(leftPost);

        const rightPost = new THREE.Mesh(postGeometry, postMaterial);
        rightPost.position.set(0.5, 0.8, 0);
        rightPost.castShadow = true;
        group.add(rightPost);

        // Base frame
        const baseGeometry = new THREE.BoxGeometry(1.4, 0.05, 0.8);
        const baseMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a202c,
            metalness: 0.7,
            roughness: 0.3
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.2;
        base.castShadow = true;
        group.add(base);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createPowerTower() {
        const group = new THREE.Group();

        // Main structure - larger and more complex
        const frameGeometry = new THREE.BoxGeometry(1.2, 2.2, 0.8);
        const frameMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.1
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.y = 0.9;
        group.add(frame);

        // Pull-up bar
        const pullupBarGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.0, 32);
        const pullupBarMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.9,
            roughness: 0.1
        });
        const pullupBar = new THREE.Mesh(pullupBarGeometry, pullupBarMaterial);
        pullupBar.rotation.z = Math.PI / 2;
        pullupBar.position.y = 1.8;
        pullupBar.castShadow = true;
        group.add(pullupBar);

        // Dip bars
        const dipBarGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.4, 16);
        const dipBarMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const leftDipBar = new THREE.Mesh(dipBarGeometry, dipBarMaterial);
        leftDipBar.rotation.z = Math.PI / 2;
        leftDipBar.position.set(-0.15, 1.2, 0.3);
        leftDipBar.castShadow = true;
        group.add(leftDipBar);

        const rightDipBar = new THREE.Mesh(dipBarGeometry, dipBarMaterial);
        rightDipBar.rotation.z = Math.PI / 2;
        rightDipBar.position.set(0.15, 1.2, 0.3);
        rightDipBar.castShadow = true;
        group.add(rightDipBar);

        // Base
        const baseGeometry = new THREE.BoxGeometry(1.4, 0.08, 1.0);
        const baseMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a202c,
            metalness: 0.7,
            roughness: 0.3
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.15;
        base.castShadow = true;
        group.add(base);

        this.currentProduct = group;
        this.scene.add(group);
    }

    // RINGS & SUSPENSION EQUIPMENT
    createPlasticRings() {
        const group = new THREE.Group();

        // Straps (similar to wooden rings)
        const strapGeometry = new THREE.BoxGeometry(0.02, 1.5, 0.005);
        const strapMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        leftStrap.position.set(-0.3, 0.3, 0);
        group.add(leftStrap);

        const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        rightStrap.position.set(0.3, 0.3, 0);
        group.add(rightStrap);

        // Plastic rings (different material)
        const ringGeometry = new THREE.TorusGeometry(0.12, 0.015, 8, 32);
        const ringMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.3,
            metalness: 0.0
        });
        
        const leftRing = new THREE.Mesh(ringGeometry, ringMaterial);
        leftRing.position.set(-0.3, -0.4, 0);
        leftRing.castShadow = true;
        group.add(leftRing);

        const rightRing = new THREE.Mesh(ringGeometry, ringMaterial);
        rightRing.position.set(0.3, -0.4, 0);
        rightRing.castShadow = true;
        group.add(rightRing);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createSuspensionTrainer() {
        const group = new THREE.Group();

        // Main anchor point
        const anchorGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 16);
        const anchorMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.9,
            roughness: 0.1
        });
        const anchor = new THREE.Mesh(anchorGeometry, anchorMaterial);
        anchor.position.y = 0.8;
        group.add(anchor);

        // Suspension straps
        const strapGeometry = new THREE.BoxGeometry(0.03, 1.4, 0.008);
        const strapMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xf59e0b,
            roughness: 0.7,
            metalness: 0.0
        });
        
        const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        leftStrap.position.set(-0.2, 0.1, 0);
        group.add(leftStrap);

        const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        rightStrap.position.set(0.2, 0.1, 0);
        group.add(rightStrap);

        // Handles
        const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 12);
        const handleMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.position.set(-0.2, -0.6, 0);
        leftHandle.castShadow = true;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.position.set(0.2, -0.6, 0);
        rightHandle.castShadow = true;
        group.add(rightHandle);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createBattleRopes() {
        const group = new THREE.Group();

        // Create rope segments
        const ropeSegments = 20;
        const ropeLength = 3.0;
        
        for (let i = 0; i < ropeSegments; i++) {
            const segmentGeometry = new THREE.CylinderGeometry(0.025, 0.025, ropeLength / ropeSegments, 8);
            const ropeMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0x2d2d2d,
                roughness: 0.9,
                metalness: 0.0
            });
            
            const segment = new THREE.Mesh(segmentGeometry, ropeMaterial);
            const angle = (i / ropeSegments) * Math.PI * 2;
            const x = Math.sin(angle) * 0.3;
            const z = Math.cos(angle) * 0.3;
            segment.position.set(x, 0, z);
            segment.rotation.x = Math.PI / 2;
            segment.castShadow = true;
            group.add(segment);
        }

        // Handles
        const handleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 12);
        const handleMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.position.set(-0.8, 0, 0);
        leftHandle.castShadow = true;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.position.set(0.8, 0, 0);
        rightHandle.castShadow = true;
        group.add(rightHandle);

        this.currentProduct = group;
        this.scene.add(group);
    }

    // PARALLEL & DIP EQUIPMENT MODELS
    createMetalParallettes() {
        const group = new THREE.Group();

        // Metal base plates
        const baseGeometry = new THREE.BoxGeometry(0.25, 0.02, 0.15);
        const baseMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const leftBase = new THREE.Mesh(baseGeometry, baseMaterial);
        leftBase.position.set(-0.3, -0.15, 0);
        leftBase.castShadow = true;
        group.add(leftBase);

        const rightBase = new THREE.Mesh(baseGeometry, baseMaterial);
        rightBase.position.set(0.3, -0.15, 0);
        rightBase.castShadow = true;
        group.add(rightBase);

        // Metal handles
        const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 16);
        const handleMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.position.set(-0.3, 0, 0);
        leftHandle.rotation.z = Math.PI / 2;
        leftHandle.castShadow = true;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.position.set(0.3, 0, 0);
        rightHandle.rotation.z = Math.PI / 2;
        rightHandle.castShadow = true;
        group.add(rightHandle);

        // Support legs
        const legGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 12);
        const legMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.8,
            roughness: 0.2
        });
        
        // Left legs
        const leftLeg1 = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg1.position.set(-0.4, -0.075, 0.05);
        group.add(leftLeg1);

        const leftLeg2 = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg2.position.set(-0.2, -0.075, 0.05);
        group.add(leftLeg2);

        // Right legs
        const rightLeg1 = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg1.position.set(0.2, -0.075, 0.05);
        group.add(rightLeg1);

        const rightLeg2 = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg2.position.set(0.4, -0.075, 0.05);
        group.add(rightLeg2);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createDipStation() {
        const group = new THREE.Group();

        // Main frame structure
        const frameGeometry = new THREE.BoxGeometry(0.8, 1.0, 0.6);
        const frameMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.1
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.y = 0.3;
        group.add(frame);

        // Dip bars
        const dipBarGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.5, 16);
        const dipBarMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const leftDipBar = new THREE.Mesh(dipBarGeometry, dipBarMaterial);
        leftDipBar.rotation.z = Math.PI / 2;
        leftDipBar.position.set(-0.2, 0.7, 0.15);
        leftDipBar.castShadow = true;
        group.add(leftDipBar);

        const rightDipBar = new THREE.Mesh(dipBarGeometry, dipBarMaterial);
        rightDipBar.rotation.z = Math.PI / 2;
        rightDipBar.position.set(0.2, 0.7, 0.15);
        rightDipBar.castShadow = true;
        group.add(rightDipBar);

        // Support posts
        const postGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.0, 12);
        const postMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const posts = [
            [-0.35, 0.3, 0.25],
            [0.35, 0.3, 0.25],
            [-0.35, 0.3, -0.25],
            [0.35, 0.3, -0.25]
        ];

        posts.forEach(pos => {
            const post = new THREE.Mesh(postGeometry, postMaterial);
            post.position.set(pos[0], pos[1], pos[2]);
            post.castShadow = true;
            group.add(post);
        });

        // Base
        const baseGeometry = new THREE.BoxGeometry(1.0, 0.05, 0.8);
        const baseMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a202c,
            metalness: 0.7,
            roughness: 0.3
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.2;
        base.castShadow = true;
        group.add(base);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createPushUpHandles() {
        const group = new THREE.Group();

        // Handle grips
        const gripGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 12);
        const gripMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const leftGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        leftGrip.position.set(-0.2, 0.08, 0);
        leftGrip.rotation.z = Math.PI / 2;
        leftGrip.castShadow = true;
        group.add(leftGrip);

        const rightGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        rightGrip.position.set(0.2, 0.08, 0);
        rightGrip.rotation.z = Math.PI / 2;
        rightGrip.castShadow = true;
        group.add(rightGrip);

        // Base platforms
        const baseGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16);
        const baseMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.7,
            roughness: 0.3
        });
        
        const leftBase = new THREE.Mesh(baseGeometry, baseMaterial);
        leftBase.position.set(-0.2, 0, 0);
        leftBase.castShadow = true;
        group.add(leftBase);

        const rightBase = new THREE.Mesh(baseGeometry, baseMaterial);
        rightBase.position.set(0.2, 0, 0);
        rightBase.castShadow = true;
        group.add(rightBase);

        // Non-slip pads
        const padGeometry = new THREE.CylinderGeometry(0.075, 0.075, 0.005, 16);
        const padMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d2d2d,
            roughness: 0.9,
            metalness: 0.0
        });
        
        const leftPad = new THREE.Mesh(padGeometry, padMaterial);
        leftPad.position.set(-0.2, -0.015, 0);
        group.add(leftPad);

        const rightPad = new THREE.Mesh(padGeometry, padMaterial);
        rightPad.position.set(0.2, -0.015, 0);
        group.add(rightPad);

        this.currentProduct = group;
        this.scene.add(group);
    }

    // RESISTANCE EQUIPMENT MODELS
    createResistanceBands() {
        const group = new THREE.Group();

        // Create multiple resistance bands with different colors
        const colors = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff];
        const resistances = ['Light', 'Medium', 'Heavy', 'X-Heavy', 'XX-Heavy'];
        
        for (let i = 0; i < 5; i++) {
            const bandGeometry = new THREE.TorusGeometry(0.15, 0.008, 8, 32);
            const bandMaterial = new THREE.MeshPhysicalMaterial({ 
                color: colors[i],
                roughness: 0.3,
                metalness: 0.0
            });
            
            const band = new THREE.Mesh(bandGeometry, bandMaterial);
            band.position.set((i - 2) * 0.1, 0, 0);
            band.rotation.x = Math.PI / 2;
            band.castShadow = true;
            group.add(band);
        }

        // Handles
        const handleGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 12);
        const handleMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.position.set(-0.3, 0, 0);
        leftHandle.castShadow = true;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.position.set(0.3, 0, 0);
        rightHandle.castShadow = true;
        group.add(rightHandle);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createAssistanceBands() {
        const group = new THREE.Group();

        // Large assistance band
        const bandGeometry = new THREE.TorusGeometry(0.25, 0.02, 8, 32);
        const bandMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x8B5CF6,
            roughness: 0.4,
            metalness: 0.0
        });
        
        const band = new THREE.Mesh(bandGeometry, bandMaterial);
        band.rotation.x = Math.PI / 2;
        band.castShadow = true;
        group.add(band);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createLoopBands() {
        const group = new THREE.Group();

        // Mini resistance bands in different colors
        const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xfeca57];
        
        for (let i = 0; i < 5; i++) {
            const loopGeometry = new THREE.TorusGeometry(0.08, 0.005, 6, 24);
            const loopMaterial = new THREE.MeshPhysicalMaterial({ 
                color: colors[i],
                roughness: 0.3,
                metalness: 0.0
            });
            
            const loop = new THREE.Mesh(loopGeometry, loopMaterial);
            loop.position.set((i - 2) * 0.05, 0, 0);
            loop.rotation.x = Math.PI / 2;
            loop.castShadow = true;
            group.add(loop);
        }

        this.currentProduct = group;
        this.scene.add(group);
    }

    createTubeBands() {
        const group = new THREE.Group();

        // Tube bands with handles
        const tubeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1.0, 12);
        const tubeMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            roughness: 0.4,
            metalness: 0.0
        });
        
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tube.rotation.z = Math.PI / 2;
        tube.castShadow = true;
        group.add(tube);

        // Handles
        const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 12);
        const handleMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.position.set(-0.6, 0, 0);
        leftHandle.castShadow = true;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.position.set(0.6, 0, 0);
        rightHandle.castShadow = true;
        group.add(rightHandle);

        this.currentProduct = group;
        this.scene.add(group);
    }

    // WEIGHT & LOADING EQUIPMENT
    createWeightedVest() {
        const group = new THREE.Group();

        // Main vest body
        const vestGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.1);
        const vestMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d2d2d,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const vest = new THREE.Mesh(vestGeometry, vestMaterial);
        vest.castShadow = true;
        group.add(vest);

        // Weight pockets
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                const pocketGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.03);
                const pocketMaterial = new THREE.MeshPhysicalMaterial({ 
                    color: 0x4a5568,
                    metalness: 0.7,
                    roughness: 0.3
                });
                
                const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
                pocket.position.set((j - 0.5) * 0.15, (i - 1) * 0.15, 0.065);
                pocket.castShadow = true;
                group.add(pocket);
            }
        }

        // Shoulder straps
        const strapGeometry = new THREE.BoxGeometry(0.05, 0.3, 0.01);
        const strapMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.9,
            metalness: 0.0
        });
        
        const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        leftStrap.position.set(-0.15, 0.4, 0);
        group.add(leftStrap);

        const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        rightStrap.position.set(0.15, 0.4, 0);
        group.add(rightStrap);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createDipBelt() {
        const group = new THREE.Group();

        // Main belt
        const beltGeometry = new THREE.TorusGeometry(0.15, 0.02, 8, 32);
        const beltMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const belt = new THREE.Mesh(beltGeometry, beltMaterial);
        belt.rotation.x = Math.PI / 2;
        belt.castShadow = true;
        group.add(belt);

        // Chain
        const chainLinks = 10;
        for (let i = 0; i < chainLinks; i++) {
            const linkGeometry = new THREE.TorusGeometry(0.015, 0.003, 6, 12);
            const linkMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0x4a5568,
                metalness: 0.9,
                roughness: 0.1
            });
            
            const link = new THREE.Mesh(linkGeometry, linkMaterial);
            link.position.y = -0.05 - (i * 0.025);
            link.rotation.x = (i % 2) * Math.PI / 2;
            link.castShadow = true;
            group.add(link);
        }

        // Weight plate attachment
        const plateGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16);
        const plateMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const plate = new THREE.Mesh(plateGeometry, plateMaterial);
        plate.position.y = -0.3;
        plate.castShadow = true;
        group.add(plate);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createAnkleWeights() {
        const group = new THREE.Group();

        // Weight cuffs
        const cuffGeometry = new THREE.TorusGeometry(0.06, 0.02, 8, 16);
        const cuffMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d2d2d,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const leftCuff = new THREE.Mesh(cuffGeometry, cuffMaterial);
        leftCuff.position.set(-0.15, 0, 0);
        leftCuff.rotation.z = Math.PI / 2;
        leftCuff.castShadow = true;
        group.add(leftCuff);

        const rightCuff = new THREE.Mesh(cuffGeometry, cuffMaterial);
        rightCuff.position.set(0.15, 0, 0);
        rightCuff.rotation.z = Math.PI / 2;
        rightCuff.castShadow = true;
        group.add(rightCuff);

        // Weight pockets
        for (let side = 0; side < 2; side++) {
            for (let i = 0; i < 3; i++) {
                const pocketGeometry = new THREE.BoxGeometry(0.03, 0.03, 0.015);
                const pocketMaterial = new THREE.MeshPhysicalMaterial({ 
                    color: 0x4a5568,
                    metalness: 0.7,
                    roughness: 0.3
                });
                
                const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
                pocket.position.set((side - 0.5) * 0.3, 0, (i - 1) * 0.04);
                pocket.castShadow = true;
                group.add(pocket);
            }
        }

        this.currentProduct = group;
        this.scene.add(group);
    }

    createWeightedChains() {
        const group = new THREE.Group();

        // Create chain links
        const chainLength = 20;
        for (let i = 0; i < chainLength; i++) {
            const linkGeometry = new THREE.TorusGeometry(0.02, 0.005, 6, 12);
            const linkMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0x2d3748,
                metalness: 0.9,
                roughness: 0.1
            });
            
            const link = new THREE.Mesh(linkGeometry, linkMaterial);
            const angle = (i / chainLength) * Math.PI * 4;
            link.position.set(Math.sin(angle) * 0.1, -i * 0.03, Math.cos(angle) * 0.1);
            link.rotation.x = (i % 2) * Math.PI / 2;
            link.castShadow = true;
            group.add(link);
        }

        this.currentProduct = group;
        this.scene.add(group);
    }

    // GRIP & HAND EQUIPMENT
    createGymnasticsGrips() {
        const group = new THREE.Group();

        // Grip pads
        const gripGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.005);
        const gripMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x8B4513,
            roughness: 0.9,
            metalness: 0.0
        });
        
        const leftGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        leftGrip.position.set(-0.1, 0, 0);
        leftGrip.castShadow = true;
        group.add(leftGrip);

        const rightGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        rightGrip.position.set(0.1, 0, 0);
        rightGrip.castShadow = true;
        group.add(rightGrip);

        // Wrist straps
        const strapGeometry = new THREE.BoxGeometry(0.02, 0.15, 0.002);
        const strapMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d2d2d,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        leftStrap.position.set(-0.1, -0.1, 0);
        group.add(leftStrap);

        const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        rightStrap.position.set(0.1, -0.1, 0);
        group.add(rightStrap);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createLiquidChalk() {
        const group = new THREE.Group();

        // Bottle
        const bottleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.12, 16);
        const bottleMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xffffff,
            roughness: 0.1,
            metalness: 0.0,
            transparent: true,
            opacity: 0.9
        });
        
        const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
        bottle.castShadow = true;
        group.add(bottle);

        // Cap
        const capGeometry = new THREE.CylinderGeometry(0.032, 0.032, 0.02, 16);
        const capMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.y = 0.07;
        cap.castShadow = true;
        group.add(cap);

        // Label
        const labelGeometry = new THREE.BoxGeometry(0.055, 0.08, 0.001);
        const labelMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x8B5CF6,
            roughness: 0.7,
            metalness: 0.0
        });
        
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(0, 0, 0.031);
        group.add(label);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createFatGrips() {
        const group = new THREE.Group();

        // Fat grip sleeves
        const gripGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.12, 16);
        const gripMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.9,
            metalness: 0.0
        });
        
        const leftGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        leftGrip.position.set(-0.15, 0, 0);
        leftGrip.rotation.z = Math.PI / 2;
        leftGrip.castShadow = true;
        group.add(leftGrip);

        const rightGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        rightGrip.position.set(0.15, 0, 0);
        rightGrip.rotation.z = Math.PI / 2;
        rightGrip.castShadow = true;
        group.add(rightGrip);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createWristWraps() {
        const group = new THREE.Group();

        // Wrist wraps
        const wrapGeometry = new THREE.BoxGeometry(0.05, 0.3, 0.002);
        const wrapMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d2d2d,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const leftWrap = new THREE.Mesh(wrapGeometry, wrapMaterial);
        leftWrap.position.set(-0.1, 0, 0);
        leftWrap.castShadow = true;
        group.add(leftWrap);

        const rightWrap = new THREE.Mesh(wrapGeometry, wrapMaterial);
        rightWrap.position.set(0.1, 0, 0);
        rightWrap.castShadow = true;
        group.add(rightWrap);

        // Velcro strips
        const velcroGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.001);
        const velcroMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x8B5CF6,
            roughness: 0.9,
            metalness: 0.0
        });
        
        const leftVelcro = new THREE.Mesh(velcroGeometry, velcroMaterial);
        leftVelcro.position.set(-0.1, 0.1, 0.002);
        group.add(leftVelcro);

        const rightVelcro = new THREE.Mesh(velcroGeometry, velcroMaterial);
        rightVelcro.position.set(0.1, 0.1, 0.002);
        group.add(rightVelcro);

        this.currentProduct = group;
        this.scene.add(group);
    }

    // FLOOR & MAT EQUIPMENT
    createExerciseMat() {
        const group = new THREE.Group();

        // Main mat
        const matGeometry = new THREE.BoxGeometry(1.8, 0.02, 0.6);
        const matMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x8B5CF6,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const mat = new THREE.Mesh(matGeometry, matMaterial);
        mat.castShadow = true;
        group.add(mat);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createYogaMat() {
        const group = new THREE.Group();

        // Yoga mat (thinner than exercise mat)
        const matGeometry = new THREE.BoxGeometry(1.8, 0.008, 0.6);
        const matMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4ecdc4,
            roughness: 0.9,
            metalness: 0.0
        });
        
        const mat = new THREE.Mesh(matGeometry, matMaterial);
        mat.castShadow = true;
        group.add(mat);

        // Texture pattern
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 3; j++) {
                const dotGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.002, 8);
                const dotMaterial = new THREE.MeshPhysicalMaterial({ 
                    color: 0x2d3748,
                    roughness: 0.8,
                    metalness: 0.0
                });
                
                const dot = new THREE.Mesh(dotGeometry, dotMaterial);
                dot.position.set((i - 4.5) * 0.15, 0.006, (j - 1) * 0.15);
                group.add(dot);
            }
        }

        this.currentProduct = group;
        this.scene.add(group);
    }

    createThickMat() {
        const group = new THREE.Group();

        // Thick exercise mat
        const matGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.8);
        const matMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            roughness: 0.7,
            metalness: 0.0
        });
        
        const mat = new THREE.Mesh(matGeometry, matMaterial);
        mat.castShadow = true;
        group.add(mat);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createBalancePad() {
        const group = new THREE.Group();

        // Balance pad
        const padGeometry = new THREE.BoxGeometry(0.4, 0.06, 0.3);
        const padMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x45b7d1,
            roughness: 0.9,
            metalness: 0.0
        });
        
        const pad = new THREE.Mesh(padGeometry, padMaterial);
        pad.castShadow = true;
        group.add(pad);

        this.currentProduct = group;
        this.scene.add(group);
    }

    // SPECIALIZED TRAINING TOOLS
    createSteelMace() {
        const group = new THREE.Group();

        // Handle
        const handleGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.8, 16);
        const handleMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.castShadow = true;
        group.add(handle);

        // Mace head
        const headGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const headMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a202c,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 0.45;
        head.castShadow = true;
        group.add(head);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createKettlebell() {
        const group = new THREE.Group();

        // Main bell body
        const bellGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const bellMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.8,
            roughness: 0.3
        });
        
        const bell = new THREE.Mesh(bellGeometry, bellMaterial);
        bell.position.y = -0.05;
        bell.castShadow = true;
        group.add(bell);

        // Handle
        const handleGeometry = new THREE.TorusGeometry(0.08, 0.015, 8, 16);
        const handleMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.y = 0.08;
        handle.rotation.x = Math.PI / 2;
        handle.castShadow = true;
        group.add(handle);

        this.currentProduct = group;
        this.scene.add(group);
    }

    createMedicineBall() {
        const group = new THREE.Group();

        // Medicine ball
        const ballGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const ballMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.castShadow = true;
        group.add(ball);

        // Grip lines
        for (let i = 0; i < 6; i++) {
            const lineGeometry = new THREE.TorusGeometry(0.125, 0.002, 4, 16);
            const lineMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0x4a5568,
                roughness: 0.7,
                metalness: 0.1
            });
            
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.rotation.x = (i / 6) * Math.PI;
            group.add(line);
        }

        this.currentProduct = group;
        this.scene.add(group);
    }

    createJumpRope() {
        const group = new THREE.Group();

        // Rope
        const ropeSegments = 30;
        for (let i = 0; i < ropeSegments; i++) {
            const segmentGeometry = new THREE.CylinderGeometry(0.003, 0.003, 0.05, 8);
            const ropeMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0x2d2d2d,
                roughness: 0.8,
                metalness: 0.0
            });
            
            const segment = new THREE.Mesh(segmentGeometry, ropeMaterial);
            const angle = (i / ropeSegments) * Math.PI * 2;
            segment.position.set(Math.sin(angle) * 0.4, Math.cos(angle) * 0.2, 0);
            segment.rotation.z = angle;
            group.add(segment);
        }

        // Handles
        const handleGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 12);
        const handleMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.position.set(-0.4, 0, 0);
        leftHandle.castShadow = true;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.position.set(0.4, 0, 0);
        rightHandle.castShadow = true;
        group.add(rightHandle);

        this.currentProduct = group;
        this.scene.add(group);
    }

    // MOBILITY TOOLS
    createFoamRoller() {
        const group = new THREE.Group();

        // Roller
        const rollerGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16);
        const rollerMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4ecdc4,
            roughness: 0.9,
            metalness: 0.0
        });
        
        const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
        roller.rotation.z = Math.PI / 2;
        roller.castShadow = true;
        group.add(roller);

        // Texture bumps
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 8; j++) {
                const bumpGeometry = new THREE.SphereGeometry(0.005, 6, 6);
                const bumpMaterial = new THREE.MeshPhysicalMaterial({ 
                    color: 0x2d3748,
                    roughness: 0.8,
                    metalness: 0.0
                });
                
                const bump = new THREE.Mesh(bumpGeometry, bumpMaterial);
                const angle = (j / 8) * Math.PI * 2;
                bump.position.set(
                    (i - 10) * 0.03,
                    Math.sin(angle) * 0.085,
                    Math.cos(angle) * 0.085
                );
                group.add(bump);
            }
        }

        this.currentProduct = group;
        this.scene.add(group);
    }

    createMassageBall() {
        const group = new THREE.Group();

        // Massage ball
        const ballGeometry = new THREE.SphereGeometry(0.06, 16, 16);
        const ballMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xff6b6b,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.castShadow = true;
        group.add(ball);

        // Texture spikes
        for (let i = 0; i < 50; i++) {
            const spikeGeometry = new THREE.ConeGeometry(0.003, 0.01, 6);
            const spikeMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0x2d3748,
                roughness: 0.7,
                metalness: 0.0
            });
            
            const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
            const phi = Math.acos(-1 + (2 * i) / 50);
            const theta = Math.sqrt(50 * Math.PI) * phi;
            
            spike.position.setFromSphericalCoords(0.065, phi, theta);
            spike.lookAt(0, 0, 0);
            group.add(spike);
        }

        this.currentProduct = group;
        this.scene.add(group);
    }

    createStretchingStrap() {
        const group = new THREE.Group();

        // Main strap
        const strapGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.002);
        const strapMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x8B5CF6,
            roughness: 0.8,
            metalness: 0.0
        });
        
        const strap = new THREE.Mesh(strapGeometry, strapMaterial);
        strap.castShadow = true;
        group.add(strap);

        // Loops
        for (let i = 0; i < 10; i++) {
            const loopGeometry = new THREE.TorusGeometry(0.02, 0.003, 6, 12);
            const loopMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0x2d3748,
                metalness: 0.8,
                roughness: 0.2
            });
            
            const loop = new THREE.Mesh(loopGeometry, loopMaterial);
            loop.position.set((i - 4.5) * 0.12, 0, 0);
            loop.rotation.x = Math.PI / 2;
            group.add(loop);
        }

        this.currentProduct = group;
        this.scene.add(group);
    }

    resetCameraView() {
        if (this.controls) {
            gsap.to(this.camera.position, {
                duration: 1,
                x: 3,
                y: 2,
                z: 5,
                ease: "power2.out"
            });
            gsap.to(this.controls.target, {
                duration: 1,
                x: 0,
                y: 0,
                z: 0,
                ease: "power2.out",
                onUpdate: () => this.controls.update()
            });
        }
    }

    setupCart() {
        this.cart = JSON.parse(localStorage.getItem('calisverse-cart') || '[]');
        this.updateCartUI();
    }

    addToCart() {
        const currentProductType = document.querySelector('.product-nav-btn.bg-primary')?.dataset.product || 'pullup-bar';
        const productInfo = this.products[currentProductType];
        
        const product = {
            id: currentProductType,
            name: productInfo.name,
            price: productInfo.price,
            quantity: 1
        };

        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push(product);
        }

        this.saveCart();
        this.updateCartUI();
        this.showCartNotification();
    }

    toggleCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('translate-x-0');
            sidebar.classList.toggle('translate-x-full');
            overlay.classList.toggle('hidden');
        }
    }

    closeCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.add('translate-x-full');
            sidebar.classList.remove('translate-x-0');
            overlay.classList.add('hidden');
        }
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        if (cartItems) {
            cartItems.innerHTML = '';
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
            } else {
                this.cart.forEach(item => {
                    const itemElement = this.createCartItemElement(item);
                    cartItems.appendChild(itemElement);
                });
            }
        }

        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }

    createCartItemElement(item) {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-4 border-b border-gray-200';
        div.innerHTML = `
            <div class="flex-1">
                <h4 class="font-semibold">${item.name}</h4>
                <p class="text-sm text-gray-600">$${item.price} × ${item.quantity}</p>
            </div>
            <button class="text-red-500 hover:text-red-700 p-1" onclick="calisverse.removeFromCart('${item.id}')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        `;
        return div;
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    saveCart() {
        localStorage.setItem('calisverse-cart', JSON.stringify(this.cart));
    }

    showCartNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = 'Product added to cart!';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    onWindowResize() {
        const container = document.getElementById('product-3d-container');
        if (container && this.camera && this.renderer) {
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.controls) {
            this.controls.update();
        }

        // Subtle rotation for product showcase
        if (this.currentProduct) {
            this.currentProduct.rotation.y += 0.003;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Initialize CalisVerse when DOM is loaded
let calisverse;
document.addEventListener('DOMContentLoaded', () => {
    calisverse = new CalisVerse();
});

// Make calisverse globally accessible for cart functions
window.calisverse = calisverse;
