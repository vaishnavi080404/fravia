// shared across every page - nav, floating bar, drawer, whatsapp widget, faq

const nav = document.querySelector('.site-nav');
const floatBar = document.querySelector('.float-bar');

function onScroll() {
  const y = window.scrollY;
  if (nav) nav.classList.toggle('solid', y > 80);
  if (floatBar) floatBar.classList.toggle('show', y > window.innerHeight * 0.7);
}
window.addEventListener('scroll', onScroll);
onScroll();

// mobile nav drawer
const burger = document.querySelector('.nav-burger');
const drawer = document.querySelector('.nav-drawer');
const drawerClose = document.querySelector('.nav-drawer-close');
if (burger && drawer) {
  burger.addEventListener('click', () => drawer.classList.add('open'));
  drawerClose.addEventListener('click', () => drawer.classList.remove('open'));
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));
}

// whatsapp quick menu
const waFab = document.querySelector('.wa-fab');
const waMenu = document.querySelector('.wa-menu');
if (waFab && waMenu) {
  waFab.addEventListener('click', () => {
    waMenu.classList.toggle('open');
    waFab.classList.remove('clicked');
    void waFab.offsetWidth; // restart the click animation even on rapid clicks
    waFab.classList.add('clicked');
    setTimeout(() => waFab.classList.remove('clicked'), 900);
  });
  document.addEventListener('click', (e) => {
    if (!waMenu.contains(e.target) && !waFab.contains(e.target)) waMenu.classList.remove('open');
  });
}

// faq accordion - reused on services.html and book.html
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (!q || !a) return;
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // close siblings so only one is open at a time
    item.parentElement.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// hero slideshow - cycles the ken-burns frames + gentle parallax on move/scroll
(function () {
  const slidesWrap = document.getElementById('heroSlides');
  const heroSection = document.getElementById('heroSection');
  if (!slidesWrap || !heroSection) return;

  const slides = slidesWrap.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    let active = 0;
    setInterval(() => {
      slides[active].classList.remove('is-active');
      active = (active + 1) % slides.length;
      slides[active].classList.add('is-active');
    }, 5200);
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && window.innerWidth > 720) {
    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    heroSection.addEventListener('mousemove', (e) => {
      const r = heroSection.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 22;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 14;
    });
    function tick() {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      slidesWrap.style.transform = `translate(${curX}px, ${curY}px)`;
      requestAnimationFrame(tick);
    }
    tick();
  }
})();

// brand intro - typewriter reveal that scales into a soft watermark, then clears
(function () {
  const intro = document.getElementById('brandIntro');
  if (!intro) return;

  const textEl = document.getElementById('brandIntroText');
  const word = 'FRAVIA';
  const seen = sessionStorage.getItem('fravia_intro_seen');
  const html = document.documentElement;
  html.classList.add('intro-lock');

  function finish() {
    html.classList.remove('intro-lock');
    intro.classList.add('fade-out');
    setTimeout(() => intro.remove(), 750);
  }

  if (seen) {
    // already saw the full reveal this session - quick version only
    textEl.textContent = word;
    intro.classList.add('quick');
    requestAnimationFrame(() => {
      setTimeout(() => intro.classList.add('grow'), 60);
    });
    setTimeout(finish, 620);
    return;
  }

  sessionStorage.setItem('fravia_intro_seen', '1');
  textEl.innerHTML = word.split('').map((c, i) => `<span class="ch" style="animation-delay:${i * 0.09}s">${c}</span>`).join('');
  const typeDuration = word.length * 90 + 380;
  setTimeout(() => intro.classList.add('grow'), typeDuration);
  setTimeout(finish, typeDuration + 950);
})();
