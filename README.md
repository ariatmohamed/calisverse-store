# CalisVerse - Revolutionary 3D Calisthenics E-commerce Platform

## Overview
CalisVerse is a cutting-edge 3D e-commerce website specializing in calisthenics equipment, designed specifically for the Arabic market. It features an immersive Three.js-powered shopping experience with IKEA-style guided journeys.

## Features

### 🎯 Core Features
- **3D Interactive Shopping**: Immersive WebGL-powered product visualization
- **Arabic-First Design**: Complete RTL support with proper Arabic typography
- **Guided Journey System**: IKEA-inspired personalized shopping paths
- **Adaptive Performance**: Automatic graphics quality adjustment
- **Mobile-First Responsive**: Optimized for all devices

### 🛍️ E-commerce Functionality
- Interactive 3D product viewer with rotation and zoom
- Real-time color customization

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: THREE.js with OrbitControls
- **Animations**: GSAP with ScrollTrigger
- **Styling**: Custom CSS with modern gradients and effects

## Quick Deploy Instructions

### For GitHub Pages:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/[username]/calisverse.git
git push -u origin main
```
Then enable Pages in GitHub repository settings.

### For Netlify:
1. Zip the entire project folder
2. Go to https://app.netlify.com/drop
3. Drag & drop the zip file
4. Get instant public URL

## File Structure

```
CalisVerse/
├── index.html              # Main website file (copy of calisverse-standalone.html)
├── calisverse-standalone.html  # Full featured version
├── css/                    # Stylesheets
│   ├── enhanced-cart-styles.css
│   ├── professional-cart-styles.css
│   ├── color-picker-styles.css
│   ├── checkout-styles.css
│   └── notification-styles.css
├── js/                     # JavaScript modules
│   ├── 3d-models.js
│   ├── fixed-cart-system.js
│   ├── color-picker.js
│   ├── checkout-system.js
│   ├── form-handler.js
│   ├── enhanced-3d-controls.js
│   ├── scroll-animations.js
│   ├── performance-optimizer.js
│   └── mobile-optimizer.js
└── assets/                 # 3D models and textures (placeholder)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Features Implementation

### 🎮 3D Product Viewer
- Interactive pull-up bar model created with Three.js primitives
- Orbit controls for rotation and zoom
- Professional lighting setup with shadows
- Automatic rotation animation
- Reset view functionality

### 🛒 Shopping Cart
- Slide-out sidebar interface
- Add/remove items functionality
- Quantity management
- Price calculation
- Persistent storage across sessions

### 🎯 User Journey System
- Experience level modal (Beginner/Intermediate/Professional)
- Personalized product recommendations
- Guided navigation through product catalog
- Cultural adaptation for Middle Eastern market

### 📱 Responsive Design
- Mobile-first approach
- Adaptive 3D viewport
- Touch-friendly controls
- Optimized for Arabic RTL layout

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Optimizations
- Progressive loading with visual feedback
- Efficient 3D rendering with requestAnimationFrame
- Optimized asset loading
- Responsive image handling

## Future Enhancements
- GLTF model loading for realistic products
- Augmented Reality (AR) integration
- Advanced product customization
- Payment gateway integration
- User account system
- Multi-language support
- Advanced analytics tracking

## Arabic Market Considerations
- Right-to-left (RTL) layout support
- Arabic typography and font rendering
- Cultural color preferences
- Local payment methods integration
- Regional shipping options
- Arabic customer support

## Development Notes
- All text content is in Arabic
- Proper RTL spacing and layout
- Cultural sensitivity in design choices
- Performance optimized for various device capabilities
- Accessibility considerations for Arabic users

## License
MIT License - Feel free to use and modify for your projects.

## Contact
For questions or support, please contact the CalisVerse development team.

---
Built with ❤️ for the Arabic calisthenics community
