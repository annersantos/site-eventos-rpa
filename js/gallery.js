/**
 * gallery.js — R.P.A Produções Eventos e Festas
 * Galeria com lightbox, navegação por teclado e fechamento por ESC
 */

(function () {
  'use strict';

  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const btnClose     = document.getElementById('lightbox-close');
  const btnPrev      = document.getElementById('lightbox-prev');
  const btnNext      = document.getElementById('lightbox-next');

  if (!lightbox || !galleryItems.length) return;

  // Monta array de imagens (suporta <picture> e <source srcset>)
  const images = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    const source = item.querySelector('source');
    return {
      src: source ? source.getAttribute('srcset') : (img ? img.getAttribute('src') : ''),
      alt: img ? img.getAttribute('alt') : '',
    };
  });

  let current = 0;

  function show(index) {
    current = (index + images.length) % images.length;
    lightboxImg.src = images[current].src;
    lightboxImg.alt = images[current].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function hide() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Retorna o foco ao item que abriu
    if (galleryItems[current]) {
      galleryItems[current].focus();
    }
  }

  // Click nas imagens
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => show(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(index);
      }
    });
  });

  // Navegação
  btnClose.addEventListener('click', hide);
  btnPrev.addEventListener('click', () => show(current - 1));
  btnNext.addEventListener('click', () => show(current + 1));

  // Click no fundo fecha
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) hide();
  });

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    switch (e.key) {
      case 'Escape':    hide(); break;
      case 'ArrowLeft': show(current - 1); break;
      case 'ArrowRight':show(current + 1); break;
    }
  });

})();
