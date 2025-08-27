/**
 * AI Model Loader for CalisVerse 3D Landing Page
 * Supports GLB/GLTF models from Meshy AI, Spline AI, Rodin AI
 */

class AIModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.loader = new THREE.GLTFLoader();
        this.loadedModels = new Map();
        this.fallbackModels = new Map();
        
        // Model configuration
        this.modelConfig = {
            'wall-mount-pullup': {
                path: 'models/ai-generated/pullup-bars/wall-mount-v1.glb',
                fallback: 'procedural',
                scale: 1.0,
                position: { x: 0, y: 0.5, z: 0 },
                rotation: { x: 0, y: 0, z: 0 }
            },
            'doorway-pullup': {
                path: 'models/ai-generated/pullup-bars/doorway-v1.glb',
                fallback: 'procedural',
                scale: 1.0,
                position: { x: -2, y: 0.8, z: -1 },
                rotation: { x: 0, y: Math.PI / 4, z: 0 }
            },
            'power-tower': {
                path: 'models/ai-generated/pullup-bars/power-tower-v1.glb',
                fallback: 'procedural',
                scale: 0.8,
                position: { x: 2.5, y: 0, z: -1.5 },
                rotation: { x: 0, y: -Math.PI / 6, z: 0 }
            },
            'multi-grip-bar': {
                path: 'models/ai-generated/pullup-bars/multi-grip-v1.glb',
                fallback: 'procedural',
                scale: 1.1,
                position: { x: -1.5, y: 1.2, z: 1 },
                rotation: { x: 0, y: Math.PI / 3, z: 0 }
            },
            'portable-pullup': {
                path: 'models/ai-generated/pullup-bars/portable-v1.glb',
                fallback: 'procedural',
                scale: 0.9,
                position: { x: 1.8, y: 0.3, z: 1.2 },
                rotation: { x: 0, y: -Math.PI / 4, z: 0 }
            }
        };
    }

    /**
     * Load AI-generated model with fallback to procedural
     */
    async loadModel(modelType) {
        const config = this.modelConfig[modelType];
        if (!config) {
            console.warn(`Unknown model type: ${modelType}`);
            return null;
        }

        try {
            // Try to load AI-generated model first
            const model = await this.loadGLTFModel(config.path);
            this.setupModel(model, config);
            this.loadedModels.set(modelType, model);
            console.log(`✅ Loaded AI model: ${modelType}`);
            return model;
        } catch (error) {
            console.log(`⚠️ AI model not found, using fallback: ${modelType}`);
            // Fallback to procedural model
            const fallbackModel = this.createFallbackModel(modelType, config);
            this.loadedModels.set(modelType, fallbackModel);
            return fallbackModel;
        }
    }

    /**
     * Load GLTF/GLB model from file
     */
    loadGLTFModel(path) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                path,
                (gltf) => {
                    const model = gltf.scene;
                    resolve(model);
                },
                (progress) => {
                    console.log(`Loading progress: ${(progress.loaded / progress.total * 100)}%`);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    /**
     * Setup model properties (shadows, materials, etc.)
     */
    setupModel(model, config) {
        // Apply transformations
        model.scale.setScalar(config.scale);
        model.position.set(config.position.x, config.position.y, config.position.z);
        model.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);

        // Setup shadows and materials
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Enhance materials for better rendering
                if (child.material) {
                    // Ensure proper metallic/roughness for PBR
                    if (child.material.metalness !== undefined) {
                        child.material.metalness = Math.max(child.material.metalness, 0.7);
                    }
                    if (child.material.roughness !== undefined) {
                        child.material.roughness = Math.min(child.material.roughness, 0.3);
                    }
                    
                    // Enable environment mapping if available
                    child.material.envMapIntensity = 0.8;
                }
            }
        });

        // Add floating animation
        this.addFloatingAnimation(model);
    }

    /**
     * Create procedural fallback models
     */
    createFallbackModel(modelType, config) {
        const group = new THREE.Group();

        switch (modelType) {
            case 'wall-mount-pullup':
                group.add(this.createWallMountBar());
                break;
            case 'doorway-pullup':
                group.add(this.createDoorwayBar());
                break;
            case 'power-tower':
                group.add(this.createPowerTower());
                break;
            case 'multi-grip-bar':
                group.add(this.createMultiGripBar());
                break;
            case 'portable-pullup':
                group.add(this.createPortableBar());
                break;
            default:
                group.add(this.createBasicPullupBar());
        }

        this.setupModel(group, config);
        return group;
    }

    /**
     * Procedural model creators (fallbacks)
     */
    createWallMountBar() {
        const group = new THREE.Group();
        
        // Main bar
        const barGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 32);
        const barMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2d3748,
            shininess: 100,
            metalness: 0.8,
            roughness: 0.2
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.rotation.z = Math.PI / 2;
        bar.castShadow = true;
        group.add(bar);

        // Wall brackets
        const bracketGeometry = new THREE.BoxGeometry(0.15, 0.08, 0.1);
        const bracketMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1a202c,
            metalness: 0.9,
            roughness: 0.1
        });
        
        [-0.5, 0.5].forEach(x => {
            const bracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
            bracket.position.set(x, 0, -0.05);
            bracket.castShadow = true;
            group.add(bracket);
        });

        return group;
    }

    createDoorwayBar() {
        const group = new THREE.Group();
        
        // Telescopic tubes
        const tubeGeometry = new THREE.CylinderGeometry(0.025, 0.025, 1.0, 16);
        const tubeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xc0c0c0,
            shininess: 150,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const leftTube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        leftTube.position.set(-0.6, 0, 0);
        leftTube.rotation.z = Math.PI / 2;
        leftTube.castShadow = true;
        group.add(leftTube);
        
        const rightTube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        rightTube.position.set(0.6, 0, 0);
        rightTube.rotation.z = Math.PI / 2;
        rightTube.castShadow = true;
        group.add(rightTube);

        // Center grip
        const gripGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 32);
        const gripMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2d3748,
            shininess: 80
        });
        const grip = new THREE.Mesh(gripGeometry, gripMaterial);
        grip.rotation.z = Math.PI / 2;
        grip.castShadow = true;
        group.add(grip);

        return group;
    }

    createPowerTower() {
        const group = new THREE.Group();
        
        // Main frame
        const frameGeometry = new THREE.BoxGeometry(0.05, 2.0, 0.05);
        const frameMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2d3748,
            metalness: 0.8,
            roughness: 0.3
        });
        
        // Vertical posts
        [-0.8, 0.8].forEach(x => {
            [-0.8, 0.8].forEach(z => {
                const post = new THREE.Mesh(frameGeometry, frameMaterial);
                post.position.set(x, 1.0, z);
                post.castShadow = true;
                group.add(post);
            });
        });

        // Top pull-up bar
        const topBarGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.6, 32);
        const topBar = new THREE.Mesh(topBarGeometry, frameMaterial);
        topBar.position.set(0, 2.0, 0);
        topBar.rotation.z = Math.PI / 2;
        topBar.castShadow = true;
        group.add(topBar);

        // Base
        const baseGeometry = new THREE.BoxGeometry(2.0, 0.1, 2.0);
        const base = new THREE.Mesh(baseGeometry, frameMaterial);
        base.position.y = 0.05;
        base.castShadow = true;
        group.add(base);

        return group;
    }

    createMultiGripBar() {
        const group = new THREE.Group();
        
        // Main horizontal bar
        const mainBarGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.4, 32);
        const barMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2d3748,
            metalness: 0.8,
            roughness: 0.2
        });
        const mainBar = new THREE.Mesh(mainBarGeometry, barMaterial);
        mainBar.rotation.z = Math.PI / 2;
        mainBar.castShadow = true;
        group.add(mainBar);

        // Angled grip handles
        const angleBarGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.3, 16);
        [-0.4, 0.4].forEach(x => {
            const angleBar = new THREE.Mesh(angleBarGeometry, barMaterial);
            angleBar.position.set(x, -0.15, 0.1);
            angleBar.rotation.set(Math.PI / 6, 0, Math.PI / 2);
            angleBar.castShadow = true;
            group.add(angleBar);
        });

        return group;
    }

    createPortableBar() {
        const group = new THREE.Group();
        
        // Adjustable legs
        const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 16);
        const legMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x606060,
            metalness: 0.7,
            roughness: 0.4
        });
        
        [-0.8, 0.8].forEach(x => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(x, 0.75, 0);
            leg.castShadow = true;
            group.add(leg);
        });

        // Top bar
        const barGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.6, 32);
        const barMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2d3748,
            metalness: 0.8,
            roughness: 0.2
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.position.y = 1.5;
        bar.rotation.z = Math.PI / 2;
        bar.castShadow = true;
        group.add(bar);

        return group;
    }

    createBasicPullupBar() {
        return this.createWallMountBar();
    }

    /**
     * Add floating animation to model
     */
    addFloatingAnimation(model) {
        const originalY = model.position.y;
        const animate = () => {
            const time = Date.now() * 0.001;
            model.position.y = originalY + Math.sin(time + model.position.x) * 0.02;
            model.rotation.y += 0.005;
        };
        
        // Store animation function for cleanup
        model.userData.animate = animate;
    }

    /**
     * Load all models for the scene
     */
    async loadAllModels() {
        const modelTypes = Object.keys(this.modelConfig);
        const loadPromises = modelTypes.map(type => this.loadModel(type));
        
        try {
            const models = await Promise.all(loadPromises);
            models.forEach(model => {
                if (model) {
                    this.scene.add(model);
                }
            });
            console.log(`✅ Loaded ${models.length} models successfully`);
            return models;
        } catch (error) {
            console.error('Error loading models:', error);
            return [];
        }
    }

    /**
     * Update animations for all loaded models
     */
    update() {
        this.loadedModels.forEach(model => {
            if (model.userData.animate) {
                model.userData.animate();
            }
        });
    }

    /**
     * Get model by type
     */
    getModel(modelType) {
        return this.loadedModels.get(modelType);
    }

    /**
     * Remove model from scene
     */
    removeModel(modelType) {
        const model = this.loadedModels.get(modelType);
        if (model) {
            this.scene.remove(model);
            this.loadedModels.delete(modelType);
        }
    }

    /**
     * Clear all models
     */
    clearAll() {
        this.loadedModels.forEach(model => {
            this.scene.remove(model);
        });
        this.loadedModels.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIModelLoader;
}
