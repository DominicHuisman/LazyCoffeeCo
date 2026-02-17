/* ===================================
   Lazy Coffee Co. - Scroll Animations
   GSAP + ScrollTrigger Implementation
   "Quiet Confidence" - Subtle, purposeful motion
   =================================== */

(function() {
    'use strict';

    // ===================================
    // Configuration & Detection
    // ===================================
    
    const CONFIG = {
        // Timing
        duration: {
            fast: 0.5,
            normal: 0.7,
            slow: 0.9,
            hero: 1.0
        },
        // Easing - smooth, elegant curves
        ease: {
            smooth: 'power2.out',
            smoothInOut: 'power2.inOut',
            gentle: 'power1.out',
            luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        },
        // Movement distances
        distance: {
            desktop: 50,
            mobile: 30
        },
        // Stagger timing
        stagger: {
            fast: 0.1,
            normal: 0.15,
            slow: 0.2
        }
    };

    // Device & preference detection
    const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const distance = isMobile ? CONFIG.distance.mobile : CONFIG.distance.desktop;

    // ===================================
    // Initialize
    // ===================================

    function init() {
        // Respect user preferences
        if (prefersReducedMotion) {
            showAllElements();
            return;
        }

        // Wait for GSAP to load
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP not loaded, retrying...');
            setTimeout(init, 100);
            return;
        }

        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Small delay to ensure DOM is ready
        requestAnimationFrame(() => {
            // Set initial states
            setInitialStates();

            // Run animations
            animateHero();
            animateNavbar();
            animateFadeUp();
            animateWordReveal();
            
            // Only run parallax on desktop
            if (!isMobile) {
                animateParallax();
                initHoverEffects();
            }
            
            // Refresh ScrollTrigger after setup
            ScrollTrigger.refresh();
        });
    }

    // ===================================
    // Initial States (Hidden)
    // ===================================

    function setInitialStates() {
        // Hero elements
        gsap.set('[data-animate="hero"]', {
            opacity: 0,
            y: 30,
            filter: isMobile ? 'none' : 'blur(4px)'
        });

        // Fade up elements
        gsap.set('[data-animate="fade-up"]', {
            opacity: 0,
            y: distance
        });

        // Word reveal titles
        gsap.set('[data-animate="words"]', {
            opacity: 1
        });
    }

    // ===================================
    // Show All (Reduced Motion Fallback)
    // ===================================

    function showAllElements() {
        const allAnimated = document.querySelectorAll('[data-animate]');
        allAnimated.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.filter = 'none';
        });
    }

    // ===================================
    // Hero Section Animation
    // ===================================

    function animateHero() {
        const heroElements = document.querySelectorAll('[data-animate="hero"]');
        if (!heroElements.length) return;

        // Staggered entrance
        gsap.to(heroElements, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: CONFIG.duration.hero,
            stagger: 0.2,
            ease: CONFIG.ease.smooth,
            delay: 0.2
        });
    }

    // ===================================
    // Navbar Scroll Behavior
    // ===================================

    function animateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        ScrollTrigger.create({
            start: 'top -80',
            onUpdate: (self) => {
                if (self.direction === 1 && self.scroll() > 80) {
                    navbar.classList.add('navbar-scrolled');
                } else if (self.scroll() <= 80) {
                    navbar.classList.remove('navbar-scrolled');
                }
            }
        });
    }

    // ===================================
    // Fade Up Animation (Scroll Triggered)
    // ===================================

    function animateFadeUp() {
        const elements = document.querySelectorAll('[data-animate="fade-up"]');
        if (!elements.length) return;
        
        elements.forEach((el) => {
            // Find sibling index for stagger
            const parent = el.parentElement;
            const siblings = parent.querySelectorAll('[data-animate="fade-up"]');
            const siblingIndex = Array.from(siblings).indexOf(el);
            const staggerDelay = siblingIndex * CONFIG.stagger.normal;

            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: isMobile ? 'top 90%' : 'top 85%',
                    toggleActions: 'play none none none',
                    once: true
                },
                opacity: 1,
                y: 0,
                duration: CONFIG.duration.normal,
                delay: staggerDelay,
                ease: CONFIG.ease.smooth,
                clearProps: 'transform' // Clean up after animation
            });
        });
    }

    // ===================================
    // Word-Level Reveal Animation
    // ===================================

    function animateWordReveal() {
        const titles = document.querySelectorAll('[data-animate="words"]');
        if (!titles.length) return;
        
        titles.forEach(title => {
            // Split text into words
            const text = title.textContent.trim();
            const words = text.split(/\s+/);
            
            // Clear and rebuild with spans
            title.innerHTML = words.map(word => 
                `<span class="word-wrap"><span class="word">${word}</span></span>`
            ).join(' ');

            // Style the word wrappers
            const wordWraps = title.querySelectorAll('.word-wrap');
            const wordSpans = title.querySelectorAll('.word');

            gsap.set(wordWraps, { overflow: 'hidden', display: 'inline-block' });
            gsap.set(wordSpans, { 
                display: 'inline-block',
                opacity: 0,
                y: 25
            });

            // Animate on scroll
            gsap.to(wordSpans, {
                scrollTrigger: {
                    trigger: title,
                    start: isMobile ? 'top 90%' : 'top 80%',
                    toggleActions: 'play none none none',
                    once: true
                },
                opacity: 1,
                y: 0,
                duration: CONFIG.duration.fast,
                stagger: CONFIG.stagger.fast,
                ease: CONFIG.ease.smooth
            });
        });
    }

    // ===================================
    // Parallax Effect (Desktop Only)
    // ===================================

    function animateParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(el => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el.parentElement,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                },
                y: '20%',
                ease: 'none'
            });
        });
    }

    // ===================================
    // Hover Effects (Desktop Only)
    // ===================================

    function initHoverEffects() {
        // Feature cards - lift and shadow
        const cards = document.querySelectorAll('.feature-card, .schedule-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -4,
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                    duration: 0.3,
                    ease: CONFIG.ease.smooth
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    duration: 0.3,
                    ease: CONFIG.ease.smooth
                });
            });
        });

        // Buttons - subtle lift
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    y: -2,
                    duration: 0.2,
                    ease: CONFIG.ease.gentle
                });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    y: 0,
                    duration: 0.2,
                    ease: CONFIG.ease.gentle
                });
            });
        });
    }

    // ===================================
    // Run on DOM Ready
    // ===================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Small delay to ensure everything is painted
        setTimeout(init, 50);
    }

})();
