// Create placeholder 3D models using Three.js for development
// This generates basic .glb files that can be replaced with real models later

class PlaceholderModelGenerator {
    constructor() {
        this.init();
    }

    init() {
        if (typeof THREE === 'undefined') {
            console.log('THREE.js not available for placeholder generation');
            return;
        }

        this.createPlaceholderModels();
    }

    createPlaceholderModels() {
        const models = [
            { name: 'pullup', variants: ['black', 'walnut', 'steel'] },
            { name: 'rings', variants: ['black', 'walnut', 'steel'] },
            { name: 'parallettes', variants: ['black', 'walnut', 'steel'] }
        ];

        models.forEach(model => {
            model.variants.forEach(variant => {
                this.generateModel(model.name, variant);
            });
            // Also create default version
            this.generateModel(model.name, 'default');
        });
    }

    generateModel(equipmentType, variant) {
        const scene = new THREE.Scene();
        const equipment = this.createEquipmentGeometry(equipmentType, variant);
        scene.add(equipment);

        // Note: In a real implementation, you would export this as GLB
        // For now, we'll create a simple data structure that model-viewer can understand
        console.log(`Generated placeholder model: ${equipmentType}-${variant}`);
    }

    createEquipmentGeometry(type, variant) {
        const group = new THREE.Group();
        const material = this.getMaterial(variant);

        switch (type) {
            case 'pullup':
                return this.createPullupBar(material);
            case 'rings':
                return this.createRings(material);
            case 'parallettes':
                return this.createParallettes(material);
            default:
                return this.createPullupBar(material);
        }
    }

    getMaterial(variant) {
        const materials = {
            'black': new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.1, roughness: 0.8 }),
            'walnut': new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.0, roughness: 0.9 }),
            'steel': new THREE.MeshStandardMaterial({ color: 0x8a8a8a, metalness: 0.9, roughness: 0.1 }),
            'default': new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.1, roughness: 0.8 })
        };
        return materials[variant] || materials['default'];
    }

    createPullupBar(material) {
        const group = new THREE.Group();
        
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
        
        return group;
    }

    createRings(material) {
        const group = new THREE.Group();
        
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
        
        return group;
    }

    createParallettes(material) {
        const group = new THREE.Group();
        
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
        
        return group;
    }
}

// For development purposes - this would normally export actual GLB files
if (typeof THREE !== 'undefined') {
    new PlaceholderModelGenerator();
}
