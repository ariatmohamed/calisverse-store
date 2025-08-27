// Legacy 3D Model System - Scoped to prevent conflicts with model-viewer
// Only used as fallback when model-viewer is not available
const Legacy3DSystem = {
    scenes: {},
    cameras: {},
    renderers: {},
    orbitControls: {},
    isEnabled: false,

    init() {
        // Only initialize if model-viewer is not supported
        if (this.isModelViewerSupported()) {
            console.log('model-viewer supported, skipping legacy 3D system');
            return;
        }

        this.isEnabled = true;
        this.init3DViewers();
    },

    isModelViewerSupported() {
        return 'customElements' in window && 
               'HTMLElement' in window && 
               typeof customElements.define === 'function';
    },

    init3DViewers() {
        // Check if THREE.js is loaded
        if (typeof THREE === 'undefined') {
            console.log('THREE.js not loaded yet, retrying...');
            setTimeout(() => this.init3DViewers(), 100);
            return;
        }

        // Check if OrbitControls is available
        if (typeof THREE.OrbitControls === 'undefined') {
            console.log('OrbitControls not loaded yet, retrying...');
            setTimeout(() => this.init3DViewers(), 100);
            return;
        }

        console.log('Initializing legacy 3D viewers as fallback...');
        
        // Initialize viewers for each product
        const viewers = [
            { id: 'pullup-viewer', type: 'pullup' },
            { id: 'rings-viewer', type: 'rings' },
            { id: 'parallettes-viewer', type: 'parallettes' }
        ];

        viewers.forEach(viewer => {
            const container = document.getElementById(viewer.id);
            if (container && !container.querySelector('model-viewer')) {
                this.create3DViewer(viewer.id, viewer.type);
            }
        });
    },

    // Create fully interactive 3D viewer
    create3DViewer(containerId, equipmentType) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Check if THREE.js is available
        if (typeof THREE === 'undefined') {
            console.error('THREE.js not loaded');
            return;
        }

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0f);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        container.appendChild(renderer.domElement);

        // Store references
        this.scenes[containerId] = scene;
        this.cameras[containerId] = camera;
        this.renderers[containerId] = renderer;

        // Controls setup
        if (typeof THREE.OrbitControls !== 'undefined') {
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enableZoom = true;
            controls.enablePan = true;
            controls.enableRotate = true;
            controls.autoRotate = false;
            controls.maxPolarAngle = Math.PI;
            controls.minDistance = 2;
            controls.maxDistance = 10;
            
            this.orbitControls[containerId] = controls;
        }

        // Professional lighting
        this.setupProfessionalLighting(scene);

        // Create equipment model
        const equipment = this.createEquipmentModel(equipmentType);
        if (equipment) {
            scene.add(equipment);
            
            // Position camera for optimal viewing
            this.positionCameraForEquipment(camera, equipmentType);
        }

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            if (this.orbitControls[containerId]) {
                this.orbitControls[containerId].update();
            }
            
            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            if (container.clientWidth > 0) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        };
        
        window.addEventListener('resize', handleResize);
        
        console.log(`Legacy 3D viewer created successfully for ${containerId}`);
    },

    // Professional lighting setup
    setupProfessionalLighting(scene) {
        // Remove existing lights
        const lightsToRemove = [];
        scene.traverse((child) => {
            if (child.isLight) {
                lightsToRemove.push(child);
            }
        });
        lightsToRemove.forEach(light => scene.remove(light));

        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);

        // Key light (main directional light)
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(5, 10, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 50;
        keyLight.shadow.camera.left = -10;
        keyLight.shadow.camera.right = 10;
        keyLight.shadow.camera.top = 10;
        keyLight.shadow.camera.bottom = -10;
        scene.add(keyLight);

        // Fill light (softer, opposite side)
        const fillLight = new THREE.DirectionalLight(0x8bb5ff, 0.6);
        fillLight.position.set(-3, 5, -3);
        scene.add(fillLight);

        // Rim light (back lighting for definition)
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
        rimLight.position.set(0, 3, -5);
        scene.add(rimLight);

        // Environment light (HDRI-style)
        const envLight = new THREE.HemisphereLight(0x87ceeb, 0x362d1d, 0.5);
        scene.add(envLight);
    },

    // Create equipment models
    createEquipmentModel(type) {
        switch (type) {
            case 'pullup':
                return this.createPullupBar();
            case 'rings':
                return this.createRings();
            case 'parallettes':
                return this.createParallettes();
            default:
                return null;
        }
    },

    createPullupBar() {
        const group = new THREE.Group();
        
        // Materials
        const blackMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.1,
            roughness: 0.2,
            clearcoat: 0.8,
            clearcoatRoughness: 0.1
        });

        // Main horizontal bar
        const barGeometry = new THREE.CylinderGeometry(0.015, 0.015, 1.2, 16);
        const bar = new THREE.Mesh(barGeometry, blackMaterial);
        bar.rotation.z = Math.PI / 2;
        bar.position.y = 2.1;
        bar.castShadow = true;
        bar.receiveShadow = true;
        group.add(bar);

        // Vertical supports
        const supportGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2.1, 12);
        
        const leftSupport = new THREE.Mesh(supportGeometry, blackMaterial);
        leftSupport.position.set(-0.6, 1.05, 0);
        leftSupport.castShadow = true;
        leftSupport.receiveShadow = true;
        group.add(leftSupport);

        const rightSupport = new THREE.Mesh(supportGeometry, blackMaterial);
        rightSupport.position.set(0.6, 1.05, 0);
        rightSupport.castShadow = true;
        rightSupport.receiveShadow = true;
        group.add(rightSupport);

        // Base plates
        const baseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
        
        const leftBase = new THREE.Mesh(baseGeometry, blackMaterial);
        leftBase.position.set(-0.6, 0.025, 0);
        leftBase.castShadow = true;
        leftBase.receiveShadow = true;
        group.add(leftBase);

        const rightBase = new THREE.Mesh(baseGeometry, blackMaterial);
        rightBase.position.set(0.6, 0.025, 0);
        rightBase.castShadow = true;
        rightBase.receiveShadow = true;
        group.add(rightBase);

        return group;
    },

    createRings() {
        const group = new THREE.Group();
        
        const blackMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.1,
            roughness: 0.2,
            clearcoat: 0.8,
            clearcoatRoughness: 0.1
        });

        // Ring geometry
        const ringGeometry = new THREE.TorusGeometry(0.12, 0.015, 8, 16);
        
        // Left ring
        const leftRing = new THREE.Mesh(ringGeometry, blackMaterial);
        leftRing.position.set(-0.3, 1.8, 0);
        leftRing.castShadow = true;
        leftRing.receiveShadow = true;
        group.add(leftRing);

        // Right ring
        const rightRing = new THREE.Mesh(ringGeometry, blackMaterial);
        rightRing.position.set(0.3, 1.8, 0);
        rightRing.castShadow = true;
        rightRing.receiveShadow = true;
        group.add(rightRing);

        return group;
    },

    createParallettes() {
        const group = new THREE.Group();
        
        const blackMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.1,
            roughness: 0.2,
            clearcoat: 0.8,
            clearcoatRoughness: 0.1
        });

        // Handle bars
        const handleGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.3, 16);
        
        const leftHandle = new THREE.Mesh(handleGeometry, blackMaterial);
        leftHandle.position.set(-0.2, 0.15, 0);
        leftHandle.rotation.z = Math.PI / 2;
        leftHandle.castShadow = true;
        leftHandle.receiveShadow = true;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, blackMaterial);
        rightHandle.position.set(0.2, 0.15, 0);
        rightHandle.rotation.z = Math.PI / 2;
        rightHandle.castShadow = true;
        rightHandle.receiveShadow = true;
        group.add(rightHandle);

        return group;
    },

    positionCameraForEquipment(camera, type) {
        switch (type) {
            case 'pullup':
                camera.position.set(2, 2, 3);
                break;
            case 'rings':
                camera.position.set(1.5, 2, 2.5);
                break;
            case 'parallettes':
                camera.position.set(1, 1, 1.5);
                break;
            default:
                camera.position.set(2, 2, 3);
        }
    }
};

// Initialize legacy system only as fallback
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Legacy3DSystem.init();
    });
} else {
    Legacy3DSystem.init();
}

// Export for global access
window.Legacy3DSystem = Legacy3DSystem;
