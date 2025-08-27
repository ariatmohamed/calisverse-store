// Register GSAP plugins safely
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Initialize scroll animations
function initScrollAnimations() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded, skipping scroll animations');
        return;
    }
    
    // Add scroll snap behavior
    let isScrolling = false;
    let scrollTimeout;
    
    // Prevent scroll hijacking by 3D models
    window.addEventListener('wheel', (event) => {
        if (!isScrolling) {
            isScrolling = true;
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 150);
        }
    }, { passive: true });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Product section animations
    const productSections = document.querySelectorAll('.product-section');
    
    productSections.forEach((section, index) => {
        const productInfo = section.querySelector('.product-info');
        const product3D = section.querySelector('.product-3d-container');
        
        // Create timeline for each section
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
                onEnter: () => {
                    // Pause auto-rotation when section is in view
                    const containerId = product3D?.id;
                    if (containerId && typeof orbitControls !== 'undefined' && orbitControls[containerId]) {
                        orbitControls[containerId].autoRotate = false;
                        orbitControls[containerId].enabled = true;
                    }
                },
                onLeave: () => {
                    // Resume auto-rotation when section leaves view
                    const containerId = product3D?.id;
                    if (containerId && typeof orbitControls !== 'undefined' && orbitControls[containerId]) {
                        orbitControls[containerId].autoRotate = true;
                        orbitControls[containerId].enabled = true;
                    }
                }
            }
        });

        // Animate product info from left/right based on layout
        const isOdd = (index + 2) % 2 === 1; // +2 because hero is first
        
        tl.fromTo(productInfo, 
            { 
                x: isOdd ? -100 : 100, 
                opacity: 0 
            },
            { 
                x: 0, 
                opacity: 1, 
                duration: 1,
                ease: "power2.out"
            }
        );

        // Animate 3D container
        tl.fromTo(product3D, 
            { 
                x: isOdd ? 100 : -100, 
                opacity: 0,
                scale: 0.8
            },
            { 
                x: 0, 
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power2.out"
            }, 
            "-=0.5"
        );

        // Animate individual features
        const features = section.querySelectorAll('.feature');
        features.forEach((feature, featureIndex) => {
            tl.fromTo(feature,
                {
                    x: -30,
                    opacity: 0
                },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out"
                },
                `-=${0.8 - (featureIndex * 0.1)}`
            );
        });

        // Animate price and buttons
        const price = section.querySelector('.product-price');
        const actions = section.querySelector('.product-actions');
        
        if (price) {
            tl.fromTo(price,
                {
                    scale: 0.8,
                    opacity: 0
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                },
                "-=0.3"
            );
        }

        if (actions) {
            tl.fromTo(actions.children,
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out"
                },
                "-=0.2"
            );
        }
    });

    // Hero scroll indicator animation
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        gsap.to(scrollIndicator, {
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "100px top",
                scrub: true
            },
            opacity: 0,
            y: -20
        });
    }

    // Navigation background on scroll
    const nav = document.querySelector('.nav');
    if (nav) {
        ScrollTrigger.create({
            trigger: document.body,
            start: "100px top",
            end: "bottom bottom",
            onEnter: () => {
                gsap.to(nav, {
                    backgroundColor: "rgba(10, 10, 15, 0.98)",
                    backdropFilter: "blur(30px)",
                    duration: 0.3
                });
            },
            onLeaveBack: () => {
                gsap.to(nav, {
                    backgroundColor: "rgba(10, 10, 15, 0.95)",
                    backdropFilter: "blur(20px)",
                    duration: 0.3
                });
            }
        });
    }

    // Parallax effect for background gradients
    productSections.forEach((section, index) => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            backgroundPosition: `50% ${50 + (index % 2 === 0 ? 20 : -20)}%`
        });
    });

    // 3D model interaction enhancements
    if (typeof orbitControls !== 'undefined') {
        Object.keys(orbitControls).forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container && orbitControls[containerId]) {
                const control = orbitControls[containerId];
                
                // Smooth camera transitions when hovering
                container.addEventListener('mouseenter', () => {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(control, {
                            autoRotateSpeed: 2,
                            duration: 0.5
                        });
                    }
                });

                container.addEventListener('mouseleave', () => {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(control, {
                            autoRotateSpeed: 0.5,
                            duration: 0.5
                        });
                    }
                });
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for 3D models to initialize
    setTimeout(initScrollAnimations, 500);
});
