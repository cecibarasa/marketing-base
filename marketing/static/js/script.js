document.addEventListener('DOMContentLoaded', function() {
    // Typewriter effect
    const words = ['Facebook Marketing', 'Website Development', 'UI & UX Design', 'Products Marketing'];
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    const speed = 100;
    const element = document.getElementById('rotating-text');

    function typeWriter() {
        const currentWord = words[currentWordIndex];
        if (isDeleting) {
            element.textContent = currentWord.substring(0, currentCharIndex--);
            if (currentCharIndex < 0) {
                isDeleting = false;
                currentWordIndex = (currentWordIndex + 1) % words.length;
                setTimeout(typeWriter, 500);
            } else {
                setTimeout(typeWriter, speed / 2);
            }
        } else {
            element.textContent = currentWord.substring(0, currentCharIndex++);
            if (currentCharIndex > currentWord.length) {
                isDeleting = true;
                setTimeout(typeWriter, 1000);
            } else {
                setTimeout(typeWriter, speed);
            }
        }
    }
    typeWriter();

    // Enhanced navbar functionality
    const header = document.querySelector('.site-header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu') || document.querySelector('.mobile-menu-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const allNavLinks = Array.from(navLinks).concat(Array.from(mobileNavLinks));

    let lastKnownScrollY = 0;
    let ticking = false;

    function onScroll() {
        lastKnownScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll(lastKnownScrollY);
                ticking = false;
            });
            ticking = true;
        }
    }

    function handleScroll(scrollY) {
        if (scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }

    // Smooth scroll handler for anchor links
    function smoothScroll(e) {
        // allow ctrl-click, new tab, mailto, external
        if (e.defaultPrevented) return;
        const href = this.getAttribute('href') || '';
        if (!href.startsWith('#')) return; // ignore external links
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        const offset = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset + 2;
        window.scrollTo({ top, behavior: 'smooth' });
        // close mobile menu when navigating
        if (mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) closeMobileMenu();
    }

    // IntersectionObserver to set active nav link based on sections in view
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            if (entry.isIntersecting) {
                allNavLinks.forEach(l => l.classList.remove('active'));
                const activeLinks = document.querySelectorAll(`a[href="#${id}"]`);
                activeLinks.forEach(a => a.classList.add('active'));
            }
        });
    }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 });
    sections.forEach(s => sectionObserver.observe(s));

    // Mobile menu: open/close, focus trap, ESC to close
    const focusableSelectors = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    let lastFocusedElement = null;

    function openMobileMenu() {
        if (!mobileMenuOverlay) return;
        mobileMenuToggle.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuOverlay.setAttribute('aria-hidden', 'false');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        document.documentElement.classList.add('no-scroll');
        lastFocusedElement = document.activeElement;
        // focus first focusable inside menu
        const focusable = mobileMenuOverlay.querySelectorAll(focusableSelectors);
        if (focusable.length) focusable[0].focus();
        // stagger animation for mobile items
        const items = mobileMenuOverlay.querySelectorAll('.mobile-nav-item');
        items.forEach((it, i) => { it.style.transitionDelay = `${i * 60}ms`; });
    }

    function closeMobileMenu() {
        if (!mobileMenuOverlay) return;
        mobileMenuToggle.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuOverlay.setAttribute('aria-hidden', 'true');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.documentElement.classList.remove('no-scroll');
        // remove inline delays
        const items = mobileMenuOverlay.querySelectorAll('.mobile-nav-item');
        items.forEach(it => { it.style.transitionDelay = ''; });
        if (lastFocusedElement) lastFocusedElement.focus();
    }

    function toggleMobileMenu(e) {
        const open = mobileMenuOverlay.classList.contains('active');
        if (open) closeMobileMenu(); else openMobileMenu();
    }

    // Close mobile menu when clicking backdrop
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) closeMobileMenu();
        });
    }

    // ESC to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) closeMobileMenu();
        }
    });

    // Add listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    allNavLinks.forEach(link => link.addEventListener('click', smoothScroll));

    // IntersectionObserver for reveal animations
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));

    // initialize header state
    handleScroll(window.scrollY);

    // Parallax mouse + scroll for hero media and decorative shapes with gentle smoothing
    (function setupParallax(){
        const hero = document.querySelector('.hero');
        const heroMedia = document.querySelector('.hero-media');
        const decor = document.querySelector('.hero-decor');
        if (!hero || (!heroMedia && !decor)) return;

        let mouseX = 0, mouseY = 0;
        let lastX = 0, lastY = 0;

        function onMouseMove(e) {
            const r = hero.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            mouseX = (e.clientX - cx) / r.width;
            mouseY = (e.clientY - cy) / r.height;
        }

        function rafLoop() {
            lastX += (mouseX - lastX) * 0.08;
            lastY += (mouseY - lastY) * 0.08;
            if (heroMedia) {
                const tx = lastX * 14; const ty = lastY * 10;
                heroMedia.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${lastX * 0.8}deg)`;
            }
            if (decor) {
                const shapes = decor.querySelectorAll('img');
                shapes.forEach((s, i) => {
                    const depth = (i + 1) * 8;
                    const tx = lastX * depth * -1; const ty = lastY * depth * -0.6;
                    s.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
                });
            }
            requestAnimationFrame(rafLoop);
        }

        hero.addEventListener('mousemove', onMouseMove);
        rafLoop();

        // scroll-based offset for slight parallax
        window.addEventListener('scroll', function() {
            const rect = hero.getBoundingClientRect();
            const sc = Math.max(0, -rect.top / 8);
            if (heroMedia) heroMedia.style.transform = `translate3d(0, ${sc}px, 0)`;
        }, { passive: true });
    })();
});