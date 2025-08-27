// Professional 3D Extensions for CalisVerse
// Advanced rendering, physics, and model enhancements

class Professional3DExtensions {
    constructor() {
        this.composer = null;
        this.bloomPass = null;
        this.ssaoPass = null;
        this.outlinePass = null;
        this.physics = null;
        this.loadingManager = new THREE.LoadingManager();
        this.gltfLoader = new THREE.GLTFLoader(this.loadingManager);
        this.dracoLoader = new THREE.DRACOLoader();
        this.ktx2Loader = new THREE.KTX2Loader();
        
        this.initializeLoaders();
    }

    initializeLoaders() {
        // Setup DRACO compression
        this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        this.gltfLoader.setDRACOLoader(this.dracoLoader);
        
        // Setup KTX2 texture compression
        this.ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.150.0/examples/js/libs/basis/');
        this.gltfLoader.setKTX2Loader(this.ktx2Loader);
    }

    // Enhanced Post-Processing Pipeline
    setupPostProcessing(renderer, scene, camera, container) {
        this.composer = new THREE.EffectComposer(renderer);
        
        // Render pass
        const renderPass = new THREE.RenderPass(scene, camera);
        this.composer.addPass(renderPass);

        // SSAO for realistic ambient occlusion
        this.ssaoPass = new THREE.SSAOPass(scene, camera, container.clientWidth, container.clientHeight);
        this.ssaoPass.kernelRadius = 16;
        this.ssaoPass.minDistance = 0.005;
        this.ssaoPass.maxDistance = 0.1;
        this.ssaoPass.output = THREE.SSAOPass.OUTPUT.Beauty;
        this.composer.addPass(this.ssaoPass);

        // Bloom for professional glow
        this.bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(container.clientWidth, container.clientHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        this.composer.addPass(this.bloomPass);

        // Outline pass for selection
        this.outlinePass = new THREE.OutlinePass(
            new THREE.Vector2(container.clientWidth, container.clientHeight),
            scene,
            camera
        );
        this.outlinePass.edgeStrength = 3.0;
        this.outlinePass.edgeGlow = 0.0;
        this.outlinePass.edgeThickness = 1.0;
        this.outlinePass.pulsePeriod = 0;
        this.outlinePass.visibleEdgeColor.set('#8B5CF6');
        this.outlinePass.hiddenEdgeColor.set('#190A05');
        this.composer.addPass(this.outlinePass);

        // Film pass for cinematic look
        const filmPass = new THREE.FilmPass(0.35, 0.025, 648, false);
        this.composer.addPass(filmPass);

        // FXAA for anti-aliasing
        const fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
        fxaaPass.material.uniforms['resolution'].value.x = 1 / container.clientWidth;
        fxaaPass.material.uniforms['resolution'].value.y = 1 / container.clientHeight;
        this.composer.addPass(fxaaPass);

        return this.composer;
    }

    // Professional Lighting Setup
    setupProfessionalLighting(scene) {
        // Clear existing lights
        const lights = scene.children.filter(child => child.isLight);
        lights.forEach(light => scene.remove(light));

        // Key light - main illumination
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
        keyLight.position.set(10, 10, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 4096;
        keyLight.shadow.mapSize.height = 4096;
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 50;
        keyLight.shadow.camera.left = -20;
        keyLight.shadow.camera.right = 20;
        keyLight.shadow.camera.top = 20;
        keyLight.shadow.camera.bottom = -20;
        keyLight.shadow.bias = -0.0001;
        keyLight.shadow.normalBias = 0.02;
        scene.add(keyLight);

        // Fill light - soften shadows
        const fillLight = new THREE.DirectionalLight(0x8B5CF6, 0.8);
        fillLight.position.set(-5, 3, -2);
        scene.add(fillLight);

        // Rim light - edge definition
        const rimLight = new THREE.DirectionalLight(0xa855f7, 1.2);
        rimLight.position.set(0, -2, -8);
        scene.add(rimLight);

        // Area lights for realistic illumination
        const rectLight1 = new THREE.RectAreaLight(0xffffff, 2, 4, 4);
        rectLight1.position.set(5, 5, 5);
        rectLight1.lookAt(0, 0, 0);
        scene.add(rectLight1);

        const rectLight2 = new THREE.RectAreaLight(0x8B5CF6, 1, 2, 2);
        rectLight2.position.set(-3, 3, -3);
        rectLight2.lookAt(0, 0, 0);
        scene.add(rectLight2);

        // Environment lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);

        // Hemisphere light for natural sky/ground lighting
        const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x362d59, 0.6);
        scene.add(hemiLight);

        return { keyLight, fillLight, rimLight, rectLight1, rectLight2, ambientLight, hemiLight };
    }

    // Enhanced Materials with PBR
    createProfessionalMaterials() {
        return {
            // Premium Steel
            premiumSteel: new THREE.MeshPhysicalMaterial({
                color: 0x4a5568,
                metalness: 0.95,
                roughness: 0.1,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
                reflectivity: 0.9,
                envMapIntensity: 2.0,
                transparent: false,
                ior: 2.4,
                thickness: 0.5,
                transmission: 0.0,
                specularIntensity: 1.0,
                specularColor: 0xffffff
            }),

            // Brushed Aluminum
            brushedAluminum: new THREE.MeshPhysicalMaterial({
                color: 0xe2e8f0,
                metalness: 0.9,
                roughness: 0.3,
                clearcoat: 0.8,
                clearcoatRoughness: 0.2,
                reflectivity: 0.8,
                envMapIntensity: 1.5,
                normalScale: new THREE.Vector2(0.5, 0.5)
            }),

            // Premium Wood
            premiumWood: new THREE.MeshPhysicalMaterial({
                color: 0x8B4513,
                metalness: 0.0,
                roughness: 0.7,
                clearcoat: 0.3,
                clearcoatRoughness: 0.4,
                envMapIntensity: 0.5,
                normalScale: new THREE.Vector2(1.0, 1.0)
            }),

            // Carbon Fiber
            carbonFiber: new THREE.MeshPhysicalMaterial({
                color: 0x1a1a1a,
                metalness: 0.1,
                roughness: 0.2,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                envMapIntensity: 1.2,
                normalScale: new THREE.Vector2(2.0, 2.0)
            }),

            // Rubber Grip
            rubberGrip: new THREE.MeshPhysicalMaterial({
                color: 0x2d3748,
                metalness: 0.0,
                roughness: 0.9,
                clearcoat: 0.1,
                clearcoatRoughness: 0.8,
                envMapIntensity: 0.3,
                normalScale: new THREE.Vector2(3.0, 3.0)
            })
        };
    }

    // Load Professional 3D Models
    async loadGLTFModel(url, onProgress = null) {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                url,
                (gltf) => {
                    // Enhance loaded model
                    this.enhanceLoadedModel(gltf.scene);
                    resolve(gltf);
                },
                onProgress,
                reject
            );
        });
    }

    enhanceLoadedModel(model) {
        model.traverse((child) => {
            if (child.isMesh) {
                // Enable shadows
                child.castShadow = true;
                child.receiveShadow = true;

                // Enhance materials
                if (child.material) {
                    if (child.material.map) {
                        child.material.map.anisotropy = 16;
                    }
                    
                    // Add environment mapping if metallic
                    if (child.material.metalness > 0.5) {
                        // Environment map would be loaded here
                        child.material.envMapIntensity = 1.5;
                    }
                }
            }
        });
    }

    // Interactive Model Features
    addInteractiveFeatures(model, scene, camera, renderer) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        const onMouseMove = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(model.children, true);
            
            if (intersects.length > 0) {
                // Highlight hovered parts
                if (this.outlinePass) {
                    this.outlinePass.selectedObjects = [intersects[0].object];
                }
                
                // Change cursor
                renderer.domElement.style.cursor = 'pointer';
            } else {
                if (this.outlinePass) {
                    this.outlinePass.selectedObjects = [];
                }
                renderer.domElement.style.cursor = 'default';
            }
        };
        
        const onClick = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(model.children, true);
            
            if (intersects.length > 0) {
                // Animate clicked part
                gsap.to(intersects[0].object.scale, {
                    x: 1.1,
                    y: 1.1,
                    z: 1.1,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
                
                // Trigger custom event
                const customEvent = new CustomEvent('modelPartClicked', {
                    detail: {
                        object: intersects[0].object,
                        point: intersects[0].point,
                        face: intersects[0].face
                    }
                });
                window.dispatchEvent(customEvent);
            }
        };
        
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('click', onClick);
        
        return { onMouseMove, onClick };
    }

    // Particle System for Atmosphere
    createAtmosphericParticles(scene) {
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions in a sphere
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
            
            // Purple/blue color palette
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                colors[i3] = 0.545; // Purple
                colors[i3 + 1] = 0.361;
                colors[i3 + 2] = 0.965;
            } else if (colorChoice < 0.66) {
                colors[i3] = 0.231; // Blue
                colors[i3 + 1] = 0.510;
                colors[i3 + 2] = 0.965;
            } else {
                colors[i3] = 0.024; // Cyan
                colors[i3 + 1] = 0.714;
                colors[i3 + 2] = 0.831;
            }
            
            sizes[i] = Math.random() * 2 + 1;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: window.devicePixelRatio }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                uniform float pixelRatio;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    alpha *= sin(time * 2.0 + gl_FragCoord.x * 0.01) * 0.3 + 0.7;
                    gl_FragColor = vec4(vColor, alpha * 0.6);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);
        
        return particleSystem;
    }

    // Performance Monitoring
    setupPerformanceMonitoring() {
        const stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
        stats.dom.style.position = 'fixed';
        stats.dom.style.top = '10px';
        stats.dom.style.right = '10px';
        stats.dom.style.zIndex = '10000';
        return stats;
    }

    // Cleanup resources
    dispose() {
        if (this.composer) {
            this.composer.dispose();
        }
        if (this.dracoLoader) {
            this.dracoLoader.dispose();
        }
        if (this.ktx2Loader) {
            this.ktx2Loader.dispose();
        }
    }
}

// Export for use in other modules
window.Professional3DExtensions = Professional3DExtensions;
