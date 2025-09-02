# CalisVerse 3D Model Technical Specifications

## Production-Ready 3D Model Requirements

### 1. Model Specifications by Product

#### Pull-Up Bar
- **Geometry**: Steel tube construction with mounting brackets
- **Polygon Count**: 2,000-4,000 triangles
- **Colorable Parts**: Main bar, grip sections, mounting hardware
- **Materials**: Metal (PBR), Rubber grips, Mounting hardware
- **Dimensions**: Standard doorway mount (adjustable width)

#### Gymnastic Rings
- **Geometry**: Wooden rings with adjustable straps
- **Polygon Count**: 1,500-3,000 triangles
- **Colorable Parts**: Ring material, strap color, buckles
- **Materials**: Wood grain (PBR), Nylon straps, Metal buckles
- **Dimensions**: 32mm diameter rings, 5m adjustable straps

#### Parallel Bars (Parallettes)
- **Geometry**: Dual bar construction with stable base
- **Polygon Count**: 3,000-5,000 triangles
- **Colorable Parts**: Bar handles, base structure, grip areas
- **Materials**: Steel/Aluminum (PBR), Non-slip base pads
- **Dimensions**: Adjustable height 70-100cm, ergonomic spacing

#### Resistance Bands Set
- **Geometry**: Multiple band thicknesses with handles and anchors
- **Polygon Count**: 2,500-4,000 triangles
- **Colorable Parts**: Band colors, handle grips, carabiners
- **Materials**: Latex/Rubber (PBR), Foam handles, Metal clips
- **Dimensions**: Various resistance levels, 1.2m length

#### Ab Wheel
- **Geometry**: Central wheel with dual handles
- **Polygon Count**: 1,000-2,000 triangles
- **Colorable Parts**: Wheel rim, handles, center hub
- **Materials**: Rubber wheel (PBR), Foam grips, Plastic/Metal core
- **Dimensions**: 17cm diameter wheel, ergonomic handles

### 2. PBR Material Setup

#### Required Texture Maps (1024x1024 or 2048x2048)
```
/textures/
├── pullup-bar/
│   ├── metal_albedo.jpg (neutral gray for color customization)
│   ├── metal_roughness.jpg
│   ├── metal_metallic.jpg
│   ├── metal_normal.jpg
│   └── metal_ao.jpg
├── gymnastic-rings/
│   ├── wood_albedo.jpg (neutral for wood stain customization)
│   ├── wood_roughness.jpg
│   ├── wood_normal.jpg
│   ├── strap_albedo.jpg (neutral for color customization)
│   └── strap_normal.jpg
└── [similar structure for other products]
```

#### Material Properties
```javascript
// Example PBR material setup
const metalMaterial = {
    albedo: [0.7, 0.7, 0.7], // Neutral base for color customization
    roughness: 0.3,
    metallic: 1.0,
    normalScale: 1.0
};

const woodMaterial = {
    albedo: [0.8, 0.8, 0.8], // Neutral base for wood stain customization
    roughness: 0.6,
    metallic: 0.0,
    normalScale: 0.8
};
```

### 3. Dynamic Color Customization Implementation

#### Mesh Separation Strategy
```javascript
// Each product should have separate meshes for colorable parts
const pullupBarMeshes = {
    mainBar: 'pullup_bar_main', // Colorable
    grips: 'pullup_bar_grips',  // Colorable
    mounting: 'pullup_bar_mount', // Fixed color
    hardware: 'pullup_bar_hardware' // Fixed color
};
```

#### Runtime Color Application
```javascript
function changeProductColor(modelId, colorHex) {
    const model = document.getElementById(modelId);
    const colorableParts = model.querySelectorAll('[data-colorable="true"]');
    
    colorableParts.forEach(part => {
        part.material.pbrMetallicRoughness.baseColorFactor = hexToRgb(colorHex);
    });
}
```

### 4. Optimization Guidelines

#### Polygon Count Targets
- **Simple Products** (Ab Wheel): 1,000-2,000 triangles
- **Medium Complexity** (Rings, Bands): 2,000-4,000 triangles
- **Complex Products** (Pull-up Bar, Parallettes): 3,000-6,000 triangles

#### Texture Optimization
- **Resolution**: 1024x1024 for small details, 2048x2048 for main surfaces
- **Format**: WebP (preferred) or compressed JPEG/PNG
- **Compression**: 85-90% quality for web delivery
- **Mipmaps**: Generate for smooth LOD transitions

#### File Size Targets
- **Individual Model**: 500KB - 2MB per .glb file
- **Total Texture Package**: 1-3MB per product
- **Loading Time**: <3 seconds on 3G connection

### 5. GLTF/GLB Export Settings

#### Required Extensions
```json
{
    "extensionsUsed": [
        "KHR_materials_pbrSpecularGlossiness",
        "KHR_materials_unlit",
        "KHR_draco_mesh_compression"
    ]
}
```

#### Compression Settings
- **Draco Compression**: Enable for geometry compression
- **Texture Compression**: KTX2/Basis Universal (if supported)
- **Animation Compression**: Quantize keyframes for smaller files

### 6. Quality Assurance Checklist

#### Visual Fidelity
- [ ] Accurate proportions and dimensions
- [ ] Realistic material properties
- [ ] Proper UV unwrapping (no stretching/seams)
- [ ] Consistent lighting response

#### Performance
- [ ] Smooth loading (<3 seconds)
- [ ] 60fps rotation/interaction
- [ ] Memory usage <50MB per model
- [ ] No rendering artifacts

#### Functionality
- [ ] Color customization works on designated parts
- [ ] Model scales properly across devices
- [ ] Touch/mouse interactions responsive
- [ ] Progressive loading with visual feedback

### 7. Implementation Integration

#### Model Viewer Configuration
```html
<model-viewer
    src="models/pullup-bar.glb"
    alt="Professional Pull-Up Bar"
    camera-controls
    auto-rotate
    environment-image="neutral"
    shadow-intensity="1.5"
    exposure="1.2"
    loading="lazy">
    <div class="progress-bar" slot="progress-bar">
        <div class="update-bar"></div>
    </div>
</model-viewer>
```

#### Color Customization Integration
```javascript
// Integrate with existing color swatch system
function changeColor(modelId, color) {
    const viewer = document.getElementById(modelId);
    const model = viewer.model;
    
    // Apply color to designated materials
    model.materials.forEach(material => {
        if (material.name.includes('colorable')) {
            material.pbrMetallicRoughness.setBaseColorFactor(colorToRgb(color));
        }
    });
}
```

## Recommended 3D Model Sources

### Professional 3D Model Marketplaces
1. **CGTrader** - High-quality fitness equipment models
2. **TurboSquid** - Professional 3D assets with PBR materials
3. **Sketchfab** - Web-optimized models with GLTF export
4. **Poly Haven** - Free PBR materials and HDRIs

### Custom Model Creation Tools
1. **Blender** (Free) - Full 3D modeling with GLTF export
2. **3ds Max** - Professional modeling with advanced PBR workflow
3. **Maya** - Industry-standard modeling and animation
4. **Substance Painter** - PBR texture creation and baking

### Model Optimization Tools
1. **gltf-pipeline** - Command-line GLTF optimization
2. **Draco Compression** - Google's mesh compression
3. **Basis Universal** - Texture compression for web
4. **Three.js GLTFLoader** - Runtime optimization and loading

## Next Steps

1. **Source or Commission Models**: Acquire production-ready 3D models meeting these specifications
2. **Texture Optimization**: Process all textures for web delivery
3. **Integration Testing**: Implement and test color customization
4. **Performance Optimization**: Ensure smooth loading and interaction
5. **Quality Assurance**: Comprehensive testing across devices and browsers

This specification ensures professional-grade 3D models optimized for web performance with full dynamic color customization capabilities.
