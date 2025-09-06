// Modern Hero Canvas Animation for CalisVerse
class CalisVerseCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.rings = [];
        this.bars = [];
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createElements();
        this.setupEventListeners();
        this.animate();
    }
    
    setupCanvas() {
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        
        resize();
        window.addEventListener('resize', resize);
    }
    
    createElements() {
        // Create floating rings
        for (let i = 0; i < 8; i++) {
            this.rings.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 30 + 20,
                speed: Math.random() * 0.5 + 0.2,
                angle: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.3 + 0.1,
                rotationSpeed: (Math.random() - 0.5) * 0.02
            });
        }
        
        // Create floating bars
        for (let i = 0; i < 6; i++) {
            this.bars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                width: Math.random() * 60 + 40,
                height: 8,
                speed: Math.random() * 0.3 + 0.1,
                angle: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.2 + 0.1,
                rotation: Math.random() * Math.PI,
                rotationSpeed: (Math.random() - 0.5) * 0.01
            });
        }
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    drawRing(ring) {
        this.ctx.save();
        this.ctx.translate(ring.x, ring.y);
        this.ctx.rotate(ring.rotation || 0);
        
        // Outer ring
        this.ctx.beginPath();
        this.ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(139, 92, 246, ${ring.opacity})`;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Inner ring
        this.ctx.beginPath();
        this.ctx.arc(0, 0, ring.radius - 6, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(6, 182, 212, ${ring.opacity * 0.6})`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawBar(bar) {
        this.ctx.save();
        this.ctx.translate(bar.x, bar.y);
        this.ctx.rotate(bar.rotation);
        
        // Main bar
        this.ctx.fillStyle = `rgba(139, 92, 246, ${bar.opacity})`;
        this.ctx.fillRect(-bar.width / 2, -bar.height / 2, bar.width, bar.height);
        
        // End caps
        this.ctx.beginPath();
        this.ctx.arc(-bar.width / 2, 0, bar.height / 2, 0, Math.PI * 2);
        this.ctx.arc(bar.width / 2, 0, bar.height / 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Highlight
        this.ctx.fillStyle = `rgba(255, 255, 255, ${bar.opacity * 0.3})`;
        this.ctx.fillRect(-bar.width / 2, -bar.height / 2, bar.width, 2);
        
        this.ctx.restore();
    }
    
    updateElements() {
        // Update rings
        this.rings.forEach(ring => {
            ring.x += Math.cos(ring.angle) * ring.speed;
            ring.y += Math.sin(ring.angle) * ring.speed;
            ring.rotation = (ring.rotation || 0) + ring.rotationSpeed;
            
            // Mouse interaction
            const dx = this.mouse.x - ring.x;
            const dy = this.mouse.y - ring.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ring.x += dx * 0.001;
                ring.y += dy * 0.001;
            }
            
            // Wrap around screen
            if (ring.x < -50) ring.x = this.canvas.width + 50;
            if (ring.x > this.canvas.width + 50) ring.x = -50;
            if (ring.y < -50) ring.y = this.canvas.height + 50;
            if (ring.y > this.canvas.height + 50) ring.y = -50;
        });
        
        // Update bars
        this.bars.forEach(bar => {
            bar.x += Math.cos(bar.angle) * bar.speed;
            bar.y += Math.sin(bar.angle) * bar.speed;
            bar.rotation += bar.rotationSpeed;
            
            // Mouse interaction
            const dx = this.mouse.x - bar.x;
            const dy = this.mouse.y - bar.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 80) {
                bar.x += dx * 0.002;
                bar.y += dy * 0.002;
            }
            
            // Wrap around screen
            if (bar.x < -100) bar.x = this.canvas.width + 100;
            if (bar.x > this.canvas.width + 100) bar.x = -100;
            if (bar.y < -50) bar.y = this.canvas.height + 50;
            if (bar.y > this.canvas.height + 50) bar.y = -50;
        });
    }
    
    draw() {
        // Clear canvas with subtle gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
        gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.95)');
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw elements
        this.rings.forEach(ring => this.drawRing(ring));
        this.bars.forEach(bar => this.drawBar(bar));
    }
    
    animate() {
        this.updateElements();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Smart Search Functionality
class CalisVerseSearch {
    constructor() {
        this.searchInput = document.getElementById('cv-search');
        this.suggestions = document.getElementById('cv-search-suggestions');
        this.selectedIndex = -1;
        
        this.searchData = [
            'Gymnastic Rings',
            'Pull-Up Bars',
            'Parallettes',
            'Dip Stations',
            'Wall Bars',
            'Resistance Bands',
            'Weighted Vests',
            'Door Anchors',
            'Ab Wheels',
            'Suspension Trainers',
            'Wooden Rings',
            'Steel Rings',
            'Adjustable Bars',
            'Portable Bars',
            'Heavy Duty Straps',
            'Chalk Bags',
            'Grip Enhancers',
            'Training Gloves'
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Focus search with "/" key
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && !this.searchInput.matches(':focus')) {
                e.preventDefault();
                this.searchInput.focus();
            }
            
            if (e.key === 'Escape') {
                this.hideSuggestions();
                this.searchInput.blur();
            }
        });
        
        // Search input events
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });
        
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value) {
                this.handleSearch(this.searchInput.value);
            }
        });
        
        this.searchInput.addEventListener('blur', () => {
            // Delay hiding to allow clicks on suggestions
            setTimeout(() => this.hideSuggestions(), 150);
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cv-search-container')) {
                this.hideSuggestions();
            }
        });
    }
    
    handleSearch(query) {
        if (!query.trim()) {
            this.hideSuggestions();
            return;
        }
        
        const filtered = this.searchData.filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
        );
        
        this.showSuggestions(filtered);
    }
    
    showSuggestions(suggestions) {
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        this.suggestions.innerHTML = suggestions
            .slice(0, 6) // Limit to 6 suggestions
            .map((item, index) => 
                `<div class="cv-suggestion" data-index="${index}">${item}</div>`
            )
            .join('');
        
        this.suggestions.classList.add('active');
        this.selectedIndex = -1;
        
        // Add click listeners
        this.suggestions.querySelectorAll('.cv-suggestion').forEach((el, index) => {
            el.addEventListener('click', () => {
                this.selectSuggestion(el.textContent);
            });
        });
    }
    
    hideSuggestions() {
        this.suggestions.classList.remove('active');
        this.selectedIndex = -1;
    }
    
    handleKeyNavigation(e) {
        const suggestionElements = this.suggestions.querySelectorAll('.cv-suggestion');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, suggestionElements.length - 1);
                this.updateSelection(suggestionElements);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection(suggestionElements);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && suggestionElements[this.selectedIndex]) {
                    this.selectSuggestion(suggestionElements[this.selectedIndex].textContent);
                } else if (this.searchInput.value.trim()) {
                    this.selectSuggestion(this.searchInput.value.trim());
                }
                break;
                
            case 'Tab':
                if (this.selectedIndex >= 0 && suggestionElements[this.selectedIndex]) {
                    e.preventDefault();
                    this.selectSuggestion(suggestionElements[this.selectedIndex].textContent);
                }
                break;
        }
    }
    
    updateSelection(suggestionElements) {
        suggestionElements.forEach((el, index) => {
            el.classList.toggle('selected', index === this.selectedIndex);
        });
    }
    
    selectSuggestion(text) {
        this.searchInput.value = text;
        this.hideSuggestions();
        
        // Simulate search action - scroll to products
        document.getElementById('products').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        // Optional: Filter products based on search
        this.filterProducts(text);
    }
    
    filterProducts(query) {
        // This would integrate with your existing product filtering logic
        console.log('Searching for:', query);
        
        // Example: highlight matching products
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent || '';
            const isMatch = title.toLowerCase().includes(query.toLowerCase());
            card.style.opacity = isMatch ? '1' : '0.5';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas animation
    const canvas = new CalisVerseCanvas('cv-bg');
    
    // Initialize search functionality
    const search = new CalisVerseSearch();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        canvas.destroy();
    });
});
