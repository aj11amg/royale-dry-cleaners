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

    // --- Dedicated Observer for '.fade-up-trigger' (adds 'in-view') ---
    const fadeUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                fadeUpObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.fade-up-trigger').forEach(el => fadeUpObserver.observe(el));

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

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Optional: Close others
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                    const otherAnswer = other.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = 0;
                }
            });

            // Toggle current
            item.classList.toggle('active');

            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });

    // --- Carousel Logic with Active Item Detection ---
    const track = document.getElementById('serviceCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (track && prevBtn && nextBtn) {
        const items = track.querySelectorAll('.carousel-item');

        // Function to detect which item is centered/active
        function updateActiveItem() {
            const trackRect = track.getBoundingClientRect();
            const trackCenter = trackRect.left + trackRect.width / 2;

            let closestItem = null;
            let closestDistance = Infinity;

            items.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width / 2;
                const distance = Math.abs(trackCenter - itemCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestItem = item;
                }

                item.classList.remove('active');
            });

            if (closestItem) {
                closestItem.classList.add('active');
            }
        }

        // Update on scroll
        track.addEventListener('scroll', updateActiveItem);

        // Update on load
        setTimeout(updateActiveItem, 100);

        // Navigation buttons
        prevBtn.addEventListener('click', () => {
            const scrollAmount = track.offsetWidth > 768 ? 350 : track.offsetWidth - 60;
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            setTimeout(updateActiveItem, 500);
        });

        nextBtn.addEventListener('click', () => {
            const scrollAmount = track.offsetWidth > 768 ? 350 : track.offsetWidth - 60;
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            setTimeout(updateActiveItem, 500);
        });

        // Auto-scroll loop for magnificence
        let autoScroll = setInterval(() => {
            if (track.scrollLeft + track.offsetWidth >= track.scrollWidth) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                const scrollAmount = track.offsetWidth > 768 ? 350 : track.offsetWidth - 60;
                track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
            setTimeout(updateActiveItem, 500);
        }, 5000); // Scroll every 5 seconds

        track.addEventListener('mouseenter', () => clearInterval(autoScroll));

        // Update on window resize
        window.addEventListener('resize', updateActiveItem);
    }

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileBtn && mobileNav) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');

            // Toggle Body Scroll
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    // --- Background Color Triggers ---
    const bgObserverOptions = {
        threshold: 0.2, // Trigger earlier
        rootMargin: "0px 0px -20% 0px"
    };

    const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove all bg classes
                document.body.classList.remove('bg-green', 'bg-blue', 'bg-gold');

                // Add new class if defined
                const bgClass = entry.target.getAttribute('data-bg');
                if (bgClass) {
                    document.body.classList.add(bgClass);
                }
            }
        });
    }, bgObserverOptions);

    // Observe all sections with data-bg
    document.querySelectorAll('[data-bg]').forEach(el => bgObserver.observe(el));
});
