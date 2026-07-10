/* ============================================================
   script.js — Quality Tree Services Buffalo
   Parallax, Scroll Animations, Counter, GHL Form Loader
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- FOOTER YEAR ---- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===========================================================
     1. NAVBAR SCROLL EFFECT
     =========================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const onScroll = () => {
    // Scrolled style
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Floating CTA visibility
    const floatingCta = document.getElementById('floating-cta');
    if (floatingCta) {
      if (window.scrollY > 400) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ===========================================================
     2. HAMBURGER MENU
     =========================================================== */
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('nav-links');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('mobile-open');
    });
    // Close on link click
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('mobile-open');
      });
    });
  }

  /* ===========================================================
     3. PARALLAX EFFECT
     =========================================================== */
  const heroBg = document.getElementById('hero-bg-img');
  const parallaxInner1 = document.getElementById('parallax-inner-1');
  const parallaxInner2 = document.getElementById('parallax-inner-2');

  const parallaxBanner1 = document.getElementById('parallax-banner-1');
  const parallaxBanner2 = document.getElementById('parallax-banner-2');

  const applyParallax = () => {
    const scrollY = window.scrollY;

    // Hero parallax
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    }

    // Banner 1 parallax
    if (parallaxInner1 && parallaxBanner1) {
      const rect = parallaxBanner1.getBoundingClientRect();
      const offset = rect.top + scrollY;
      const parallaxOffset = (scrollY - offset + window.innerHeight) * 0.25;
      parallaxInner1.style.transform = `translateY(${parallaxOffset}px)`;
    }

    // Banner 2 parallax
    if (parallaxInner2 && parallaxBanner2) {
      const rect = parallaxBanner2.getBoundingClientRect();
      const offset = rect.top + scrollY;
      const parallaxOffset = (scrollY - offset + window.innerHeight) * 0.25;
      parallaxInner2.style.transform = `translateY(${parallaxOffset}px)`;
    }
  };
  window.addEventListener('scroll', applyParallax, { passive: true });
  applyParallax();

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
