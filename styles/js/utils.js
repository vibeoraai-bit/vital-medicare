// ============================================
// EDUPRIME ENTERPRISE — UTILITIES & READ MORE
// ============================================

// ============================================
// READ MORE TOGGLE
// ============================================
function initReadMore() {
  const CHAR_LIMIT = 150;
  document.querySelectorAll('[data-read-more]').forEach(container => {
    const fullText = container.getAttribute('data-full-text') || container.textContent.trim();
    if (fullText.length <= CHAR_LIMIT) return;

    const preview = fullText.substring(0, CHAR_LIMIT) + '...';
    let expanded = false;

    const textEl = document.createElement('span');
    textEl.textContent = preview;
    textEl.className = 'read-more-text';

    const btn = document.createElement('button');
    btn.textContent = 'Read More';
    btn.className = 'read-more-btn seal-press';
    btn.style.cssText = `
      background: none;
      border: none;
      color: #C6A43F;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      padding: 0;
      margin-left: 6px;
      font-family: inherit;
      text-decoration: underline;
    `;

    btn.addEventListener('click', function () {
      expanded = !expanded;
      textEl.textContent = expanded ? fullText : preview;
      btn.textContent = expanded ? 'Read Less' : 'Read More';
    });

    container.innerHTML = '';
    container.appendChild(textEl);
    container.appendChild(btn);
  });
}

// ============================================
// SCROLL REVEAL OBSERVER
// ============================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ============================================
// MODAL SYSTEM
// ============================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = 'flex';
  modal.querySelector('.modal-content').classList.remove('paper-glide-out');
  modal.querySelector('.modal-content').classList.add('paper-glide');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const content = modal.querySelector('.modal-content');
  content.classList.remove('paper-glide');
  content.classList.add('paper-glide-out');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 350);
}

// Close modal on overlay click
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) {
    const modal = e.target.closest('[id]');
    if (modal) closeModal(modal.id);
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      if (m.style.display !== 'none') closeModal(m.id);
    });
  }
});

// ============================================
// ACTIVE NAV LINK
// ============================================
function initActiveNav() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath === href || currentPath.startsWith(href + '/'))) {
      link.classList.add('nav-active', 'ink-draw-active');
    }
  });
}

// ============================================
// MOBILE HAMBURGER MENU
// ============================================
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('menu-overlay');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    const isOpen = menu.classList.contains('menu-open');
    menu.classList.toggle('menu-open');
    overlay?.classList.toggle('active');
    toggle.innerHTML = isOpen ? menuIcon() : closeIcon();
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  overlay?.addEventListener('click', function () {
    menu.classList.remove('menu-open');
    overlay.classList.remove('active');
    toggle.innerHTML = menuIcon();
    document.body.style.overflow = '';
  });
}

function menuIcon() {
  return `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
}

function closeIcon() {
  return `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'success', duration = 4000) {
  const colors = {
    success: { bg: '#0E9F6E', icon: '✓' },
    error: { bg: '#DC2626', icon: '✕' },
    warning: { bg: '#D97706', icon: '!' },
    info: { bg: '#0A1929', icon: 'ℹ' }
  };
  const config = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${config.bg};
    color: white;
    padding: 14px 20px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    animation: paperGlideIn 0.4s ease forwards;
    max-width: 360px;
  `;
  toast.innerHTML = `<span style="font-weight:800;font-size:1rem">${config.icon}</span>${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'paperGlideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================
// FORMAT CURRENCY
// ============================================
function formatNaira(amount) {
  return '₦' + Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ============================================
// FORMAT DATE
// ============================================
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ============================================
// SUPABASE CLIENT HELPER
// ============================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Include supabase-js via CDN in your HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
let supabaseClient;
function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

// ============================================
// INIT ALL ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  initReadMore();
  initScrollReveal();
  initActiveNav();
  initMobileMenu();
});