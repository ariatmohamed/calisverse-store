/**
 * Robust 3D Product Viewer System
 * Stable Three.js implementation with proper models and color management
 */

class Robust3DViewer {
    constructor() {
        this.viewers = new Map();
        this.colorStates = new Map();
        this.isInitialized = false;
        this.resizeObserver = null;
        
        // Color definitions
        this.colors = {
            black: { hex: '#2c2c2c', name: 'Black' },
            steel: { hex: '#8a9ba8', name: 'Steel' },
            walnut: { hex: '#8b4513', name: 'Walnut' },
            purple: { hex: '#8b5cf6', name: 'Purple' }
        };
        
        // Default colors for each product
        this.defaultColors = {
            'pullup-bar': 'black',
            'rings': 'walnut',
            'parallettes': 'steel'
        };
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM and Three.js to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeViewers());
        } else {
            this.initializeViewers();
        }
        
        this.isInitialized = true;
    }
    
    initializeViewers() {
        // Find all 3D viewer containers
        const containers = document.querySelectorAll('.model-viewer-container');
        
        containers.forEach(container => {
            const productName = container.dataset.product;
            if (productName && !this.viewers.has(productName)) {
                this.createViewer(container, productName);
            }
        });
        
        // Setup resize observer for responsive behavior
        this.setupResizeObserver();
        
        // Setup color pill handlers
        this.setupColorHandlers();
        
        console.log('🎯 Robust 3D Viewer System initialized');
    }
    
    createViewer(container, productName) {
        try {
            // Clear container
            container.innerHTML = '';
            
            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.style.cssText = `
                width: 100%;
                height: 100%;
                display: block;
                background: transparent;
            `;
            container.appendChild(canvas);
            
            // Initialize Three.js scene
            const scene = new THREE.Scene();
            scene.background = null; // Transparent background
            
            // Camera setup
            const camera = new THREE.PerspectiveCamera(
                45, 
                container.clientWidth / container.clientHeight, 
                0.1, 
                1000
            );
            camera.position.set(5, 3, 5);
            
            // Renderer setup with anti-aliasing
            const renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
            });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            
            // Lighting setup
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 10, 5);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            scene.add(directionalLight);
            
            const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
            fillLight.position.set(-5, 5, -5);
            scene.add(fillLight);
            
            // OrbitControls setup
            const controls = new THREE.OrbitControls(camera, canvas);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enableZoom = true;
            controls.enablePan = false;
            controls.minDistance = 2;
            controls.maxDistance = 10;
            controls.maxPolarAngle = Math.PI * 0.8;
            controls.autoRotate = false;
            
            // Create 3D model based on product type
            const model = this.createProductModel(productName);
            scene.add(model);
            
            // Set default color
            const defaultColor = this.defaultColors[productName];
            this.colorStates.set(productName, defaultColor);
            this.applyColor(model, productName, defaultColor);
            
            // Animation loop with sway effect for rings
            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                
                // Add subtle sway animation for rings
                if (productName === 'rings' && model.userData.animationTime !== undefined) {
                    model.userData.animationTime += 0.01;
                    const swayAmount = Math.sin(model.userData.animationTime) * 0.02;
                    
                    model.traverse((child) => {
                        if (child.userData.swayTarget && model.userData.originalPositions[child.uuid]) {
                            const originalPos = model.userData.originalPositions[child.uuid];
                            child.position.x = originalPos.x + swayAmount;
                        }
                        if (child.userData.colorTarget && model.userData.originalPositions[child.uuid]) {
                            const originalPos = model.userData.originalPositions[child.uuid];
                            child.position.x = originalPos.x + swayAmount * 0.5;
                        }
                    });
                }
                
                renderer.render(scene, camera);
            };
            animate();
            
            // Store viewer data
            this.viewers.set(productName, {
                scene,
                camera,
                renderer,
                controls,
                model,
                container,
                canvas
            });
            
            console.log(`✅ Created robust 3D viewer for ${productName}`);
            
        } catch (error) {
            console.error(`❌ Failed to create viewer for ${productName}:`, error);
            this.createFallback(container, productName);
        }
    }
    
    createProductModel(productName) {
        const group = new THREE.Group();
        
        switch (productName) {
            case 'pullup-bar':
                return this.createPullupBarModel();
            case 'rings':
                return this.createRingsModel();
            case 'parallettes':
                return this.createParallettesModel();
            default:
                return this.createDefaultModel();
        }
    }
    
    createPullupBarModel() {
        const group = new THREE.Group();
        
        // Main horizontal bar
        const barGeometry = new THREE.CylinderGeometry(0.15, 0.15, 4, 16);
        const barMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2c2c2c,
            metalness: 0.8,
            roughness: 0.2
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.rotation.z = Math.PI / 2;
        bar.castShadow = true;
        bar.userData.colorTarget = true;
        group.add(bar);
        
        // Wall mounts (left and right)
        const mountGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.3);
        const mountMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2c2c2c,
            metalness: 0.7,
            roughness: 0.3
        });
        
        const leftMount = new THREE.Mesh(mountGeometry, mountMaterial);
        leftMount.position.set(-2.2, 0, 0);
        leftMount.castShadow = true;
        leftMount.userData.colorTarget = true;
        group.add(leftMount);
        
        const rightMount = new THREE.Mesh(mountGeometry, mountMaterial);
        rightMount.position.set(2.2, 0, 0);
        rightMount.castShadow = true;
        rightMount.userData.colorTarget = true;
        group.add(rightMount);
        
        // Mounting screws
        for (let i = 0; i < 4; i++) {
            const screwGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8);
            const screwMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x444444,
                metalness: 0.9,
                roughness: 0.1
            });
            const screw = new THREE.Mesh(screwGeometry, screwMaterial);
            screw.rotation.x = Math.PI / 2;
            screw.position.set(
                i < 2 ? -2.2 : 2.2,
                i % 2 === 0 ? 0.2 : -0.2,
                0.2
            );
            group.add(screw);
        }
        
        return group;
    }
    
    createRingsModel() {
        const group = new THREE.Group();
        
        // Create suspension point (ceiling mount)
        const mountGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
        const mountMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            metalness: 0.9,
            roughness: 0.1
        });
        const mount = new THREE.Mesh(mountGeometry, mountMaterial);
        mount.position.set(0, 3.5, 0);
        mount.rotation.x = Math.PI / 2;
        group.add(mount);
        
        // Ring geometry with realistic wood texture
        const ringGeometry = new THREE.TorusGeometry(0.45, 0.08, 12, 24);
        const ringMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b4513,
            roughness: 0.7,
            metalness: 0.05,
            normalScale: new THREE.Vector2(0.5, 0.5)
        });
        
        // Left ring
        const leftRing = new THREE.Mesh(ringGeometry, ringMaterial.clone());
        leftRing.position.set(-0.6, 0, 0);
        leftRing.castShadow = true;
        leftRing.receiveShadow = true;
        leftRing.userData.colorTarget = true;
        leftRing.userData.ringIndex = 0;
        group.add(leftRing);
        
        // Right ring
        const rightRing = new THREE.Mesh(ringGeometry, ringMaterial.clone());
        rightRing.position.set(0.6, 0, 0);
        rightRing.castShadow = true;
        rightRing.receiveShadow = true;
        rightRing.userData.colorTarget = true;
        rightRing.userData.ringIndex = 1;
        group.add(rightRing);
        
        // Suspension straps - more realistic webbing
        const strapGeometry = new THREE.BoxGeometry(0.03, 3, 0.002);
        const strapMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2a2a2a,
            roughness: 0.9,
            metalness: 0.0
        });
        
        // Left ring straps
        const leftStrap1 = new THREE.Mesh(strapGeometry, strapMaterial);
        leftStrap1.position.set(-0.7, 1.75, 0);
        leftStrap1.userData.swayTarget = true;
        group.add(leftStrap1);
        
        const leftStrap2 = new THREE.Mesh(strapGeometry, strapMaterial);
        leftStrap2.position.set(-0.5, 1.75, 0);
        leftStrap2.userData.swayTarget = true;
        group.add(leftStrap2);
        
        // Right ring straps
        const rightStrap1 = new THREE.Mesh(strapGeometry, strapMaterial);
        rightStrap1.position.set(0.7, 1.75, 0);
        rightStrap1.userData.swayTarget = true;
        group.add(rightStrap1);
        
        const rightStrap2 = new THREE.Mesh(strapGeometry, strapMaterial);
        rightStrap2.position.set(0.5, 1.75, 0);
        rightStrap2.userData.swayTarget = true;
        group.add(rightStrap2);
        
        // Cam buckles for adjustment
        const buckleGeometry = new THREE.BoxGeometry(0.15, 0.08, 0.04);
        const buckleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x555555,
            metalness: 0.8,
            roughness: 0.2
        });
        
        // Left buckles
        const leftBuckle1 = new THREE.Mesh(buckleGeometry, buckleMaterial);
        leftBuckle1.position.set(-0.7, 2.5, 0);
        group.add(leftBuckle1);
        
        const leftBuckle2 = new THREE.Mesh(buckleGeometry, buckleMaterial);
        leftBuckle2.position.set(-0.5, 2.5, 0);
        group.add(leftBuckle2);
        
        // Right buckles
        const rightBuckle1 = new THREE.Mesh(buckleGeometry, buckleMaterial);
        rightBuckle1.position.set(0.7, 2.5, 0);
        group.add(rightBuckle1);
        
        const rightBuckle2 = new THREE.Mesh(buckleGeometry, buckleMaterial);
        rightBuckle2.position.set(0.5, 2.5, 0);
        group.add(rightBuckle2);
        
        // Add subtle sway animation
        group.userData.animationTime = 0;
        group.userData.originalPositions = {};
        
        // Store original positions for sway animation
        group.traverse((child) => {
            if (child.userData.swayTarget || child.userData.colorTarget) {
                group.userData.originalPositions[child.uuid] = child.position.clone();
            }
        });
        
        return group;
    }
    
    createParallettesModel() {
        const group = new THREE.Group();
        
        // Handles (horizontal bars)
        const handleGeometry = new THREE.CylinderGeometry(0.12, 0.12, 1.5, 16);
        const handleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8a9ba8,
            roughness: 0.6,
            metalness: 0.3
        });
        
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.rotation.z = Math.PI / 2;
        leftHandle.position.set(0, 0.8, -0.8);
        leftHandle.castShadow = true;
        leftHandle.userData.colorTarget = true;
        group.add(leftHandle);
        
        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.rotation.z = Math.PI / 2;
        rightHandle.position.set(0, 0.8, 0.8);
        rightHandle.castShadow = true;
        rightHandle.userData.colorTarget = true;
        group.add(rightHandle);
        
        // Legs (vertical supports)
        const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12);
        const legMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8a9ba8,
            roughness: 0.6,
            metalness: 0.3
        });
        
        // Left parallette legs
        for (let i = 0; i < 2; i++) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(i === 0 ? -0.6 : 0.6, 0.4, -0.8);
            leg.castShadow = true;
            leg.userData.colorTarget = true;
            group.add(leg);
        }
        
        // Right parallette legs
        for (let i = 0; i < 2; i++) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(i === 0 ? -0.6 : 0.6, 0.4, 0.8);
            leg.castShadow = true;
            leg.userData.colorTarget = true;
            group.add(leg);
        }
        
        // Rubber feet
        const footGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 12);
        const footMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.9
        });
        
        for (let z = 0; z < 2; z++) {
            for (let x = 0; x < 2; x++) {
                const foot = new THREE.Mesh(footGeometry, footMaterial);
                foot.position.set(
                    x === 0 ? -0.6 : 0.6,
                    0.025,
                    z === 0 ? -0.8 : 0.8
                );
                group.add(foot);
            }
        }
        
        return group;
    }
    
    createDefaultModel() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x8b5cf6 });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.userData.colorTarget = true;
        return cube;
    }
    
    applyColor(model, productName, colorKey) {
        const colorData = this.colors[colorKey];
        if (!colorData) return;
        
        const color = new THREE.Color(colorData.hex);
        
        model.traverse((child) => {
            if (child.isMesh && child.userData.colorTarget) {
                // Apply color based on product type and material properties
                if (productName === 'rings' || productName === 'parallettes') {
                    // Wood/metal materials
                    child.material.color.copy(color);
                    if (colorKey === 'walnut') {
                        child.material.roughness = 0.8;
                        child.material.metalness = 0.1;
                    } else if (colorKey === 'steel') {
                        child.material.roughness = 0.2;
                        child.material.metalness = 0.8;
                    } else {
                        child.material.roughness = 0.4;
                        child.material.metalness = 0.5;
                    }
                } else {
                    // Metal materials (pullup-bar)
                    child.material.color.copy(color);
                    child.material.roughness = 0.2;
                    child.material.metalness = 0.8;
                }
            }
        });
        
        // Store color state
        this.colorStates.set(productName, colorKey);
        
        // Update UI pills
        this.updateColorPills(productName, colorKey);
        
        console.log(`🎨 Applied ${colorData.name} color to ${productName}`);
    }
    
    updateColorPills(productName, activeColor) {
        const pills = document.querySelectorAll(`[data-product="${productName}"] .color-pill`);
        pills.forEach(pill => {
            const variant = pill.dataset.variant;
            if (variant === activeColor) {
                pill.classList.add('active');
                pill.setAttribute('aria-pressed', 'true');
            } else {
                pill.classList.remove('active');
                pill.setAttribute('aria-pressed', 'false');
            }
        });
    }
    
    setupColorHandlers() {
        // Global color pill click handler
        document.addEventListener('click', (event) => {
            const pill = event.target.closest('.color-pill');
            if (!pill) return;
            
            const container = pill.closest('[data-product]');
            if (!container) return;
            
            const productName = container.dataset.product;
            const colorKey = pill.dataset.variant;
            
            if (this.viewers.has(productName) && this.colors[colorKey]) {
                const viewer = this.viewers.get(productName);
                this.applyColor(viewer.model, productName, colorKey);
                
                // Prevent event bubbling
                event.preventDefault();
                event.stopPropagation();
            }
        });
        
        console.log('🎯 Color handlers setup complete');
    }
    
    setupResizeObserver() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const container = entry.target;
                const productName = container.dataset?.product;
                
                if (productName && this.viewers.has(productName)) {
                    const viewer = this.viewers.get(productName);
                    const { camera, renderer } = viewer;
                    
                    const width = container.clientWidth;
                    const height = container.clientHeight;
                    
                    if (width > 0 && height > 0) {
                        camera.aspect = width / height;
                        camera.updateProjectionMatrix();
                        renderer.setSize(width, height);
                    }
                }
            });
        });
        
        // Observe all viewer containers
        this.viewers.forEach((viewer) => {
            this.resizeObserver.observe(viewer.container);
        });
    }
    
    changeColor(productName, colorKey) {
        if (!this.viewers.has(productName) || !this.colors[colorKey]) {
            console.warn(`Cannot change color: ${productName} viewer or ${colorKey} color not found`);
            return;
        }
        
        const viewer = this.viewers.get(productName);
        this.applyColor(viewer.model, productName, colorKey);
    }
    
    createFallback(container, productName) {
        container.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(139, 92, 246, 0.1);
                border: 2px dashed rgba(139, 92, 246, 0.3);
                border-radius: 12px;
                color: #8b5cf6;
                font-weight: 600;
            ">
                3D Model Loading...
            </div>
        `;
    }
    
    destroy() {
        // Cleanup all viewers
        this.viewers.forEach((viewer, productName) => {
            viewer.renderer.dispose();
            viewer.controls.dispose();
            console.log(`🧹 Cleaned up viewer for ${productName}`);
        });
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        this.viewers.clear();
        this.colorStates.clear();
        this.isInitialized = false;
    }
}

// Global color pill click handler function
function handleColorPillClick(productName, colorKey, element) {
    if (window.robust3DViewer) {
        window.robust3DViewer.changeColor(productName, colorKey);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Ensure Three.js is loaded
    if (typeof THREE !== 'undefined') {
        window.robust3DViewer = new Robust3DViewer();
    } else {
        console.error('Three.js not loaded - cannot initialize 3D viewers');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.robust3DViewer) {
        window.robust3DViewer.destroy();
    }
});
