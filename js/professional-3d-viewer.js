// Professional 3D Viewer with Variant System and Sticky Cart
class Professional3DViewer {
    constructor(containerId, equipmentType, modelPath) {
        this.containerId = containerId;
        this.equipmentType = equipmentType;
        this.modelPath = modelPath;
        this.currentVariant = 'black';
        this.model = null;
        this.isInteracting = false;
        
        this.init();
    }
    
    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) return;
        
        this.setupViewer();
        this.createVariantControls();
        this.createStickyCartButton();
        this.setupInteractionFeedback();
    }
    
    setupViewer() {
        // Clear existing content
        this.container.innerHTML = '';
        this.container.className += ' professional-3d-viewer';
        
        // Create viewer canvas area
        const viewerCanvas = document.createElement('div');
        viewerCanvas.className = 'viewer-canvas';
        viewerCanvas.id = `${this.containerId}-canvas`;
        this.container.appendChild(viewerCanvas);
        
        // Initialize 3D scene (using the GLTF loader we created)
        this.init3DScene(viewerCanvas);
    }
    
    init3DScene(canvas) {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent
        
        // Camera with professional settings
        this.camera = new THREE.PerspectiveCamera(
            35, 
            canvas.clientWidth / canvas.clientHeight, 
            0.1, 
            100
        );
        this.camera.position.set(5, 3, 7);
        
        // Renderer with high quality settings
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;
        
        canvas.appendChild(this.renderer.domElement);
        
        // Professional controls - full interaction
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.04;
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;
        this.controls.enablePan = true; // Enable pan for professional use
        this.controls.autoRotate = false;
        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 0.8;
        this.controls.panSpeed = 0.6;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 15;
        this.controls.minPolarAngle = Math.PI / 8;
        this.controls.maxPolarAngle = Math.PI - Math.PI / 8;
        
        // Studio lighting with HDRI-style setup
        this.setupStudioLighting();
        
        // Load model
        this.loadModel();
        
        // Start render loop
        this.startRenderLoop();
        
        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupStudioLighting() {
        // Clear existing lights
        this.scene.children = this.scene.children.filter(child => !child.isLight);
        
        // HDRI-style environment lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.25);
        this.scene.add(ambientLight);
        
        // Key light (main directional)
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(8, 12, 6);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 50;
        keyLight.shadow.camera.left = -15;
        keyLight.shadow.camera.right = 15;
        keyLight.shadow.camera.top = 15;
        keyLight.shadow.camera.bottom = -15;
        keyLight.shadow.bias = -0.0001;
        this.scene.add(keyLight);
        
        // Fill light (soft, opposite side)
        const fillLight = new THREE.DirectionalLight(0x8B5CF6, 0.3);
        fillLight.position.set(-4, 6, -4);
        this.scene.add(fillLight);
        
        // Rim light (edge definition)
        const rimLight = new THREE.DirectionalLight(0xA78BFA, 0.4);
        rimLight.position.set(0, -8, -12);
        this.scene.add(rimLight);
        
        // Environment hemisphere (neutral HDRI feel)
        const envLight = new THREE.HemisphereLight(0x87CEEB, 0x4682B4, 0.15);
        this.scene.add(envLight);
        
        // Add subtle point lights for extra depth
        const pointLight1 = new THREE.PointLight(0x8B5CF6, 0.2, 20);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xA855F7, 0.15, 15);
        pointLight2.position.set(-3, 3, -3);
        this.scene.add(pointLight2);
    }
    
    loadModel() {
        // Show loading state
        this.showLoading();
        
        // Initialize GLTF loader if not available
        if (!window.gltfLoader) {
            const script = document.createElement('script');
            script.src = 'https://threejs.org/examples/js/loaders/GLTFLoader.js';
            script.onload = () => {
                window.gltfLoader = new THREE.GLTFLoader();
                this.loadModelFile();
            };
            script.onerror = () => {
                this.showFallback();
            };
            document.head.appendChild(script);
        } else {
            this.loadModelFile();
        }
    }
    
    loadModelFile() {
        window.gltfLoader.load(
            this.modelPath,
            (gltf) => {
                this.model = gltf.scene;
                this.model.name = 'equipment';
                
                // Enhance model materials and shadows
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        if (child.material) {
                            child.material.envMapIntensity = 0.7;
                            child.material.needsUpdate = true;
                        }
                    }
                });
                
                this.scene.add(this.model);
                this.frameModel();
                this.hideLoading();
                this.applyVariant(this.currentVariant);
            },
            (progress) => {
                const percent = (progress.loaded / progress.total) * 100;
                this.updateLoadingProgress(percent);
            },
            (error) => {
                console.error('Model loading error:', error);
                this.showFallback();
            }
        );
    }
    
    frameModel() {
        if (!this.model) return;
        
        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Center model
        this.model.position.sub(center);
        
        // Calculate optimal camera distance
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        const cameraDistance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.8;
        
        // Set camera position for best view
        this.camera.position.set(cameraDistance, cameraDistance * 0.6, cameraDistance * 0.8);
        this.camera.lookAt(0, 0, 0);
        
        // Update controls
        this.controls.target.set(0, 0, 0);
        this.controls.minDistance = cameraDistance * 0.4;
        this.controls.maxDistance = cameraDistance * 2.5;
        this.controls.update();
    }
    
    createVariantControls() {
        const variantContainer = document.createElement('div');
        variantContainer.className = 'variant-controls';
        
        const variants = [
            { id: 'black', name: 'Matte Black', color: '#2a2a2a' },
            { id: 'walnut', name: 'Walnut Wood', color: '#8B4513' },
            { id: 'steel', name: 'Brushed Steel', color: '#8a8a8a' }
        ];
        
        variantContainer.innerHTML = `
            <div class="variant-label">Material:</div>
            <div class="variant-options">
                ${variants.map(variant => `
                    <button class="variant-btn ${variant.id === this.currentVariant ? 'active' : ''}" 
                            data-variant="${variant.id}"
                            title="${variant.name}">
                        <div class="variant-color" style="background: ${variant.color}"></div>
                        <span class="variant-name">${variant.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
        
        this.container.appendChild(variantContainer);
        
        // Add event listeners
        variantContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.variant-btn');
            if (btn) {
                const variant = btn.dataset.variant;
                this.selectVariant(variant);
            }
        });
    }
    
    selectVariant(variant) {
        this.currentVariant = variant;
        
        // Update UI
        this.container.querySelectorAll('.variant-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.variant === variant);
        });
        
        // Apply to model
        this.applyVariant(variant);
        
        // Update sticky cart button
        this.updateStickyCart();
    }
    
    applyVariant(variant) {
        if (!this.model) return;
        
        const materialProps = {
            'black': { 
                color: 0x2a2a2a, 
                metalness: 0.1, 
                roughness: 0.8,
                emissive: 0x000000
            },
            'walnut': { 
                color: 0x8B4513, 
                metalness: 0.0, 
                roughness: 0.9,
                emissive: 0x1a0a00
            },
            'steel': { 
                color: 0x8a8a8a, 
                metalness: 0.9, 
                roughness: 0.2,
                emissive: 0x111111
            }
        };
        
        const props = materialProps[variant] || materialProps['black'];
        
        this.model.traverse((child) => {
            if (child.isMesh && child.material) {
                // Create new material or update existing
                if (child.material.isMeshStandardMaterial) {
                    child.material.color.setHex(props.color);
                    child.material.metalness = props.metalness;
                    child.material.roughness = props.roughness;
                    child.material.emissive.setHex(props.emissive);
                    child.material.emissiveIntensity = 0.05;
                    child.material.needsUpdate = true;
                } else {
                    // Replace with standard material
                    child.material = new THREE.MeshStandardMaterial({
                        color: props.color,
                        metalness: props.metalness,
                        roughness: props.roughness,
                        emissive: props.emissive,
                        emissiveIntensity: 0.05
                    });
                }
            }
        });
    }
    
    createStickyCartButton() {
        const stickyCart = document.createElement('div');
        stickyCart.className = 'sticky-cart-button';
        stickyCart.innerHTML = `
            <div class="cart-content">
                <div class="product-info">
                    <div class="product-name">${this.getProductName()}</div>
                    <div class="product-variant">${this.getVariantName()}</div>
                    <div class="product-price">${this.getProductPrice()}</div>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${this.equipmentType}')">
                    <span class="cart-icon">🛒</span>
                    <span class="cart-text">Add to Cart</span>
                </button>
            </div>
        `;
        
        this.container.appendChild(stickyCart);
    }
    
    updateStickyCart() {
        const variantElement = this.container.querySelector('.product-variant');
        if (variantElement) {
            variantElement.textContent = this.getVariantName();
        }
    }
    
    getProductName() {
        const names = {
            'pullup': 'Professional Pull-up Bar',
            'rings': 'Olympic Gymnastic Rings',
            'parallettes': 'Premium Parallettes'
        };
        return names[this.equipmentType] || 'Professional Equipment';
    }
    
    getVariantName() {
        const variants = {
            'black': 'Matte Black',
            'walnut': 'Walnut Wood',
            'steel': 'Brushed Steel'
        };
        return variants[this.currentVariant] || 'Matte Black';
    }
    
    getProductPrice() {
        const prices = {
            'pullup': '$299',
            'rings': '$149',
            'parallettes': '$89'
        };
        return prices[this.equipmentType] || '$199';
    }
    
    setupInteractionFeedback() {
        // Interaction state tracking
        this.controls.addEventListener('start', () => {
            this.isInteracting = true;
            this.container.classList.add('interacting');
        });
        
        this.controls.addEventListener('end', () => {
            this.isInteracting = false;
            this.container.classList.remove('interacting');
        });
        
        // Auto-rotate when not interacting
        let autoRotateTimeout;
        this.controls.addEventListener('end', () => {
            clearTimeout(autoRotateTimeout);
            autoRotateTimeout = setTimeout(() => {
                if (!this.isInteracting) {
                    this.controls.autoRotate = true;
                    this.controls.autoRotateSpeed = 0.5;
                }
            }, 3000);
        });
        
        this.controls.addEventListener('start', () => {
            this.controls.autoRotate = false;
            clearTimeout(autoRotateTimeout);
        });
    }
    
    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }
    
    handleResize() {
        const canvas = this.container.querySelector('.viewer-canvas');
        if (canvas && canvas.clientWidth > 0) {
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    }
    
    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'model-loading';
        loading.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading 3D Model...</div>
            <div class="loading-progress"><div class="progress-bar"></div></div>
        `;
        this.container.appendChild(loading);
    }
    
    updateLoadingProgress(percent) {
        const progressBar = this.container.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    }
    
    hideLoading() {
        const loading = this.container.querySelector('.model-loading');
        if (loading) {
            loading.remove();
        }
    }
    
    showFallback() {
        this.hideLoading();
        const fallback = document.createElement('div');
        fallback.className = 'model-fallback';
        fallback.innerHTML = `
            <img src="/images/${this.equipmentType}-hero.jpg" alt="${this.getProductName()}" />
            <div class="fallback-notice">3D view unavailable</div>
        `;
        this.container.appendChild(fallback);
    }
}

// Auto-initialize professional viewers
function initProfessional3DViewers() {
    const viewers = document.querySelectorAll('.professional-3d-viewer, .viewer-3d');
    viewers.forEach(container => {
        const equipmentType = container.dataset.equipment;
        const modelPath = container.dataset.model || `/models/${equipmentType}.glb`;
        
        if (equipmentType && !container.classList.contains('initialized')) {
            new Professional3DViewer(container.id, equipmentType, modelPath);
            container.classList.add('initialized');
        }
    });
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfessional3DViewers);
} else {
    initProfessional3DViewers();
}

// Add required CSS
const style = document.createElement('style');
style.textContent = `
    .professional-3d-viewer {
        position: relative;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 16px;
        overflow: hidden;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .viewer-canvas {
        width: 100%;
        height: 400px;
        position: relative;
    }
    
    .variant-controls {
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 10;
        background: rgba(0, 0, 0, 0.7);
        padding: 16px;
        border-radius: 12px;
        backdrop-filter: blur(10px);
    }
    
    .variant-label {
        color: rgba(255, 255, 255, 0.8);
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .variant-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .variant-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 140px;
    }
    
    .variant-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(139, 92, 246, 0.5);
        transform: translateY(-1px);
    }
    
    .variant-btn.active {
        background: rgba(139, 92, 246, 0.2);
        border-color: #8B5CF6;
        color: white;
    }
    
    .variant-color {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.3);
        flex-shrink: 0;
    }
    
    .sticky-cart-button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        z-index: 10;
        background: rgba(0, 0, 0, 0.8);
        padding: 16px;
        border-radius: 12px;
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        min-width: 280px;
    }
    
    .cart-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }
    
    .product-info {
        flex: 1;
    }
    
    .product-name {
        color: white;
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 4px;
    }
    
    .product-variant {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        margin-bottom: 4px;
    }
    
    .product-price {
        color: #8B5CF6;
        font-weight: 700;
        font-size: 16px;
    }
    
    .add-to-cart-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: linear-gradient(135deg, #8B5CF6, #A855F7);
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }
    
    .add-to-cart-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
    }
    
    .model-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: rgba(255, 255, 255, 0.8);
        z-index: 5;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(139, 92, 246, 0.3);
        border-top: 3px solid #8B5CF6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 12px;
    }
    
    .loading-progress {
        width: 120px;
        height: 3px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        margin: 8px auto 0;
        overflow: hidden;
    }
    
    .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #8B5CF6, #A855F7);
        width: 0%;
        transition: width 0.3s ease;
    }
    
    .model-fallback {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
    }
    
    .model-fallback img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.8;
    }
    
    .fallback-notice {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.8);
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
        .variant-controls {
            top: 10px;
            left: 10px;
            padding: 12px;
        }
        
        .sticky-cart-button {
            bottom: 10px;
            right: 10px;
            left: 10px;
            min-width: auto;
        }
        
        .cart-content {
            flex-direction: column;
            gap: 12px;
        }
        
        .add-to-cart-btn {
            width: 100%;
            justify-content: center;
        }
    }
`;
document.head.appendChild(style);
