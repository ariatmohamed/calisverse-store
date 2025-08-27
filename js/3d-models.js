// 3D Model Creation and Management
let scenes = {};
let cameras = {};
let renderers = {};
let orbitControls = {};

function init3DViewers() {
    // Check if THREE.js is loaded
    if (typeof THREE === 'undefined') {
        console.log('THREE.js not loaded yet, retrying...');
        setTimeout(init3DViewers, 100);
        return;
    }

    // Check if OrbitControls is available
    if (typeof THREE.OrbitControls === 'undefined') {
        console.log('OrbitControls not loaded yet, retrying...');
        setTimeout(init3DViewers, 100);
        return;
    }

    console.log('Initializing 3D viewers...');
    
    // Initialize viewers for each product
    const viewers = [
        { id: 'pullup-viewer', type: 'pullup' },
        { id: 'rings-viewer', type: 'rings' },
        { id: 'parallettes-viewer', type: 'parallettes' }
    ];

    viewers.forEach(viewer => {
        const container = document.getElementById(viewer.id);
        if (container) {
            create3DViewer(viewer.id, viewer.type);
        }
    });
}

// Create fully interactive 3D viewer
function create3DViewer(containerId, equipmentType) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Check if THREE.js is available
    if (typeof THREE === 'undefined') {
        console.error('THREE.js not loaded');
        return;
    }

    // Check if OrbitControls is available
    if (typeof THREE.OrbitControls === 'undefined') {
        console.error('OrbitControls not loaded');
        return;
    }

    console.log(`Creating 3D viewer for ${containerId} with equipment type: ${equipmentType}`);
    
    // Clear loading text
    const loading = container.querySelector('.loading');
    if (loading) {
        loading.style.display = 'none';
        console.log('Loading text hidden');
    }

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    scenes[containerId] = scene;

    // Create camera with optimized settings
    const camera = new THREE.PerspectiveCamera(
        60, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        100
    );
    camera.position.set(3, 2, 4);
    cameras[containerId] = camera;

    // Create renderer with enhanced settings
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
    renderers[containerId] = renderer;

    // Enhanced Interactive Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1.0;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.2;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI - Math.PI / 6;
    
    // Store controls
    orbitControls[containerId] = controls;
    
    // Interactive behavior
    let isInteracting = false;
    let autoRotateTimeout;
    
    controls.addEventListener('start', () => {
        isInteracting = true;
        controls.autoRotate = false;
        clearTimeout(autoRotateTimeout);
        container.style.cursor = 'grabbing';
    });
    
    controls.addEventListener('end', () => {
        isInteracting = false;
        container.style.cursor = 'grab';
        
        // Resume auto-rotate after 3 seconds of inactivity
        autoRotateTimeout = setTimeout(() => {
            if (!isInteracting) {
                controls.autoRotate = true;
            }
        }, 3000);
    });
    
    // Mouse interaction feedback
    container.addEventListener('mouseenter', () => {
        container.style.cursor = 'grab';
        controls.autoRotate = true;
    });
    
    container.addEventListener('mouseleave', () => {
        container.style.cursor = 'default';
        controls.autoRotate = false;
    });
    
    // Professional lighting setup
    setupProfessionalLighting(scene);
    
    // Create equipment model with default color
    const equipment = createEquipment(equipmentType, 'matte black');
    equipment.name = 'equipment';
    scene.add(equipment);
    
    // Add instruction text
    const instructionText = document.createElement('div');
    instructionText.className = 'interaction-hint';
    instructionText.textContent = 'Hover to interact • Click & Drag to Rotate • Scroll to Zoom';
    instructionText.style.cssText = `
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        font-weight: 500;
        background: rgba(0, 0, 0, 0.5);
        padding: 8px 16px;
        border-radius: 20px;
        backdrop-filter: blur(10px);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 10;
    `;
    container.appendChild(instructionText);
    
    // Show instruction on hover
    container.addEventListener('mouseenter', () => {
        instructionText.style.opacity = '1';
    });
    
    container.addEventListener('mouseleave', () => {
        instructionText.style.opacity = '0';
    });
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
    
    // Handle window resize
    const handleResize = () => {
        if (container.clientWidth > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    };
    
    window.addEventListener('resize', handleResize);
    
    console.log(`3D viewer created successfully for ${containerId}`);
}

// Professional lighting setup
function setupProfessionalLighting(scene) {
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
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    scene.add(keyLight);

    // Fill light (softer illumination from opposite side)
    const fillLight = new THREE.DirectionalLight(0x8B5CF6, 0.5);
    fillLight.position.set(-3, 5, -3);
    scene.add(fillLight);

    // Rim light (edge highlighting)
    const rimLight = new THREE.DirectionalLight(0xA78BFA, 0.6);
    rimLight.position.set(0, -5, -10);
    scene.add(rimLight);

    // Environment light for realistic reflections
    const envLight = new THREE.HemisphereLight(0x8B5CF6, 0x4C1D95, 0.3);
    scene.add(envLight);
}

// Equipment creation functions
function createPullupBar(color = 'matte black') {
    const group = new THREE.Group();
    
    // Get material for color
    const material = getEquipmentMaterial(color);
    
    // Main horizontal bar
    const barGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 16);
    const bar = new THREE.Mesh(barGeometry, material);
    bar.rotation.z = Math.PI / 2;
    bar.position.y = 1.8;
    group.add(bar);
    
    // Support posts
    const postGeometry = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 12);
    const leftPost = new THREE.Mesh(postGeometry, material);
    leftPost.position.set(-0.9, 0.9, 0);
    group.add(leftPost);
    
    const rightPost = new THREE.Mesh(postGeometry, material);
    rightPost.position.set(0.9, 0.9, 0);
    group.add(rightPost);
    
    // Base plates
    const baseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
    const leftBase = new THREE.Mesh(baseGeometry, material);
    leftBase.position.set(-0.9, 0.025, 0);
    group.add(leftBase);
    
    const rightBase = new THREE.Mesh(baseGeometry, material);
    rightBase.position.set(0.9, 0.025, 0);
    group.add(rightBase);
    
    return group;
}

function createRings(color = 'matte black') {
    const group = new THREE.Group();
    const material = getEquipmentMaterial(color);
    
    // Ring geometry
    const ringGeometry = new THREE.TorusGeometry(0.12, 0.02, 8, 16);
    
    // Left ring
    const leftRing = new THREE.Mesh(ringGeometry, material);
    leftRing.position.set(-0.3, 1.5, 0);
    group.add(leftRing);
    
    // Right ring
    const rightRing = new THREE.Mesh(ringGeometry, material);
    rightRing.position.set(0.3, 1.5, 0);
    group.add(rightRing);
    
    // Straps
    const strapGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.8, 8);
    const leftStrap = new THREE.Mesh(strapGeometry, material);
    leftStrap.position.set(-0.3, 1.9, 0);
    group.add(leftStrap);
    
    const rightStrap = new THREE.Mesh(strapGeometry, material);
    rightStrap.position.set(0.3, 1.9, 0);
    group.add(rightStrap);
    
    // Mounting point
    const mountGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.1);
    const mount = new THREE.Mesh(mountGeometry, material);
    mount.position.y = 2.3;
    group.add(mount);
    
    return group;
}

function createParallettes(color = 'matte black') {
    const group = new THREE.Group();
    const material = getEquipmentMaterial(color);
    
    // Handle bars
    const handleGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.4, 12);
    
    const leftHandle = new THREE.Mesh(handleGeometry, material);
    leftHandle.rotation.z = Math.PI / 2;
    leftHandle.position.set(-0.2, 0.15, 0);
    group.add(leftHandle);
    
    const rightHandle = new THREE.Mesh(handleGeometry, material);
    rightHandle.rotation.z = Math.PI / 2;
    rightHandle.position.set(0.2, 0.15, 0);
    group.add(rightHandle);
    
    // Support legs
    const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8);
    
    // Left legs
    const leftFrontLeg = new THREE.Mesh(legGeometry, material);
    leftFrontLeg.position.set(-0.4, 0.075, 0.1);
    group.add(leftFrontLeg);
    
    const leftBackLeg = new THREE.Mesh(legGeometry, material);
    leftBackLeg.position.set(-0.4, 0.075, -0.1);
    group.add(leftBackLeg);
    
    // Right legs
    const rightFrontLeg = new THREE.Mesh(legGeometry, material);
    rightFrontLeg.position.set(0.4, 0.075, 0.1);
    group.add(rightFrontLeg);
    
    const rightBackLeg = new THREE.Mesh(legGeometry, material);
    rightBackLeg.position.set(0.4, 0.075, -0.1);
    group.add(rightBackLeg);
    
    return group;
}

function createDipBars(color = 'matte black') {
    const group = new THREE.Group();
    const material = getEquipmentMaterial(color);
    
    // Parallel bars
    const barGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 12);
    
    const leftBar = new THREE.Mesh(barGeometry, material);
    leftBar.rotation.z = Math.PI / 2;
    leftBar.position.set(-0.3, 1.2, 0);
    group.add(leftBar);
    
    const rightBar = new THREE.Mesh(barGeometry, material);
    rightBar.rotation.z = Math.PI / 2;
    rightBar.position.set(0.3, 1.2, 0);
    group.add(rightBar);
    
    // Support frame
    const frameGeometry = new THREE.CylinderGeometry(0.025, 0.025, 1.2, 8);
    
    // Vertical supports
    const leftSupport = new THREE.Mesh(frameGeometry, material);
    leftSupport.position.set(-0.6, 0.6, 0);
    group.add(leftSupport);
    
    const rightSupport = new THREE.Mesh(frameGeometry, material);
    rightSupport.position.set(0.6, 0.6, 0);
    group.add(rightSupport);
    
    // Base
    const baseGeometry = new THREE.BoxGeometry(1.4, 0.05, 0.4);
    const base = new THREE.Mesh(baseGeometry, material);
    base.position.y = 0.025;
    group.add(base);
    
    return group;
}

// Equipment factory function
function createEquipment(type, color = 'matte black') {
    switch (type) {
        case 'pullup':
            return createPullupBar(color);
        case 'rings':
            return createRings(color);
        case 'parallettes':
            return createParallettes(color);
        case 'dipbars':
            return createDipBars(color);
        default:
            console.warn(`Unknown equipment type: ${type}`);
            return createPullupBar(color);
    }
}

// Material factory function
function getEquipmentMaterial(color) {
    const colorMap = {
        'matte black': { 
            color: 0x2a2a2a, 
            metalness: 0.1, 
            roughness: 0.8,
            emissive: 0x000000
        },
        'steel gray': { 
            color: 0x8a8a8a, 
            metalness: 0.7, 
            roughness: 0.3,
            emissive: 0x111111
        },
        'chrome silver': { 
            color: 0xc0c0c0, 
            metalness: 0.9, 
            roughness: 0.1,
            emissive: 0x222222
        },
        'deep purple': { 
            color: 0x6b46c1, 
            metalness: 0.3, 
            roughness: 0.6,
            emissive: 0x2d1b69
        },
        'electric blue': { 
            color: 0x3b82f6, 
            metalness: 0.4, 
            roughness: 0.5,
            emissive: 0x1e40af
        },
        'forest green': { 
            color: 0x10b981, 
            metalness: 0.2, 
            roughness: 0.7,
            emissive: 0x047857
        },
        'sunset orange': { 
            color: 0xf97316, 
            metalness: 0.3, 
            roughness: 0.6,
            emissive: 0xc2410c
        },
        'crimson red': { 
            color: 0xef4444, 
            metalness: 0.2, 
            roughness: 0.7,
            emissive: 0xb91c1c
        }
    };

    const materialProps = colorMap[color] || colorMap['matte black'];
    
    return new THREE.MeshStandardMaterial({
        color: materialProps.color,
        metalness: materialProps.metalness,
        roughness: materialProps.roughness,
        emissive: materialProps.emissive,
        emissiveIntensity: 0.1
    });
}

// Update equipment color function
function updateEquipmentColor(containerId, newColor) {
    const scene = scenes[containerId];
    if (!scene) return;

    const equipment = scene.getObjectByName('equipment');
    if (!equipment) return;

    const newMaterial = getEquipmentMaterial(newColor);
    
    equipment.traverse((child) => {
        if (child.isMesh) {
            child.material = newMaterial;
        }
    });
}

// Initialize all 3D viewers on page load
function initializeAll3DViewers() {
    // Wait for THREE.js to load
    if (typeof THREE === 'undefined' || typeof THREE.OrbitControls === 'undefined') {
        setTimeout(initializeAll3DViewers, 100);
        return;
    }

    // Find all 3D viewer containers
    const viewers = document.querySelectorAll('.viewer-3d');
    viewers.forEach(container => {
        const equipmentType = container.dataset.equipment;
        if (equipmentType && !scenes[container.id]) {
            create3DViewer(container.id, equipmentType);
        }
    });
}

// Clean up function
function cleanup3DViewer(containerId) {
    if (animationFrames[containerId]) {
        cancelAnimationFrame(animationFrames[containerId]);
        delete animationFrames[containerId];
    }
    
    if (renderers[containerId]) {
        renderers[containerId].dispose();
        delete renderers[containerId];
    }
    
    delete scenes[containerId];
    delete cameras[containerId];
    delete orbitControls[containerId];
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll3DViewers);
} else {
    initializeAll3DViewers();
}
