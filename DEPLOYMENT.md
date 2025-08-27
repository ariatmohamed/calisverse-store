# CalisVerse Deployment Guide

## Quick Netlify Deployment

### 1. Connect Repository to Netlify
1. Visit [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Choose GitHub and select `ariatmohamed/calisverse`

### 2. Build Settings
```
Branch: main
Build command: echo 'Static site - no build required'
Publish directory: .
```

### 3. Environment Variables (if needed)
No environment variables required for this static site.

### 4. Custom Domain Setup
- Site settings > Domain management
- Add custom domain or use provided netlify.app subdomain

## File Structure
```
CalisVerse/
├── index.html              # Main entry point
├── netlify.toml            # Netlify configuration
├── _headers                # Security headers
├── js/                     # JavaScript files
├── css/                    # Stylesheets
├── models/                 # 3D model files (.glb)
└── images/                 # Images and posters
```

## Build Configuration (netlify.toml)
The site is configured as a static site with:
- Security headers
- Cache optimization
- 3D model MIME types
- CORS for model-viewer

## Troubleshooting

### "Site not found" Error
- Ensure repository is connected to Netlify
- Check build logs for errors
- Verify publish directory is set to "."

### 3D Models Not Loading
- Check models/ directory exists
- Verify .glb files are present
- Check browser console for CORS errors

### Performance Issues
- Models are lazy-loaded
- Reduced motion support enabled
- Mobile optimizations active

## Post-Deployment Checklist
- [ ] Site loads without errors
- [ ] 3D viewers initialize properly
- [ ] Variant buttons work
- [ ] Cart system functions
- [ ] Mobile responsive
- [ ] No console errors
