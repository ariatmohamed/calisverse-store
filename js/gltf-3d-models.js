// Professional 3D Model Loader with GLTFLoader
let scenes = {};
let cameras = {};
let renderers = {};
let orbitControls = {};
let loadedModels = {};
let animationFrames = {};

// GLTFLoader setup
let gltfLoader;

function initGLTFLoader() {
    if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
        // Fallback to CDN if GLTFLoader not available
        const script = document.createElement('script');
        script.src = 'https://threejs.org/examples/js/loaders/GLTFLoader.js';
        script.onload = () => {
            gltfLoader = new THREE.GLTFLoader();
            console.log('GLTFLoader initialized');
        };
        document.head.appendChild(script);
    } else {
        gltfLoader = new THREE.GLTFLoader();
    }
}

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
    
    // Initialize GLTF Loader
    initGLTFLoader();
    
    // Initialize viewers for each product
    const viewers = [
        { id: 'pullup-viewer', type: 'pullup', modelPath: '/models/pullup-bar.glb' },
        { id: 'rings-viewer', type: 'rings', modelPath: '/models/rings.glb' },
        { id: 'parallettes-viewer', type: 'parallettes', modelPath: '/models/parallettes.glb' }
    ];

    viewers.forEach(viewer => {
        const container = document.getElementById(viewer.id);
        if (container) {
            create3DViewer(viewer.id, viewer.type, viewer.modelPath);
        }
    });
}

// Create professional 3D viewer with GLTF loading
function create3DViewer(containerId, equipmentType, modelPath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Check if THREE.js is available
    if (typeof THREE === 'undefined') {
        console.error('THREE.js not loaded');
        showFallbackImage(container, equipmentType);
        return;
    }

    console.log(`Creating 3D viewer for ${containerId} with model: ${modelPath}`);
    
    // Add loading spinner
    const loadingSpinner = createLoadingSpinner();
    container.appendChild(loadingSpinner);

    // Create scene with professional setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent for overlay effect
    scenes[containerId] = scene;

    // Create camera with optimized settings
    const camera = new THREE.PerspectiveCamera(
        45, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        100
    );
    camera.position.set(4, 3, 5);
    cameras[containerId] = camera;

    // Create renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    
    // Cap pixel ratio for performance
    const pixelRatio = Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    container.appendChild(renderer.domElement);
    renderers[containerId] = renderer;

    // Professional Interactive Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = true; // Enable pan for professional use
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1.0;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 0.8;
    controls.minDistance = 2;
    controls.maxDistance = 12;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI - Math.PI / 6;
    
    orbitControls[containerId] = controls;
    
    // Professional lighting setup
    setupStudioLighting(scene);
    
    // Load GLTF model with error handling
    loadGLTFModel(scene, modelPath, containerId, loadingSpinner, () => {
        // Model loaded successfully - frame it properly
        frameModel(scene, camera, controls);
        startRenderLoop(containerId);
        addInteractionHints(container);
    });

    // Handle window resize
    const handleResize = () => {
        if (container.clientWidth > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Pause rendering when tab is inactive for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseRenderLoop(containerId);
        } else {
            startRenderLoop(containerId);
        }
    });
}

// Load GLTF model with comprehensive error handling
function loadGLTFModel(scene, modelPath, containerId, loadingSpinner, onSuccess) {
    if (!gltfLoader) {
        console.error('GLTFLoader not initialized');
        showFallbackImage(document.getElementById(containerId), containerId.split('-')[0]);
        return;
    }

    gltfLoader.load(
        modelPath,
        // Success callback
        (gltf) => {
            console.log(`Model loaded successfully: ${modelPath}`);
            
            const model = gltf.scene;
            model.name = 'equipment';
            
            // Enable shadows
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Enhance materials
                    if (child.material) {
                        child.material.envMapIntensity = 0.8;
                    }
                }
            });
            
            scene.add(model);
            loadedModels[containerId] = model;
            
            // Hide loading spinner
            if (loadingSpinner && loadingSpinner.parentNode) {
                loadingSpinner.parentNode.removeChild(loadingSpinner);
            }
            
            onSuccess();
        },
        // Progress callback
        (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            console.log(`Loading progress: ${percent.toFixed(1)}%`);
            updateLoadingProgress(loadingSpinner, percent);
        },
        // Error callback
        (error) => {
            console.error(`Error loading model ${modelPath}:`, error);
            
            // Hide loading spinner
            if (loadingSpinner && loadingSpinner.parentNode) {
                loadingSpinner.parentNode.removeChild(loadingSpinner);
            }
            
            // Show fallback
            const container = document.getElementById(containerId);
            showFallbackImage(container, containerId.split('-')[0]);
        }
    );
}

// Studio lighting setup for professional look
function setupStudioLighting(scene) {
    // Remove existing lights
    const lightsToRemove = [];
    scene.traverse((child) => {
        if (child.isLight) {
            lightsToRemove.push(child);
        }
    });
    lightsToRemove.forEach(light => scene.remove(light));

    // HDRI-style environment lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Key light (main)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
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
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Fill light (soft)
    const fillLight = new THREE.DirectionalLight(0x8B5CF6, 0.4);
    fillLight.position.set(-3, 5, -3);
    scene.add(fillLight);

    // Rim light (edge highlighting)
    const rimLight = new THREE.DirectionalLight(0xA78BFA, 0.5);
    rimLight.position.set(0, -5, -10);
    scene.add(rimLight);

    // Environment hemisphere light
    const envLight = new THREE.HemisphereLight(0x8B5CF6, 0x4C1D95, 0.2);
    scene.add(envLight);
}

// Frame model to fit view perfectly
function frameModel(scene, camera, controls) {
    const model = scene.getObjectByName('equipment');
    if (!model) return;

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Position model at origin
    model.position.sub(center);

    // Calculate optimal camera distance
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraDistance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.5;

    // Set camera position
    camera.position.set(cameraDistance, cameraDistance * 0.7, cameraDistance);
    camera.lookAt(0, 0, 0);

    // Update controls
    controls.target.set(0, 0, 0);
    controls.minDistance = cameraDistance * 0.5;
    controls.maxDistance = cameraDistance * 3;
    controls.update();
}

// Create loading spinner
function createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'model-loading-spinner';
    spinner.innerHTML = `
        <div class="spinner-ring"></div>
        <div class="loading-text">Loading 3D Model...</div>
        <div class="loading-progress">
            <div class="progress-bar"></div>
        </div>
    `;
    
    spinner.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: rgba(255, 255, 255, 0.8);
        z-index: 10;
    `;
    
    return spinner;
}

// Update loading progress
function updateLoadingProgress(spinner, percent) {
    const progressBar = spinner.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }
}

// Show fallback image if WebGL fails
function showFallbackImage(container, equipmentType) {
    const fallback = document.createElement('div');
    fallback.className = 'webgl-fallback';
    fallback.innerHTML = `
        <img src="/images/${equipmentType}-fallback.jpg" alt="${equipmentType}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">
        <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); padding: 8px 16px; border-radius: 20px; font-size: 12px; color: rgba(255,255,255,0.8);">
            3D view not supported
        </div>
    `;
    fallback.style.cssText = `
        position: relative;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    container.appendChild(fallback);
}

// Add interaction hints
function addInteractionHints(container) {
    const hints = document.createElement('div');
    hints.className = 'interaction-hints';
    hints.innerHTML = `
        <div class="hint">🖱️ Drag to rotate</div>
        <div class="hint">🔍 Scroll to zoom</div>
        <div class="hint">⚡ Shift+drag to pan</div>
    `;
    
    hints.style.cssText = `
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 10;
    `;
    
    const hintStyle = `
        background: rgba(0, 0, 0, 0.7);
        color: rgba(255, 255, 255, 0.8);
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 11px;
        font-weight: 500;
        backdrop-filter: blur(10px);
    `;
    
    hints.querySelectorAll('.hint').forEach(hint => {
        hint.style.cssText = hintStyle;
    });
    
    container.appendChild(hints);
    
    // Show hints on hover
    container.addEventListener('mouseenter', () => {
        hints.style.opacity = '1';
    });
    
    container.addEventListener('mouseleave', () => {
        hints.style.opacity = '0';
    });
}

// Render loop management
function startRenderLoop(containerId) {
    const scene = scenes[containerId];
    const camera = cameras[containerId];
    const renderer = renderers[containerId];
    const controls = orbitControls[containerId];
    
    if (!scene || !camera || !renderer || !controls) return;
    
    const animate = () => {
        animationFrames[containerId] = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    
    animate();
}

function pauseRenderLoop(containerId) {
    if (animationFrames[containerId]) {
        cancelAnimationFrame(animationFrames[containerId]);
        delete animationFrames[containerId];
    }
}

// Color variant system
function updateModelColor(containerId, colorVariant) {
    const model = loadedModels[containerId];
    if (!model) return;
    
    const colorMap = {
        'black': { color: 0x2a2a2a, metalness: 0.1, roughness: 0.8 },
        'walnut': { color: 0x8B4513, metalness: 0.0, roughness: 0.9 },
        'steel': { color: 0x8a8a8a, metalness: 0.9, roughness: 0.1 }
    };
    
    const props = colorMap[colorVariant] || colorMap['black'];
    
    model.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.color.setHex(props.color);
            child.material.metalness = props.metalness;
            child.material.roughness = props.roughness;
            child.material.needsUpdate = true;
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
        const modelPath = container.dataset.model || `/models/${equipmentType}.glb`;
        
        if (equipmentType && !scenes[container.id]) {
            create3DViewer(container.id, equipmentType, modelPath);
        }
    });
}

// Lazy loading for off-screen models
function setupLazyLoading() {
    const observers = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !scenes[entry.target.id]) {
                const equipmentType = entry.target.dataset.equipment;
                const modelPath = entry.target.dataset.model || `/models/${equipmentType}.glb`;
                create3DViewer(entry.target.id, equipmentType, modelPath);
                observers.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.viewer-3d').forEach(viewer => {
        observers.observe(viewer);
    });
}

// Clean up function
function cleanup3DViewer(containerId) {
    pauseRenderLoop(containerId);
    
    if (renderers[containerId]) {
        renderers[containerId].dispose();
        delete renderers[containerId];
    }
    
    delete scenes[containerId];
    delete cameras[containerId];
    delete orbitControls[containerId];
    delete loadedModels[containerId];
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeAll3DViewers();
        setupLazyLoading();
    });
} else {
    initializeAll3DViewers();
    setupLazyLoading();
}

// Add required CSS for loading spinner
const style = document.createElement('style');
style.textContent = `
    .model-loading-spinner .spinner-ring {
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
        border-radius: 2px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
