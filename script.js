/**
 * PORTFOLIO — script.js
 * Handles: navbar scroll, hamburger menu, scroll reveal,
 *          active nav links, contact form, back-to-top, footer year
 */

/* ── DOM References ── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu= document.getElementById('mobileMenu');
const navLinks  = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');
const revealEls = document.querySelectorAll('.reveal');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const backTop   = document.getElementById('backTop');
const yearSpan  = document.getElementById('year');

/* ── Footer year ── */
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

/* ============================================================
   NAVBAR — scroll shadow + active link highlight
   ============================================================ */
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  const scrollY = window.scrollY;

  /* Navbar shadow */
  navbar.classList.toggle('scrolled', scrollY > 30);

  /* Back-to-top visibility */
  backTop.classList.toggle('visible', scrollY > 400);

  /* Active nav link based on scroll position */
  let currentSection = '';
  sections.forEach(sec => {
    const secTop = sec.offsetTop - 100;
    if (scrollY >= secTop) currentSection = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* Close mobile menu when a link is clicked */
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* Close mobile menu on outside click */
document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ============================================================
   SCROLL REVEAL — Intersection Observer
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate only once
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ============================================================
   CONTACT FORM — validation + success state
   ============================================================ */
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    /* Basic validation */
    if (!name || !email || !message) {
      shakeForm();
      return;
    }
    if (!isValidEmail(email)) {
      contactForm.email.focus();
      contactForm.email.style.borderColor = '#e74c3c';
      setTimeout(() => {
        contactForm.email.style.borderColor = '';
      }, 2000);
      return;
    }

    /* Simulate sending (replace with real API call) */
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-send-fill"></i> Send Message';
      contactForm.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1200);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm() {
  contactForm.style.animation = 'none';
  void contactForm.offsetWidth; // reflow
  contactForm.style.animation = 'shake 0.4s ease';
}

/* Inject shake keyframes dynamically */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   SMOOTH SCROLL for all anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   BAR CHART ANIMATION — re-trigger on hero visible
   ============================================================ */
const bars = document.querySelectorAll('.bar');
const heroSection = document.getElementById('home');

const heroObserver = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      bars.forEach((bar, i) => {
        bar.style.animation = 'none';
        void bar.offsetWidth;
        bar.style.animation = `growUp 0.8s ${i * 0.12}s ease forwards`;
      });
    }
  },
  { threshold: 0.3 }
);

if (heroSection) heroObserver.observe(heroSection);