/* ==========================================================================
   i18n.js - Internationalization system for checkauto.lt
   
   Translations are loaded from /lang/*.json files. Language switcher
   persists the choice to localStorage.
   
   No dependencies. No build step. Pure vanilla JS.
   ========================================================================== */

(function () {
  'use strict';

  const DEFAULT_LANG = 'lt';
  const SUPPORTED_LANGS = ['lt', 'en'];

  /** Cache for loaded translations */
  const translations = {};

  /**
   * Resolve a dot-notation key against a nested object.
   */
  function resolve(obj, path) {
    return path.split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : null;
    }, obj);
  }

  /**
   * Apply translations to all elements with [data-i18n] on the page.
   * Skips elements that have child elements (to preserve inner HTML like <span>).
   */
  function applyTranslations(data) {
    if (!data) return;

    // Standard text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = resolve(data, key);
      if (value !== null) {
        // Only set textContent if element has no child elements to preserve
        if (el.children.length === 0) {
          el.textContent = value;
        } else {
          // Preserve child elements - only update text nodes
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
          const textNodes = [];
          let node;
          while (node = walker.nextNode()) {
            if (node.parentElement === el) textNodes.push(node);
          }
          // For elements with mixed content, just update first/last text nodes
          // This handles cases like "Su check<span>auto</span>.lt"
          if (textNodes.length > 0) {
            const parts = value.split('checkauto');
            if (parts.length === 2 && el.querySelector('.logo-accent')) {
              textNodes[0].textContent = parts[0] + 'check';
              if (textNodes.length > 1) textNodes[textNodes.length - 1].textContent = '.lt';
            }
          }
        }
      }
    });

    // Placeholders for inputs/textareas
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const value = resolve(data, key);
      if (value !== null) el.setAttribute('placeholder', value);
    });

    // Aria labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const value = resolve(data, key);
      if (value !== null) el.setAttribute('aria-label', value);
    });
  }

  /**
   * Update the visual state of language dropdown.
   */
  function updateSwitcherUI(lang) {
    document.querySelectorAll('.lang-dropdown').forEach(dropdown => {
      dropdown.setAttribute('data-active-lang', lang);
      dropdown.querySelectorAll('.lang-dropdown-menu li').forEach(li => {
        li.classList.toggle('active', li.getAttribute('data-lang') === lang);
      });
    });
  }

  /**
   * Load translations for a language from JSON file.
   * Returns cached data if already loaded.
   */
  function loadTranslations(lang) {
    if (translations[lang]) {
      return Promise.resolve(translations[lang]);
    }
    return fetch('/lang/' + lang + '.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        translations[lang] = data;
        return data;
      });
  }

  /**
   * Set the active language, persist to localStorage, and re-render all text.
   */
  function setLanguage(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) return;
    loadTranslations(lang).then(function (data) {
      applyTranslations(data);
      updateSwitcherUI(lang);
      localStorage.setItem('checkauto-lang', lang);
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.classList.remove('i18n-loading');
    });
  }

  /**
   * Initialize the i18n system.
   */
  function init() {
    const savedLang = localStorage.getItem('checkauto-lang') || DEFAULT_LANG;
    document.documentElement.setAttribute('lang', savedLang);
    setLanguage(savedLang);

    // Bind language dropdown
    document.querySelectorAll('.lang-dropdown').forEach(dropdown => {
      const toggle = dropdown.querySelector('.lang-dropdown-toggle');
      const menu = dropdown.querySelector('.lang-dropdown-menu');

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other dropdowns
        document.querySelectorAll('.lang-dropdown.open').forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('open');
            d.querySelector('.lang-dropdown-toggle').setAttribute('aria-expanded', 'false');
          }
        });
        dropdown.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(dropdown.classList.contains('open')));
      });

      menu.querySelectorAll('li[data-lang]').forEach(li => {
        li.addEventListener('click', () => {
          const lang = li.getAttribute('data-lang');
          if (lang) setLanguage(lang);
          dropdown.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.lang-dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.querySelector('.lang-dropdown-toggle').setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.checkautoI18n = { setLanguage };
})();
