/* ===================================
   Lazy Coffee Co. - Simple Scroll Animations
   Everything visible by default.
   Animations are additive enhancements only.
   =================================== */

(function() {
    'use strict';

    const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function init() {
        if (prefersReducedMotion) return;

        try {
            // Inject minimal animation CSS — nothing sets opacity:0 by default
            const style = document.createElement('style');
            style.id = 'lazy-animations';
            const dur = isMobile ? '0.7s' : '0.9s';
            const ease = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            style.textContent = `
                [data-animate="hero"].animate {
                    animation: heroFadeIn ${dur} ${ease} both;
                }
                @keyframes heroFadeIn {
                    from { opacity: 0.3; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                [data-animate="fade-up"].visible {
                    animation: fadeUpIn ${dur} ${ease} both;
                }
                @keyframes fadeUpIn {
                    from { opacity: 0.3; transform: translateY(25px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                [data-animate="words"].visible .word {
                    animation: wordIn ${dur} ${ease} both;
                }
                @keyframes wordIn {
                    from { opacity: 0.3; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                [data-animate="words"] .word {
                    display: inline-block;
                }
            `;
            document.head.appendChild(style);

            // Split section titles into word spans for staggered animation
            const wordStagger = isMobile ? 0.06 : 0.08;
            document.querySelectorAll('[data-animate="words"]').forEach(title => {
                const text = title.textContent.trim();
                const words = text.split(/\s+/);
                title.innerHTML = words.map((word, i) =>
                    `<span class="word" style="animation-delay: ${i * wordStagger}s">${word}</span>`
                ).join(' ');
            });

            // Scroll observer for fade-up and word sections
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

            document.querySelectorAll('[data-animate="fade-up"], [data-animate="words"]').forEach(el => {
                observer.observe(el);
            });

            // Hero elements — staggered entrance
            const heroDelay = isMobile ? 200 : 300;
            const heroStagger = isMobile ? 150 : 200;
            document.querySelectorAll('[data-animate="hero"]').forEach((el, i) => {
                setTimeout(() => el.classList.add('animate'), heroDelay + i * heroStagger);
            });

            // Navbar scroll effect
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 80) {
                        navbar.classList.add('navbar-scrolled');
                    } else {
                        navbar.classList.remove('navbar-scrolled');
                    }
                }, { passive: true });
            }

        } catch (e) {
            console.warn('Animation init failed:', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 50);
    }

})();
