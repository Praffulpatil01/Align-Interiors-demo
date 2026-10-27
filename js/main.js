/**
 * Align Interiors / Align Architecture & Interiors
 * Main JavaScript (Vanilla JS - Single Page Website)
 */

(function () {
  'use strict';

  // 1. Dynamic Copyright Year
  function initCopyrightYear() {
    var yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // 2. Mobile Menu Navigation
  function initMobileMenu() {
    var toggleBtn = document.querySelector('.menu-toggle');
    var drawer = document.querySelector('.mobile-nav-drawer');
    var overlay = document.querySelector('.mobile-nav-overlay');
    var navLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !drawer || !overlay) return;

    function openMenu() {
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.classList.add('is-active');
      overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      var firstLink = drawer.querySelector('a, button');
      if (firstLink) firstLink.focus();
    }

    function closeMenu() {
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('is-active');
      overlay.classList.remove('is-active');
      document.body.style.overflow = '';
      toggleBtn.focus();
    }

    toggleBtn.addEventListener('click', function () {
      var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });

    // Trap focus inside drawer when active
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = drawer.querySelectorAll('a, button');
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // 3. Smooth In-Page Anchor Navigation with Header Offset
  function initSmoothAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#' || targetId === '#main-content') return;
        var targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          var headerOffset = 90;
          var elementPosition = targetElement.getBoundingClientRect().top;
          var offsetPosition = Math.max(0, elementPosition + window.pageYOffset - headerOffset);

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update active link in desktop and mobile nav
          document.querySelectorAll('.nav-link').forEach(function (nl) {
            nl.classList.remove('active');
          });
          document.querySelectorAll('.mobile-nav-link').forEach(function (mnl) {
            mnl.classList.remove('active');
          });

          if (this.classList.contains('nav-link') || this.classList.contains('mobile-nav-link')) {
            this.classList.add('active');
          }
        }
      });
    });
  }

  // 4. Highlight Nav Link on Scroll Spy
  function initScrollSpy() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-desktop .nav-link');
    var mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!sections.length) return;

    function onScroll() {
      var scrollY = window.pageYOffset;

      sections.forEach(function (current) {
        var sectionHeight = current.offsetHeight;
        var sectionTop = current.getBoundingClientRect().top + scrollY - 120;
        var sectionId = current.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(function (link) {
            var isMatch = link.getAttribute('href') === '#' + sectionId;
            link.classList.toggle('active', isMatch);
          });
          mobileLinks.forEach(function (link) {
            var isMatch = link.getAttribute('href') === '#' + sectionId;
            link.classList.toggle('active', isMatch);
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 5. Global Image Error Fallback Handler
  function initImageFallbacks() {
    document.addEventListener('error', function (event) {
      var target = event.target;
      if (target && target.tagName === 'IMG') {
        var fallback = target.getAttribute('data-fallback') || 'images/placeholders/hero-placeholder.svg';
        if (target.src !== fallback && !target.dataset.hasFallenBack) {
          target.dataset.hasFallenBack = 'true';
          target.src = fallback;
        }
      }
    }, true);
  }

  // 6. Intersection Observer for Scroll Reveals
  function initScrollObserver() {
    var revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // 7. Video Walkthrough Player Handler (Opens directly on YouTube to prevent 503/153 embed blocks)
  function initVideoModal() {
    var videoCards = document.querySelectorAll('.video-card[data-video-id], .video-facade-card[data-video-id]');
    if (!videoCards.length) return;

    videoCards.forEach(function (card) {
      var videoId = card.getAttribute('data-video-id');
      if (videoId) {
        var ytUrl = 'https://www.youtube.com/watch?v=' + videoId;
        card.setAttribute('href', ytUrl);
        card.setAttribute('target', '_blank');
        card.setAttribute('rel', 'noopener noreferrer');

        // Allow direct click and keyboard activation
        card.addEventListener('keydown', function (e) {
          if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            window.open(ytUrl, '_blank', 'noopener,noreferrer');
          }
        });
      }
    });
  }

  // Initialize all base behavior on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    initCopyrightYear();
    initMobileMenu();
    initSmoothAnchorScroll();
    initScrollSpy();
    initImageFallbacks();
    initScrollObserver();
    initVideoModal();
  });
})();
