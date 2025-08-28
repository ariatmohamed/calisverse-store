// Professional Navigation Controller
class ProfessionalNav {
    constructor() {
        this.nav = document.getElementById('main-nav');
        this.mobileToggle = document.getElementById('mobile-menu-toggle');
        this.mobileOverlay = document.getElementById('mobile-menu-overlay');
        this.mobileClose = document.getElementById('mobile-menu-close');
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupDropdowns();
        this.setupMobileDropdowns();
        this.setupActiveLinks();
        this.setupKeyboardNavigation();
    }

    setupScrollEffect() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }

    setupMobileMenu() {
        this.mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        this.mobileClose.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        this.mobileOverlay.addEventListener('click', (e) => {
            if (e.target === this.mobileOverlay) {
                this.closeMobileMenu();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileOverlay.classList.contains('open')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const isOpen = this.mobileOverlay.classList.contains('open');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileOverlay.classList.add('open');
        this.mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        
        // Animate hamburger lines
        const lines = this.mobileToggle.querySelectorAll('.hamburger-line');
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }

    closeMobileMenu() {
        this.mobileOverlay.classList.remove('open');
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        // Reset hamburger lines
        const lines = this.mobileToggle.querySelectorAll('.hamburger-line');
        lines[0].style.transform = '';
        lines[1].style.opacity = '';
        lines[2].style.transform = '';
    }

    setupDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleDropdown(dropdown);
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    this.closeDropdown(dropdown);
                }
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeDropdown(dropdown);
                }
            });
        });
    }

    toggleDropdown(dropdown) {
        const isOpen = dropdown.classList.contains('open');
        
        // Close all other dropdowns
        this.dropdowns.forEach(d => {
            if (d !== dropdown) {
                this.closeDropdown(d);
            }
        });
        
        if (isOpen) {
            this.closeDropdown(dropdown);
        } else {
            this.openDropdown(dropdown);
        }
    }

    openDropdown(dropdown) {
        dropdown.classList.add('open');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        toggle.setAttribute('aria-expanded', 'true');
    }

    closeDropdown(dropdown) {
        dropdown.classList.remove('open');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        toggle.setAttribute('aria-expanded', 'false');
    }

    setupMobileDropdowns() {
        this.mobileDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            
            toggle.addEventListener('click', () => {
                dropdown.classList.toggle('open');
            });
        });
    }

    setupActiveLinks() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        const sections = document.querySelectorAll('section[id]');
        
        // Set initial active state
        this.updateActiveLink();
        
        // Update active link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveLink();
        });
        
        // Handle click navigation
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 72; // Account for fixed nav
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 100; // Offset for better detection
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active states
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    setupKeyboardNavigation() {
        const focusableElements = this.nav.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (element.classList.contains('dropdown-toggle')) {
                        e.preventDefault();
                        const dropdown = element.closest('.dropdown');
                        this.toggleDropdown(dropdown);
                    }
                }
            });
        });
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.professionalNav = new ProfessionalNav();
});

// Smooth scroll utility function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 72; // Account for fixed nav
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}
