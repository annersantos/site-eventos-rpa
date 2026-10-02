/**
 * main.js — R.P.A Produções Eventos e Festas
 * Responsabilidades: header scroll, menu mobile, animações de entrada, nav ativa
 * Otimizado para performance em navegadores de celular
 */

(function () {
  'use strict';

  /* ── Header scroll & Nav Ativa com Throttling rAF ── */
  const header = document.getElementById('header');
  let scrollTicking = false;

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav();
    scrollTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(onScroll);
      scrollTicking = true;
    }
  }, { passive: true });

  onScroll(); // Execução inicial

  /* ── Menu mobile ────────────────────────────────────────── */
  const menuToggle  = document.getElementById('menu-toggle');
  const menuClose   = document.getElementById('menu-close');
  const mobileMenu  = document.getElementById('mobile-menu');
  const ham1        = document.getElementById('ham-1');
  const ham2        = document.getElementById('ham-2');
  const ham3        = document.getElementById('ham-3');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    ham1.style.transform = 'rotate(45deg) translate(5px, 5px)';
    ham2.style.opacity = '0';
    ham3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    ham1.style.transform = '';
    ham2.style.opacity = '';
    ham3.style.transform = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  /* ── Nav ativa conforme scroll ───────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY;
    let current   = '';

    sections.forEach(sec => {
      const top    = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  /* ── Animações de scroll (Intersection Observer) ─────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      el.classList.add('visible');
    });
  }

  /* ── Smooth scroll para hash interno ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', this.getAttribute('href'));
      }
    });
  });

})();
