// Language Toggle Functionality
const langToggle = document.getElementById('langToggle');
const langText = langToggle.querySelector('.lang-text');
let currentLang = localStorage.getItem('language') || 'en';

// Set initial language
document.documentElement.lang = currentLang;
updateLanguage(currentLang);

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', currentLang);
    updateLanguage(currentLang);
});

function updateLanguage(lang) {
    langText.textContent = lang.toUpperCase();
    
    // Update all elements with data-lang attributes
    document.querySelectorAll('[data-lang-en]').forEach(element => {
        const key = `data-lang-${lang}`;
        if (element.hasAttribute(key)) {
            element.textContent = element.getAttribute(key);
        }
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section-title, .project-card, .skill-item, .contact-info, .contact-form');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Skill Bars Animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        if (level) {
            setTimeout(() => {
                bar.style.transform = `scaleX(${level / 100})`;
            }, 500);
            bar.style.transition = 'transform 1.5s ease-out';
        }
    });
}

// Trigger skill bars animation when skills section is visible
const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillsObserver.observe(skillsSection);
}

// Floating Cubes Animation Enhancement
function enhanceFloatingCubes() {
    const cubes = document.querySelectorAll('.floating-cube');
    cubes.forEach((cube, index) => {
        cube.addEventListener('mouseenter', () => {
            cube.style.transform = 'scale(1.2) rotate(45deg)';
            cube.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.8)';
        });
        
        cube.addEventListener('mouseleave', () => {
            cube.style.transform = 'scale(1) rotate(0deg)';
            cube.style.boxShadow = 'none';
        });
    });
}

// Connect Button Functionality
const connectBtn = document.querySelector('.connect-btn');
if (connectBtn) {
    connectBtn.addEventListener('click', () => {
        // Scroll to contact section
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Submit to Formspree endpoint defined in form action
        try {
            const res = await fetch(this.action || 'https://formspree.io/f/mgvzglyg', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            });
            if (res.ok) {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.reset();
            } else {
                showNotification('Failed to send. Please try again later.', 'error');
            }
        } catch (err) {
            showNotification('Network error. Please try again.', 'error');
        }
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Parallax Effect for Background Elements
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-cube');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    enhanceFloatingCubes();
    initParallax();
    
    // Add smooth reveal animation for sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        sectionObserver.observe(section);
    });
});

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add hover effects to skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(15px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0) scale(1)';
        });
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledParallax = throttle(initParallax, 16); // 60fps
window.addEventListener('scroll', throttledParallax); 

// ==========================
// 3D Carousel (Projects)
// ==========================
(function initCarousel3D() {
    document.addEventListener('DOMContentLoaded', () => {
        const stage = document.querySelector('.carousel-stage');
        if (!stage) return; // No carousel on page

        const cards = Array.from(stage.querySelectorAll('.carousel-card'));
        const prevBtn = document.querySelector('.carousel-nav.prev');
        const nextBtn = document.querySelector('.carousel-nav.next');
        const dotsContainer = document.querySelector('.carousel-dots');

        let active = 0;
        let hover = false;
        let inView = true;
        let autoTimer = null;
        const rotateInterval = 4000;
        const minSwipe = 50;
        let touchStartX = null;
        let touchEndX = null;

        // Build dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            cards.forEach((_, i) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.setAttribute('aria-label', `Go to slide ${i + 1}`);
                b.addEventListener('click', () => setActive(i));
                dotsContainer.appendChild(b);
            });
        }

        function setClasses() {
            cards.forEach((card, i) => {
                card.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');
                const len = cards.length;
                const prev = (active - 1 + len) % len;
                const next = (active + 1) % len;
                if (i === active) card.classList.add('is-active');
                else if (i === prev) card.classList.add('is-prev');
                else if (i === next) card.classList.add('is-next');
                else card.classList.add('is-hidden');
            });

            if (dotsContainer) {
                Array.from(dotsContainer.children).forEach((dot, i) => {
                    if (i === active) dot.setAttribute('aria-current', 'true');
                    else dot.removeAttribute('aria-current');
                });
            }
        }

        function setActive(i) {
            active = (i + cards.length) % cards.length;
            setClasses();
        }

        function next() { setActive(active + 1); }
        function prev() { setActive(active - 1); }

        // Buttons
        nextBtn && nextBtn.addEventListener('click', next);
        prevBtn && prevBtn.addEventListener('click', prev);

        // Hover pause
        const wrapper = document.querySelector('.carousel3d-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => { hover = true; stopAuto(); });
            wrapper.addEventListener('mouseleave', () => { hover = false; startAuto(); });
        }

        // Intersection observer for in-view auto-rotate control
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                inView = entry.isIntersecting;
                if (inView) startAuto(); else stopAuto();
            });
        }, { threshold: 0.2 });
        io.observe(stage);

        function startAuto() {
            if (autoTimer || hover || !inView) return;
            autoTimer = setInterval(next, rotateInterval);
        }

        function stopAuto() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        // Touch swipe
        stage.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
            touchEndX = null;
        }, { passive: true });

        stage.addEventListener('touchmove', (e) => {
            touchEndX = e.changedTouches[0].clientX;
        }, { passive: true });

        stage.addEventListener('touchend', () => {
            if (touchStartX === null || touchEndX === null) return;
            const dx = touchStartX - touchEndX;
            if (dx > minSwipe) next();
            else if (dx < -minSwipe) prev();
        });

        // Lightbox (enhanced): gallery navigation, captions, a11y, focus trap
        const lightbox = document.getElementById('image-lightbox');
        const lbContent = lightbox ? lightbox.querySelector('.lightbox-content') : null;
        const lbImg = lightbox ? lightbox.querySelector('img') : null;
        const lbCaption = lightbox ? lightbox.querySelector('.lb-caption') : null;
        const btnClose = lightbox ? lightbox.querySelector('.lb-close') : null;
        const btnPrev = lightbox ? lightbox.querySelector('.lb-prev') : null;
        const btnNext = lightbox ? lightbox.querySelector('.lb-next') : null;

        // Use existing 'cards' from carousel to build gallery data
        const gallery = cards.map(card => {
            const img = card.querySelector('.media-img');
            const titleEl = card.querySelector('.carousel-body h3');
            return {
                el: img,
                src: img ? img.getAttribute('src') : '',
                alt: img ? img.getAttribute('alt') || '' : '',
                caption: titleEl ? titleEl.textContent.trim() : ''
            };
        }).filter(g => g.src);

        let currentIndex = 0;
        let lastFocused = null;
        let lightboxOpen = false;

        function updateLightbox(index) {
            if (!lbImg) return;
            const item = gallery[index];
            lbImg.src = item.src;
            lbImg.alt = item.alt || item.caption || '';
            if (lbCaption) lbCaption.textContent = item.caption || '';
            currentIndex = index;
            // Manage disabled state for nav if single
            const multi = gallery.length > 1;
            if (btnPrev) btnPrev.style.display = multi ? '' : 'none';
            if (btnNext) btnNext.style.display = multi ? '' : 'none';
        }

        function focusTrap(e) {
            if (!lightboxOpen || !lbContent) return;
            if (e.key !== 'Tab') return;
            const focusables = lbContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const f = Array.from(focusables).filter(el => !el.hasAttribute('disabled'));
            if (f.length === 0) return;
            const first = f[0];
            const last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        function openLightbox(index, originEl) {
            if (!lightbox || !lbContent) return;
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('noscroll');
            lastFocused = originEl || document.activeElement;
            updateLightbox(index);
            // Delay to ensure element is focusable
            setTimeout(() => { lbContent.focus(); }, 0);
            lightboxOpen = true;
            stopAuto();
        }

        function closeLightbox() {
            if (!lightbox) return;
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('noscroll');
            if (lbImg) lbImg.src = '';
            lightboxOpen = false;
            // Restore focus
            if (lastFocused && typeof lastFocused.focus === 'function') {
                lastFocused.focus();
            }
            startAuto();
        }

        function nextImage() {
            if (!gallery.length) return;
            const i = (currentIndex + 1) % gallery.length;
            updateLightbox(i);
        }

        function prevImage() {
            if (!gallery.length) return;
            const i = (currentIndex - 1 + gallery.length) % gallery.length;
            updateLightbox(i);
        }

        // Bind click on images to open (keep cursor style as default/custom)
        gallery.forEach((g, idx) => {
            if (!g.el) return;
            g.el.addEventListener('click', (e) => openLightbox(idx, e.currentTarget.closest('.carousel-card') || g.el));
        });

        if (lightbox) {
            // Backdrop click (only when clicking backdrop, not content)
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
            // Buttons
            if (btnClose) btnClose.addEventListener('click', closeLightbox);
            if (btnPrev) btnPrev.addEventListener('click', prevImage);
            if (btnNext) btnNext.addEventListener('click', nextImage);
            // Keyboard
            document.addEventListener('keydown', (e) => {
                if (!lightboxOpen) return;
                if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
                else if (e.key === 'ArrowLeft') { e.preventDefault(); prevImage(); }
                else if (e.key === 'ArrowRight') { e.preventDefault(); nextImage(); }
            });
            // Focus trap
            document.addEventListener('keydown', focusTrap);
        }

        // Init
        setActive(0);
        startAuto();
    });
})();

// ==========================
// Custom Cursor Logic - Optimized for Performance
// ==========================
(function initCustomCursor() {
    // Disable on mobile and touch devices for better performance
    const isTouch = matchMedia('(pointer: coarse)').matches || matchMedia('(hover: none)').matches || window.innerWidth < 768;
    if (isTouch) return;
    
    const dot = document.querySelector('.cursor');
    const outline = document.querySelector('.cursor-outline');
    if (!dot || !outline) return;
    
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let outX = mouseX, outY = mouseY;
    let rafId = null;
    let lastUpdate = 0;
    const FPS_LIMIT = 60; // Limit FPS
    const frameDelay = 1000 / FPS_LIMIT;
    const ease = 0.15; // Slightly reduced easing for better performance
    
    // Optimized move function with throttling
    const move = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Use transform for better performance
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };
    
    // Optimized animation loop with FPS limiting
    const loop = (currentTime) => {
        // Throttle to target FPS
        if (currentTime - lastUpdate < frameDelay) {
            rafId = requestAnimationFrame(loop);
            return;
        }
        lastUpdate = currentTime;
        
        // Smooth outline following
        outX += (mouseX - outX) * ease;
        outY += (mouseY - outY) * ease;
        
        // Use transform for better performance
        outline.style.transform = `translate(${outX}px, ${outY}px)`;
        
        rafId = requestAnimationFrame(loop);
    };
    
    // Throttled mouse move event
    let mouseMoveTimeout = null;
    window.addEventListener('mousemove', (e) => {
        if (mouseMoveTimeout) return;
        mouseMoveTimeout = setTimeout(() => {
            move(e);
            mouseMoveTimeout = null;
        }, 8); // ~120fps throttle for smooth cursor
    });
    
    // Start animation loop
    rafId = requestAnimationFrame(loop);
    
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        } else {
            rafId = requestAnimationFrame(loop);
        }
    });
    
    // Hide/show cursor optimizations
    document.addEventListener('mouseleave', () => {
        dot.classList.add('cursor--hide');
        outline.classList.add('cursor-outline--hide');
        // Pause animation when cursor is hidden
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    });
    
    document.addEventListener('mouseenter', () => {
        dot.classList.remove('cursor--hide');
        outline.classList.remove('cursor-outline--hide');
        // Resume animation when cursor is visible
        if (!rafId) {
            rafId = requestAnimationFrame(loop);
        }
    });
    
    // Optimized hover effects with event delegation
    const hoverSelectors = ['a', 'button', '.connect-btn', '.figma-btn', '.learn-more', '.carousel-nav', '.carousel-card', '.contact-method', '.submit-btn', '.logo-circle'];
    
    // Use event delegation for better performance
    document.addEventListener('mouseenter', (e) => {
        if (hoverSelectors.some(selector => e.target.matches(selector) || e.target.closest(selector))) {
            dot.classList.add('cursor--hover');
            outline.classList.add('cursor-outline--hover');
        }
    }, true);
    
    document.addEventListener('mouseleave', (e) => {
        if (hoverSelectors.some(selector => e.target.matches(selector) || e.target.closest(selector))) {
            dot.classList.remove('cursor--hover');
            outline.classList.remove('cursor-outline--hover');
        }
    }, true);
    
    // Clean up on unload
    window.addEventListener('beforeunload', () => {
        if (rafId) cancelAnimationFrame(rafId);
        if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
    });
})();

// Interactive Flying Bug - Optimized for Performance
(function initFlyingBug() {
    // Disable on mobile devices for better performance
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) return; // Skip bug animation on mobile
    
    const bug = document.createElement('div');
    bug.className = 'flying-bug';
    document.body.appendChild(bug);
    
    let bugX = Math.random() * window.innerWidth;
    let bugY = Math.random() * window.innerHeight;
    let targetX = bugX;
    let targetY = bugY;
    let mouseX = 0;
    let mouseY = 0;
    let isCaught = false;
    let respawnTimer = null;
    let animationId = null;
    let lastUpdate = 0;
    const FPS_LIMIT = 30; // Limit to 30 FPS instead of 60 for better performance
    const frameDelay = 1000 / FPS_LIMIT;
    
    // Update bug position - Optimized
    function updateBug(currentTime) {
        if (isCaught) return;
        
        // Throttle animation to 30 FPS
        if (currentTime - lastUpdate < frameDelay) {
            animationId = requestAnimationFrame(updateBug);
            return;
        }
        lastUpdate = currentTime;
        
        // Simplified movement calculation
        const dx = targetX - bugX;
        const dy = targetY - bugY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Less frequent target changes for better performance
        if (distance < 50 || Math.random() < 0.005) { // Reduced frequency
            targetX = Math.random() * (window.innerWidth - 100) + 50;
            targetY = Math.random() * (window.innerHeight - 100) + 50;
        }
        
        // Simplified cursor avoidance
        const cursorDx = mouseX - bugX;
        const cursorDy = mouseY - bugY;
        const cursorDistance = Math.sqrt(cursorDx * cursorDx + cursorDy * cursorDy);
        
        if (cursorDistance < 80) {
            targetX = bugX - cursorDx;
            targetY = bugY - cursorDy;
            targetX = Math.max(50, Math.min(window.innerWidth - 50, targetX));
            targetY = Math.max(50, Math.min(window.innerHeight - 50, targetY));
        }
        
        // Smoother, less intensive movement
        bugX += (targetX - bugX) * 0.015; // Reduced from 0.02
        bugY += (targetY - bugY) * 0.015;
        
        // Reduced random movement
        bugX += (Math.random() - 0.5) * 1; // Reduced from 2
        bugY += (Math.random() - 0.5) * 1;
        
        // Keep within bounds
        bugX = Math.max(20, Math.min(window.innerWidth - 20, bugX));
        bugY = Math.max(20, Math.min(window.innerHeight - 20, bugY));
        
        // Use transform instead of left/top for better performance
        bug.style.transform = `translate(${bugX}px, ${bugY}px)`;
        
        animationId = requestAnimationFrame(updateBug);
    }
    
    // Throttled mouse tracking
    let mouseTrackingTimeout = null;
    document.addEventListener('mousemove', (e) => {
        if (mouseTrackingTimeout) return; // Throttle mouse events
        
        mouseTrackingTimeout = setTimeout(() => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Check if cursor is close enough to catch bug
            if (!isCaught) {
                const dx = mouseX - bugX;
                const dy = mouseY - bugY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 25) {
                    catchBug();
                }
            }
            mouseTrackingTimeout = null;
        }, 16); // ~60fps throttle for mouse events
    });
    
    // Catch the bug
    function catchBug() {
        if (isCaught) return;
        
        isCaught = true;
        bug.classList.add('caught');
        
        // Show catch notification
        showBugCatchNotification();
        
        // Stop animation
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        // Respawn after delay
        respawnTimer = setTimeout(() => {
            bug.classList.remove('caught');
            bugX = Math.random() * window.innerWidth;
            bugY = Math.random() * window.innerHeight;
            targetX = bugX;
            targetY = bugY;
            isCaught = false;
            
            // Restart animation
            animationId = requestAnimationFrame(updateBug);
        }, 3000);
    }
    
    // Optimized notification
    function showBugCatchNotification() {
        const notification = document.createElement('div');
        notification.textContent = '🐛 Nice catch! The bug will respawn soon...';
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-blue);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            z-index: 10001;
            animation: slideDown 0.3s ease-out;
            box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 1500); // Shorter display time
    }
    
    // Start animation with performance monitoring
    animationId = requestAnimationFrame(updateBug);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        bugX = Math.min(bugX, window.innerWidth - 20);
        bugY = Math.min(bugY, window.innerHeight - 20);
    });
    
    // Clean up on unload
    window.addEventListener('beforeunload', () => {
        if (respawnTimer) clearTimeout(respawnTimer);
        if (animationId) cancelAnimationFrame(animationId);
        if (mouseTrackingTimeout) clearTimeout(mouseTrackingTimeout);
    });
    
    // Pause animation when tab is not visible (Performance boost)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        } else if (!isCaught) {
            animationId = requestAnimationFrame(updateBug);
        }
    });
})();

// Interactive Skills Section
document.addEventListener('DOMContentLoaded', function() {
    const logoCircle = document.getElementById('logoCircle');
    const skillsText = document.getElementById('skillsText');
    const skillsRevealContainer = document.getElementById('skillsRevealContainer');
    
    if (!logoCircle || !skillsText || !skillsRevealContainer) {
        console.log('Skills elements not found');
        return;
    }
    
    let isAnimated = false;
    
    // Handle logo circle click
    logoCircle.addEventListener('click', function() {
        if (isAnimated) {
            // Hide skills if already shown
            hideSkills();
        } else {
            // Show skills if hidden
            showSkills();
        }
    });
    
    function showSkills() {
        isAnimated = true;
        
        // Step 1: Fade out logo
        logoCircle.classList.add('fade-out');
        
        // Step 2: Change text after 250ms
        setTimeout(function() {
            skillsText.classList.add('text-change');
            
            // Change text content
            setTimeout(function() {
                const textElement = skillsText.querySelector('p');
                if (textElement) {
                    const isEnglish = document.documentElement.lang === 'en';
                    textElement.textContent = isEnglish ? 'Skills & Tools' : 'المهارات والأدوات';
                    textElement.style.transform = 'translateY(0)';
                    textElement.style.opacity = '1';
                }
            }, 250);
        }, 250);
        
        // Step 3: Reveal skills container after 800ms
        setTimeout(function() {
            skillsRevealContainer.classList.add('revealed');
            
            // Animate circular progress bars
            setTimeout(function() {
                animateProgressBars();
            }, 500);
        }, 800);
    }
    
    function hideSkills() {
        // Step 1: Hide skills container immediately
        skillsRevealContainer.classList.remove('revealed');
        
        // Reset progress bars
        const progressRings = document.querySelectorAll('.progress-ring-fill');
        progressRings.forEach(function(ring) {
            ring.style.strokeDashoffset = '220';
        });
        
        // Step 2: Show logo back immediately and change text
        logoCircle.classList.remove('fade-out');
        
        setTimeout(function() {
            skillsText.classList.remove('text-change');
            
            const textElement = skillsText.querySelector('p');
            if (textElement) {
                const isEnglish = document.documentElement.lang === 'en';
                textElement.textContent = isEnglish ? 'That is my logo' : 'هذا هو شعاري';
                textElement.style.transform = 'translateY(0)';
                textElement.style.opacity = '1';
            }
            
            isAnimated = false;
        }, 300);
    }
    
    function animateProgressBars() {
        const circularSkills = document.querySelectorAll('.circular-skill');
        
        circularSkills.forEach(function(skill, index) {
            const percentage = parseInt(skill.dataset.percentage);
            const progressRing = skill.querySelector('.progress-ring-fill');
            
            if (progressRing) {
                // Calculate stroke-dashoffset based on percentage
                const circumference = 2 * Math.PI * 35; // radius = 35
                const offset = circumference - (percentage / 100) * circumference;
                
                setTimeout(function() {
                    progressRing.style.strokeDashoffset = offset;
                }, index * 200); // Stagger animation
            }
        });
    }
    
    // Handle language changes
    function updateSkillsText() {
        const textElement = skillsText.querySelector('p');
        if (textElement && isAnimated) {
            const isEnglish = document.documentElement.lang === 'en';
            textElement.textContent = isEnglish ? 'Skills & Tools' : 'المهارات والأدوات';
        }
    }
    
    // Listen for language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            setTimeout(updateSkillsText, 100);
        });
    }
});