/**
 * Personal Website JavaScript
 * Implements smooth scrolling, active link highlighting, mobile menu, and scroll reveal animations.
 */

// --- Experience Read More / Read Less ---
function toggleExpDetails(btn) {
    const list = btn.previousElementSibling;
    if (!list) return;

    if (list.classList.contains('collapsed')) {
        list.classList.remove('collapsed');
        list.classList.add('expanded');
        btn.classList.add('expanded');
        btn.innerHTML = 'Read Less <i class="fas fa-chevron-up"></i>';
    } else {
        list.classList.remove('expanded');
        list.classList.add('collapsed');
        btn.classList.remove('expanded');
        btn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
    }
}

// --- Lenis Smooth Scroll ---
let lenis = null;
try {
    lenis = new window.Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
    });

    function lenisRaf(time) {
        lenis.raf(time);
        requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);
} catch (e) {
    lenis = null;
}

// --- Page Loader & Hero Entrance ---
const loader = document.getElementById('loader');

function hideLoader() {
    if (!loader) return;
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger hero staggered entrance shortly after loader fades
    setTimeout(() => {
        document.body.classList.add('hero-ready');
    }, 300);
}

// Hide loader on full page load, with a 3s failsafe
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => setTimeout(hideLoader, 200));
setTimeout(hideLoader, 3000);

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // --- 2. Sticky Navbar & Active Link Highlighting ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinksDesktop = document.querySelectorAll('.nav-link');

    // --- 3. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                // Add delay if specified
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    setTimeout(() => {
                        entry.target.classList.add('is-revealed');
                    }, delay);
                } else {
                    entry.target.classList.add('is-revealed');
                }
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- 4. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (lenis) {
                    lenis.scrollTo(targetElement, {
                        offset: -80,
                        duration: 1.15,
                        easing: (t) => 1 - Math.pow(1 - t, 3),
                    });
                } else {
                    const headerOffset = 80;
                    const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // --- 5. Contact form (Web3Forms) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            const accessKey = contactForm.querySelector('input[name="access_key"]')?.value?.trim();

            if (!accessKey) {
                alert('Contact form is missing its access key. Check index.html.');
                return;
            }

            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            const formData = new FormData(contactForm);
            const payload = Object.fromEntries(formData.entries());

            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                const text = await res.text();
                let result;
                try {
                    result = JSON.parse(text);
                } catch {
                    throw new Error(
                        'The form service returned an invalid response. Free host URLs like *.vercel.app are often blocked by Web3Forms — try a custom domain or contact Web3Forms support.'
                    );
                }

                if (result.success) {
                    btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                    btn.classList.add('btn-success');
                    btn.style.backgroundColor = '#6D8196';
                    contactForm.reset();

                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                        btn.style.backgroundColor = '';
                        btn.classList.remove('btn-success');
                    }, 3000);
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (err) {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                const detail = err instanceof Error ? err.message : 'Unknown error';
                alert(
                    `Could not send your message.\n\n${detail}\n\nTip: Web3Forms often requires a custom domain on free hosts (not *.vercel.app). You can still use the email icon below.`
                );
            }
        });
    }

    // --- 6. Typing Effect ---
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const words = [
            "Analog & Mixed-Signal IC Design",
            "Power Electronics & Control",
            "VLSI & CMOS Tapeout",
            "M.S. ECE @ UC Davis",
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeSpeed = 100; // ms per character typing
        const deleteSpeed = 50; // ms per character deleting
        const pauseEnd = 2000; // ms to pause at end of word
        const pauseStart = 500; // ms to pause before typing next word

        function typeWriter() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                // Remove char
                typingElement.innerHTML = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Add char
                typingElement.innerHTML = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeDelay = isDeleting ? deleteSpeed : typeSpeed;

            // If word is complete
            if (!isDeleting && charIndex === currentWord.length) {
                typeDelay = pauseEnd;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // If word is fully deleted
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeDelay = pauseStart;
            }

            setTimeout(typeWriter, typeDelay);
        }

        setTimeout(typeWriter, 1000);
    }

    // --- 7. Skills View Toggle ---
    const skillsToggleBtn = document.getElementById('skills-toggle');
    const skillsToggleText = document.getElementById('skills-toggle-text');
    const skillsContainer = document.getElementById('skills-container');

    if (skillsToggleBtn && skillsContainer) {
        skillsToggleBtn.addEventListener('click', () => {
            if (skillsContainer.classList.contains('compact-view')) {
                // Switch to Grid view
                skillsContainer.classList.remove('compact-view');
                skillsContainer.classList.add('expanded-view');
                skillsToggleText.textContent = 'View: Compact';
                skillsToggleBtn.querySelector('i').className = 'fas fa-list';
            } else {
                // Switch to Compact view
                skillsContainer.classList.remove('expanded-view');
                skillsContainer.classList.add('compact-view');
                skillsToggleText.textContent = 'View: Grid';
                skillsToggleBtn.querySelector('i').className = 'fas fa-th-large';
            }
        });
    }

    // --- 8. Theme Toggle (default = dark on load; saved 'light' overrides) ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    const THEME_KEY = 'kamesh-portfolio-theme';

    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    } else {
        document.body.classList.add('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeBtn && themeIcon) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            let theme = 'light';
            if (document.body.classList.contains('dark-theme')) {
                theme = 'dark';
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            localStorage.setItem(THEME_KEY, theme);
        });
    }

    // --- 9. Scroll Text Reveal ---
    const revealTextElems = document.querySelectorAll('.scroll-reveal-text');
    revealTextElems.forEach(el => {
        // Simple word split, keeping spaces
        const text = el.innerText;
        const words = text.split(/(\s+)/);
        el.innerHTML = '';
        words.forEach(word => {
            if (word.trim() === '') {
                el.appendChild(document.createTextNode(word));
            } else {
                const span = document.createElement('span');
                span.innerText = word;
                span.classList.add('reveal-word');
                el.appendChild(span);
            }
        });
    });

    function highlightTextOnScroll() {
        const windowHeight = window.innerHeight;
        revealTextElems.forEach(el => {
            const rect = el.getBoundingClientRect();
            // We want the text to start revealing when the element enters the bottom 80% of the viewport,
            // and finish revealing when it reaches the top 40% of the viewport.
            const start = windowHeight * 0.85;
            const end = windowHeight * 0.35;

            let progress = (start - rect.top) / (start - end);
            progress = Math.max(0, Math.min(1, progress));

            const spans = el.querySelectorAll('.reveal-word');
            const revealCount = Math.floor(progress * spans.length);

            spans.forEach((span, index) => {
                if (index < revealCount) {
                    span.style.color = 'var(--text-primary)';
                    span.style.opacity = '1';
                } else {
                    span.style.color = 'var(--text-tertiary)';
                    span.style.opacity = '0.3';
                }
            });
        });
    }

    if (revealTextElems.length > 0) {
        highlightTextOnScroll();
    }

    // --- 10. Scroll Progress Bar + Back to Top ---
    const scrollProgressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    // --- 10b. Experience Timeline Progress + Active Item Highlight ---
    const expTimeline = document.querySelector('.exp-timeline');
    const expItems = document.querySelectorAll('.exp-item');

    function updateExperienceTimelineProgress() {
        if (!expTimeline) return;
        const timelineRect = expTimeline.getBoundingClientRect();
        const triggerLine = window.innerHeight * 0.55;
        const progress = ((triggerLine - timelineRect.top) / timelineRect.height) * 100;
        const clamped = Math.max(0, Math.min(100, progress));
        expTimeline.style.setProperty('--exp-progress', `${clamped}%`);

        // Light up dots as the line reaches them
        const progressPx = (clamped / 100) * timelineRect.height;
        expItems.forEach(item => {
            const dot = item.querySelector('.exp-dot');
            if (!dot) return;
            const dotRect = dot.getBoundingClientRect();
            const dotCenter = dotRect.top + dotRect.height / 2 - timelineRect.top;
            item.classList.toggle('dot-reached', progressPx >= dotCenter);
        });
    }

    if (expItems.length > 0) {
        const expObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('is-active', entry.isIntersecting);
            });
        }, { threshold: 0.45 });
        expItems.forEach(item => expObserver.observe(item));
        updateExperienceTimelineProgress();
        window.addEventListener('resize', updateExperienceTimelineProgress);
    }

    // --- CONSOLIDATED SCROLL HANDLER (single passive listener) ---
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Navbar
                if (navbar) {
                    navbar.classList.toggle('navbar-scrolled', scrollY > 50);
                }

                // Active link highlighting
                let current = '';
                sections.forEach(section => {
                    if (scrollY >= section.offsetTop - section.clientHeight / 3) {
                        current = section.getAttribute('id');
                    }
                });
                navLinksDesktop.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').includes(current));
                });
                mobileLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').includes(current));
                });

                // Scroll progress bar
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                if (scrollProgressBar && totalHeight > 0) {
                    scrollProgressBar.style.width = (scrollY / totalHeight) * 100 + '%';
                }

                // Back to top
                if (backToTopBtn) {
                    backToTopBtn.classList.toggle('visible', scrollY > 400);
                }

                // Text reveal
                if (revealTextElems.length > 0) highlightTextOnScroll();

                // Experience timeline
                updateExperienceTimelineProgress();

                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // --- 11. 3D Tilt Effect on Glass Cards ---
    const tiltCards = document.querySelectorAll('.glass-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease';
        });
    });

    // --- 12. Button Ripple Effect ---
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.25);
                transform: scale(0);
                animation: rippleEffect 0.65s ease-out forwards;
                pointer-events: none;
            `;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    // --- 13. Staggered Skill Card Entrance ---
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const cards = entry.target.querySelectorAll('.skill-card');
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, i * 55);
            });
            skillRevealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    skillCategories.forEach(cat => {
        const cards = cat.querySelectorAll('.skill-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(18px)';
            card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        });
        skillRevealObserver.observe(cat);
    });

    // --- 14. Count-Up Animation ---
    const countUps = document.querySelectorAll('.count-up');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseFloat(el.dataset.target);
            const decimals = parseInt(el.dataset.decimals || 0);
            const duration = 1400;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = (eased * target).toFixed(decimals);
                if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
            countObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    countUps.forEach(el => countObserver.observe(el));

    // --- 15. Project Card Mouse Spotlight ---
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const front = card.querySelector('.project-card-front');
            if (!front) return;
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            front.style.setProperty('--mouse-x', x + '%');
            front.style.setProperty('--mouse-y', y + '%');
        });
    });

    // --- 16. Mouse Follower Animation ---
    const follower = document.getElementById('mouse-follower');
    const followerDot = document.getElementById('mouse-follower-dot');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (follower && followerDot && supportsFinePointer && !prefersReducedMotion) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            follower.style.opacity = '1';
            followerDot.style.opacity = '1';
        });

        window.addEventListener('mouseleave', () => {
            follower.style.opacity = '0';
            followerDot.style.opacity = '0';
        });

        const animateFollower = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            follower.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            followerDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateFollower);
        };
        requestAnimationFrame(animateFollower);
    }


});
