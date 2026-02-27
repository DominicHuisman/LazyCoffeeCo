/* ===================================
   Lazy Coffee Co. - Navbar Scroll Effect
   All content is pure HTML/CSS, always visible.
   This file only handles the navbar background
   change on scroll.
   =================================== */

(function() {
    'use strict';

    function init() {
        var navbar = document.querySelector('.navbar');
        if (!navbar) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 80) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
