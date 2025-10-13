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

// Observe elements for animation (simplified on mobile)
document.addEventListener('DOMContentLoaded', () => {
    // On mobile, only animate section titles for better performance
    const selector = window.innerWidth <= 768 
        ? '.section-title' 
        : '.section-title, .project-card, .skill-item, .contact-info, .contact-form';
    
    const animatedElements = document.querySelectorAll(selector);
    
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

// Floating Cubes Animation Enhancement (disabled on mobile for performance)
function enhanceFloatingCubes() {
    // Skip on mobile devices for better performance
    if (window.innerWidth <= 768) return;
    
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

// Parallax Effect for Background Elements (disabled on mobile for performance)
function initParallax() {
    // Skip parallax on mobile devices for better performance
    if (window.innerWidth <= 768) return;
    
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
    
    // Skip heavy animations on mobile for better performance
    if (window.innerWidth > 768) {
        // Add smooth reveal animation for sections (desktop only)
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
    } else {
        // On mobile, show sections immediately without animation
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }
});

// Add hover effects for interactive elements (disabled on mobile for performance)
document.addEventListener('DOMContentLoaded', () => {
    // Skip hover effects on mobile devices
    if (window.innerWidth <= 768) return;
    
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

// Script for Show All Projects button (robust + CSS-driven)
(function initProjectVisibilityToggle() {
    const showAllBtn = document.getElementById('showAllProjectsBtn');
    const showLessBtn = document.getElementById('showLessProjectsBtn');
    const projectsGrid = document.querySelector('.projects-grid');

    if (!projectsGrid || !showAllBtn || !showLessBtn) return;

    showAllBtn.addEventListener('click', () => {
        projectsGrid.classList.add('show-all');
        showAllBtn.style.display = 'none';
        showLessBtn.style.display = 'block';
    });

    showLessBtn.addEventListener('click', () => {
        projectsGrid.classList.remove('show-all');
        showAllBtn.style.display = 'block';
        showLessBtn.style.display = 'none';
        // Scroll to the top of the projects section for better UX
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
})();

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

// Custom cursor removed for better performance

// Flying bug removed for better performance

// Interactive skills section removed for better performance