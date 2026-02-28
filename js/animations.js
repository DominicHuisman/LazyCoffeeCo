/* ===================================
   Lazy Coffee Co. - Scroll Animations
   Hero entrance is handled by pure CSS.
   This JS handles: word splitting, scroll
   observer for sections, navbar scroll effect.
   =================================== */

(function() {
    'use strict';

    var isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function init() {
        if (prefersReducedMotion) {
            showAllElements();
            return;
        }

        // Split section titles into individual word spans for stagger effect
        var wordStagger = isMobile ? 0.08 : 0.1;
        document.querySelectorAll('[data-animate="words"]').forEach(function(title) {
            var text = title.textContent.trim();
            var words = text.split(/\s+/);
            title.innerHTML = words.map(function(word, i) {
                return '<span class="word" style="transition-delay: ' + (i * wordStagger) + 's">' + word + '</span>';
            }).join(' ');
        });

        // Scroll observer — adds .visible class when elements enter viewport
        if ('IntersectionObserver' in window) {
            var threshold = isMobile ? 0.15 : 0.1;
            var rootMargin = isMobile ? '0px 0px -10% 0px' : '0px 0px -5% 0px';
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: threshold, rootMargin: rootMargin });

            document.querySelectorAll('[data-animate="fade-up"], [data-animate="words"]').forEach(function(el) {
                observer.observe(el);
            });

            // On mobile, feature cards become scroll-triggered instead of page-load
            if (isMobile) {
                document.querySelectorAll('.feature-card[data-animate="hero"]').forEach(function(el) {
                    observer.observe(el);
                });
            }
        } else {
            // Fallback: show everything
            showAllElements();
        }

        // Navbar scroll effect
        var navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 80) {
                    navbar.classList.add('navbar-scrolled');
                } else {
                    navbar.classList.remove('navbar-scrolled');
                }
            }, { passive: true });
        }
    }

    function showAllElements() {
        document.querySelectorAll('[data-animate]').forEach(function(el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.filter = 'none';
            el.classList.add('visible');
        });
        document.querySelectorAll('.word').forEach(function(span) {
            span.style.opacity = '1';
            span.style.transform = 'none';
            span.style.filter = 'none';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 50);
    }

})();
