// Enhanced 3D Controls for Professional Pull-Up Bar
class Enhanced3DControls {
    constructor() {
        this.viewers = new Map();
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Wait for 3D models to be ready
        if (typeof scenes === 'undefined' || typeof renderers === 'undefined' || 
            typeof cameras === 'undefined' || typeof orbitControls === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.setupEnhancedControls();
        this.isInitialized = true;
    }

    setupEnhancedControls() {
        // Enhanced controls for pull-up bar specifically
        const pullupViewer = document.getElementById('pullup-viewer');
        if (pullupViewer && scenes['pullup-viewer'] && renderers['pullup-viewer']) {
            this.enhanceViewer('pullup-viewer', pullupViewer);
        }

        // Setup for other viewers as well
        ['rings-viewer', 'parallettes-viewer', 'dipbars-viewer'].forEach(viewerId => {
            const viewer = document.getElementById(viewerId);
            if (viewer && scenes[viewerId] && renderers[viewerId]) {
                this.enhanceViewer(viewerId, viewer);
            }
        });
    }

    enhanceViewer(viewerId, viewerElement) {
        const scene = scenes[viewerId];
        const renderer = renderers[viewerId];
        const camera = cameras[viewerId];
        const controls = orbitControls[viewerId];

        if (!scene || !renderer || !camera || !controls) return;

        // Enhanced controls configuration
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enableRotate = true;
        controls.enablePan = false;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.5;
        controls.minDistance = 2;
        controls.maxDistance = 8;
        controls.minPolarAngle = Math.PI / 6;
        controls.maxPolarAngle = Math.PI - Math.PI / 6;

        // Enhanced interaction feedback
        let isInteracting = false;
        let autoRotateTimeout;

        // Mouse/touch interaction handlers
        const onInteractionStart = () => {
            isInteracting = true;
            controls.autoRotate = false;
            clearTimeout(autoRotateTimeout);
            viewerElement.style.cursor = 'grabbing';
            
            // Add interaction glow effect
            viewerElement.classList.add('interacting');
        };

        const onInteractionEnd = () => {
            isInteracting = false;
            viewerElement.style.cursor = 'grab';
            viewerElement.classList.remove('interacting');
            
            // Resume auto-rotate after 3 seconds of inactivity
            autoRotateTimeout = setTimeout(() => {
                if (!isInteracting) {
                    controls.autoRotate = true;
                }
            }, 3000);
        };

        // Enhanced zoom handling
        const onZoom = (event) => {
            const zoomLevel = (camera.position.length() - controls.minDistance) / 
                            (controls.maxDistance - controls.minDistance);
            
            // Update lighting intensity based on zoom
            scene.traverse((child) => {
                if (child.isLight && child.type !== 'AmbientLight') {
                    child.intensity = 0.8 + (1 - zoomLevel) * 0.4;
                }
            });
        };

        // Bind events
        controls.addEventListener('start', onInteractionStart);
        controls.addEventListener('end', onInteractionEnd);
        controls.addEventListener('change', onZoom);

        // Enhanced hover effects
        viewerElement.addEventListener('mouseenter', () => {
            viewerElement.style.cursor = 'grab';
            controls.autoRotate = true;
        });

        viewerElement.addEventListener('mouseleave', () => {
            viewerElement.style.cursor = 'default';
            controls.autoRotate = false;
            viewerElement.classList.remove('interacting');
        });

        // Touch support for mobile
        viewerElement.addEventListener('touchstart', onInteractionStart, { passive: true });
        viewerElement.addEventListener('touchend', onInteractionEnd, { passive: true });

        // Performance optimization
        const animate = () => {
            if (controls.enableDamping) {
                controls.update();
            }
            
            // Only render when needed
            if (controls.autoRotate || isInteracting || controls.enableDamping) {
                renderer.render(scene, camera);
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();

        // Store viewer reference
        this.viewers.set(viewerId, {
            scene,
            renderer,
            camera,
            controls,
            element: viewerElement
        });
    }

    // Method to temporarily disable auto-rotate for color changes
    pauseAutoRotate(viewerId, duration = 2000) {
        const viewer = this.viewers.get(viewerId);
        if (viewer && viewer.controls) {
            viewer.controls.autoRotate = false;
            setTimeout(() => {
                if (viewer.controls) {
                    viewer.controls.autoRotate = true;
                }
            }, duration);
        }
    }

    // Method to focus camera on equipment
    focusOnEquipment(viewerId) {
        const viewer = this.viewers.get(viewerId);
        if (!viewer) return;

        const equipment = viewer.scene.getObjectByName('equipment');
        if (equipment) {
            // Calculate bounding box
            const box = new THREE.Box3().setFromObject(equipment);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            // Position camera for optimal view
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = viewer.camera.fov * (Math.PI / 180);
            const cameraDistance = maxDim / (2 * Math.tan(fov / 2)) * 1.5;
            
            viewer.controls.target.copy(center);
            viewer.camera.position.set(
                center.x + cameraDistance * 0.5,
                center.y + cameraDistance * 0.3,
                center.z + cameraDistance
            );
            
            viewer.controls.update();
        }
    }
}

// Enhanced lighting setup for professional appearance
function enhanceLighting(scene) {
    // Remove existing lights
    const lightsToRemove = [];
    scene.traverse((child) => {
        if (child.isLight) {
            lightsToRemove.push(child);
        }
    });
    lightsToRemove.forEach(light => scene.remove(light));

    // Professional lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Key light (main illumination)
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

    // Fill light (softer illumination)
    const fillLight = new THREE.DirectionalLight(0x8B5CF6, 0.4);
    fillLight.position.set(-3, 5, -3);
    scene.add(fillLight);

    // Rim light (edge highlighting)
    const rimLight = new THREE.DirectionalLight(0xA78BFA, 0.6);
    rimLight.position.set(0, -5, -10);
    scene.add(rimLight);

    // Environment light for reflections
    const envLight = new THREE.HemisphereLight(0x8B5CF6, 0x4C1D95, 0.2);
    scene.add(envLight);
}

// Initialize enhanced controls when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for 3D models to initialize first
    const initEnhancedControls = () => {
        if (typeof scenes !== 'undefined' && Object.keys(scenes).length > 0) {
            window.enhanced3DControls = new Enhanced3DControls();
            
            // Enhance lighting for all scenes
            Object.values(scenes).forEach(scene => {
                enhanceLighting(scene);
            });
        } else {
            setTimeout(initEnhancedControls, 200);
        }
    };
    
    setTimeout(initEnhancedControls, 1000);
});

// Export for use in color picker
window.Enhanced3DControls = Enhanced3DControls;
