# 3D Models Directory

## Required Files

Please add your GLB/GLTF model files here:

1. **pullup-bar.glb** - Pull-up bar 3D model
2. **gymnastic-rings.glb** - Gymnastic rings 3D model  
3. **parallel-bars.glb** - Parallel bars 3D model

## Model Requirements

- Format: GLB (preferred) or GLTF
- Optimized for web (< 5MB per model)
- Materials should use PBR workflow (metallic/roughness)
- Models should be centered at origin (0,0,0)
- Recommended scale: 1 unit = 1 meter

## Performance Optimizations

- Enable DRACO compression when exporting
- Use KTX2 textures if supported
- Optimize geometry (reduce polygon count for web)
- Bake lighting where possible

The React Three Fiber viewer will automatically handle:
- Material color changes
- Lighting setup
- Camera controls
- Loading states
