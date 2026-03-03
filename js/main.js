/* ==========================================================================
   main.js - Core interactions for checkauto.lt
   
   Handles:
   1. Mobile navigation toggle (hamburger → full-screen overlay)
   2. Scroll reveal animations (IntersectionObserver)
   3. Contact form mock submission
   4. Sticky header scroll behavior
   
   No dependencies. Minimal footprint. Vanilla JS.
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. MOBILE NAVIGATION
     --------------------------------------------------------------------------
     Toggle body class .nav-open which controls the overlay visibility
     and hamburger-to-X animation via CSS.
     -------------------------------------------------------------------------- */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const body = document.body;
    const mobileLinks = document.querySelectorAll('.nav-mobile a');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
      body.classList.toggle('nav-open');
      const isOpen = body.classList.contains('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Uždaryti meniu' : 'Atidaryti meniu');
    });

    // Close nav when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Atidaryti meniu');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('nav-open')) {
        body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. SCROLL REVEAL
     --------------------------------------------------------------------------
     Uses IntersectionObserver to add .revealed class to .reveal elements
     when they enter the viewport. CSS handles the animation.
     -------------------------------------------------------------------------- */
  function initScrollReveal() {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Make everything visible immediately
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Only animate once
          }
        });
      },
      {
        threshold: 0.1,      // Trigger when 10% visible
        rootMargin: '0px 0px -40px 0px' // Slight offset for natural feel
      }
    );

    // Stagger observer: when a .reveal-stagger parent enters,
    // reveal ALL its .reveal children at once so CSS delays work properly.
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach(child => {
              child.classList.add('revealed');
              observer.unobserve(child); // Stop individual observer
            });
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    document.querySelectorAll('.reveal-stagger').forEach(el => staggerObserver.observe(el));
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     3. COPY EMAIL BUTTON
     --------------------------------------------------------------------------
     Copies email to clipboard and shows a brief checkmark confirmation.
     -------------------------------------------------------------------------- */
  function initCopyButtons() {
    document.querySelectorAll('.copy-btn[data-copy]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const text = btn.getAttribute('data-copy');
        navigator.clipboard.writeText(text).then(() => {
          btn.classList.add('copied');
          setTimeout(() => btn.classList.remove('copied'), 1500);
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. HEADER SCROLL BEHAVIOR
     --------------------------------------------------------------------------
     Subtle: adds a class when scrolled past a threshold for potential
     styling changes (e.g., shadow, reduced height).
     -------------------------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 10;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     5. SCROLL HINT
     --------------------------------------------------------------------------
     Hides the "žemyn" indicator once the user scrolls a little.
     -------------------------------------------------------------------------- */
  function initScrollHint() {
    const hint = document.querySelector('.scroll-hint');
    if (!hint) return;

    const hideAfter = 60; // px
    let hidden = false;

    window.addEventListener('scroll', () => {
      if (!hidden && window.scrollY > hideAfter) {
        hint.classList.add('hidden');
        hidden = true;
      } else if (hidden && window.scrollY <= hideAfter) {
        hint.classList.remove('hidden');
        hidden = false;
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     INIT
     -------------------------------------------------------------------------- */
  function init() {
    initMobileNav();
    initScrollReveal();
    initCopyButtons();
    initHeaderScroll();
    initScrollHint();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
