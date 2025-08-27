/**
 * Debug Asset Checker - Lightweight overlay for missing 3D assets
 * Shows 404s in dev, suppressed in production
 */

class DebugAssetChecker {
    constructor() {
        this.isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.missingAssets = new Set();
        this.debugOverlay = null;
        
        if (this.isDev) {
            this.createDebugOverlay();
            this.startAssetMonitoring();
        }
        
        // Always monitor console for clean error reporting
        this.monitorConsoleErrors();
    }

    createDebugOverlay() {
        this.debugOverlay = document.createElement('div');
        this.debugOverlay.id = 'debug-asset-overlay';
        this.debugOverlay.innerHTML = `
            <div class="debug-header">
                <span>🔍 Asset Debug</span>
                <button class="debug-close" onclick="this.parentElement.parentElement.style.display='none'">×</button>
            </div>
            <div class="debug-content">
                <div class="debug-status">✅ All assets loading correctly</div>
                <div class="debug-list"></div>
            </div>
        `;

        this.debugOverlay.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            max-height: 400px;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid #8b5cf6;
            border-radius: 8px;
            color: white;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            overflow: hidden;
        `;

        // Add styles for debug components
        const style = document.createElement('style');
        style.textContent = `
            .debug-header {
                padding: 8px 12px;
                background: #8b5cf6;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
            }
            .debug-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 16px;
                padding: 0;
                width: 20px;
                height: 20px;
            }
            .debug-content {
                padding: 12px;
                max-height: 350px;
                overflow-y: auto;
            }
            .debug-status {
                margin-bottom: 10px;
                padding: 6px;
                border-radius: 4px;
                background: rgba(34, 197, 94, 0.2);
                border: 1px solid #22c55e;
            }
            .debug-status.error {
                background: rgba(239, 68, 68, 0.2);
                border-color: #ef4444;
            }
            .debug-item {
                margin: 4px 0;
                padding: 4px 6px;
                background: rgba(239, 68, 68, 0.1);
                border-left: 3px solid #ef4444;
                border-radius: 2px;
                font-size: 11px;
                word-break: break-all;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(this.debugOverlay);
    }

    startAssetMonitoring() {
        // Monitor all model-viewer elements
        const observer = new MutationObserver(() => {
            this.checkModelViewers();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial check
        setTimeout(() => this.checkModelViewers(), 1000);
        
        // Periodic checks
        setInterval(() => this.checkModelViewers(), 5000);
    }

    async checkModelViewers() {
        const modelViewers = document.querySelectorAll('model-viewer');
        const assetsToCheck = new Set();

        // Collect all asset URLs
        modelViewers.forEach(viewer => {
            if (viewer.src) assetsToCheck.add(viewer.src);
            if (viewer.poster) assetsToCheck.add(viewer.poster);
        });

        // Check each asset
        for (const assetUrl of assetsToCheck) {
            try {
                const response = await fetch(assetUrl, { method: 'HEAD' });
                if (!response.ok) {
                    this.reportMissingAsset(assetUrl, response.status);
                } else {
                    this.missingAssets.delete(assetUrl);
                }
            } catch (error) {
                this.reportMissingAsset(assetUrl, 'Network Error');
            }
        }

        if (this.isDev) {
            this.updateDebugOverlay();
        }
    }

    reportMissingAsset(url, status) {
        const assetInfo = `${url} (${status})`;
        this.missingAssets.add(assetInfo);
        
        // Always log to console
        console.error(`❌ Missing 3D Asset: ${assetInfo}`);
    }

    updateDebugOverlay() {
        if (!this.debugOverlay) return;

        const statusEl = this.debugOverlay.querySelector('.debug-status');
        const listEl = this.debugOverlay.querySelector('.debug-list');

        if (this.missingAssets.size === 0) {
            statusEl.textContent = '✅ All assets loading correctly';
            statusEl.className = 'debug-status';
            listEl.innerHTML = '';
        } else {
            statusEl.textContent = `❌ ${this.missingAssets.size} missing assets`;
            statusEl.className = 'debug-status error';
            
            listEl.innerHTML = Array.from(this.missingAssets)
                .map(asset => `<div class="debug-item">${asset}</div>`)
                .join('');
        }
    }

    monitorConsoleErrors() {
        // Intercept console errors for clean reporting
        const originalError = console.error;
        console.error = (...args) => {
            // Check if it's a 404 for our assets
            const message = args.join(' ');
            if (message.includes('/models/') || message.includes('/images/')) {
                if (!this.isDev) {
                    // In production, suppress 404 spam but keep one clean error
                    if (!this.hasLoggedAssetError) {
                        originalError('🚨 Some 3D assets failed to load. Check network tab for details.');
                        this.hasLoggedAssetError = true;
                    }
                    return;
                }
            }
            
            // Call original console.error for other errors
            originalError.apply(console, args);
        };
    }

    // Public API
    checkAsset(url) {
        return fetch(url, { method: 'HEAD' })
            .then(response => response.ok)
            .catch(() => false);
    }

    getMissingAssets() {
        return Array.from(this.missingAssets);
    }
}

// Initialize debug checker
if (typeof window !== 'undefined') {
    window.debugAssetChecker = new DebugAssetChecker();
}

export { DebugAssetChecker };
