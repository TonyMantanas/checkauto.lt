(function () {
  'use strict';

  var grid = document.querySelector('.gallery-grid');

  /* ---- Get current language ---- */
  function getLang() {
    return localStorage.getItem('checkauto-lang') || document.documentElement.lang || 'lt';
  }

  /* ---- Get i18n labels ---- */
  function getLabels(lang) {
    var labels = {
      lt: { seller: 'Pardavėjas sakė', found: 'Ką radome' },
      en: { seller: 'Seller said', found: 'What we found' }
    };
    return labels[lang] || labels.lt;
  }

  /* ---- Escape HTML to prevent XSS ---- */
  function esc(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  /* ---- Build a single card ---- */
  function buildCard(item, lang) {
    var t = item[lang] || item.lt;
    var labels = getLabels(lang);
    var article = document.createElement('article');
    article.className = 'gallery-card';
    article.setAttribute('data-category', item.category);

    article.innerHTML =
      '<div class="gallery-card-image">' +
        '<img src="' + esc(item.image) + '" alt="' + esc(t.title) + '" loading="lazy" width="800" height="500">' +
        '<span class="gallery-tag gallery-tag--' + esc(item.category) + '">' + esc(t.tag) + '</span>' +
      '</div>' +
      '<div class="gallery-card-body">' +
        '<h3 class="gallery-card-title">' + esc(t.title) + '</h3>' +
        '<div class="gallery-card-detail">' +
          '<span class="gallery-detail-label">' + esc(labels.seller) + '</span>' +
          '<p>' + esc(t.seller) + '</p>' +
        '</div>' +
        '<div class="gallery-card-detail">' +
          '<span class="gallery-detail-label gallery-detail-label--found">' + esc(labels.found) + '</span>' +
          '<p>' + esc(t.found) + '</p>' +
        '</div>' +
        '<div class="gallery-verdict">' + esc(t.verdict) + '</div>' +
      '</div>';

    return article;
  }

  /* ---- Render gallery from JSON ---- */
  function renderGallery(items) {
    var lang = getLang();
    grid.innerHTML = '';
    items.forEach(function (item) {
      grid.appendChild(buildCard(item, lang));
    });
    initFilters();
    initLightbox();
  }

  /* ---- Filters ---- */
  function initFilters() {
    var filters = document.querySelectorAll('.gallery-filter');
    var cards = document.querySelectorAll('.gallery-card');

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        filters.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        cards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---- Lightbox ---- */
  function initLightbox() {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;background:rgba(0,0,0,0.92);cursor:zoom-out;justify-content:center;align-items:center;';

    var closeBtn = document.createElement('button');
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.style.cssText = 'position:absolute;top:20px;right:20px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;line-height:1;';
    closeBtn.innerHTML = '&#10005;';

    var lbImg = document.createElement('img');
    lbImg.style.cssText = 'max-width:90vw;max-height:85vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.4);';

    overlay.appendChild(closeBtn);
    overlay.appendChild(lbImg);
    document.body.appendChild(overlay);

    function openLightbox(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || '';
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.gallery-card-image').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var img = el.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      });
    });

    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLightbox();
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.style.display === 'flex') closeLightbox();
    });
  }

  /* ---- Load JSON and render ---- */
  if (grid) {
    fetch('/data/gallery.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        renderGallery(data.items);

        /* Re-render when language changes */
        var observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (m) {
            if (m.attributeName === 'lang') {
              renderGallery(data.items);
            }
          });
        });
        observer.observe(document.documentElement, { attributes: true });
      })
      .catch(function (err) { console.error('Gallery JSON load error:', err); });
  }
})();
