/**
 * Main JavaScript for Portfolio Site
 * Subtle interactions and progressive enhancements
 */

(function() {
    'use strict';

    // ===========================
    // Navigation Active State
    // ===========================
    function updateActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // ===========================
    // Skill Progress Animation
    // ===========================
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');

        if (skillBars.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const progress = bar.getAttribute('data-progress');

                    // Add a slight delay for staggered animation
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 100);

                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }

    // ===========================
    // Smooth Scroll Enhancement
    // ===========================
    function enhanceSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===========================
    // Fade-in Animation on Scroll
    // ===========================
    function initFadeInAnimations() {
        const elements = document.querySelectorAll('.timeline-item, .project-card, .skills-category, .expertise-card');

        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    }

    // ===========================
    // Navigation Background on Scroll
    // ===========================
    function initNavScrollEffect() {
        const nav = document.querySelector('.nav');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                nav.style.borderBottomColor = 'rgba(224, 224, 224, 0.8)';
            } else {
                nav.style.borderBottomColor = 'var(--color-border)';
            }

            lastScroll = currentScroll;
        });
    }

    // ===========================
    // Initialize Everything
    // ===========================
    function init() {
        updateActiveNav();
        animateSkillBars();
        enhanceSmoothScroll();
        initFadeInAnimations();
        initNavScrollEffect();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
