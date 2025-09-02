// Inventory Management System for CalisVerse
class InventoryManager {
    constructor() {
        this.inventory = this.loadInventory();
        this.init();
    }

    init() {
        this.updateProductAvailability();
        this.bindEvents();
    }

    // Load inventory from localStorage or set defaults
    loadInventory() {
        const saved = localStorage.getItem('calisverse-inventory');
        if (saved) {
            return JSON.parse(saved);
        }

        // Default inventory levels
        return {
            'pullup-bar': {
                'black': 15,
                'silver': 12,
                'red': 8,
                'blue': 10
            },
            'gymnastic-rings': {
                'natural': 20,
                'black': 15,
                'cherry': 5
            },
            'parallel-bars': {
                'black': 10,
                'silver': 8,
                'red': 6
            },
            'resistance-bands': {
                'rainbow': 25,
                'black': 20,
                'red': 15
            },
            'ab-wheel': {
                'black': 18,
                'silver': 12,
                'blue': 9
            }
        };
    }

    // Save inventory to localStorage
    saveInventory() {
        localStorage.setItem('calisverse-inventory', JSON.stringify(this.inventory));
    }

    // Get stock level for a product/color combination
    getStock(productId, color) {
        return this.inventory[productId]?.[color] || 0;
    }

    // Check if product is in stock
    isInStock(productId, color, quantity = 1) {
        return this.getStock(productId, color) >= quantity;
    }

    // Reserve stock when adding to cart
    reserveStock(productId, color, quantity) {
        if (this.isInStock(productId, color, quantity)) {
            this.inventory[productId][color] -= quantity;
            this.saveInventory();
            this.updateProductAvailability();
            return true;
        }
        return false;
    }

    // Release stock when removing from cart
    releaseStock(productId, color, quantity) {
        if (!this.inventory[productId]) {
            this.inventory[productId] = {};
        }
        if (!this.inventory[productId][color]) {
            this.inventory[productId][color] = 0;
        }
        
        this.inventory[productId][color] += quantity;
        this.saveInventory();
        this.updateProductAvailability();
    }

    // Update product availability in UI
    updateProductAvailability() {
        Object.keys(this.inventory).forEach(productId => {
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (!productCard) return;

            const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
            const colorSwatches = productCard.querySelectorAll('.color-swatch');
            
            // Check if any color variant is in stock
            const hasStock = Object.values(this.inventory[productId]).some(stock => stock > 0);
            
            if (!hasStock) {
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'Out of Stock';
                addToCartBtn.classList.add('out-of-stock');
            } else {
                addToCartBtn.disabled = false;
                addToCartBtn.textContent = 'Add to Cart';
                addToCartBtn.classList.remove('out-of-stock');
            }

            // Update color swatch availability
            colorSwatches.forEach(swatch => {
                const color = swatch.dataset.color;
                const stock = this.getStock(productId, color);
                
                if (stock <= 0) {
                    swatch.classList.add('out-of-stock');
                    swatch.title = `${swatch.dataset.name} - Out of Stock`;
                } else if (stock <= 3) {
                    swatch.classList.add('low-stock');
                    swatch.title = `${swatch.dataset.name} - Only ${stock} left`;
                } else {
                    swatch.classList.remove('out-of-stock', 'low-stock');
                    swatch.title = `${swatch.dataset.name} - ${stock} in stock`;
                }
            });
        });
    }

    // Add stock level indicators to products
    addStockIndicators() {
        Object.keys(this.inventory).forEach(productId => {
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (!productCard) return;

            const colorOptions = productCard.querySelector('.color-options');
            if (!colorOptions) return;

            // Add stock indicator container
            let stockIndicator = productCard.querySelector('.stock-indicator');
            if (!stockIndicator) {
                stockIndicator = document.createElement('div');
                stockIndicator.className = 'stock-indicator';
                colorOptions.parentNode.appendChild(stockIndicator);
            }

            // Get current selected color
            const activeColor = productCard.querySelector('.color-swatch.active')?.dataset.color || 'black';
            const stock = this.getStock(productId, activeColor);

            if (stock <= 0) {
                stockIndicator.innerHTML = '<span class="stock-status out">Out of Stock</span>';
            } else if (stock <= 3) {
                stockIndicator.innerHTML = `<span class="stock-status low">Only ${stock} left in stock</span>`;
            } else if (stock <= 10) {
                stockIndicator.innerHTML = `<span class="stock-status medium">${stock} in stock</span>`;
            } else {
                stockIndicator.innerHTML = `<span class="stock-status high">In Stock</span>`;
            }
        });
    }

    // Bind events for color changes to update stock indicators
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-swatch')) {
                setTimeout(() => this.addStockIndicators(), 100);
            }
        });
    }

    // Process order and update inventory
    processOrder(cartItems) {
        const orderSummary = [];
        
        cartItems.forEach(item => {
            if (this.isInStock(item.id, item.color, item.quantity)) {
                this.inventory[item.id][item.color] -= item.quantity;
                orderSummary.push({
                    ...item,
                    status: 'confirmed'
                });
            } else {
                orderSummary.push({
                    ...item,
                    status: 'backordered',
                    availableStock: this.getStock(item.id, item.color)
                });
            }
        });

        this.saveInventory();
        this.updateProductAvailability();
        this.addStockIndicators();
        
        return orderSummary;
    }

    // Restock products (admin function)
    restock(productId, color, quantity) {
        if (!this.inventory[productId]) {
            this.inventory[productId] = {};
        }
        if (!this.inventory[productId][color]) {
            this.inventory[productId][color] = 0;
        }
        
        this.inventory[productId][color] += quantity;
        this.saveInventory();
        this.updateProductAvailability();
        this.addStockIndicators();
        
        console.log(`Restocked ${quantity} units of ${productId} in ${color}`);
    }

    // Get inventory report
    getInventoryReport() {
        const report = {};
        Object.keys(this.inventory).forEach(productId => {
            report[productId] = {
                totalStock: Object.values(this.inventory[productId]).reduce((sum, stock) => sum + stock, 0),
                colors: { ...this.inventory[productId] },
                lowStock: Object.entries(this.inventory[productId]).filter(([color, stock]) => stock <= 3),
                outOfStock: Object.entries(this.inventory[productId]).filter(([color, stock]) => stock === 0)
            };
        });
        return report;
    }
}

// Initialize inventory manager
let inventoryManager;

document.addEventListener('DOMContentLoaded', () => {
    inventoryManager = new InventoryManager();
    window.inventoryManager = inventoryManager; // Make globally accessible
    
    // Add stock indicators after a short delay to ensure DOM is ready
    setTimeout(() => {
        inventoryManager.addStockIndicators();
    }, 500);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryManager;
}
