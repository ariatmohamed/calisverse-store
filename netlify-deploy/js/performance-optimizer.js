// Performance Optimizer for CalisVerse
// Reduces lag and improves rendering performance

class PerformanceOptimizer {
    constructor() {
        this.isLowEndDevice = this.detectLowEndDevice();
        this.activeViewers = new Map();
        this.intersectionObserver = null;
        this.rafId = null;
        this.init();
    }

    detectLowEndDevice() {
        // Detect low-end devices
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return true;
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        // Check for mobile or low-end indicators
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEndGPU = /Intel.*HD|Mali|Adreno [1-4]|PowerVR SGX/i.test(renderer);
        const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        
        return isMobile || isLowEndGPU || hasLowMemory;
    }

    init() {
        this.setupIntersectionObserver();
        this.optimizeGlobalSettings();
        this.setupPerformanceMonitoring();
    }

    setupIntersectionObserver() {
        // Only render 3D viewers when they're visible
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const viewerId = entry.target.id;
                if (entry.isIntersecting) {
                    this.activateViewer(viewerId);
                } else {
                    this.deactivateViewer(viewerId);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });

        // Observe all 3D viewers
        document.querySelectorAll('[id$="-viewer"]').forEach(viewer => {
            this.intersectionObserver.observe(viewer);
        });
    }

    activateViewer(viewerId) {
        if (!this.activeViewers.has(viewerId)) {
            // Create optimized viewer
            this.createOptimizedViewer(viewerId);
        }
    }

    deactivateViewer(viewerId) {
        const viewer = this.activeViewers.get(viewerId);
        if (viewer) {
            // Pause rendering when not visible
            if (viewer.animationId) {
                cancelAnimationFrame(viewer.animationId);
                viewer.animationId = null;
            }
        }
    }

    createOptimizedViewer(viewerId) {
        const container = document.getElementById(viewerId);
        if (!container) return;

        // Clear existing content
        container.innerHTML = '<div class="loading">Loading...</div>';

        // Get equipment type
        const equipmentType = this.getEquipmentType(viewerId);
        
        // Create optimized 3D scene
        const viewer = this.setupOptimizedScene(container, equipmentType);
        this.activeViewers.set(viewerId, viewer);
    }

    setupOptimizedScene(container, equipmentType) {
        // Optimized scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0f);

        // Optimized camera
        const camera = new THREE.PerspectiveCamera(
            60, // Reduced FOV for better performance
            container.clientWidth / container.clientHeight,
            0.5, // Increased near plane
            50   // Reduced far plane
        );
        camera.position.set(0, 1, 4);

        // Optimized renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: !this.isLowEndDevice,
            alpha: true,
            powerPreference: this.isLowEndDevice ? "low-power" : "high-performance"
        });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(this.isLowEndDevice ? 1 : Math.min(window.devicePixelRatio, 2));
        
        // Reduced shadow quality for performance
        if (!this.isLowEndDevice) {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.BasicShadowMap; // Faster than PCF
        }
        
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        // Simplified lighting for performance
        this.setupOptimizedLighting(scene);

        // Create simplified equipment model
        const equipment = this.createSimplifiedEquipment(equipmentType);
        scene.add(equipment);

        // Optimized controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.autoRotate = !this.isLowEndDevice; // Disable auto-rotate on low-end devices
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = false;
        controls.enablePan = false;

        // Optimized animation loop
        let lastTime = 0;
        const targetFPS = this.isLowEndDevice ? 30 : 60;
        const frameInterval = 1000 / targetFPS;

        const animate = (currentTime) => {
            const viewer = this.activeViewers.get(container.id);
            if (!viewer) return;

            viewer.animationId = requestAnimationFrame(animate);

            // Frame rate limiting
            if (currentTime - lastTime < frameInterval) return;
            lastTime = currentTime;

            controls.update();
            renderer.render(scene, camera);
        };

        const viewer = {
            scene,
            camera,
            renderer,
            controls,
            equipment,
            animationId: null
        };

        // Start animation
        viewer.animationId = requestAnimationFrame(animate);

        // Handle resize efficiently
        const resizeObserver = new ResizeObserver(this.debounce(() => {
            if (container.clientWidth > 0) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        }, 100));
        resizeObserver.observe(container);

        return viewer;
    }

    setupOptimizedLighting(scene) {
        // Minimal lighting setup for performance
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(4, 6, 4);
        
        if (!this.isLowEndDevice) {
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 1024; // Reduced shadow resolution
            directionalLight.shadow.mapSize.height = 1024;
        }
        
        scene.add(directionalLight);

        // Single accent light
        const accentLight = new THREE.DirectionalLight(0x8B5CF6, 0.3);
        accentLight.position.set(-2, 2, -2);
        scene.add(accentLight);
    }

    createSimplifiedEquipment(type) {
        const group = new THREE.Group();
        
        // Simplified materials for performance
        const material = new THREE.MeshLambertMaterial({
            color: 0x8B5CF6,
            transparent: false
        });

        const metalMaterial = new THREE.MeshLambertMaterial({
            color: 0x4a5568,
            transparent: false
        });

        switch (type) {
            case 'pullup':
                return this.createSimplifiedPullUpBar(group, material, metalMaterial);
            case 'rings':
                return this.createSimplifiedRings(group, material);
            case 'parallettes':
                return this.createSimplifiedParallettes(group, material);
            case 'dipbars':
                return this.createSimplifiedDipBars(group, material, metalMaterial);
            default:
                return group;
        }
    }

    createSimplifiedPullUpBar(group, material, metalMaterial) {
        // Simplified geometry with fewer vertices
        const bracketGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.2);
        const leftBracket = new THREE.Mesh(bracketGeometry, metalMaterial);
        leftBracket.position.set(-2, 0, 0);
        group.add(leftBracket);

        const rightBracket = new THREE.Mesh(bracketGeometry, metalMaterial);
        rightBracket.position.set(2, 0, 0);
        group.add(rightBracket);

        const barGeometry = new THREE.CylinderGeometry(0.08, 0.08, 3.5, 16); // Reduced segments
        const mainBar = new THREE.Mesh(barGeometry, material);
        mainBar.rotation.z = Math.PI / 2;
        mainBar.position.y = 0.3;
        group.add(mainBar);

        return group;
    }

    createSimplifiedRings(group, material) {
        const ringGeometry = new THREE.TorusGeometry(0.4, 0.08, 8, 32); // Reduced segments
        
        const leftRing = new THREE.Mesh(ringGeometry, material);
        leftRing.position.set(-0.8, 0, 0);
        group.add(leftRing);

        const rightRing = new THREE.Mesh(ringGeometry, material);
        rightRing.position.set(0.8, 0, 0);
        group.add(rightRing);

        return group;
    }

    createSimplifiedParallettes(group, material) {
        const handleGeometry = new THREE.CylinderGeometry(0.06, 0.06, 1, 16);
        
        const leftHandle = new THREE.Mesh(handleGeometry, material);
        leftHandle.position.set(-0.6, 0.4, 0);
        leftHandle.rotation.z = Math.PI / 2;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, material);
        rightHandle.position.set(0.6, 0.4, 0);
        rightHandle.rotation.z = Math.PI / 2;
        group.add(rightHandle);

        return group;
    }

    createSimplifiedDipBars(group, material, metalMaterial) {
        const baseGeometry = new THREE.BoxGeometry(2, 0.1, 1.5);
        const base = new THREE.Mesh(baseGeometry, metalMaterial);
        base.position.y = -0.8;
        group.add(base);

        const handleGeometry = new THREE.CylinderGeometry(0.06, 0.06, 1.2, 16);
        const leftHandle = new THREE.Mesh(handleGeometry, material);
        leftHandle.position.set(-0.8, 0.7, 0);
        leftHandle.rotation.x = Math.PI / 2;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, material);
        rightHandle.position.set(0.8, 0.7, 0);
        rightHandle.rotation.x = Math.PI / 2;
        group.add(rightHandle);

        return group;
    }

    getEquipmentType(viewerId) {
        if (viewerId.includes('pullup')) return 'pullup';
        if (viewerId.includes('rings')) return 'rings';
        if (viewerId.includes('parallettes')) return 'parallettes';
        if (viewerId.includes('dipbars')) return 'dipbars';
        return 'pullup';
    }

    optimizeGlobalSettings() {
        // Reduce particle count
        const particles = document.querySelectorAll('.particle');
        if (this.isLowEndDevice && particles.length > 20) {
            particles.forEach((particle, index) => {
                if (index > 20) particle.remove();
            });
        }

        // Disable expensive animations on low-end devices
        if (this.isLowEndDevice) {
            document.documentElement.style.setProperty('--animation-duration', '0s');
        }
    }

    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();

        const checkPerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;

                // Auto-adjust quality based on FPS
                if (fps < 30 && !this.isLowEndDevice) {
                    this.reduceQuality();
                }
            }
            
            requestAnimationFrame(checkPerformance);
        };
        
        checkPerformance();
    }

    reduceQuality() {
        // Automatically reduce quality if performance is poor
        this.activeViewers.forEach(viewer => {
            if (viewer.renderer) {
                viewer.renderer.setPixelRatio(1);
                viewer.renderer.shadowMap.enabled = false;
            }
            if (viewer.controls) {
                viewer.controls.autoRotate = false;
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    dispose() {
        // Clean up resources
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        this.activeViewers.forEach(viewer => {
            if (viewer.animationId) {
                cancelAnimationFrame(viewer.animationId);
            }
            if (viewer.renderer) {
                viewer.renderer.dispose();
            }
        });
        
        this.activeViewers.clear();
    }
}

// Initialize performance optimizer
window.performanceOptimizer = new PerformanceOptimizer();

// Override the original 3D viewer creation
window.originalCreate3DViewer = window.create3DViewer;
window.create3DViewer = function(containerId, equipmentType) {
    // Use optimized version instead
    return window.performanceOptimizer.createOptimizedViewer(containerId);
};
