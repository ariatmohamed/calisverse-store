class CalisVerse3DLanding {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.products = [];
        this.selectedProduct = null;
        this.isLoading = true;
        this.loadingProgress = 0;
        
        // Product data
        this.productData = {
            'pullup-bar': {
                name: 'Professional Pull-up Bar',
                price: '$79.99',
                description: 'Heavy-duty steel construction with comfortable grip padding. Perfect for building upper body strength.',
                position: { x: 0, y: 0.5, z: 0 },
                scale: 1.2
            },
            'rings': {
                name: 'Wooden Gymnastics Rings',
                price: '$49.99',
                description: 'Premium wooden rings with adjustable straps. Ideal for advanced bodyweight training.',
                position: { x: -2.5, y: 0.8, z: -1 },
                scale: 1.0
            },
            'parallettes': {
                name: 'Wooden Parallettes',
                price: '$59.99',
                description: 'Handcrafted wooden parallettes for L-sits, handstands, and push-up variations.',
                position: { x: 2, y: -0.5, z: 1 },
                scale: 1.0
            },
            'bands': {
                name: 'Resistance Band Set',
                price: '$29.99',
                description: 'Complete set of resistance bands with multiple resistance levels and accessories.',
                position: { x: -1.5, y: -0.3, z: 2 },
                scale: 0.8
            },
            'vest': {
                name: 'Weighted Training Vest',
                price: '$89.99',
                description: 'Adjustable weighted vest with removable weight plates for progressive training.',
                position: { x: 3, y: 0.2, z: -2 },
                scale: 0.9
            }
        };
        
        this.init();
    }

    async init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.setupControls();
        this.setupEventListeners();
        
        // Start loading products
        await this.loadProducts();
        
        // Hide loading screen and start experience
        this.hideLoadingScreen();
        this.startExperience();
        
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8fafc);
        this.scene.fog = new THREE.Fog(0xf8fafc, 10, 50);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 3, 8);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
        mainLight.position.set(10, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        this.scene.add(mainLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x8B5CF6, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
        rimLight.position.set(0, 5, -10);
        this.scene.add(rimLight);

        // Ground plane for shadows
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    setupControls() {
        // Wait for OrbitControls to be available
        const initControls = () => {
            if (typeof THREE.OrbitControls !== 'undefined') {
                this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.05;
                this.controls.screenSpacePanning = false;
                this.controls.minDistance = 3;
                this.controls.maxDistance = 20;
                this.controls.maxPolarAngle = Math.PI / 2;
                this.controls.autoRotate = true;
                this.controls.autoRotateSpeed = 0.5;
            } else {
                // Fallback to simple controls
                this.setupFallbackControls();
            }
        };

        // Try to initialize controls immediately, or wait a bit
        setTimeout(initControls, 100);
    }

    setupFallbackControls() {
        this.controls = {
            target: new THREE.Vector3(0, 0, 0),
            autoRotate: true,
            autoRotateSpeed: 0.5,
            update: () => {
                if (this.controls.autoRotate) {
                    const angle = Date.now() * 0.0005 * this.controls.autoRotateSpeed;
                    this.camera.position.x = Math.cos(angle) * 8;
                    this.camera.position.z = Math.sin(angle) * 8;
                    this.camera.lookAt(this.controls.target);
                }
            }
        };
    }

    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
        this.renderer.domElement.addEventListener('mouseenter', () => {
            if (this.controls) this.controls.autoRotate = false;
        });
        this.renderer.domElement.addEventListener('mouseleave', () => {
            if (this.controls) this.controls.autoRotate = true;
        });
    }

    async loadProducts() {
        // Create hero pull-up bar
        this.createPullUpBar();
        
        // Create gymnastics rings
        this.createGymnasticRings();
        
        // Create parallettes
        this.createParallettes();
        
        // Create resistance bands
        this.createResistanceBands();
        
        // Create weighted vest
        this.createWeightedVest();
        
        // Simulate loading progress
        for (let i = 0; i <= 100; i += 10) {
            this.loadingProgress = i;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    createPullUpBar() {
        const group = new THREE.Group();
        group.userData = { type: 'pullup-bar', interactive: true };

        // Main horizontal bar
        const barGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 32);
        const barMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2d3748,
            metalness: 0.9,
            roughness: 0.1,
            clearcoat: 1.0
        });
        const mainBar = new THREE.Mesh(barGeometry, barMaterial);
        mainBar.rotation.z = Math.PI / 2;
        mainBar.position.y = 0.8;
        mainBar.castShadow = true;
        group.add(mainBar);

        // Support posts
        const postGeometry = new THREE.CylinderGeometry(0.025, 0.025, 1.0, 16);
        const postMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x4a5568,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const leftPost = new THREE.Mesh(postGeometry, postMaterial);
        leftPost.position.set(-0.5, 0.3, 0);
        leftPost.castShadow = true;
        group.add(leftPost);

        const rightPost = new THREE.Mesh(postGeometry, postMaterial);
        rightPost.position.set(0.5, 0.3, 0);
        rightPost.castShadow = true;
        group.add(rightPost);

        // Base
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

        const data = this.productData['pullup-bar'];
        group.position.set(data.position.x, data.position.y, data.position.z);
        group.scale.setScalar(data.scale);
        
        this.scene.add(group);
        this.products.push(group);
    }

    createGymnasticRings() {
        const group = new THREE.Group();
        group.userData = { type: 'rings', interactive: true };

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

        // Wooden rings
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

        const data = this.productData['rings'];
        group.position.set(data.position.x, data.position.y, data.position.z);
        group.scale.setScalar(data.scale);
        
        this.scene.add(group);
        this.products.push(group);
    }

    createParallettes() {
        const group = new THREE.Group();
        group.userData = { type: 'parallettes', interactive: true };

        // Wooden handles
        const handleGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.3, 16);
        const handleMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x8B4513,
            roughness: 0.6,
            metalness: 0.0
        });
        
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.position.set(-0.2, 0.1, 0);
        leftHandle.rotation.z = Math.PI / 2;
        leftHandle.castShadow = true;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.position.set(0.2, 0.1, 0);
        rightHandle.rotation.z = Math.PI / 2;
        rightHandle.castShadow = true;
        group.add(rightHandle);

        // Wooden bases
        const baseGeometry = new THREE.BoxGeometry(0.35, 0.03, 0.1);
        const baseMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x654321,
            roughness: 0.7,
            metalness: 0.0
        });
        
        const leftBase = new THREE.Mesh(baseGeometry, baseMaterial);
        leftBase.position.set(-0.2, 0, 0);
        leftBase.castShadow = true;
        group.add(leftBase);

        const rightBase = new THREE.Mesh(baseGeometry, baseMaterial);
        rightBase.position.set(0.2, 0, 0);
        rightBase.castShadow = true;
        group.add(rightBase);

        const data = this.productData['parallettes'];
        group.position.set(data.position.x, data.position.y, data.position.z);
        group.scale.setScalar(data.scale);
        
        this.scene.add(group);
        this.products.push(group);
    }

    createResistanceBands() {
        const group = new THREE.Group();
        group.userData = { type: 'bands', interactive: true };

        // Multiple resistance bands
        const colors = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff];
        
        for (let i = 0; i < 5; i++) {
            const bandGeometry = new THREE.TorusGeometry(0.15, 0.008, 8, 32);
            const bandMaterial = new THREE.MeshPhysicalMaterial({ 
                color: colors[i],
                roughness: 0.3,
                metalness: 0.0,
                transparent: true,
                opacity: 0.8
            });
            
            const band = new THREE.Mesh(bandGeometry, bandMaterial);
            band.position.set((i - 2) * 0.05, i * 0.02, 0);
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

        const data = this.productData['bands'];
        group.position.set(data.position.x, data.position.y, data.position.z);
        group.scale.setScalar(data.scale);
        
        this.scene.add(group);
        this.products.push(group);
    }

    createWeightedVest() {
        const group = new THREE.Group();
        group.userData = { type: 'vest', interactive: true };

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

        const data = this.productData['vest'];
        group.position.set(data.position.x, data.position.y, data.position.z);
        group.scale.setScalar(data.scale);
        
        this.scene.add(group);
        this.products.push(group);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loadingScreen.classList.add('hidden');
            }
        });
    }

    startExperience() {
        // Show welcome text with enhanced animation
        const welcomeText = document.getElementById('welcome-text');
        gsap.fromTo(welcomeText, 
            { opacity: 0, scale: 0.8, y: 50 },
            { opacity: 1, scale: 1, y: 0, duration: 1.2, delay: 0.3, ease: "back.out(1.4)" }
        );

        // Auto-hide welcome text
        gsap.to(welcomeText, {
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            delay: 4.5,
            ease: "power2.in"
        });

        // Animate products into view with staggered entrance
        this.products.forEach((product, index) => {
            // Start from random positions for dramatic effect
            const startPos = {
                x: (Math.random() - 0.5) * 20,
                y: Math.random() * 10 + 5,
                z: (Math.random() - 0.5) * 20
            };
            
            product.position.set(startPos.x, startPos.y, startPos.z);
            product.scale.setScalar(0);
            
            const targetData = this.productData[product.userData.type];
            
            // Animate to final position
            gsap.to(product.position, {
                x: targetData.position.x,
                y: targetData.position.y,
                z: targetData.position.z,
                duration: 2,
                delay: 0.8 + index * 0.3,
                ease: "power2.out"
            });
            
            // Animate scale
            gsap.to(product.scale, {
                x: targetData.scale,
                y: targetData.scale,
                z: targetData.scale,
                duration: 1.5,
                delay: 1.2 + index * 0.3,
                ease: "back.out(1.7)"
            });
            
            // Add rotation animation
            gsap.fromTo(product.rotation,
                { y: Math.PI * 2 },
                { y: 0, duration: 2, delay: 0.8 + index * 0.3, ease: "power2.out" }
            );
        });

        // Add particle effects
        this.addParticleEffects();
    }

    addParticleEffects() {
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = Math.random() * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x8B5CF6,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        
        // Animate particles
        const animateParticles = () => {
            const positions = particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3 + 1] += 0.01;
                
                if (positions[i * 3 + 1] > 20) {
                    positions[i * 3 + 1] = 0;
                }
            }
            
            particleSystem.geometry.attributes.position.needsUpdate = true;
            particleSystem.rotation.y += 0.001;
        };
        
        this.particleAnimation = animateParticles;
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Raycast for hover effects
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.products, true);

        // Reset all labels
        document.querySelectorAll('.product-label').forEach(label => {
            label.classList.remove('visible');
        });

        if (intersects.length > 0) {
            const product = this.getProductFromIntersect(intersects[0]);
            if (product && product.userData.interactive) {
                this.showProductLabel(product, event);
                document.body.style.cursor = 'pointer';
            }
        } else {
            document.body.style.cursor = 'default';
        }
    }

    onMouseClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.products, true);

        if (intersects.length > 0) {
            const product = this.getProductFromIntersect(intersects[0]);
            if (product && product.userData.interactive) {
                this.selectProduct(product);
            }
        }
    }

    getProductFromIntersect(intersect) {
        let object = intersect.object;
        while (object && !object.userData.type) {
            object = object.parent;
        }
        return object;
    }

    showProductLabel(product, event) {
        const label = document.getElementById(`${product.userData.type}-label`);
        if (label) {
            label.style.left = event.clientX + 'px';
            label.style.top = event.clientY + 'px';
            label.classList.add('visible');
        }
    }

    selectProduct(product) {
        this.selectedProduct = product;
        const data = this.productData[product.userData.type];
        
        // Update product info panel
        document.getElementById('info-title').textContent = data.name;
        document.getElementById('info-description').textContent = data.description;
        document.getElementById('info-price').textContent = data.price;
        
        // Show product info
        const productInfo = document.getElementById('product-info');
        productInfo.classList.add('visible');
        
        // Focus camera on product
        this.focusOnProduct(product);
        
        // Add glow effect
        this.addGlowEffect(product);
    }

    focusOnProduct(product) {
        if (!this.controls) return;
        
        const targetPosition = product.position.clone();
        const offset = new THREE.Vector3(2, 1, 3);
        const newCameraPosition = targetPosition.clone().add(offset);
        
        gsap.to(this.camera.position, {
            x: newCameraPosition.x,
            y: newCameraPosition.y,
            z: newCameraPosition.z,
            duration: 1.5,
            ease: "power2.out"
        });
        
        gsap.to(this.controls.target, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => this.controls.update()
        });
    }

    addGlowEffect(product) {
        // Remove existing glow effects
        this.products.forEach(p => {
            p.traverse(child => {
                if (child.material && child.material.emissive) {
                    child.material.emissive.setHex(0x000000);
                }
            });
        });
        
        // Add glow to selected product
        product.traverse(child => {
            if (child.material && child.material.emissive) {
                child.material.emissive.setHex(0x8B5CF6);
                child.material.emissiveIntensity = 0.2;
            }
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        if (this.controls) {
            this.controls.update();
        }
        
        // Gentle floating animation for products
        this.products.forEach((product, index) => {
            const time = Date.now() * 0.001;
            const originalY = this.productData[product.userData.type].position.y;
            product.position.y = originalY + Math.sin(time + index) * 0.05;
            product.rotation.y += 0.005;
        });
        
        // Animate particles if they exist
        if (this.particleAnimation) {
            this.particleAnimation();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CalisVerse3DLanding();
});

// Add event listeners for UI interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add to cart button
    document.getElementById('add-to-cart').addEventListener('click', () => {
        // Add to cart functionality
        alert('Product added to cart!');
    });
    
    // View details button
    document.getElementById('view-details').addEventListener('click', () => {
        // Redirect to product details
        window.location.href = 'index.html';
    });
});
