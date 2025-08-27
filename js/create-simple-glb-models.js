// Create Simple GLB Models for CalisVerse
// This script creates basic 3D models and exports them as GLB files

import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { GLTFExporter } from 'https://unpkg.com/three@0.158.0/examples/jsm/exporters/GLTFExporter.js';

class SimpleModelCreator {
    constructor() {
        this.exporter = new GLTFExporter();
        this.materials = this.createMaterials();
    }

    createMaterials() {
        return {
            black: new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.1,
                roughness: 0.3
            }),
            walnut: new THREE.MeshStandardMaterial({
                color: 0x8B4513,
                metalness: 0.0,
                roughness: 0.8
            }),
            steel: new THREE.MeshStandardMaterial({
                color: 0xC0C0C0,
                metalness: 0.9,
                roughness: 0.1
            })
        };
    }

    createPullupBar(material = 'black') {
        const group = new THREE.Group();
        
        // Main horizontal bar
        const barGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 16);
        const bar = new THREE.Mesh(barGeometry, this.materials[material]);
        bar.rotation.z = Math.PI / 2;
        bar.position.y = 2.0;
        group.add(bar);

        // Vertical supports
        const supportGeometry = new THREE.CylinderGeometry(0.025, 0.025, 2.0, 12);
        
        const leftSupport = new THREE.Mesh(supportGeometry, this.materials[material]);
        leftSupport.position.set(-0.6, 1.0, 0);
        group.add(leftSupport);

        const rightSupport = new THREE.Mesh(supportGeometry, this.materials[material]);
        rightSupport.position.set(0.6, 1.0, 0);
        group.add(rightSupport);

        // Base plates
        const baseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
        
        const leftBase = new THREE.Mesh(baseGeometry, this.materials[material]);
        leftBase.position.set(-0.6, 0.025, 0);
        group.add(leftBase);

        const rightBase = new THREE.Mesh(baseGeometry, this.materials[material]);
        rightBase.position.set(0.6, 0.025, 0);
        group.add(rightBase);

        return group;
    }

    createRings(material = 'black') {
        const group = new THREE.Group();
        
        // Ring geometry
        const ringGeometry = new THREE.TorusGeometry(0.12, 0.015, 8, 16);
        
        // Left ring
        const leftRing = new THREE.Mesh(ringGeometry, this.materials[material]);
        leftRing.position.set(-0.3, 1.5, 0);
        group.add(leftRing);

        // Right ring
        const rightRing = new THREE.Mesh(ringGeometry, this.materials[material]);
        rightRing.position.set(0.3, 1.5, 0);
        group.add(rightRing);

        // Straps (simplified as cylinders)
        const strapGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.3, 8);
        
        const leftStrap = new THREE.Mesh(strapGeometry, this.materials.black);
        leftStrap.position.set(-0.3, 1.8, 0);
        group.add(leftStrap);

        const rightStrap = new THREE.Mesh(strapGeometry, this.materials.black);
        rightStrap.position.set(0.3, 1.8, 0);
        group.add(rightStrap);

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

        // Legs for left parallette
        const legGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.15, 8);
        
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const leg = new THREE.Mesh(legGeometry, this.materials[material]);
                leg.position.set(-0.35 + i * 0.3, 0.075, -0.1 + j * 0.2);
                group.add(leg);
            }
        }

        // Legs for right parallette
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const leg = new THREE.Mesh(legGeometry, this.materials[material]);
                leg.position.set(0.05 + i * 0.3, 0.075, -0.1 + j * 0.2);
                group.add(leg);
            }
        }

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
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    URL.revokeObjectURL(url);
                    resolve(filename);
                },
                { binary: true },
                (error) => reject(error)
            );
        });
    }

    async generateAllModels() {
        const products = [
            { name: 'pullup-bar', method: 'createPullupBar' },
            { name: 'rings', method: 'createRings' },
            { name: 'parallettes', method: 'createParallettes' }
        ];
        const variants = ['black', 'walnut', 'steel'];
        
        console.log('🎯 Starting GLB model generation...');
        
        for (const product of products) {
            for (const variant of variants) {
                const model = this[product.method](variant);
                const filename = `${product.name}-${variant}.glb`;
                
                try {
                    await this.exportModel(model, filename);
                    console.log(`✅ Generated: ${filename}`);
                    
                    // Small delay to prevent browser overwhelm
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    console.error(`❌ Failed to generate ${filename}:`, error);
                }
            }
        }
        
        console.log('🎉 Model generation complete! Move files from Downloads to /models/ folder');
    }
}

// Initialize and provide global access
const modelCreator = new SimpleModelCreator();
window.modelCreator = modelCreator;
window.generateGLBModels = () => modelCreator.generateAllModels();

console.log(`
🎯 Simple GLB Model Generator Ready!

To generate all 9 model files, run:
generateGLBModels()

This will download:
- pullup-bar-black.glb, pullup-bar-walnut.glb, pullup-bar-steel.glb
- rings-black.glb, rings-walnut.glb, rings-steel.glb  
- parallettes-black.glb, parallettes-walnut.glb, parallettes-steel.glb

Move the downloaded files to your /models/ directory.
`);

export { SimpleModelCreator };
