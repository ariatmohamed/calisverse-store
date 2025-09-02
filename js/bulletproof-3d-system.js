/**
 * Bulletproof 3D Product Viewer System
 * Stable, reusable component architecture with comprehensive error handling
 */

// 3D State Management with useReducer pattern
const create3DReducer = () => {
    const initialState = {
        isLoading: true,
        isError: false,
        errorMessage: '',
        isInitialized: false,
        selectedColor: null,
        scene: null,
        camera: null,
        renderer: null,
        controls: null,
        model: null,
        animationId: null
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case 'INIT_START':
                return { ...state, isLoading: true, isError: false };
            case 'INIT_SUCCESS':
                return {
                    ...state,
                    isLoading: false,
                    isInitialized: true,
                    scene: action.payload.scene,
                    camera: action.payload.camera,
                    renderer: action.payload.renderer,
                    controls: action.payload.controls,
                    model: action.payload.model
                };
            case 'INIT_ERROR':
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    errorMessage: action.payload.message
                };
            case 'COLOR_CHANGE':
                return { ...state, selectedColor: action.payload.color };
            case 'SET_ANIMATION_ID':
                return { ...state, animationId: action.payload.id };
            case 'DISPOSE':
                return { ...initialState };
            default:
                return state;
        }
    };

    return { initialState, reducer };
};

// Product Model Factory with error handling
class ProductModelFactory {
    static createModel(productType) {
        let model;
        switch(productType) {
            case 'pullup-bar':
                model = ProductModelFactory.createPullUpBar();
                break;
            case 'rings':
                model = ProductModelFactory.createRingsModel();
                break;
            case 'parallettes':
                model = ProductModelFactory.createParallettesModel();
                break;
            default:
                model = ProductModelFactory.createFallbackCube();
        }
        
        model.castShadow = true;
        model.receiveShadow = true;
        return model;
    }

    static createPullUpBar() {
        const group = new THREE.Group();
        
        // Main horizontal bar with realistic proportions
        const barGeometry = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 32);
        const barMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2c2c2c,
            shininess: 150,
            specular: 0x888888,
            reflectivity: 0.3
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.rotation.z = Math.PI / 2;
        bar.position.y = 0.6;
        bar.userData.colorTarget = true;
        group.add(bar);
        
        // Grip texture rings on bar
        for (let i = -8; i <= 8; i += 2) {
            const ringGeometry = new THREE.TorusGeometry(0.045, 0.003, 8, 16);
            const ringMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x2c2c2c,
                shininess: 100
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.set(i * 0.1, 0.6, 0);
            ring.rotation.x = Math.PI / 2;
            ring.userData.colorTarget = true;
            group.add(ring);
        }
        
        // Heavy-duty wall brackets
        const bracketGeometry = new THREE.BoxGeometry(0.35, 0.5, 0.25);
        const bracketMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2c2c2c,
            shininess: 120,
            specular: 0x666666
        });
        
        // Left bracket with angled support
        const leftBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
        leftBracket.position.set(-1.3, 0.6, -0.12);
        leftBracket.userData.colorTarget = true;
        group.add(leftBracket);
        
        // Left support beam
        const supportGeometry = new THREE.BoxGeometry(0.08, 0.4, 0.15);
        const leftSupport = new THREE.Mesh(supportGeometry, bracketMaterial);
        leftSupport.position.set(-1.15, 0.4, -0.05);
        leftSupport.rotation.z = -0.3;
        leftSupport.userData.colorTarget = true;
        group.add(leftSupport);
        
        // Right bracket with angled support
        const rightBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
        rightBracket.position.set(1.3, 0.6, -0.12);
        rightBracket.userData.colorTarget = true;
        group.add(rightBracket);
        
        const rightSupport = new THREE.Mesh(supportGeometry, bracketMaterial);
        rightSupport.position.set(1.15, 0.4, -0.05);
        rightSupport.rotation.z = 0.3;
        rightSupport.userData.colorTarget = true;
        group.add(rightSupport);
        
        // Professional mounting hardware
        const screwGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.08, 12);
        const screwMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 200,
            specular: 0xaaaaaa
        });
        
        // 6 mounting screws per bracket
        [-1.3, 1.3].forEach(x => {
            [-0.15, 0, 0.15].forEach(yOffset => {
                [0.15, -0.15].forEach(zOffset => {
                    const screw = new THREE.Mesh(screwGeometry, screwMaterial);
                    screw.position.set(x, 0.6 + yOffset, 0.04 + zOffset);
                    screw.rotation.x = Math.PI / 2;
                    group.add(screw);
                    
                    // Screw heads
                    const headGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.01, 12);
                    const head = new THREE.Mesh(headGeometry, screwMaterial);
                    head.position.set(x, 0.6 + yOffset, 0.09 + zOffset);
                    head.rotation.x = Math.PI / 2;
                    group.add(head);
                });
            });
        });
        
        // Add subtle auto-rotation
        group.userData.autoRotate = true;
        group.userData.rotationSpeed = 0.002;
        
        return group;
    }
    
    static createFallbackCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x8b5cf6 });
        const cube = new THREE.Mesh(geometry, material);
        cube.userData.colorTarget = true;
        return cube;
    }

    static createRingsModel() {
        const group = new THREE.Group();
        
        // Ceiling mount
        const mountGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
        const mountMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            metalness: 0.9,
            roughness: 0.1
        });
        const mount = new THREE.Mesh(mountGeometry, mountMaterial);
        mount.position.y = 2.8;
        group.add(mount);
        
        // Rings
        const ringGeometry = new THREE.TorusGeometry(0.4, 0.05, 8, 16);
        const ringMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b4513,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const leftRing = new THREE.Mesh(ringGeometry, ringMaterial);
        leftRing.position.set(-0.6, 0, 0);
        leftRing.castShadow = true;
        leftRing.userData.colorTarget = true;
        group.add(leftRing);
        
        const rightRing = new THREE.Mesh(ringGeometry, ringMaterial);
        rightRing.position.set(0.6, 0, 0);
        rightRing.castShadow = true;
        rightRing.userData.colorTarget = true;
        group.add(rightRing);
        
        // Suspension straps
        const strapGeometry = new THREE.BoxGeometry(0.03, 3, 0.002);
        const strapMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2a2a2a,
            roughness: 0.9
        });
        
        for (let i = 0; i < 4; i++) {
            const strap = new THREE.Mesh(strapGeometry, strapMaterial);
            strap.position.set(
                i < 2 ? -0.6 + (i * 0.2) : 0.6 - ((i - 2) * 0.2),
                1.75,
                0
            );
            strap.userData.swayTarget = true;
            group.add(strap);
        }
        
        // Animation setup
        group.userData.animationTime = 0;
        group.userData.originalPositions = {};
        group.traverse((child) => {
            if (child.userData.swayTarget || child.userData.colorTarget) {
                group.userData.originalPositions[child.uuid] = child.position.clone();
            }
        });
        
        return group;
    }

    static createParallettesModel() {
        const group = new THREE.Group();
        
        // Handles
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
        
        // Support legs
        const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 12);
        const legMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8a9ba8,
            roughness: 0.6,
            metalness: 0.3
        });
        
        // 4 legs for each parallette
        [[-0.7, -0.8], [0.7, -0.8], [-0.7, 0.8], [0.7, 0.8]].forEach(([x, z]) => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(x, 0.4, z);
            leg.castShadow = true;
            leg.userData.colorTarget = true;
            group.add(leg);
            
            // Rubber feet
            const footGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.02, 12);
            const footMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x1a1a1a,
                roughness: 0.9
            });
            const foot = new THREE.Mesh(footGeometry, footMaterial);
            foot.position.set(x, 0.01, z);
            group.add(foot);
        });
        
        return group;
    }
}

// Color Management System
class ColorManager {
    static colors = {
        black: { hex: '#2c2c2c', name: 'Black' },
        steel: { hex: '#8a9ba8', name: 'Steel' },
        walnut: { hex: '#8b4513', name: 'Walnut' },
        purple: { hex: '#8b5cf6', name: 'Purple' }
    };

    static defaultColors = {
        'pullup-bar': 'black',
        'rings': 'walnut',
        'parallettes': 'steel'
    };

    static applyColor(model, colorKey, productType) {
        try {
            const colorData = ColorManager.colors[colorKey];
            if (!colorData) {
                console.warn(`Unknown color: ${colorKey}`);
                return false;
            }

            const color = new THREE.Color(colorData.hex);
            
            model.traverse((child) => {
                if (child.isMesh && child.userData.colorTarget) {
                    child.material.color.copy(color);
                    
                    // Apply material properties based on color and product
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
                }
            });

            return true;
        } catch (error) {
            console.error('Failed to apply color:', error);
            return false;
        }
    }
}

// Main ProductViewer3D Component
class ProductViewer3D {
    constructor(container, options = {}) {
        this.container = container;
        this.productType = options.productType || 'pullup-bar';
        this.selectedColor = options.selectedColor || ColorManager.defaultColors[this.productType];
        this.onColorChange = options.onColorChange || (() => {});
        this.onError = options.onError || (() => {});
        this.onReady = options.onReady || (() => {});
        
        // State management
        const { initialState, reducer } = create3DReducer();
        this.state = initialState;
        this.dispatch = (action) => {
            this.state = reducer(this.state, action);
            this.handleStateChange();
        };
        
        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.animate = this.animate.bind(this);
        
        this.init();
    }

    async init() {
        try {
            this.dispatch({ type: 'INIT_START' });
            
            // Show loading state
            this.showLoadingState();
            
            // Check Three.js availability
            if (typeof THREE === 'undefined') {
                throw new Error('Three.js not loaded');
            }
            
            // Initialize 3D scene
            await this.setupScene();
            
            // Create and add model
            const model = ProductModelFactory.createModel(this.productType);
            this.state.scene.add(model);
            this.state.model = model;
            
            // Apply default color
            ColorManager.applyColor(model, this.selectedColor, this.productType);
            
            // Add subtle initial rotation animation
            if (model.userData.autoRotate) {
                this.startAutoRotation();
            }
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start animation loop
            this.startAnimation();
            
            this.dispatch({
                type: 'INIT_SUCCESS',
                payload: { model }
            });
            
            this.hideLoadingState();
            this.onReady();
            
        } catch (error) {
            console.error('3D Viewer initialization failed:', error);
            this.dispatch({ type: 'INIT_ERROR', payload: error.message });
            this.showErrorState(error.message);
            this.onError(error);
        }
    }

    showLoadingState() {
        this.container.innerHTML = `
            <div class="professional-loader">
                <div class="loader-content">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading 3D Model...</div>
                </div>
            </div>
        `;
    }

    hideLoadingState() {
        const loader = this.container.querySelector('.professional-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    }

    showErrorState(message) {
        this.container.innerHTML = `
            <div class="error-fallback">
                <div class="error-content">
                    <div class="error-icon">⚠️</div>
                    <div class="error-message">Failed to load 3D model</div>
                    <div class="error-details">${message}</div>
                </div>
            </div>
        `;
    }

    async setupScene() {
        // Create scene
        const scene = new THREE.Scene();
        scene.background = null;
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.set(3, 2, 3);
        
        // Create renderer
        const canvas = document.createElement('canvas');
        const renderer = new THREE.WebGLRenderer({ 
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        
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
        
        // Setup controls with consistent settings
        const controls = new THREE.OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.minDistance = 3;
        controls.maxDistance = 8;
        controls.maxPolarAngle = Math.PI * 0.75;
        controls.autoRotate = false;
        controls.rotateSpeed = 0.8;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        
        // Add canvas to container
        this.container.appendChild(canvas);
        
        // Store references
        this.state.scene = scene;
        this.state.camera = camera;
        this.state.renderer = renderer;
        this.state.controls = controls;
    }

    setupEventListeners() {
        window.addEventListener('resize', this.handleResize);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    handleResize() {
        if (!this.state.camera || !this.state.renderer) return;
        
        const rect = this.container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        this.state.camera.aspect = width / height;
        this.state.camera.updateProjectionMatrix();
        this.state.renderer.setSize(width, height);
    }

    startAnimation() {
        this.animate();
    }

    animate() {
        if (!this.state.isRunning) return;
        
        requestAnimationFrame(this.animate);
        
        if (this.state.controls) {
            this.state.controls.update();
        }
        
        // Auto-rotation for pull-up bar
        if (this.state.model && this.state.model.userData.autoRotate) {
            this.state.model.rotation.y += this.state.model.userData.rotationSpeed || 0.002;
        }
        
        // Sway animation for rings
        if (this.productType === 'rings' && this.state.model) {
            this.updateRingsAnimation();
        }
        
        if (this.state.renderer && this.state.scene && this.state.camera) {
            this.state.renderer.render(this.state.scene, this.state.camera);
        }
    }

    updateRingsAnimation() {
        if (!this.state.model.userData.animationTime) {
            this.state.model.userData.animationTime = 0;
        }
        
        this.state.model.userData.animationTime += 0.01;
        
        this.state.model.traverse((child) => {
            if (child.userData.swayTarget) {
                const originalPos = this.state.model.userData.originalPositions[child.uuid];
                if (originalPos) {
                    child.position.x = originalPos.x + Math.sin(this.state.model.userData.animationTime) * 0.02;
                    child.rotation.z = Math.sin(this.state.model.userData.animationTime) * 0.05;
                }
            }
        });
    }

    changeColor(colorKey) {
        if (!this.state.model) return false;
        
        const success = ColorManager.applyColor(this.state.model, colorKey, this.productType);
        if (success) {
            this.selectedColor = colorKey;
            this.onColorChange(colorKey);
        }
        return success;
    }

    startAutoRotation() {
        if (this.state.controls) {
            this.state.controls.autoRotate = true;
            this.state.controls.autoRotateSpeed = 1.0;
        }
    }

    stopAutoRotation() {
        if (this.state.controls) {
            this.state.controls.autoRotate = false;
        }
    }

    handleStateChange() {
        // Handle state changes if needed
    }

    cleanup() {
        this.state.isRunning = false;
        
        if (this.state.renderer) {
            this.state.renderer.dispose();
        }
        
        if (this.state.scene) {
            this.state.scene.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }
        
        window.removeEventListener('resize', this.handleResize);
    }
}

// Global Manager
class BulletproofViewerManager {
    static viewers = new Map();
    
    static createViewer(containerId, productType) {
        const container = document.querySelector(`[data-product="${productType}"]`);
        if (!container) {
            console.error(`Container not found for product: ${productType}`);
            return null;
        }
        
        const viewer = new ProductViewer3D(container, {
            productType,
            onColorChange: (color) => {
                console.log(`Color changed to ${color} for ${productType}`);
            },
            onReady: () => {
                console.log(`3D viewer ready for ${productType}`);
            },
            onError: (error) => {
                console.error(`3D viewer error for ${productType}:`, error);
            }
        });
        
        BulletproofViewerManager.viewers.set(productType, viewer);
        return viewer;
    }
    
    static getViewer(productType) {
        return BulletproofViewerManager.viewers.get(productType);
    }
    
    static changeColor(productType, colorKey) {
        const viewer = BulletproofViewerManager.getViewer(productType);
        if (viewer) {
            return viewer.changeColor(colorKey);
        }
        return false;
    }
}

// Initialize viewers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all product viewers
    ['pullup-bar', 'rings', 'parallettes'].forEach(productType => {
        BulletproofViewerManager.createViewer(`${productType}-viewer`, productType);
    });
});

// Global color change handler
function handleColorPillClick(productType, colorKey, element) {
    // Update UI
    const colorPills = element.parentElement.querySelectorAll('.color-pill');
    colorPills.forEach(pill => {
        pill.classList.remove('active');
        pill.setAttribute('aria-pressed', 'false');
    });
    
    element.classList.add('active');
    element.setAttribute('aria-pressed', 'true');
    
    // Change 3D model color
    BulletproofViewerManager.changeColor(productType, colorKey);
}
        const leftBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
        leftBracket.position.set(-1.3, 0.6, -0.12);
        group.add(leftBracket);
        
        // Left support beam
        const supportGeometry = new THREE.BoxGeometry(0.08, 0.4, 0.15);
        const leftSupport = new THREE.Mesh(supportGeometry, bracketMaterial);
        leftSupport.position.set(-1.15, 0.4, -0.05);
        leftSupport.rotation.z = -0.3;
        group.add(leftSupport);
        
        // Right bracket with angled support
        const rightBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
        rightBracket.position.set(1.3, 0.6, -0.12);
        group.add(rightBracket);
        
        const rightSupport = new THREE.Mesh(supportGeometry, bracketMaterial);
        rightSupport.position.set(1.15, 0.4, -0.05);
        rightSupport.rotation.z = 0.3;
        group.add(rightSupport);
        
        // Professional mounting hardware
        const screwGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.08, 12);
        const screwMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 200,
            specular: 0xaaaaaa
        });
        
        // 6 mounting screws per bracket
        [-1.3, 1.3].forEach(x => {
            [-0.15, 0, 0.15].forEach(yOffset => {
                [0.15, -0.15].forEach(zOffset => {
                    const screw = new THREE.Mesh(screwGeometry, screwMaterial);
                    screw.position.set(x, 0.6 + yOffset, 0.04 + zOffset);
                    screw.rotation.x = Math.PI / 2;
                    group.add(screw);
                    
                    // Screw heads
                    const headGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.01, 12);
                    const head = new THREE.Mesh(headGeometry, screwMaterial);
                    head.position.set(x, 0.6 + yOffset, 0.09 + zOffset);
                    head.rotation.x = Math.PI / 2;
                    group.add(head);
                });
            });
        });
        
        // Add subtle auto-rotation
        group.userData.autoRotate = true;
        group.userData.rotationSpeed = 0.002;
        
        return group;
    }

    static createRingsModel() {
        const group = new THREE.Group();
        
        // Ceiling mount
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
        
        // Rings with realistic wood texture
        const ringGeometry = new THREE.TorusGeometry(0.45, 0.08, 12, 24);
        const ringMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b4513,
            roughness: 0.7,
            metalness: 0.05
        });
        
        const leftRing = new THREE.Mesh(ringGeometry, ringMaterial.clone());
        leftRing.position.set(-0.6, 0, 0);
        leftRing.castShadow = true;
        leftRing.userData.colorTarget = true;
        group.add(leftRing);
        
        const rightRing = new THREE.Mesh(ringGeometry, ringMaterial.clone());
        rightRing.position.set(0.6, 0, 0);
        rightRing.castShadow = true;
        rightRing.userData.colorTarget = true;
        group.add(rightRing);
        
        // Suspension straps
        const strapGeometry = new THREE.BoxGeometry(0.03, 3, 0.002);
        const strapMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2a2a2a,
            roughness: 0.9
        });
        
        for (let i = 0; i < 4; i++) {
            const strap = new THREE.Mesh(strapGeometry, strapMaterial);
            strap.position.set(
                i < 2 ? -0.6 + (i * 0.2) : 0.6 - ((i - 2) * 0.2),
                1.75,
                0
            );
            strap.userData.swayTarget = true;
            group.add(strap);
        }
        
        // Animation setup
        group.userData.animationTime = 0;
        group.userData.originalPositions = {};
        group.traverse((child) => {
            if (child.userData.swayTarget || child.userData.colorTarget) {
                group.userData.originalPositions[child.uuid] = child.position.clone();
            }
        });
        
        return group;
    }

    static createParallettesModel() {
        const group = new THREE.Group();
        
        // Handles
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
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12);
        const legMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8a9ba8,
            roughness: 0.6,
            metalness: 0.3
        });
        
        for (let z = 0; z < 2; z++) {
            for (let x = 0; x < 2; x++) {
                const leg = new THREE.Mesh(legGeometry, legMaterial);
                leg.position.set(
                    x === 0 ? -0.6 : 0.6,
                    0.4,
                    z === 0 ? -0.8 : 0.8
                );
                leg.castShadow = true;
                leg.userData.colorTarget = true;
                group.add(leg);
            }
        }
        
        return group;
    }

    static createFallbackModel() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x8b5cf6 });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.userData.colorTarget = true;
        cube.userData.isFallback = true;
        return cube;
    }
}

// Color Management System
class ColorManager {
    static colors = {
        black: { hex: '#2c2c2c', name: 'Black' },
        steel: { hex: '#8a9ba8', name: 'Steel' },
        walnut: { hex: '#8b4513', name: 'Walnut' },
        purple: { hex: '#8b5cf6', name: 'Purple' }
    };

    static defaultColors = {
        'pullup-bar': 'black',
        'rings': 'walnut',
        'parallettes': 'steel'
    };

    static applyColor(model, colorKey, productType) {
        try {
            const colorData = ColorManager.colors[colorKey];
            if (!colorData) {
                console.warn(`Unknown color: ${colorKey}`);
                return false;
            }

            const color = new THREE.Color(colorData.hex);
            
            model.traverse((child) => {
                if (child.isMesh && child.userData.colorTarget) {
                    child.material.color.copy(color);
                    
                    // Apply material properties based on color and product
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
                }
            });

            return true;
        } catch (error) {
            console.error('Failed to apply color:', error);
            return false;
        }
    }
}

// Main ProductViewer3D Component
class ProductViewer3D {
    constructor(container, options = {}) {
        this.container = container;
        this.productType = options.productType || 'pullup-bar';
        this.selectedColor = options.selectedColor || ColorManager.defaultColors[this.productType];
        this.onColorChange = options.onColorChange || (() => {});
        this.onError = options.onError || (() => {});
        this.onReady = options.onReady || (() => {});
        
        // State management
        const { initialState, reducer } = create3DReducer();
        this.state = initialState;
        this.dispatch = (action) => {
            this.state = reducer(this.state, action);
            this.handleStateChange();
        };
        
        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.animate = this.animate.bind(this);
        
        this.init();
    }

    async init() {
        try {
            this.dispatch({ type: 'INIT_START' });
            
            // Show loading state
            this.showLoadingState();
            
            // Check Three.js availability
            if (typeof THREE === 'undefined') {
                throw new Error('Three.js not loaded');
            }
            
            // Initialize 3D scene
            await this.setupScene();
            
            // Create and add model
            const model = ProductModelFactory.createModel(this.productType);
            this.state.scene.add(model);
            this.state.model = model;
            
            // Apply default color
            ColorManager.applyColor(model, this.selectedColor, this.productType);
            
            // Add subtle initial rotation animation
            if (model.userData.autoRotate) {
                this.startAutoRotation();
            }
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start animation loop
            this.startAnimation();
            
            this.dispatch({
                type: 'INIT_SUCCESS',
                payload: {
                    scene: this.state.scene,
                    camera: this.state.camera,
                    renderer: this.state.renderer,
                    controls: this.state.controls,
                    model: model
                }
            });
            
            this.hideLoadingState();
            this.onReady();
            
        } catch (error) {
            console.error('3D initialization failed:', error);
            this.dispatch({
                type: 'INIT_ERROR',
                payload: { message: error.message }
            });
            this.showErrorState(error.message);
            this.onError(error);
        }
    }

    async setupScene() {
        // Create scene
        const scene = new THREE.Scene();
        scene.background = null;
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(5, 3, 5);
        
        // Create renderer
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
            background: transparent;
        `;
        
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        // Setup lighting
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
        
        // Setup controls with consistent settings
        const controls = new THREE.OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.minDistance = 3;
        controls.maxDistance = 8;
        controls.maxPolarAngle = Math.PI * 0.75;
        controls.autoRotate = false;
        controls.rotateSpeed = 0.8;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        
        // Add canvas to container
        this.container.appendChild(canvas);
        
        // Store references
        this.state.scene = scene;
        this.state.camera = camera;
        this.state.renderer = renderer;
        this.state.controls = controls;
    }

    startAnimation() {
        const animate = () => {
            try {
                const animationId = requestAnimationFrame(animate);
                this.dispatch({ type: 'SET_ANIMATION_ID', payload: { id: animationId } });
                
                if (this.state.controls) {
                    this.state.controls.update();
                }
                
                // Add sway animation for rings
                if (this.productType === 'rings' && this.state.model && this.state.model.userData.animationTime !== undefined) {
                    this.state.model.userData.animationTime += 0.01;
                    const swayAmount = Math.sin(this.state.model.userData.animationTime) * 0.02;
                    
                    this.state.model.traverse((child) => {
                        if (child.userData.swayTarget && this.state.model.userData.originalPositions[child.uuid]) {
                            const originalPos = this.state.model.userData.originalPositions[child.uuid];
                            child.position.x = originalPos.x + swayAmount;
                        }
                    });
                }
                
                if (this.state.renderer && this.state.scene && this.state.camera) {
                    this.state.renderer.render(this.state.scene, this.state.camera);
                }
            } catch (error) {
                console.error('Animation error:', error);
            }
        };
        
        animate();
    }

    setupEventListeners() {
        // Resize observer for responsive behavior
        this.resizeObserver = new ResizeObserver((entries) => {
            this.handleResize();
        });
        this.resizeObserver.observe(this.container);
        
        // Window resize fallback
        window.addEventListener('resize', this.handleResize);
        
        // Touch controls for mobile
        if ('ontouchstart' in window) {
            this.setupTouchControls();
        }
    }

    setupTouchControls() {
        if (this.state.controls) {
            this.state.controls.touches = {
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN
            };
        }
    }

    handleResize() {
        try {
            if (!this.state.camera || !this.state.renderer || !this.container) return;
            
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            
            if (width > 0 && height > 0) {
                this.state.camera.aspect = width / height;
                this.state.camera.updateProjectionMatrix();
                this.state.renderer.setSize(width, height);
            }
        } catch (error) {
            console.error('Resize error:', error);
        }
    }

    changeColor(colorKey) {
        try {
            if (!this.state.model || !ColorManager.colors[colorKey]) {
                console.warn(`Cannot change color: ${colorKey}`);
                return false;
            }
            
            const success = ColorManager.applyColor(this.state.model, colorKey, this.productType);
            if (success) {
                this.dispatch({ type: 'COLOR_CHANGE', payload: { color: colorKey } });
                this.selectedColor = colorKey;
                this.onColorChange(colorKey);
            }
            
            return success;
        } catch (error) {
            console.error('Color change error:', error);
            return false;
        }
    }

    showLoadingState() {
        this.container.innerHTML = `
            <div class="loading-state" style="
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(139, 92, 246, 0.05);
                border-radius: 12px;
                color: #8b5cf6;
            ">
                <div class="spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(139, 92, 246, 0.3);
                    border-top: 3px solid #8b5cf6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 16px;
                "></div>
                <div style="font-weight: 600;">Loading 3D Model...</div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }

    hideLoadingState() {
        const loadingState = this.container.querySelector('.loading-state');
        if (loadingState) {
            loadingState.style.opacity = '0';
            loadingState.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (loadingState.parentNode) {
                    loadingState.parentNode.removeChild(loadingState);
                }
            }, 300);
        }
    }

    showErrorState(message) {
        this.container.innerHTML = `
            <div class="error-state" style="
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(239, 68, 68, 0.05);
                border: 2px dashed rgba(239, 68, 68, 0.3);
                border-radius: 12px;
                color: #ef4444;
                text-align: center;
                padding: 20px;
            ">
                <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
                <div style="font-weight: 600; margin-bottom: 8px;">3D Viewer Error</div>
                <div style="font-size: 14px; opacity: 0.8;">${message}</div>
                <button onclick="location.reload()" style="
                    margin-top: 16px;
                    padding: 8px 16px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                ">Reload Page</button>
            </div>
        `;
    }

    handleStateChange() {
        // React to state changes if needed
        if (this.state.isError) {
            console.error('3D Viewer Error:', this.state.errorMessage);
        }
    }

    dispose() {
        try {
            // Stop animation
            if (this.state.animationId) {
                cancelAnimationFrame(this.state.animationId);
            }
            
            // Dispose Three.js resources
            if (this.state.renderer) {
                this.state.renderer.dispose();
            }
            
            if (this.state.controls) {
                this.state.controls.dispose();
            }
            
            // Remove event listeners
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }
            
            window.removeEventListener('resize', this.handleResize);
            
            // Clear container
            this.container.innerHTML = '';
            
            // Reset state
            this.dispatch({ type: 'DISPOSE' });
            
            console.log('3D Viewer disposed successfully');
        } catch (error) {
            console.error('Disposal error:', error);
        }
    }
}

// Global initialization and management
class BulletproofViewer3DManager {
    constructor() {
        this.viewers = new Map();
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeViewers();
        });
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.disposeAll();
        });
        
        this.isInitialized = true;
    }

    initializeViewers() {
        const containers = document.querySelectorAll('.model-viewer-container');
        
        containers.forEach(container => {
            const productType = container.dataset.product;
            if (productType && !this.viewers.has(productType)) {
                this.createViewer(container, productType);
            }
        });
    }

    createViewer(container, productType) {
        try {
            const viewer = new ProductViewer3D(container, {
                productType: productType,
                selectedColor: ColorManager.defaultColors[productType],
                onColorChange: (color) => {
                    this.updateColorPills(productType, color);
                },
                onError: (error) => {
                    console.error(`Viewer error for ${productType}:`, error);
                },
                onReady: () => {
                    console.log(`✅ ${productType} viewer ready`);
                }
            });
            
            this.viewers.set(productType, viewer);
            this.setupColorHandlers(productType);
            
        } catch (error) {
            console.error(`Failed to create viewer for ${productType}:`, error);
        }
    }

    setupColorHandlers(productType) {
        // Global color pill click handler for this product
        document.addEventListener('click', (event) => {
            const pill = event.target.closest('.color-pill');
            if (!pill) return;
            
            const container = pill.closest(`[data-product="${productType}"]`);
            if (!container) return;
            
            const colorKey = pill.dataset.variant;
            const viewer = this.viewers.get(productType);
            
            if (viewer && ColorManager.colors[colorKey]) {
                viewer.changeColor(colorKey);
                event.preventDefault();
                event.stopPropagation();
            }
        });
    }

    updateColorPills(productType, activeColor) {
        const pills = document.querySelectorAll(`[data-product="${productType}"] .color-pill`);
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

    changeColor(productType, colorKey) {
        const viewer = this.viewers.get(productType);
        if (viewer) {
            return viewer.changeColor(colorKey);
        }
        return false;
    }

    disposeAll() {
        this.viewers.forEach((viewer, productType) => {
            viewer.dispose();
            console.log(`🧹 Disposed viewer for ${productType}`);
        });
        this.viewers.clear();
    }
}

// Initialize global manager
window.bulletproofViewer3D = new BulletproofViewer3DManager();

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof THREE !== 'undefined') {
            window.bulletproofViewer3D.init();
        } else {
            console.error('Three.js not loaded - cannot initialize bulletproof 3D viewers');
        }
    });
} else {
    if (typeof THREE !== 'undefined') {
        window.bulletproofViewer3D.init();
    }
}

// Global helper function for manual color changes
function handleColorPillClick(productType, colorKey, element) {
    if (window.bulletproofViewer3D) {
        window.bulletproofViewer3D.changeColor(productType, colorKey);
    }
}
