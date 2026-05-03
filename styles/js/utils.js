// ============================================
// UTILS - Used Functions Only
// ============================================

// FORMAT CURRENCY
export function formatNaira(amount) {
  return '₦' + Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// FORMAT DATE
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });
}

// TOAST NOTIFICATION
export function showToast(message, type = 'success', duration = 4000) {
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

// ACTIVE NAV LINK
export function initActiveNav() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath === href || currentPath.startsWith(href + '/'))) {
      link.classList.add('nav-active', 'ink-draw-active');
    }
  });
}

// MOBILE HAMBURGER MENU
export function initMobileMenu() {
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

// INIT ALL ON DOM READY
document.addEventListener('DOMContentLoaded', function () {
  initActiveNav();
  initMobileMenu();
});

