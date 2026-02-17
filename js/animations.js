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
            fast: 0.6,
            normal: 0.9,
            slow: 1.2,
            hero: 1.4
        },
        // Easing - smooth, elegant curves
        ease: {
            smooth: 'power2.out',
            smoothInOut: 'power2.inOut',
            gentle: 'power1.out',
            luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        },
        // Movement distances (reduced for mobile)
        distance: {
            desktop: 50,
            mobile: 30
        },
        // Stagger timing
        stagger: {
            fast: 0.12,
            normal: 0.18,
            slow: 0.25
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
        
        // Configure for mobile
        ScrollTrigger.config({
            ignoreMobileResize: true
        });

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
        }

        // Initialize hover effects
        initHoverEffects();
        
        // Refresh ScrollTrigger after all animations are set up
        ScrollTrigger.refresh();
        
        // Mobile safety net: if animations don't trigger, show everything after 2 seconds
        if (isMobile) {
            setTimeout(() => {
                showAllElements();
            }, 2000);
        }
    }

    // ===================================
    // Initial States (Hidden)
    // ===================================

    function setInitialStates() {
        // Hero elements
        gsap.set('[data-animate="hero"]', {
            opacity: 0,
            y: 30,
            filter: 'blur(4px)'
        });

        // Fade up elements
        gsap.set('[data-animate="fade-up"]', {
            opacity: 0,
            y: distance
        });

        // Word reveal titles (we'll split them later)
        gsap.set('[data-animate="words"]', {
            opacity: 1 // Keep visible, we animate the words
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
        
        // Also show word spans
        const wordSpans = document.querySelectorAll('.word');
        wordSpans.forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'none';
            span.style.filter = 'none';
        });
    }

    // ===================================
    // Hero Section Animation
    // ===================================

    function animateHero() {
        const heroElements = document.querySelectorAll('[data-animate="hero"]');
        if (!heroElements.length) return;

        // Staggered entrance with blur-to-sharp
        gsap.to(heroElements, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: CONFIG.duration.hero,
            stagger: 0.2,
            ease: CONFIG.ease.smooth,
            delay: 0.3 // Small delay for page load
        });
    }

    // ===================================
    // Navbar Scroll Behavior
    // ===================================

    function animateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Add scrolled class for CSS transitions
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
        
        elements.forEach((el, index) => {
            // Calculate stagger delay based on siblings
            const siblings = el.parentElement.querySelectorAll('[data-animate="fade-up"]');
            const siblingIndex = Array.from(siblings).indexOf(el);
            const staggerDelay = siblingIndex * CONFIG.stagger.normal;

            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: isMobile ? 'top 98%' : 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: CONFIG.duration.normal,
                delay: staggerDelay,
                ease: CONFIG.ease.smooth
            });
        });
    }

    // ===================================
    // Word-Level Reveal Animation
    // ===================================

    function animateWordReveal() {
        const titles = document.querySelectorAll('[data-animate="words"]');
        
        titles.forEach(title => {
            // Split text into words
            const text = title.textContent;
            const words = text.split(' ');
            
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
                y: 20,
                filter: isMobile ? 'none' : 'blur(2px)'
            });

            // Animate on scroll
            gsap.to(wordSpans, {
                scrollTrigger: {
                    trigger: title,
                    start: isMobile ? 'top 98%' : 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: CONFIG.duration.normal,
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
                    scrub: 1 // Smooth scrubbing
                },
                y: '20%', // Move slower than scroll
                ease: 'none'
            });
        });
    }

    // ===================================
    // Hover Effects (CSS Enhanced by JS)
    // ===================================

    function initHoverEffects() {
        // Feature cards - lift and shadow
        const cards = document.querySelectorAll('.feature-card, .schedule-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (isMobile) return;
                gsap.to(card, {
                    y: -4,
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                    duration: 0.3,
                    ease: CONFIG.ease.smooth
                });
            });
            card.addEventListener('mouseleave', () => {
                if (isMobile) return;
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
                if (isMobile) return;
                gsap.to(btn, {
                    y: -2,
                    duration: 0.2,
                    ease: CONFIG.ease.gentle
                });
            });
            btn.addEventListener('mouseleave', () => {
                if (isMobile) return;
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
        // Small delay to ensure page is fully painted
        setTimeout(init, 50);
    }

})();
