# Pull-Up Bar 3D Model Specification

## Based on Meshy AI Reference Design

### Model Requirements

#### **Geometry Specifications**
- **Main Bar**: Cylindrical steel tube (32mm diameter, 120cm length)
- **Mounting Brackets**: Heavy-duty wall mount brackets (2 pieces)
- **Support Arms**: Angled support arms connecting bar to wall mounts
- **Hardware**: Visible bolts, screws, and mounting hardware
- **Grip Areas**: Textured grip zones on the main bar

#### **Component Breakdown**
```
Pull-Up Bar Assembly:
├── Main Bar (colorable)
│   ├── Central grip section (textured)
│   ├── Left grip zone (textured) 
│   └── Right grip zone (textured)
├── Mounting Brackets (colorable)
│   ├── Left wall bracket
│   └── Right wall bracket
├── Support Arms (colorable)
│   ├── Left angled support
│   └── Right angled support
└── Hardware (fixed color)
    ├── Wall bolts (8 pieces)
    ├── Bracket screws (4 pieces)
    └── Bar end caps (2 pieces)
```

#### **Material Specifications**

**Main Bar Material (PBR)**
- Base Color: Neutral gray (0.7, 0.7, 0.7) for color customization
- Metallic: 0.9 (high metallic for steel)
- Roughness: 0.2 (smooth steel finish)
- Normal Map: Subtle brushed metal texture

**Grip Zones Material (PBR)**
- Base Color: Neutral gray (0.6, 0.6, 0.6)
- Metallic: 0.1 (non-metallic grip coating)
- Roughness: 0.8 (high roughness for grip)
- Normal Map: Knurled/textured pattern

**Mounting Brackets Material (PBR)**
- Base Color: Neutral gray (0.7, 0.7, 0.7) for color customization
- Metallic: 0.8 (steel construction)
- Roughness: 0.3 (slightly rougher than main bar)
- Normal Map: Cast metal texture

**Hardware Material (PBR)**
- Base Color: Dark steel (0.3, 0.3, 0.3) - fixed color
- Metallic: 0.9 (high metallic)
- Roughness: 0.1 (polished hardware)

#### **Polygon Count Target**
- **Total**: 4,000-6,000 triangles
- **Main Bar**: 800-1,200 triangles
- **Mounting Brackets**: 1,500-2,000 triangles each
- **Support Arms**: 600-800 triangles each
- **Hardware**: 200-400 triangles total

#### **Texture Requirements**
- **Resolution**: 2048x2048 for main components, 1024x1024 for hardware
- **Maps Required**: Albedo, Normal, Metallic, Roughness, AO
- **Format**: WebP or compressed JPEG for web optimization
- **UV Layout**: Non-overlapping, efficient packing

#### **Color Customization Setup**
```javascript
const pullupBarColorableParts = {
    mainBar: 'main_bar_material',
    brackets: 'bracket_material', 
    supportArms: 'support_arm_material'
    // Hardware remains fixed color
};
```

#### **Dimensions (Real-world Scale)**
- **Bar Length**: 120cm (adjustable in model)
- **Bar Diameter**: 32mm
- **Wall Clearance**: 60cm from wall
- **Bracket Width**: 15cm each
- **Support Arm Length**: 45cm each

### Implementation Steps

#### **Option 1: Commission from Meshy AI**
1. Use the exact prompt from your screenshot
2. Generate with PBR materials enabled
3. Export as GLTF with separate materials for colorable parts
4. Optimize polygon count and texture resolution

#### **Option 2: Alternative 3D Model Sources**
1. **CGTrader**: Search "wall mounted pull up bar"
2. **TurboSquid**: Professional fitness equipment models
3. **Sketchfab**: Web-optimized models with GLTF export
4. **Blender**: Create custom model following specifications

#### **Option 3: Modify Existing Model**
1. Find similar pull-up bar model
2. Modify geometry to match reference design
3. Apply proper PBR materials and UV mapping
4. Separate materials for color customization

### Integration Code

#### **HTML Model Viewer Update**
```html
<model-viewer
    id="pullup-model"
    src="models/pullup-bar-realistic.glb"
    alt="Professional Wall-Mounted Pull-Up Bar"
    camera-controls
    auto-rotate
    auto-rotate-delay="3000"
    rotation-per-second="20deg"
    environment-image="neutral"
    shadow-intensity="1.8"
    shadow-softness="0.6"
    exposure="1.3"
    class="model-viewer"
    camera-orbit="15deg 75deg 3m"
    field-of-view="30deg"
    min-camera-orbit="auto auto 2m"
    max-camera-orbit="auto auto 5m"
    data-colorable-parts="main_bar,brackets,support_arms"
    loading="lazy">
    <div class="progress-bar" slot="progress-bar">
        <div class="update-bar"></div>
    </div>
</model-viewer>
```

#### **Enhanced Color Options**
```html
<div class="color-options">
    <div class="color-swatch active" data-color="black" data-name="Matte Black"></div>
    <div class="color-swatch" data-color="silver" data-name="Stainless Steel"></div>
    <div class="color-swatch" data-color="red" data-name="Racing Red"></div>
    <div class="color-swatch" data-color="blue" data-name="Navy Blue"></div>
    <div class="color-swatch" data-name="Custom" onclick="openColorPicker()"></div>
</div>
```

### File Structure
```
/models/pullup-bar/
├── pullup-bar-realistic.glb (main model file)
├── textures/
│   ├── main_bar_albedo.webp
│   ├── main_bar_normal.webp
│   ├── main_bar_metallic.webp
│   ├── main_bar_roughness.webp
│   ├── bracket_albedo.webp
│   ├── bracket_normal.webp
│   └── hardware_combined.webp
└── pullup-bar-specs.json (metadata)
```

### Quality Checklist
- [ ] Realistic proportions matching reference image
- [ ] Proper PBR materials with metallic workflow
- [ ] Separate materials for colorable components
- [ ] Optimized polygon count (4K-6K triangles)
- [ ] Clean UV mapping without stretching
- [ ] Web-optimized file size (<2MB total)
- [ ] Smooth loading and interaction
- [ ] Color customization working properly

This specification matches the professional wall-mounted pull-up bar design from your Meshy AI reference and provides a complete implementation plan for CalisVerse integration.
