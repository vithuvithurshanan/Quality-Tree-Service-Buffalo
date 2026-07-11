/* ============================================================
   script.js — Quality Tree Services Buffalo
   Parallax, Scroll Animations, Counter, GHL Form Loader
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- FOOTER YEAR ---- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===========================================================
     1 & 3. SCROLL EFFECTS & PARALLAX (OPTIMIZED)
     =========================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const floatingCta = document.getElementById('floating-cta');

  const heroBg = document.getElementById('hero-bg-img');
  const parallaxInner1 = document.getElementById('parallax-inner-1');
  const parallaxInner2 = document.getElementById('parallax-inner-2');
  const parallaxBanner1 = document.getElementById('parallax-banner-1');
  const parallaxBanner2 = document.getElementById('parallax-banner-2');

  let ticking = false;
  let banner1Offset = 0;
  let banner2Offset = 0;
  let sectionOffsets = [];

  const calculateLayout = () => {
    if (parallaxBanner1) banner1Offset = parallaxBanner1.getBoundingClientRect().top + window.scrollY;
    if (parallaxBanner2) banner2Offset = parallaxBanner2.getBoundingClientRect().top + window.scrollY;
    sectionOffsets = Array.from(sections).map(sec => ({
      id: sec.id,
      top: sec.getBoundingClientRect().top + window.scrollY
    }));
  };

  const updateScrollEffects = () => {
    const scrollY = window.scrollY;

    // 1. Navbar style
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // 2. Active link highlighting
    let current = '';
    sectionOffsets.forEach(sec => {
      if (scrollY >= sec.top - 120) {
        current = sec.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // 3. Floating CTA visibility
    if (floatingCta) {
      if (scrollY > 400) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    }

    // 4. Parallax
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
    if (parallaxInner1 && parallaxBanner1) {
      const parallaxOffset = (scrollY - banner1Offset + window.innerHeight) * 0.25;
      parallaxInner1.style.transform = `translateY(${parallaxOffset}px)`;
    }
    if (parallaxInner2 && parallaxBanner2) {
      const parallaxOffset = (scrollY - banner2Offset + window.innerHeight) * 0.25;
      parallaxInner2.style.transform = `translateY(${parallaxOffset}px)`;
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  };

  window.addEventListener('load', () => {
    calculateLayout();
    updateScrollEffects();
  }, { passive: true });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', calculateLayout, { passive: true });

  /* ===========================================================
     2. HAMBURGER MENU
     =========================================================== */

  /* ===========================================================
     4. HERO PARTICLES
     =========================================================== */
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.setProperty('--dur', `${4 + Math.random() * 6}s`);
      p.style.setProperty('--delay', `${Math.random() * 4}s`);
      p.style.opacity = (0.2 + Math.random() * 0.5).toFixed(2);
      p.style.width = p.style.height = `${2 + Math.random() * 4}px`;
      particlesContainer.appendChild(p);
    }
  }

  /* ===========================================================
     5. SCROLL REVEAL ANIMATIONS
     =========================================================== */
  // Add reveal class to elements
  const revealTargets = [
    { selector: '.service-card', cls: 'reveal' },
    { selector: '.why-card', cls: 'reveal' },
    { selector: '.gallery-item', cls: 'reveal' },
    { selector: '.info-card', cls: 'reveal' },
    { selector: '.section-header', cls: 'reveal' },
    { selector: '.about-img-col', cls: 'reveal-left' },
    { selector: '.about-content-col', cls: 'reveal-right' },
    { selector: '.service-areas', cls: 'reveal' },
    { selector: '.contact-form-wrap', cls: 'reveal-right' },
  ];

  revealTargets.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add(cls);
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Stagger delay for grid children
        const parent = el.parentElement;
        const siblings = [...parent.children].filter(c =>
          c.classList.contains('reveal') ||
          c.classList.contains('reveal-left') ||
          c.classList.contains('reveal-right')
        );
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = `${idx * 0.08}s`;
        el.classList.add('visible');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ===========================================================
     6. COUNTER ANIMATION
     =========================================================== */
  const statNums = document.querySelectorAll('.stat-num');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const start = performance.now();

    const step = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  /* ===========================================================
     7. GHL IFRAME LOADER
     =========================================================== */
  const ghlIframe = document.getElementById('inline-jBuZmVJrv9oq04ue7kUS');
  const fallback = document.getElementById('form-fallback');

  if (ghlIframe) {
    // GHL iframe is present — hide the fallback form
    if (fallback) fallback.style.display = 'none';
  } else {
    // No GHL iframe found — show fallback form
    if (fallback) fallback.style.display = 'block';
  }

  /* ===========================================================
     8. FALLBACK FORM SUBMISSION
     =========================================================== */
  const fallbackForm = document.getElementById('contact-fallback-form');
  if (fallbackForm) {
    fallbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('fallback-submit-btn');
      if (btn) {
        btn.textContent = '✅ Request Sent!';
        btn.style.background = 'linear-gradient(135deg, #1a7a22, #3a9944)';
        btn.disabled = true;
      }
      setTimeout(() => {
        if (btn) {
          btn.textContent = 'Send Request';
          btn.disabled = false;
          btn.style.background = '';
        }
        fallbackForm.reset();
      }, 4000);
    });
  }

  /* ===========================================================
     9. SMOOTH SCROLL FOR ALL ANCHOR LINKS
     =========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===========================================================
     10. MOUSE PARALLAX ON HERO CONTENT
     =========================================================== */
  const heroContent = document.getElementById('hero-content');
  const heroSection = document.getElementById('home');

  if (heroSection && heroContent) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY, currentTarget } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = ((clientX - left) / width - 0.5) * 20;
      const y = ((clientY - top) / height - 0.5) * 10;
      heroContent.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      heroContent.style.transform = 'translate(0, 0)';
    });
  }

  /* ===========================================================
     11. SERVICE CARD 3D TILT
     =========================================================== */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      // Only apply tilt after reveal animation is done
      if (!card.classList.contains('visible')) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('visible')) return;
      // Clear inline transform — let CSS hover handle the base state
      card.style.transform = '';
    });
  });

});
