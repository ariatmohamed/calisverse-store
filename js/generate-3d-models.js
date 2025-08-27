// Generate Real 3D Models for CalisVerse Products
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { GLTFExporter } from 'https://unpkg.com/three@0.158.0/examples/jsm/exporters/GLTFExporter.js';

class ModelGenerator {
    constructor() {
        this.scene = new THREE.Scene();
        this.exporter = new GLTFExporter();
        this.materials = this.createMaterials();
    }

    createMaterials() {
        return {
            black: new THREE.MeshPhysicalMaterial({
                color: 0x1a1a1a,
                metalness: 0.1,
                roughness: 0.2,
                clearcoat: 0.8,
                clearcoatRoughness: 0.1
            }),
            walnut: new THREE.MeshPhysicalMaterial({
                color: 0x8B4513,
                metalness: 0.0,
                roughness: 0.7,
                map: this.createWoodTexture()
            }),
            steel: new THREE.MeshPhysicalMaterial({
                color: 0xC0C0C0,
                metalness: 0.9,
                roughness: 0.1,
                envMapIntensity: 1.0
            })
        };
    }

    createWoodTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Wood grain pattern
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(0.3, '#A0522D');
        gradient.addColorStop(0.6, '#8B4513');
        gradient.addColorStop(1, '#654321');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add wood grain lines
        ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 25 + Math.sin(i) * 10);
            ctx.lineTo(512, i * 25 + Math.sin(i + 1) * 10);
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 8);
        return texture;
    }

    createPullupBar(material = 'black') {
        const group = new THREE.Group();
        
        // Main horizontal bar
        const barGeometry = new THREE.CylinderGeometry(0.015, 0.015, 1.2, 16);
        const bar = new THREE.Mesh(barGeometry, this.materials[material]);
        bar.rotation.z = Math.PI / 2;
        bar.position.y = 2.1;
        group.add(bar);
        
        // Vertical supports
        const supportGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2.1, 12);
        
        const leftSupport = new THREE.Mesh(supportGeometry, this.materials[material]);
        leftSupport.position.set(-0.6, 1.05, 0);
        group.add(leftSupport);
        
        const rightSupport = new THREE.Mesh(supportGeometry, this.materials[material]);
        rightSupport.position.set(0.6, 1.05, 0);
        group.add(rightSupport);
        
        // Base plates
        const baseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
        
        const leftBase = new THREE.Mesh(baseGeometry, this.materials[material]);
        leftBase.position.set(-0.6, 0.025, 0);
        group.add(leftBase);
        
        const rightBase = new THREE.Mesh(baseGeometry, this.materials[material]);
        rightBase.position.set(0.6, 0.025, 0);
        group.add(rightBase);
        
        // Grip texture on bar
        const gripGeometry = new THREE.CylinderGeometry(0.016, 0.016, 0.3, 16);
        const gripMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x333333,
            roughness: 0.9,
            metalness: 0.1
        });
        
        for (let i = -2; i <= 2; i++) {
            const grip = new THREE.Mesh(gripGeometry, gripMaterial);
            grip.position.set(i * 0.15, 2.1, 0);
            grip.rotation.z = Math.PI / 2;
            group.add(grip);
        }
        
        return group;
    }

    createRings(material = 'black') {
        const group = new THREE.Group();
        
        // Ring geometry
        const ringGeometry = new THREE.TorusGeometry(0.12, 0.015, 8, 16);
        
        // Left ring
        const leftRing = new THREE.Mesh(ringGeometry, this.materials[material]);
        leftRing.position.set(-0.3, 1.8, 0);
        group.add(leftRing);
        
        // Right ring
        const rightRing = new THREE.Mesh(ringGeometry, this.materials[material]);
        rightRing.position.set(0.3, 1.8, 0);
        group.add(rightRing);
        
        // Straps
        const strapGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.4, 8);
        const strapMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x2a2a2a,
            roughness: 0.8
        });
        
        const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        leftStrap.position.set(-0.3, 2.1, 0);
        group.add(leftStrap);
        
        const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        rightStrap.position.set(0.3, 2.1, 0);
        group.add(rightStrap);
        
        // Mounting point
        const mountGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 12);
        const mount = new THREE.Mesh(mountGeometry, this.materials[material]);
        mount.position.y = 2.35;
        mount.rotation.z = Math.PI / 2;
        group.add(mount);
        
        return group;
    }

    createParallettes(material = 'black') {
        const group = new THREE.Group();
        
        // Handle bars
        const handleGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.3, 16);
        
        const leftHandle = new THREE.Mesh(handleGeometry, this.materials[material]);
        leftHandle.position.set(-0.2, 0.15, 0);
        leftHandle.rotation.z = Math.PI / 2;
        group.add(leftHandle);
        
        const rightHandle = new THREE.Mesh(handleGeometry, this.materials[material]);
        rightHandle.position.set(0.2, 0.15, 0);
        rightHandle.rotation.z = Math.PI / 2;
        group.add(rightHandle);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 12);
        
        // Left parallette legs
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const leg = new THREE.Mesh(legGeometry, this.materials[material]);
                leg.position.set(-0.35 + i * 0.3, 0.075, -0.1 + j * 0.2);
                group.add(leg);
            }
        }
        
        // Right parallette legs
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const leg = new THREE.Mesh(legGeometry, this.materials[material]);
                leg.position.set(0.05 + i * 0.3, 0.075, -0.1 + j * 0.2);
                group.add(leg);
            }
        }
        
        // Grip texture
        const gripGeometry = new THREE.CylinderGeometry(0.016, 0.016, 0.25, 16);
        const gripMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x333333,
            roughness: 0.9
        });
        
        const leftGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        leftGrip.position.set(-0.2, 0.15, 0);
        leftGrip.rotation.z = Math.PI / 2;
        group.add(leftGrip);
        
        const rightGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        rightGrip.position.set(0.2, 0.15, 0);
        rightGrip.rotation.z = Math.PI / 2;
        group.add(rightGrip);
        
        return group;
    }

    async exportModel(model, filename) {
        return new Promise((resolve, reject) => {
            this.exporter.parse(
                model,
                (gltf) => {
                    const blob = new Blob([gltf], { type: 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);
                    
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    link.click();
                    
                    URL.revokeObjectURL(url);
                    resolve(filename);
                },
                { binary: true },
                (error) => reject(error)
            );
        });
    }

    async generateAllModels() {
        const products = ['pullup-bar', 'rings', 'parallettes'];
        const variants = ['black', 'walnut', 'steel'];
        
        console.log('Starting 3D model generation...');
        
        for (const product of products) {
            for (const variant of variants) {
                let model;
                
                switch (product) {
                    case 'pullup-bar':
                        model = this.createPullupBar(variant);
                        break;
                    case 'rings':
                        model = this.createRings(variant);
                        break;
                    case 'parallettes':
                        model = this.createParallettes(variant);
                        break;
                }
                
                if (model) {
                    const filename = `${product}-${variant}.glb`;
                    try {
                        await this.exportModel(model, filename);
                        console.log(`✓ Generated: ${filename}`);
                    } catch (error) {
                        console.error(`✗ Failed to generate ${filename}:`, error);
                    }
                }
                
                // Clear scene for next model
                this.scene.clear();
            }
        }
        
        console.log('Model generation complete!');
    }
}

// Auto-generate models when script loads
const generator = new ModelGenerator();

// Export for manual use
window.ModelGenerator = ModelGenerator;
window.generateModels = () => generator.generateAllModels();

// Show instructions
console.log(`
🎯 CalisVerse 3D Model Generator Ready!

To generate all models, run:
generateModels()

This will create 9 .glb files:
- pullup-bar-black.glb
- pullup-bar-walnut.glb  
- pullup-bar-steel.glb
- rings-black.glb
- rings-walnut.glb
- rings-steel.glb
- parallettes-black.glb
- parallettes-walnut.glb
- parallettes-steel.glb

Models will be downloaded to your Downloads folder.
Move them to /models/ directory for deployment.
`);
