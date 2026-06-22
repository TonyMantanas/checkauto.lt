/* ==========================================================================
   main.js - Core interactions for checkauto.lt
   
   Handles:
   1. Mobile navigation toggle (hamburger → full-screen overlay)
   2. Copy-to-clipboard button
   3. Sticky header scroll behavior
   4. Scroll hint auto-hide
   5. Contact form submission
   
   No dependencies. Minimal footprint. Vanilla JS.
   ========================================================================== */

(function () {
  'use strict';

  const CONTACT_FORM_ENDPOINT = 'https://ddhhhieitupjixynjrry.supabase.co/functions/v1/send-email';
  const CONTACT_FORM_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkaGhoaWVpdHVwaml4eW5qcnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNDAyOTQsImV4cCI6MjA5NzcxNjI5NH0.PXAxGc3TSFUnbcyWdizhkiJkKqJlqD1Ic8PHAjHSFIc';

  const CONTACT_FORM_MESSAGES = {
    lt: {
      sending: 'Siunčiama...',
      success: 'Užklausa išsiųsta. Atsakysime kaip įmanoma greičiau.',
      rateLimited: 'Išsiųsta per daug užklausų. Bandykite dar kartą vėliau.',
      error: 'Užklausos išsiųsti nepavyko. Bandykite dar kartą arba rašykite info@checkauto.lt.'
    },
    en: {
      sending: 'Sending...',
      success: 'Inquiry sent. We will respond as soon as possible.',
      rateLimited: 'Too many inquiries were sent. Please try again later.',
      error: 'The inquiry could not be sent. Please try again or email info@checkauto.lt.'
    }
  };

  function getActiveLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'lt';
  }

  function getContactMessage(key) {
    const lang = getActiveLang();
    return CONTACT_FORM_MESSAGES[lang][key] || CONTACT_FORM_MESSAGES.lt[key];
  }

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

    const scrollThreshold = 10;

    window.addEventListener('scroll', () => {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
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
     6. CONTACT FORM
     -------------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    const submitButton = form.querySelector('[data-contact-form-submit]');
    const submitLabel = form.querySelector('[data-contact-submit-label]');
    const status = form.querySelector('[data-contact-form-status]');

    function setStatus(type, message) {
      if (!status) return;
      status.textContent = message || '';
      status.classList.toggle('is-success', type === 'success');
      status.classList.toggle('is-error', type === 'error');
    }

    function setSubmitting(isSubmitting, idleLabel) {
      if (submitButton) submitButton.disabled = isSubmitting;
      if (submitLabel) {
        submitLabel.textContent = isSubmitting ? getContactMessage('sending') : idleLabel;
      }
    }

    form.addEventListener('input', () => {
      if (status && status.textContent) setStatus('', '');
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const idleLabel = submitLabel ? submitLabel.textContent : '';
      const formData = new FormData(form);
      const payload = {
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        phone: String(formData.get('phone') || '').trim(),
        inspectionType: String(formData.get('inspectionType') || '').trim(),
        vehicle: String(formData.get('vehicle') || '').trim(),
        vehicleLocation: String(formData.get('vehicleLocation') || '').trim(),
        preferredTime: String(formData.get('preferredTime') || '').trim(),
        listingUrl: String(formData.get('listingUrl') || '').trim(),
        message: String(formData.get('message') || '').trim(),
        website: String(formData.get('website') || '').trim(),
        pageUrl: window.location.href,
        language: getActiveLang()
      };

      setStatus('', '');
      setSubmitting(true, idleLabel);

      try {
        const response = await fetch(CONTACT_FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: CONTACT_FORM_ANON_KEY,
            Authorization: 'Bearer ' + CONTACT_FORM_ANON_KEY
          },
          body: JSON.stringify(payload)
        });

        if (response.status === 429) {
          throw new Error('rateLimited');
        }

        if (!response.ok) {
          throw new Error('Request failed');
        }

        form.reset();
        setStatus('success', getContactMessage('success'));
      } catch (error) {
        const messageKey = error instanceof Error && error.message === 'rateLimited'
          ? 'rateLimited'
          : 'error';
        setStatus('error', getContactMessage(messageKey));
      } finally {
        setSubmitting(false, idleLabel);
      }
    });
  }

  /* --------------------------------------------------------------------------
     INIT
     -------------------------------------------------------------------------- */
  function init() {
    initMobileNav();
    initCopyButtons();
    initHeaderScroll();
    initScrollHint();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
