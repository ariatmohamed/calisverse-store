// Generate Poster Images for 3D Models
class PosterImageGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');
        
        // Setup for high quality rendering
        this.canvas.style.width = '800px';
        this.canvas.style.height = '600px';
    }

    createGradientBackground(colors) {
        const gradient = this.ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.5, colors[1]);
        gradient.addColorStop(1, colors[2]);
        return gradient;
    }

    drawPullupBarPoster(variant = 'black') {
        this.ctx.clearRect(0, 0, 800, 600);
        
        // Background gradient based on variant
        let colors;
        switch (variant) {
            case 'black':
                colors = ['#1a1a2e', '#16213e', '#0f0f23'];
                break;
            case 'walnut':
                colors = ['#2d1b0e', '#3d2817', '#1a0f08'];
                break;
            case 'steel':
                colors = ['#2a2a2a', '#3a3a3a', '#1a1a1a'];
                break;
        }
        
        this.ctx.fillStyle = this.createGradientBackground(colors);
        this.ctx.fillRect(0, 0, 800, 600);
        
        // Draw stylized pullup bar silhouette
        this.ctx.strokeStyle = variant === 'walnut' ? '#8B4513' : 
                              variant === 'steel' ? '#C0C0C0' : '#333333';
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        
        // Vertical supports
        this.ctx.beginPath();
        this.ctx.moveTo(200, 500);
        this.ctx.lineTo(200, 200);
        this.ctx.moveTo(600, 500);
        this.ctx.lineTo(600, 200);
        this.ctx.stroke();
        
        // Horizontal bar
        this.ctx.beginPath();
        this.ctx.moveTo(200, 200);
        this.ctx.lineTo(600, 200);
        this.ctx.stroke();
        
        // Base plates
        this.ctx.fillStyle = this.ctx.strokeStyle;
        this.ctx.beginPath();
        this.ctx.ellipse(200, 500, 30, 8, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(600, 500, 30, 8, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.addProductLabel('PULLUP BAR', variant.toUpperCase());
    }

    drawRingsPoster(variant = 'black') {
        this.ctx.clearRect(0, 0, 800, 600);
        
        let colors;
        switch (variant) {
            case 'black':
                colors = ['#1a1a2e', '#16213e', '#0f0f23'];
                break;
            case 'walnut':
                colors = ['#2d1b0e', '#3d2817', '#1a0f08'];
                break;
            case 'steel':
                colors = ['#2a2a2a', '#3a3a3a', '#1a1a1a'];
                break;
        }
        
        this.ctx.fillStyle = this.createGradientBackground(colors);
        this.ctx.fillRect(0, 0, 800, 600);
        
        // Draw rings
        this.ctx.strokeStyle = variant === 'walnut' ? '#8B4513' : 
                              variant === 'steel' ? '#C0C0C0' : '#333333';
        this.ctx.lineWidth = 12;
        
        // Left ring
        this.ctx.beginPath();
        this.ctx.arc(300, 300, 60, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Right ring
        this.ctx.beginPath();
        this.ctx.arc(500, 300, 60, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Straps
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#2a2a2a';
        this.ctx.beginPath();
        this.ctx.moveTo(300, 240);
        this.ctx.lineTo(300, 150);
        this.ctx.moveTo(500, 240);
        this.ctx.lineTo(500, 150);
        this.ctx.stroke();
        
        // Mounting point
        this.ctx.fillStyle = this.ctx.strokeStyle;
        this.ctx.fillRect(350, 140, 100, 20);
        
        this.addProductLabel('GYMNASTIC RINGS', variant.toUpperCase());
    }

    drawParallettesPoster(variant = 'black') {
        this.ctx.clearRect(0, 0, 800, 600);
        
        let colors;
        switch (variant) {
            case 'black':
                colors = ['#1a1a2e', '#16213e', '#0f0f23'];
                break;
            case 'walnut':
                colors = ['#2d1b0e', '#3d2817', '#1a0f08'];
                break;
            case 'steel':
                colors = ['#2a2a2a', '#3a3a3a', '#1a1a1a'];
                break;
        }
        
        this.ctx.fillStyle = this.createGradientBackground(colors);
        this.ctx.fillRect(0, 0, 800, 600);
        
        // Draw parallettes
        this.ctx.strokeStyle = variant === 'walnut' ? '#8B4513' : 
                              variant === 'steel' ? '#C0C0C0' : '#333333';
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        
        // Left parallette
        this.ctx.beginPath();
        this.ctx.moveTo(200, 350);
        this.ctx.lineTo(350, 350);
        this.ctx.stroke();
        
        // Left legs
        this.ctx.beginPath();
        this.ctx.moveTo(220, 350);
        this.ctx.lineTo(220, 450);
        this.ctx.moveTo(330, 350);
        this.ctx.lineTo(330, 450);
        this.ctx.stroke();
        
        // Right parallette
        this.ctx.beginPath();
        this.ctx.moveTo(450, 350);
        this.ctx.lineTo(600, 350);
        this.ctx.stroke();
        
        // Right legs
        this.ctx.beginPath();
        this.ctx.moveTo(470, 350);
        this.ctx.lineTo(470, 450);
        this.ctx.moveTo(580, 350);
        this.ctx.lineTo(580, 450);
        this.ctx.stroke();
        
        this.addProductLabel('PARALLETTES', variant.toUpperCase());
    }

    addProductLabel(productName, variantName) {
        // Product name
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.font = 'bold 36px Arial, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(productName, 400, 100);
        
        // Variant name
        this.ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
        this.ctx.font = '24px Arial, sans-serif';
        this.ctx.fillText(variantName, 400, 130);
        
        // Loading indicator
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.font = '18px Arial, sans-serif';
        this.ctx.fillText('Loading 3D Model...', 400, 550);
        
        // Loading spinner
        const centerX = 400;
        const centerY = 520;
        const radius = 15;
        
        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = 'rgba(139, 92, 246, 1)';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 0.5);
        this.ctx.stroke();
    }

    downloadImage(filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    }

    generateAllPosters() {
        const products = [
            { name: 'pullup-bar', method: 'drawPullupBarPoster' },
            { name: 'rings', method: 'drawRingsPoster' },
            { name: 'parallettes', method: 'drawParallettesPoster' }
        ];
        const variants = ['black', 'walnut', 'steel'];
        
        console.log('Generating poster images...');
        
        products.forEach(product => {
            variants.forEach(variant => {
                this[product.method](variant);
                const filename = `${product.name}-${variant}-poster.jpg`;
                this.downloadImage(filename);
                console.log(`✓ Generated: ${filename}`);
            });
        });
        
        console.log('Poster generation complete!');
    }
}

// Initialize generator
const posterGenerator = new PosterImageGenerator();

// Export for use
window.PosterImageGenerator = PosterImageGenerator;
window.generatePosters = () => posterGenerator.generateAllPosters();

console.log(`
🖼️ CalisVerse Poster Generator Ready!

To generate all poster images, run:
generatePosters()

This will create 9 poster images:
- pullup-bar-black-poster.jpg
- pullup-bar-walnut-poster.jpg
- pullup-bar-steel-poster.jpg
- rings-black-poster.jpg
- rings-walnut-poster.jpg
- rings-steel-poster.jpg
- parallettes-black-poster.jpg
- parallettes-walnut-poster.jpg
- parallettes-steel-poster.jpg

Images will be downloaded to your Downloads folder.
Move them to /images/ directory for deployment.
`);
