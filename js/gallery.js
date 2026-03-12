(function () {
  'use strict';

  /* ---- Filters ---- */
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

  /* ---- Lightbox ---- */
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
})();
