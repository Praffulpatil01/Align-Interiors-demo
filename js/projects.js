/**
 * Align Interiors / Align Architecture & Interiors
 * Projects Portfolio & Lightbox (Vanilla JS)
 */

(function () {
  'use strict';

  var currentFilteredProjects = [];
  var currentLightboxIndex = 0;
  var lastFocusedElement = null;

  function initProjects() {
    var galleryGrid = document.getElementById('projects-gallery-grid');
    var filterContainer = document.getElementById('project-filters');
    var lightbox = document.getElementById('project-lightbox');

    if (!galleryGrid) return;

    var projects = (window.ALIGN_DATA && window.ALIGN_DATA.projects) ? window.ALIGN_DATA.projects : [];
    currentFilteredProjects = projects.slice();

    // 1. Render Gallery Items
    function renderGallery(items) {
      galleryGrid.innerHTML = '';

      if (!items || items.length === 0) {
        var emptyEl = document.createElement('div');
        emptyEl.className = 'empty-state';
        emptyEl.innerHTML = [
          '<h3 class="empty-state-title">No projects currently listed in this category</h3>',
          '<p class="empty-state-text">Our studio frequently designs tailored spaces across Pune. Contact us to discuss your specific requirements or request custom portfolio folios.</p>',
          '<a href="#contact" class="btn btn-primary btn-sm">Enquire About This Category</a>'
        ].join('');
        galleryGrid.appendChild(emptyEl);
        return;
      }

      items.forEach(function (project, index) {
        var card = document.createElement('article');
        card.className = 'gallery-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'View details for ' + project.title);
        card.dataset.index = index;

        card.innerHTML = [
          '<div class="gallery-card-media">',
          '  <img src="' + project.image + '" alt="' + project.title + '" data-fallback="' + project.placeholder + '" loading="lazy" width="800" height="600">',
          '</div>',
          '<div class="gallery-card-body">',
          '  <span class="gallery-card-tag">' + (project.categoryLabel || project.category) + '</span>',
          '  <h3 class="gallery-card-title">' + project.title + '</h3>',
          '  <p class="gallery-card-caption">' + project.caption + '</p>',
          '  <span class="gallery-card-action">',
          '    View Project',
          '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
          '  </span>',
          '</div>'
        ].join('');

        function triggerOpen() {
          openLightbox(index, card);
        }

        card.addEventListener('click', triggerOpen);
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerOpen();
          }
        });

        galleryGrid.appendChild(card);
      });
    }

    // 2. Filter Handler
    if (filterContainer) {
      var filterButtons = filterContainer.querySelectorAll('.filter-btn');
      filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          filterButtons.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');

          var category = btn.getAttribute('data-filter');
          if (category === 'all') {
            currentFilteredProjects = projects.slice();
          } else {
            currentFilteredProjects = projects.filter(function (p) {
              return p.category === category;
            });
          }
          renderGallery(currentFilteredProjects);
        });
      });
    }

    // Initial render
    renderGallery(currentFilteredProjects);

    // 3. Lightbox Logic
    if (lightbox) {
      var closeBtn = lightbox.querySelector('.lightbox-close-btn');
      var prevBtn = lightbox.querySelector('.lightbox-prev');
      var nextBtn = lightbox.querySelector('.lightbox-next');
      var imgEl = lightbox.querySelector('.lightbox-img');
      var titleEl = lightbox.querySelector('.lightbox-title');
      var tagEl = lightbox.querySelector('.lightbox-tag');
      var captionEl = lightbox.querySelector('.lightbox-caption');

      function updateLightboxContent(idx) {
        if (!currentFilteredProjects[idx]) return;
        var item = currentFilteredProjects[idx];
        currentLightboxIndex = idx;

        imgEl.src = item.image;
        imgEl.alt = item.title;
        imgEl.setAttribute('data-fallback', item.placeholder);
        titleEl.textContent = item.title;
        tagEl.textContent = item.categoryLabel || item.category;
        captionEl.textContent = item.caption;

        // Toggle nav button visibility if only 1 project
        if (currentFilteredProjects.length <= 1) {
          if (prevBtn) prevBtn.style.display = 'none';
          if (nextBtn) nextBtn.style.display = 'none';
        } else {
          if (prevBtn) prevBtn.style.display = 'flex';
          if (nextBtn) nextBtn.style.display = 'flex';
        }
      }

      window.openLightbox = function (idx, triggerEl) {
        lastFocusedElement = triggerEl || document.activeElement;
        updateLightboxContent(idx);
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
      };

      function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
          lastFocusedElement.focus();
        }
      }

      function showNext() {
        var nextIdx = (currentLightboxIndex + 1) % currentFilteredProjects.length;
        updateLightboxContent(nextIdx);
      }

      function showPrev() {
        var prevIdx = (currentLightboxIndex - 1 + currentFilteredProjects.length) % currentFilteredProjects.length;
        updateLightboxContent(prevIdx);
      }

      if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
      if (nextBtn) nextBtn.addEventListener('click', showNext);
      if (prevBtn) prevBtn.addEventListener('click', showPrev);

      // Close if clicking outside dialog
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });

      // Keyboard controls (Escape, ArrowLeft/Right, and Tab trap)
      document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('is-open')) return;

        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowRight') {
          showNext();
        } else if (e.key === 'ArrowLeft') {
          showPrev();
        } else if (e.key === 'Tab') {
          var focusable = lightbox.querySelectorAll('button:not([style*="display: none"])');
          if (focusable.length > 0) {
            var first = focusable[0];
            var last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initProjects);
})();
