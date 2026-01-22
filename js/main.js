document.addEventListener('DOMContentLoaded', () => {
    // --- Loader ---
    const loader = document.getElementById('loader');
    
    // Simulate initial load (or wait for video to buffer slightly)
    setTimeout(() => {
        loader.classList.add('hidden');
        triggerHeroAnimations();
    }, 1000); // 1s artificial delay for smoothness

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-on-scroll');
    fadeElements.forEach(el => observer.observe(el));

    // --- Hero Animations Trigger ---
    function triggerHeroAnimations() {
        // Find elements inside hero that might need manual class addition if CSS animation isn't enough
        const heroText = document.querySelectorAll('.hero-headline .reveal-text');
        heroText.forEach(el => {
            // Re-trigger animation if needed, or already handled by CSS keyframes on load
            el.style.animationPlayState = 'running';
        });

        const delayedFade = document.querySelectorAll('.hero-section .fade-in-up');
        delayedFade.forEach(el => {
            el.classList.add('visible');
        });
    }

    // --- Smooth Scroll for Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
