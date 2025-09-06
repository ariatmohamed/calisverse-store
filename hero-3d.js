// Interactive 3D Hero Background for CalisVerse
class CalisVerse3D {
    constructor() {
        this.container = document.getElementById('cv-3d-container');
        this.canvasFallback = document.getElementById('cv-bg');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.materials = [];
        this.currentMaterialIndex = 0;
        this.isWebGLSupported = this.checkWebGLSupport();
        this.isMobile = this.detectMobile();
        this.frameCount = 0;
        this.lastFPSCheck = performance.now();
        this.fps = 60;
        
        // Performance settings
        this.targetFPS = this.isMobile ? 40 : 60;
        this.qualityLevel = this.isMobile ? 'low' : 'high';
        
        this.init();
    }
    
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth < 768;
    }
    
    init() {
        if (!this.isWebGLSupported) {
            this.fallbackToCanvas();
            return;
        }
        
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.loadModel();
        this.setupEventListeners();
        this.animate();
    }
    
    fallbackToCanvas() {
        console.log('WebGL not supported, falling back to canvas animation');
        this.container.style.display = 'none';
        this.canvasFallback.style.display = 'block';
        
        // Initialize the existing canvas animation
        this.initCanvasFallback();
    }
    
    initCanvasFallback() {
        const c = this.canvasFallback;
        const ctx = c.getContext('2d');
        let w, h, dpr;

        const shapes = Array.from({length: 28}).map((_,i)=>({
            t: Math.random()*Math.PI*2,
            r: 40 + Math.random()*220,
            x: 0, y: 0,
            speed: .2 + Math.random()*1.1,
            type: i%3 ? 'ring' : 'bar',
            hue: 265 + Math.random()*15
        }));

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = c.clientWidth = c.parentElement.clientWidth;
            h = c.clientHeight = c.parentElement.clientHeight;
            c.width = w*dpr; c.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
        };
        resize(); 
        window.addEventListener('resize', resize);

        const draw = () => {
            ctx.clearRect(0,0,w,h);
            ctx.globalCompositeOperation='lighter';
            shapes.forEach(s=>{
                s.t += (s.speed/500);
                const cx = w*0.52, cy = h*0.38;
                s.x = cx + Math.cos(s.t)*s.r;
                s.y = cy + Math.sin(s.t)*s.r*0.55;

                const col = `hsla(${s.hue}, 85%, 65%, .10)`;
                ctx.strokeStyle = col; ctx.fillStyle = col;
                ctx.lineWidth = 2;

                if(s.type==='ring'){
                    ctx.beginPath(); ctx.arc(s.x, s.y, 14, 0, Math.PI*2); ctx.stroke();
                }else{
                    ctx.save();
                    ctx.translate(s.x, s.y);
                    ctx.rotate(Math.sin(s.t)*0.6);
                    ctx.fillRect(-22, -3, 44, 6);
                    ctx.restore();
                }
            });
            requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0b0e16, 10, 50);
    }
    
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(0, 2, 8);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: this.qualityLevel === 'high',
            alpha: true,
            powerPreference: this.isMobile ? 'low-power' : 'high-performance'
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = this.qualityLevel === 'high';
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x8B5CF6, 0.3);
        this.scene.add(ambientLight);
        
        // Key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
        keyLight.position.set(5, 10, 5);
        keyLight.castShadow = this.qualityLevel === 'high';
        if (keyLight.castShadow) {
            keyLight.shadow.mapSize.width = this.isMobile ? 1024 : 2048;
            keyLight.shadow.mapSize.height = this.isMobile ? 1024 : 2048;
            keyLight.shadow.camera.near = 0.5;
            keyLight.shadow.camera.far = 50;
        }
        this.scene.add(keyLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0x06B6D4, 0.4);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
        
        // Rim light
        const rimLight = new THREE.DirectionalLight(0x8B5CF6, 0.6);
        rimLight.position.set(0, -5, -10);
        this.scene.add(rimLight);
    }
    
    loadModel() {
        const loader = new THREE.GLTFLoader();
        
        // Try to load a calisthenics model, fallback to creating procedural rings
        const modelPaths = [
            './assets/models/gymnastic-rings.glb',
            './assets/models/parallettes.glb',
            './assets/models/rings.glb'
        ];
        
        this.tryLoadModel(modelPaths, 0);
    }
    
    tryLoadModel(paths, index) {
        if (index >= paths.length) {
            this.createProceduralRings();
            return;
        }
        
        const loader = new THREE.GLTFLoader();
        loader.load(
            paths[index],
            (gltf) => {
                this.model = gltf.scene;
                this.setupModel();
                this.extractMaterials();
            },
            (progress) => {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.log(`Failed to load ${paths[index]}, trying next...`);
                this.tryLoadModel(paths, index + 1);
            }
        );
    }
    
    createProceduralRings() {
        console.log('Creating procedural gymnastic rings');
        
        const group = new THREE.Group();
        
        // Create two rings
        const ringGeometry = new THREE.TorusGeometry(1.2, 0.08, 8, 32);
        const strapGeometry = new THREE.CylinderGeometry(0.02, 0.02, 3, 8);
        
        // Materials for color switching
        this.materials = [
            new THREE.MeshPhongMaterial({ color: 0x8B5CF6, shininess: 30 }),
            new THREE.MeshPhongMaterial({ color: 0x06B6D4, shininess: 30 }),
            new THREE.MeshPhongMaterial({ color: 0xF59E0B, shininess: 30 }),
            new THREE.MeshPhongMaterial({ color: 0xEF4444, shininess: 30 }),
            new THREE.MeshPhongMaterial({ color: 0x10B981, shininess: 30 })
        ];
        
        // Left ring
        const leftRing = new THREE.Mesh(ringGeometry, this.materials[0].clone());
        leftRing.position.set(-1.5, 0, 0);
        leftRing.castShadow = true;
        leftRing.receiveShadow = true;
        group.add(leftRing);
        
        // Right ring
        const rightRing = new THREE.Mesh(ringGeometry, this.materials[0].clone());
        rightRing.position.set(1.5, 0, 0);
        rightRing.castShadow = true;
        rightRing.receiveShadow = true;
        group.add(rightRing);
        
        // Left strap
        const leftStrap = new THREE.Mesh(strapGeometry, this.materials[0].clone());
        leftStrap.position.set(-1.5, 1.5, 0);
        leftStrap.castShadow = true;
        group.add(leftStrap);
        
        // Right strap
        const rightStrap = new THREE.Mesh(strapGeometry, this.materials[0].clone());
        rightStrap.position.set(1.5, 1.5, 0);
        rightStrap.castShadow = true;
        group.add(rightStrap);
        
        this.model = group;
        this.setupModel();
    }
    
    setupModel() {
        this.model.scale.setScalar(this.isMobile ? 0.8 : 1.2);
        this.model.position.y = -1;
        this.scene.add(this.model);
        
        // Enable shadows for all meshes
        this.model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }
    
    extractMaterials() {
        this.materials = [];
        this.model.traverse((child) => {
            if (child.isMesh && child.material) {
                if (!this.materials.includes(child.material)) {
                    this.materials.push(child.material);
                }
            }
        });
        
        // Add color variants
        if (this.materials.length > 0) {
            const baseMaterial = this.materials[0];
            const colors = [0x8B5CF6, 0x06B6D4, 0xF59E0B, 0xEF4444, 0x10B981];
            
            this.materials = colors.map(color => {
                const material = baseMaterial.clone();
                material.color.setHex(color);
                return material;
            });
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Color toggle on click
        this.container.addEventListener('click', () => this.toggleMaterial());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'c' || e.key === 'C') {
                this.toggleMaterial();
            }
        });
    }
    
    toggleMaterial() {
        if (this.materials.length === 0) return;
        
        this.currentMaterialIndex = (this.currentMaterialIndex + 1) % this.materials.length;
        const newMaterial = this.materials[this.currentMaterialIndex];
        
        this.model.traverse((child) => {
            if (child.isMesh) {
                child.material = newMaterial.clone();
            }
        });
    }
    
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    checkPerformance() {
        this.frameCount++;
        const now = performance.now();
        
        if (now - this.lastFPSCheck >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFPSCheck = now;
            
            // Adjust quality based on performance
            if (this.fps < this.targetFPS * 0.8) {
                this.adjustQuality('down');
            } else if (this.fps > this.targetFPS * 1.2 && this.qualityLevel === 'low') {
                this.adjustQuality('up');
            }
        }
    }
    
    adjustQuality(direction) {
        if (direction === 'down' && this.qualityLevel === 'high') {
            this.qualityLevel = 'low';
            this.renderer.setPixelRatio(1);
            this.renderer.shadowMap.enabled = false;
            console.log('Reduced quality for better performance');
        } else if (direction === 'up' && this.qualityLevel === 'low' && !this.isMobile) {
            this.qualityLevel = 'high';
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.shadowMap.enabled = true;
            console.log('Increased quality');
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Auto-rotate model
        if (this.model) {
            this.model.rotation.y += delta * 0.3;
            this.model.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        }
        
        // Update mixer for animations
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        this.checkPerformance();
        this.renderer.render(this.scene, this.camera);
    }
    
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
    }
}

// Initialize 3D scene when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calisVerse3D = new CalisVerse3D();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        calisVerse3D.destroy();
    });
    
    // Expose for debugging
    window.calisVerse3D = calisVerse3D;
});
