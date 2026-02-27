/* ===================================
   Lazy Coffee Co. - Scroll Animations
   Navbar scroll effect + IntersectionObserver
   for section fade-in animations.
   All content visible by default via CSS.
   =================================== */

(function() {
    'use strict';

    function init() {
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

        // Scroll-triggered fade-in for sections
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

            // Observe section titles, cards, and form elements
            var targets = document.querySelectorAll(
                '.section-title, .schedule-card, .catering-subtitle, ' +
                '.catering-features, .review-card, .booking-form, .review-subtitle'
            );
            targets.forEach(function(el) { observer.observe(el); });
        } else {
            // Fallback: show everything immediately
            var all = document.querySelectorAll(
                '.section-title, .schedule-card, .catering-subtitle, ' +
                '.catering-features, .review-card, .booking-form, .review-subtitle'
            );
            all.forEach(function(el) { el.classList.add('in-view'); });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
