document.addEventListener('DOMContentLoaded', () => {

  // --- Nav scroll effect ---
  const nav = document.querySelector('.nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastY = y;
  }, { passive: true });

  // --- Mobile menu ---
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- FAQ accordion ---
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const answer = item.querySelector('.faq__answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq__item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq__answer').style.maxHeight = '0';
      });

      // Open clicked if was closed
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // --- Scroll reveal ---
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));

  // --- Smooth scroll for nav links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      e.preventDefault();
      const target = document.querySelector(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Footer back to top ---
  const backToTop = document.querySelector('.footer__back');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Stagger service items ---
  document.querySelectorAll('.service-item.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  // --- Portfolio filter tabs ---
  const tabs = document.querySelectorAll('.portfolio__tab');
  const items = document.querySelectorAll('.portfolio__item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbVideo = document.getElementById('lightboxVideo');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose = document.getElementById('lightboxClose');
  const lbOverlay = lightbox ? lightbox.querySelector('.lightbox__overlay') : null;
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');

  let lbItems = [];
  let lbIndex = 0;

  function getVisibleItems() {
    return Array.from(document.querySelectorAll('.portfolio__item:not(.hidden)'));
  }

  function showLightbox(index) {
    if (!lightbox) return;
    lbItems = getVisibleItems();
    if (index < 0 || index >= lbItems.length) return;
    lbIndex = index;

    const item = lbItems[lbIndex];
    const isVideo = item.classList.contains('portfolio__item--video');
    const title = item.querySelector('.portfolio__item-title');

    lbImg.classList.remove('active');
    lbVideo.classList.remove('active');
    lbVideo.pause();
    lbVideo.removeAttribute('src');

    if (isVideo) {
      const vid = item.querySelector('video');
      if (vid) {
        lbVideo.src = vid.src;
        lbVideo.classList.add('active');
        lbVideo.play();
      }
    } else {
      const img = item.querySelector('img');
      if (img) {
        lbImg.src = img.src;
        lbImg.alt = img.alt || '';
        lbImg.classList.add('active');
      }
    }

    lbCaption.textContent = title ? title.textContent : '';
    lightbox.classList.add('open');
    lightbox.dataset.mode = 'portfolio';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lbVideo.pause();
    lbVideo.removeAttribute('src');
    lbImg.classList.remove('active');
    lbVideo.classList.remove('active');
    lightbox.classList.remove('open');
    lightbox.dataset.mode = '';
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    lbItems = getVisibleItems();
    let newIndex = lbIndex + dir;
    if (newIndex < 0) newIndex = lbItems.length - 1;
    if (newIndex >= lbItems.length) newIndex = 0;
    showLightbox(newIndex);
  }

  // Attach click to all portfolio items
  document.querySelectorAll('.portfolio__item').forEach(item => {
    item.addEventListener('click', () => {
      const allVisible = getVisibleItems();
      const idx = allVisible.indexOf(item);
      if (idx !== -1) showLightbox(idx);
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbOverlay) lbOverlay.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lbNext) lbNext.addEventListener('click', () => navigateLightbox(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // --- Lightbox for promo gallery ---
  const galleryItems = document.querySelectorAll('[data-lightbox-gallery]');
  let galleryList = [];
  let galleryIndex = 0;

  function showGalleryLightbox(index) {
    if (!lightbox) return;
    galleryList = Array.from(galleryItems);
    if (index < 0 || index >= galleryList.length) return;
    galleryIndex = index;

    const img = galleryList[galleryIndex].querySelector('img');
    if (!img) return;

    lbImg.classList.remove('active');
    lbVideo.classList.remove('active');
    lbVideo.pause();
    lbVideo.removeAttribute('src');

    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lbImg.classList.add('active');
    lbCaption.textContent = '';

    // Override navigation for gallery mode
    lbItems = [];
    lbIndex = -1;

    lightbox.classList.add('open');
    lightbox.dataset.mode = 'gallery';
    document.body.style.overflow = 'hidden';
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => showGalleryLightbox(i));
  });

  // Override nav for gallery mode
  if (lbPrev) {
    lbPrev.addEventListener('click', () => {
      if (lightbox.dataset.mode === 'gallery') {
        galleryIndex = (galleryIndex - 1 + galleryList.length) % galleryList.length;
        showGalleryLightbox(galleryIndex);
      }
    });
  }
  if (lbNext) {
    lbNext.addEventListener('click', () => {
      if (lightbox.dataset.mode === 'gallery') {
        galleryIndex = (galleryIndex + 1) % galleryList.length;
        showGalleryLightbox(galleryIndex);
      }
    });
  }

  // --- Touch swipe for lightbox ---
  let touchStartX = 0;
  let touchStartY = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (lightbox.dataset.mode === 'gallery') {
          if (dx < 0) { galleryIndex = (galleryIndex + 1) % galleryList.length; showGalleryLightbox(galleryIndex); }
          else { galleryIndex = (galleryIndex - 1 + galleryList.length) % galleryList.length; showGalleryLightbox(galleryIndex); }
        } else {
          if (dx < 0) navigateLightbox(1);
          else navigateLightbox(-1);
        }
      }
    }, { passive: true });
  }

});
