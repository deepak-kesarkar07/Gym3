// script.js — menu toggle, year, and infinite carousel setup
document.addEventListener('DOMContentLoaded', function () {
  // set current year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = y;

  // mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('open');
    });
  }

  // Close nav when clicking outside or pressing Escape
  function closeNav(){
    if (navLinks && navLinks.classList.contains('open')){
      navLinks.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded','false');
    }
  }

  document.addEventListener('click', function(e){
    if (!navLinks) return;
    const withinNav = e.composedPath && e.composedPath().includes(navLinks);
    const withinToggle = e.composedPath && toggle && e.composedPath().includes(toggle);
    if (!withinNav && !withinToggle) closeNav();
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' || e.key === 'Esc') closeNav();
  });

  // Setup carousels for infinite scroll
  function setupCarousel(carousel){
    const track = carousel.querySelector('.track');
    if (!track) return;

    // capture original children and clone to make seamless loop
    const items = Array.from(track.children);
    if (items.length === 0) return;

    // duplicate once (append clones) so track is 2x long and animation can translate -50%
    items.forEach(node => track.appendChild(node.cloneNode(true)));

    // compute a sensible duration in seconds
    const baseSpeed = parseFloat(carousel.dataset.speed) || 18; // seconds-per-item-ish
    const originalCount = items.length;
    // duration scales with number of items so longer tracks scroll slower overall
    const duration = Math.max(8, originalCount * baseSpeed / 3);
    track.style.setProperty('--duration', duration + 's');
    track.style.animationDuration = duration + 's';

    // pause/resume on hover/focus
    carousel.addEventListener('mouseenter', ()=> track.style.animationPlayState = 'paused');
    carousel.addEventListener('mouseleave', ()=> track.style.animationPlayState = 'running');
    carousel.addEventListener('focusin', ()=> track.style.animationPlayState = 'paused');
    carousel.addEventListener('focusout', ()=> track.style.animationPlayState = 'running');
  }

  document.querySelectorAll('.carousel').forEach(setupCarousel);
});
