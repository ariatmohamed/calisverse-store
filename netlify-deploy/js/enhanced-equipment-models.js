// Enhanced Equipment Models with Professional Features
// Realistic geometry, advanced materials, and interactive components

class EnhancedEquipmentModels {
    constructor() {
        this.materials = this.createProfessionalMaterials();
        this.textureLoader = new THREE.TextureLoader();
        this.cubeTextureLoader = new THREE.CubeTextureLoader();
        this.environmentMap = null;
        this.loadEnvironmentMap();
    }

    loadEnvironmentMap() {
        // Load HDR environment map for realistic reflections
        const urls = [
            'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/px.jpg',
            'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nx.jpg',
            'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/py.jpg',
            'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/ny.jpg',
            'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/pz.jpg',
            'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nz.jpg'
        ];
        
        this.environmentMap = this.cubeTextureLoader.load(urls);
        this.environmentMap.format = THREE.RGBFormat;
    }

    createProfessionalMaterials() {
        return {
            // Premium Steel with realistic properties
            premiumSteel: new THREE.MeshPhysicalMaterial({
                color: 0x4a5568,
                metalness: 0.95,
                roughness: 0.08,
                clearcoat: 1.0,
                clearcoatRoughness: 0.03,
                reflectivity: 0.9,
                envMapIntensity: 2.5,
                ior: 2.4,
                specularIntensity: 1.0,
                specularColor: 0xffffff
            }),

            // Brushed Aluminum
            brushedAluminum: new THREE.MeshPhysicalMaterial({
                color: 0xe2e8f0,
                metalness: 0.9,
                roughness: 0.25,
                clearcoat: 0.8,
                clearcoatRoughness: 0.15,
                reflectivity: 0.85,
                envMapIntensity: 2.0
            }),

            // Carbon Fiber
            carbonFiber: new THREE.MeshPhysicalMaterial({
                color: 0x1a1a1a,
                metalness: 0.1,
                roughness: 0.15,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
                envMapIntensity: 1.8,
                normalScale: new THREE.Vector2(2.0, 2.0)
            }),

            // Premium Wood
            premiumWood: new THREE.MeshPhysicalMaterial({
                color: 0x8B4513,
                metalness: 0.0,
                roughness: 0.6,
                clearcoat: 0.4,
                clearcoatRoughness: 0.3,
                envMapIntensity: 0.6
            }),

            // Rubber Grip
            rubberGrip: new THREE.MeshPhysicalMaterial({
                color: 0x2d3748,
                metalness: 0.0,
                roughness: 0.95,
                clearcoat: 0.05,
                clearcoatRoughness: 0.9,
                envMapIntensity: 0.2
            }),

            // Chrome finish
            chrome: new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 1.0,
                roughness: 0.02,
                clearcoat: 1.0,
                clearcoatRoughness: 0.01,
                reflectivity: 1.0,
                envMapIntensity: 3.0
            }),

            // Anodized aluminum
            anodizedAluminum: new THREE.MeshPhysicalMaterial({
                color: 0x8B5CF6,
                metalness: 0.8,
                roughness: 0.2,
                clearcoat: 0.9,
                clearcoatRoughness: 0.1,
                envMapIntensity: 1.5
            })
        };
    }

    // Enhanced Pull-Up Bar with realistic details
    createEnhancedPullUpBar() {
        const group = new THREE.Group();

        // Wall mounting plates with realistic bolts
        const mountingPlateGeometry = new THREE.BoxGeometry(0.4, 1.8, 0.25);
        const boltGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.05, 8);
        
        // Left mounting assembly
        const leftPlate = new THREE.Mesh(mountingPlateGeometry, this.materials.premiumSteel);
        leftPlate.position.set(-2.2, 0, 0);
        leftPlate.castShadow = true;
        leftPlate.receiveShadow = true;
        group.add(leftPlate);

        // Add mounting bolts
        for (let i = 0; i < 6; i++) {
            const bolt = new THREE.Mesh(boltGeometry, this.materials.chrome);
            bolt.position.set(-2.2, -0.6 + (i * 0.24), 0.13);
            bolt.castShadow = true;
            group.add(bolt);
        }

        // Right mounting assembly
        const rightPlate = new THREE.Mesh(mountingPlateGeometry, this.materials.premiumSteel);
        rightPlate.position.set(2.2, 0, 0);
        rightPlate.castShadow = true;
        rightPlate.receiveShadow = true;
        group.add(rightPlate);

        for (let i = 0; i < 6; i++) {
            const bolt = new THREE.Mesh(boltGeometry, this.materials.chrome);
            bolt.position.set(2.2, -0.6 + (i * 0.24), 0.13);
            bolt.castShadow = true;
            group.add(bolt);
        }

        // Support arms with reinforcement
        const armGeometry = new THREE.BoxGeometry(0.9, 0.18, 0.18);
        const reinforcementGeometry = new THREE.BoxGeometry(0.2, 0.18, 0.3);
        
        const leftArm = new THREE.Mesh(armGeometry, this.materials.premiumSteel);
        leftArm.position.set(-1.3, 0.4, 0);
        leftArm.castShadow = true;
        leftArm.receiveShadow = true;
        group.add(leftArm);

        const leftReinforcement = new THREE.Mesh(reinforcementGeometry, this.materials.premiumSteel);
        leftReinforcement.position.set(-1.8, 0.4, 0);
        leftReinforcement.castShadow = true;
        group.add(leftReinforcement);

        const rightArm = new THREE.Mesh(armGeometry, this.materials.premiumSteel);
        rightArm.position.set(1.3, 0.4, 0);
        rightArm.castShadow = true;
        rightArm.receiveShadow = true;
        group.add(rightArm);

        const rightReinforcement = new THREE.Mesh(reinforcementGeometry, this.materials.premiumSteel);
        rightReinforcement.position.set(1.8, 0.4, 0);
        rightReinforcement.castShadow = true;
        group.add(rightReinforcement);

        // Main bar with grip texture
        const barGeometry = new THREE.CylinderGeometry(0.09, 0.09, 3.8, 32);
        const mainBar = new THREE.Mesh(barGeometry, this.materials.brushedAluminum);
        mainBar.rotation.z = Math.PI / 2;
        mainBar.position.y = 0.4;
        mainBar.castShadow = true;
        mainBar.receiveShadow = true;
        group.add(mainBar);

        // Grip sections
        const gripGeometry = new THREE.CylinderGeometry(0.095, 0.095, 0.6, 32);
        const leftGrip = new THREE.Mesh(gripGeometry, this.materials.rubberGrip);
        leftGrip.rotation.z = Math.PI / 2;
        leftGrip.position.set(-0.8, 0.4, 0);
        leftGrip.castShadow = true;
        group.add(leftGrip);

        const rightGrip = new THREE.Mesh(gripGeometry, this.materials.rubberGrip);
        rightGrip.rotation.z = Math.PI / 2;
        rightGrip.position.set(0.8, 0.4, 0);
        rightGrip.castShadow = true;
        group.add(rightGrip);

        // Add environment mapping
        this.applyEnvironmentMapping(group);
        
        return group;
    }

    // Enhanced Gymnastics Rings with realistic straps
    createEnhancedGymnasticsRings() {
        const group = new THREE.Group();

        // Mounting point
        const mountGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 16);
        const mount = new THREE.Mesh(mountGeometry, this.materials.premiumSteel);
        mount.position.set(0, 2.2, 0);
        mount.rotation.z = Math.PI / 2;
        mount.castShadow = true;
        group.add(mount);

        // Adjustable straps with realistic segments
        const strapSegments = 8;
        const strapSegmentGeometry = new THREE.BoxGeometry(0.08, 0.25, 0.03);
        
        for (let side = 0; side < 2; side++) {
            const xPos = side === 0 ? -0.9 : 0.9;
            
            for (let i = 0; i < strapSegments; i++) {
                const segment = new THREE.Mesh(strapSegmentGeometry, this.materials.carbonFiber);
                segment.position.set(xPos, 2.0 - (i * 0.25), 0);
                segment.castShadow = true;
                group.add(segment);
                
                // Add stitching detail
                if (i > 0) {
                    const stitchGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.1, 8);
                    const stitch = new THREE.Mesh(stitchGeometry, this.materials.chrome);
                    stitch.position.set(xPos, 2.0 - (i * 0.25) + 0.125, 0);
                    stitch.rotation.z = Math.PI / 2;
                    group.add(stitch);
                }
            }
        }

        // Rings with wood grain texture
        const ringGeometry = new THREE.TorusGeometry(0.45, 0.09, 16, 100);
        
        const leftRing = new THREE.Mesh(ringGeometry, this.materials.premiumWood);
        leftRing.position.set(-0.9, 0, 0);
        leftRing.castShadow = true;
        leftRing.receiveShadow = true;
        group.add(leftRing);

        const rightRing = new THREE.Mesh(ringGeometry, this.materials.premiumWood);
        rightRing.position.set(0.9, 0, 0);
        rightRing.castShadow = true;
        rightRing.receiveShadow = true;
        group.add(rightRing);

        // Ring attachment hardware
        const attachmentGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 16);
        const leftAttachment = new THREE.Mesh(attachmentGeometry, this.materials.chrome);
        leftAttachment.position.set(-0.9, 0.45, 0);
        leftAttachment.castShadow = true;
        group.add(leftAttachment);

        const rightAttachment = new THREE.Mesh(attachmentGeometry, this.materials.chrome);
        rightAttachment.position.set(0.9, 0.45, 0);
        rightAttachment.castShadow = true;
        group.add(rightAttachment);

        this.applyEnvironmentMapping(group);
        return group;
    }

    // Enhanced Parallettes with adjustable height
    createEnhancedParallettes() {
        const group = new THREE.Group();

        const handleGeometry = new THREE.CylinderGeometry(0.065, 0.065, 1.2, 32);
        const legGeometry = new THREE.CylinderGeometry(0.045, 0.045, 0.9, 16);
        const baseGeometry = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16);
        const adjustmentGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.1, 16);

        // Left parallette
        const leftHandle = new THREE.Mesh(handleGeometry, this.materials.premiumWood);
        leftHandle.position.set(-0.7, 0.45, 0);
        leftHandle.rotation.z = Math.PI / 2;
        leftHandle.castShadow = true;
        leftHandle.receiveShadow = true;
        group.add(leftHandle);

        // Adjustable legs with height mechanism
        const leftLeg1 = new THREE.Mesh(legGeometry, this.materials.anodizedAluminum);
        leftLeg1.position.set(-1.1, -0.35, 0);
        leftLeg1.castShadow = true;
        group.add(leftLeg1);

        const leftLeg2 = new THREE.Mesh(legGeometry, this.materials.anodizedAluminum);
        leftLeg2.position.set(-0.3, -0.35, 0);
        leftLeg2.castShadow = true;
        group.add(leftLeg2);

        // Height adjustment mechanisms
        const leftAdj1 = new THREE.Mesh(adjustmentGeometry, this.materials.chrome);
        leftAdj1.position.set(-1.1, -0.1, 0);
        leftAdj1.castShadow = true;
        group.add(leftAdj1);

        const leftAdj2 = new THREE.Mesh(adjustmentGeometry, this.materials.chrome);
        leftAdj2.position.set(-0.3, -0.1, 0);
        leftAdj2.castShadow = true;
        group.add(leftAdj2);

        // Rubber bases
        const leftBase1 = new THREE.Mesh(baseGeometry, this.materials.rubberGrip);
        leftBase1.position.set(-1.1, -0.8, 0);
        group.add(leftBase1);

        const leftBase2 = new THREE.Mesh(baseGeometry, this.materials.rubberGrip);
        leftBase2.position.set(-0.3, -0.8, 0);
        group.add(leftBase2);

        // Right parallette (mirror)
        const rightHandle = new THREE.Mesh(handleGeometry, this.materials.premiumWood);
        rightHandle.position.set(0.7, 0.45, 0);
        rightHandle.rotation.z = Math.PI / 2;
        rightHandle.castShadow = true;
        rightHandle.receiveShadow = true;
        group.add(rightHandle);

        const rightLeg1 = new THREE.Mesh(legGeometry, this.materials.anodizedAluminum);
        rightLeg1.position.set(0.3, -0.35, 0);
        rightLeg1.castShadow = true;
        group.add(rightLeg1);

        const rightLeg2 = new THREE.Mesh(legGeometry, this.materials.anodizedAluminum);
        rightLeg2.position.set(1.1, -0.35, 0);
        rightLeg2.castShadow = true;
        group.add(rightLeg2);

        const rightAdj1 = new THREE.Mesh(adjustmentGeometry, this.materials.chrome);
        rightAdj1.position.set(0.3, -0.1, 0);
        rightAdj1.castShadow = true;
        group.add(rightAdj1);

        const rightAdj2 = new THREE.Mesh(adjustmentGeometry, this.materials.chrome);
        rightAdj2.position.set(1.1, -0.1, 0);
        rightAdj2.castShadow = true;
        group.add(rightAdj2);

        const rightBase1 = new THREE.Mesh(baseGeometry, this.materials.rubberGrip);
        rightBase1.position.set(0.3, -0.8, 0);
        group.add(rightBase1);

        const rightBase2 = new THREE.Mesh(baseGeometry, this.materials.rubberGrip);
        rightBase2.position.set(1.1, -0.8, 0);
        group.add(rightBase2);

        this.applyEnvironmentMapping(group);
        return group;
    }

    // Enhanced Dip Bars with professional construction
    createEnhancedDipBars() {
        const group = new THREE.Group();

        // Heavy-duty base frame
        const baseFrameGeometry = new THREE.BoxGeometry(2.2, 0.12, 1.8);
        const baseFrame = new THREE.Mesh(baseFrameGeometry, this.materials.premiumSteel);
        baseFrame.position.y = -0.75;
        baseFrame.castShadow = true;
        baseFrame.receiveShadow = true;
        group.add(baseFrame);

        // Reinforcement bars
        const reinforcementGeometry = new THREE.BoxGeometry(2.2, 0.08, 0.08);
        const frontReinforcement = new THREE.Mesh(reinforcementGeometry, this.materials.premiumSteel);
        frontReinforcement.position.set(0, -0.6, 0.8);
        frontReinforcement.castShadow = true;
        group.add(frontReinforcement);

        const backReinforcement = new THREE.Mesh(reinforcementGeometry, this.materials.premiumSteel);
        backReinforcement.position.set(0, -0.6, -0.8);
        backReinforcement.castShadow = true;
        group.add(backReinforcement);

        // Vertical supports with professional welding details
        const supportGeometry = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 16);
        const weldGeometry = new THREE.TorusGeometry(0.07, 0.01, 8, 16);

        // Create all four supports
        const supportPositions = [
            [-0.9, 0.05, 0.7],
            [0.9, 0.05, 0.7],
            [-0.9, 0.05, -0.7],
            [0.9, 0.05, -0.7]
        ];

        supportPositions.forEach(pos => {
            const support = new THREE.Mesh(supportGeometry, this.materials.premiumSteel);
            support.position.set(...pos);
            support.castShadow = true;
            group.add(support);

            // Add weld detail at base
            const weld = new THREE.Mesh(weldGeometry, this.materials.chrome);
            weld.position.set(pos[0], -0.65, pos[2]);
            weld.rotation.x = Math.PI / 2;
            group.add(weld);
        });

        // Professional handles with ergonomic grip
        const handleGeometry = new THREE.CylinderGeometry(0.07, 0.07, 1.4, 32);
        const gripGeometry = new THREE.CylinderGeometry(0.075, 0.075, 0.8, 32);

        const leftHandle = new THREE.Mesh(handleGeometry, this.materials.brushedAluminum);
        leftHandle.position.set(-0.9, 0.8, 0);
        leftHandle.rotation.x = Math.PI / 2;
        leftHandle.castShadow = true;
        leftHandle.receiveShadow = true;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, this.materials.brushedAluminum);
        rightHandle.position.set(0.9, 0.8, 0);
        rightHandle.rotation.x = Math.PI / 2;
        rightHandle.castShadow = true;
        rightHandle.receiveShadow = true;
        group.add(rightHandle);

        // Ergonomic grip sections
        const leftGrip = new THREE.Mesh(gripGeometry, this.materials.rubberGrip);
        leftGrip.position.set(-0.9, 0.8, 0);
        leftGrip.rotation.x = Math.PI / 2;
        leftGrip.castShadow = true;
        group.add(leftGrip);

        const rightGrip = new THREE.Mesh(gripGeometry, this.materials.rubberGrip);
        rightGrip.position.set(0.9, 0.8, 0);
        rightGrip.rotation.x = Math.PI / 2;
        rightGrip.castShadow = true;
        group.add(rightGrip);

        // Stability feet
        const footGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
        const footPositions = [
            [-1.0, -0.82, 0.8],
            [1.0, -0.82, 0.8],
            [-1.0, -0.82, -0.8],
            [1.0, -0.82, -0.8]
        ];

        footPositions.forEach(pos => {
            const foot = new THREE.Mesh(footGeometry, this.materials.rubberGrip);
            foot.position.set(...pos);
            group.add(foot);
        });

        this.applyEnvironmentMapping(group);
        return group;
    }

    applyEnvironmentMapping(group) {
        if (this.environmentMap) {
            group.traverse((child) => {
                if (child.isMesh && child.material) {
                    if (child.material.metalness > 0.5) {
                        child.material.envMap = this.environmentMap;
                        child.material.needsUpdate = true;
                    }
                }
            });
        }
    }

    // Add realistic wear and tear effects
    addWearEffects(model) {
        model.traverse((child) => {
            if (child.isMesh && child.material) {
                // Add subtle wear to metal surfaces
                if (child.material.metalness > 0.5) {
                    child.material.roughness += Math.random() * 0.1;
                    child.material.clearcoatRoughness += Math.random() * 0.05;
                }
                
                // Add scuff marks to grip surfaces
                if (child.material.roughness > 0.8) {
                    const originalColor = child.material.color.clone();
                    child.material.color.lerp(new THREE.Color(0.8, 0.8, 0.8), Math.random() * 0.1);
                }
            }
        });
    }

    // Create equipment based on type
    createEquipment(type) {
        let equipment;
        
        switch (type) {
            case 'pullup':
                equipment = this.createEnhancedPullUpBar();
                break;
            case 'rings':
                equipment = this.createEnhancedGymnasticsRings();
                break;
            case 'parallettes':
                equipment = this.createEnhancedParallettes();
                break;
            case 'dipbars':
                equipment = this.createEnhancedDipBars();
                break;
            default:
                equipment = new THREE.Group();
        }

        // Add realistic wear effects
        this.addWearEffects(equipment);
        
        return equipment;
    }
}

// Export for use
window.EnhancedEquipmentModels = EnhancedEquipmentModels;
