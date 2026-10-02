/**
 * animations.js — R.P.A Produções Eventos e Festas
 * Responsabilidades (otimizado para alta performance mobile):
 *  - Barra de progresso de rolagem com throttling via rAF
 *  - Lazy loading de imagens
 *  - Contadores animados ao entrar em viewport
 *  - Parallax leve no hero (apenas telas desktop/tablet >= 768px)
 *  - Partículas flutuantes dinâmicas (apenas telas desktop >= 768px)
 *  - Stagger reveal aprimorado para grids de cards
 *  - Animação de tipagem no hero
 */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  /* ── 1. BARRA DE PROGRESSO DE ROLAGEM ───────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    let progressTicking = false;
    function updateProgress() {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
      progressTicking = false;
    }
    window.addEventListener('scroll', function () {
      if (!progressTicking) {
        requestAnimationFrame(updateProgress);
        progressTicking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  /* ── 2. LAZY LOADING COM BLUR → NÍTIDO ──────────────────── */
  const lazyImages = document.querySelectorAll('img[data-src]');

  if (lazyImages.length) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;

        function finishLoad() {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.remove('lazy-loading');
          img.classList.add('lazy-loaded');
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        }

        if (img.complete && img.naturalWidth > 0) {
          finishLoad();
        } else {
          img.classList.add('lazy-loading');
          const tempImg = new Image();
          tempImg.onload = finishLoad;
          tempImg.onerror = finishLoad;
          tempImg.src = img.dataset.src || img.src;
          if (tempImg.complete) {
            finishLoad();
          }
        }

        imgObserver.unobserve(img);
      });
    }, { rootMargin: '300px 0px', threshold: 0 });

    lazyImages.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('lazy-loaded');
      } else {
        imgObserver.observe(img);
      }
    });
  }

  /* ── 3. CONTADORES ANIMADOS ──────────────────────────────── */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const duration = parseInt(el.dataset.duration || 1800);
    const isFloat  = el.dataset.float === 'true';
    const suffix   = el.dataset.suffix || '';
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = eased * target;
      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ── 4. PARALLAX LEVE NO HERO (Somente telas >= 768px) ────── */
  if (!prefersReduced && !isMobile) {
    const heroSection = document.getElementById('hero');
    const heroImg     = document.querySelector('.hero-main-image');

    if (heroSection && heroImg) {
      let parallaxTicking = false;
      window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
          requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight * 1.5) {
              heroImg.style.transform = 'translateY(' + (scrollY * 0.1) + 'px)';
            }
            parallaxTicking = false;
          });
          parallaxTicking = true;
        }
      }, { passive: true });
    }
  }

  /* ── 5. PARTÍCULAS FLUTUANTES DINÂMICAS (Somente telas >= 768px) ── */
  if (!prefersReduced && !isMobile) {
    const particleContainer = document.getElementById('hero-particles');
    if (particleContainer) {
      const emojis = ['🎈', '🎉', '⭐', '🎊', '✨', '🌟', '🎀', '🎂', '🌈', '💫'];
      const count  = 12;

      for (let i = 0; i < count; i++) {
        const span       = document.createElement('span');
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.className   = 'hero-particle';

        const size  = 0.9 + Math.random() * 1.4;
        const left  = Math.random() * 100;
        const delay = Math.random() * 8;
        const dur   = 5 + Math.random() * 7;
        const top   = 5 + Math.random() * 90;

        span.style.cssText = [
          'position:absolute',
          'left:' + left + '%',
          'top:' + top + '%',
          'font-size:' + size + 'rem',
          'opacity:' + (0.25 + Math.random() * 0.45),
          'animation:particleFloat ' + dur + 's ease-in-out ' + delay + 's infinite',
          'pointer-events:none',
          'user-select:none',
          'will-change:transform'
        ].join(';');

        particleContainer.appendChild(span);
      }
    }
  }

  /* ── 6. STAGGER REVEAL PARA GRIDS ───────────────────────── */
  if (!prefersReduced) {
    const grids = document.querySelectorAll('[data-stagger-grid]');
    grids.forEach(function(grid) {
      const children = Array.from(grid.children);
      children.forEach(function(child, i) {
        child.style.transitionDelay = (i * 80) + 'ms';
        child.classList.add('reveal');
      });
    });
  }

  /* ── 7. ANIMAÇÃO DE TIPAGEM NO SUBTÍTULO HERO ───────────── */
  if (!prefersReduced) {
    const typeEl = document.getElementById('hero-typewriter');
    if (typeEl) {
      const words   = typeEl.dataset.words ? typeEl.dataset.words.split('|') : [];
      let wi = 0, ci = 0, deleting = false;

      function typeLoop() {
        const word    = words[wi % words.length];
        const display = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
        typeEl.textContent = display;

        let delay = deleting ? 60 : 100;
        if (!deleting && ci > word.length)  { delay = 1800; deleting = true; }
        if (deleting && ci < 0)             { delay = 400;  deleting = false; wi++; ci = 0; }
        setTimeout(typeLoop, delay);
      }
      if (words.length) typeLoop();
    }
  }

  /* ── 8. RIPPLE NOS BOTÕES AO CLICAR ─────────────────────── */
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-whatsapp').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      if (prefersReduced) return;
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = [
        'width:' + size + 'px',
        'height:' + size + 'px',
        'left:' + (e.clientX - rect.left - size / 2) + 'px',
        'top:' + (e.clientY - rect.top - size / 2) + 'px'
      ].join(';');
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function() { ripple.remove(); });
    });
  });

})();
