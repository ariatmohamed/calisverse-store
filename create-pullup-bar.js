// Pull-Up Bar 3D Model Creation Script
// This script provides the framework for creating a realistic pull-up bar model

class PullUpBarGenerator {
    constructor() {
        this.specifications = {
            mainBar: {
                length: 1.2, // 120cm
                diameter: 0.032, // 32mm
                material: 'steel'
            },
            mountingBrackets: {
                width: 0.15, // 15cm each
                depth: 0.12, // 12cm
                height: 0.08, // 8cm
                material: 'steel'
            },
            supportArms: {
                length: 0.45, // 45cm
                angle: 45, // degrees
                diameter: 0.025, // 25mm
                material: 'steel'
            },
            hardware: {
                bolts: 8,
                screws: 4,
                endCaps: 2,
                material: 'stainless_steel'
            }
        };
    }

    // Generate model specifications for external tools
    generateModelSpecs() {
        return {
            prompt: "Create a realistic 3D model of a wall-mounted pull-up bar for a premium fitness brand. The design should include: a horizontal steel bar (120cm long, 32mm diameter) with textured grip zones, two heavy-duty wall mounting brackets with angled support arms, visible hardware (bolts and screws), and a professional matte black finish. The model should be optimized for web use with PBR materials, clean geometry, and separate materials for color customization of the main bar, brackets, and support arms. Style: modern, industrial, high-quality fitness equipment.",
            
            components: [
                "Main horizontal bar with grip texture",
                "Left wall mounting bracket", 
                "Right wall mounting bracket",
                "Left angled support arm",
                "Right angled support arm",
                "Wall mounting bolts (8 pieces)",
                "Bracket screws (4 pieces)",
                "Bar end caps (2 pieces)"
            ],
            
            materials: {
                main_bar: {
                    type: "PBR_Metal",
                    baseColor: [0.7, 0.7, 0.7],
                    metallic: 0.9,
                    roughness: 0.2,
                    colorable: true
                },
                grip_zones: {
                    type: "PBR_Textured",
                    baseColor: [0.6, 0.6, 0.6],
                    metallic: 0.1,
                    roughness: 0.8,
                    colorable: false
                },
                brackets: {
                    type: "PBR_Metal",
                    baseColor: [0.7, 0.7, 0.7],
                    metallic: 0.8,
                    roughness: 0.3,
                    colorable: true
                },
                support_arms: {
                    type: "PBR_Metal",
                    baseColor: [0.7, 0.7, 0.7],
                    metallic: 0.8,
                    roughness: 0.3,
                    colorable: true
                },
                hardware: {
                    type: "PBR_Metal",
                    baseColor: [0.3, 0.3, 0.3],
                    metallic: 0.9,
                    roughness: 0.1,
                    colorable: false
                }
            },
            
            optimization: {
                polygonCount: "4000-6000 triangles",
                textureResolution: "2048x2048 for main components",
                fileFormat: "GLB with Draco compression",
                fileSize: "< 2MB"
            }
        };
    }

    // Generate Three.js scene for preview
    generateThreeJSPreview() {
        return `
// Three.js Pull-Up Bar Preview Scene
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class PullUpBarPreview {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.loader = new GLTFLoader();
        
        this.init();
    }
    
    init() {
        // Setup renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);
        
        // Setup camera
        this.camera.position.set(2, 1, 3);
        this.camera.lookAt(0, 0, 0);
        
        // Setup lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Load pull-up bar model
        this.loadModel();
        
        // Start render loop
        this.animate();
    }
    
    loadModel() {
        this.loader.load('models/pullup-bar-realistic.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.setScalar(1);
            model.position.set(0, 0, 0);
            
            // Enable shadows
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Setup PBR materials
                    if (child.material) {
                        child.material.envMapIntensity = 1.0;
                    }
                }
            });
            
            this.scene.add(model);
            this.model = model;
        });
    }
    
    changeColor(color) {
        if (!this.model) return;
        
        const colorValue = new THREE.Color(color);
        
        this.model.traverse((child) => {
            if (child.isMesh && child.material) {
                const materialName = child.material.name.toLowerCase();
                
                // Apply color to colorable parts
                if (materialName.includes('main_bar') || 
                    materialName.includes('bracket') || 
                    materialName.includes('support_arm')) {
                    child.material.color = colorValue;
                }
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate model slowly
        if (this.model) {
            this.model.rotation.y += 0.005;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

export default PullUpBarPreview;
        `;
    }
}

// Export specifications for model creation
const pullUpBarGenerator = new PullUpBarGenerator();
const modelSpecs = pullUpBarGenerator.generateModelSpecs();

console.log('Pull-Up Bar Model Specifications:');
console.log(JSON.stringify(modelSpecs, null, 2));

// Instructions for model creation
console.log(`
=== PULL-UP BAR MODEL CREATION INSTRUCTIONS ===

1. Use Meshy AI or Blender with this prompt:
   "${modelSpecs.prompt}"

2. Ensure these components are included:
   ${modelSpecs.components.map(c => `   - ${c}`).join('\n')}

3. Apply PBR materials as specified in the materials object

4. Export as GLB with these settings:
   - Polygon count: ${modelSpecs.optimization.polygonCount}
   - Texture resolution: ${modelSpecs.optimization.textureResolution}
   - File format: ${modelSpecs.optimization.fileFormat}
   - Target file size: ${modelSpecs.optimization.fileSize}

5. Save the file as: /Users/ariatmohamed/CascadeProjects/CalisVerse/models/pullup-bar-realistic.glb
`);

export { PullUpBarGenerator, modelSpecs };
