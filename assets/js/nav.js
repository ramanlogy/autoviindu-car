/* ══════════════════════════════════════
   AUTOVIINDU — NAVIGATION MODULE
   Handles: dropdown, search, mobile menu
══════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── SCROLL HEADER SHADOW ─── */
  window.addEventListener('scroll', () => {
    const hdr = document.querySelector('.site-header');
    if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ─── MEGA DROPDOWN ─── */
  let openDropdown = null;
  let dropdownTimer = null;

  function closeAllDropdowns() {
    document.querySelectorAll('.mega-dropdown').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('open'));
    document.querySelectorAll('.nav-link .arrow').forEach(a => {
      a.style.transform = '';
    });
    openDropdown = null;
  }

  document.querySelectorAll('.nav-item[data-dropdown]').forEach(item => {
    const trigger = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.mega-dropdown');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('mouseenter', () => {
      clearTimeout(dropdownTimer);
      if (openDropdown && openDropdown !== dropdown) closeAllDropdowns();
      item.classList.add('open');
      dropdown.classList.add('open');
      openDropdown = dropdown;
    });

    item.addEventListener('mouseleave', () => {
      dropdownTimer = setTimeout(() => {
        item.classList.remove('open');
        dropdown.classList.remove('open');
        if (openDropdown === dropdown) openDropdown = null;
      }, 120);
    });

    dropdown.addEventListener('mouseenter', () => clearTimeout(dropdownTimer));
    dropdown.addEventListener('mouseleave', () => {
      dropdownTimer = setTimeout(() => {
        item.classList.remove('open');
        dropdown.classList.remove('open');
        if (openDropdown === dropdown) openDropdown = null;
      }, 120);
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-item[data-dropdown]')) closeAllDropdowns();
  });

  /* ─── DESKTOP SEARCH ─── */
  const searchInput = document.getElementById('header-search-input');
  const searchDropdown = document.getElementById('search-dropdown');
  const searchClear = document.getElementById('search-clear');
  let searchIndex = [];
  let searchDebounce = null;

  function initSearch() {
    if (window.buildSearchIndex) searchIndex = window.buildSearchIndex();
  }

  function runSearch(query) {
    if (!query || query.trim().length < 2) {
      showQuickSuggestions();
      return;
    }
    const q = query.toLowerCase();
    const results = searchIndex.filter(c => c.searchText.includes(q)).slice(0, 6);
    renderSearchResults(results, q);
  }

  function showQuickSuggestions() {
    if (!searchDropdown) return;
    const chips = ['MG Hector', 'IONIQ 5', 'Toyota Prius', 'Honda City', 'Kia Seltos', 'BYD Atto 3', 'Swift', 'EV cars'];
    searchDropdown.innerHTML = `
      <div class="search-dropdown-header">Popular Searches</div>
      <div class="search-quick-chips">
        ${chips.map(c => `<span class="search-quick-chip" onclick="AV.goTo('cars');AV.nav.closeSearch()">${c}</span>`).join('')}
      </div>`;
    searchDropdown.classList.add('open');
  }

  function renderSearchResults(results, query) {
    if (!searchDropdown) return;
    if (!results.length) {
      searchDropdown.innerHTML = `
        <div class="search-no-results">
          No cars found for "<strong>${query}</strong>"<br>
          <small style="color:var(--ink-4)">Try brand, model, or type</small>
        </div>`;
    } else {
      const badgeMap = { ev: 'badge-ev', hybrid: 'badge-hybrid', popular: 'badge-pop' };
      searchDropdown.innerHTML = `
        <div class="search-dropdown-header">${results.length} result${results.length > 1 ? 's' : ''} found</div>
        ${results.map(r => `
          <div class="search-result-item" onclick="AV.openDetail('${r.slug}');AV.nav.closeSearch()">
            <img class="search-result-img" src="${r.image}" alt="${r.display}" loading="lazy">
            <div style="flex:1;min-width:0">
              <div class="search-result-name">${highlight(r.display, query)}</div>
              <div class="search-result-meta">${r.year} · ${r.type} · ${r.body}</div>
            </div>
            <div class="search-result-price">${r.price}</div>
          </div>`).join('')}`;
    }
    searchDropdown.classList.add('open');
  }

  function highlight(text, query) {
    if (!query) return text;
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(re, '<mark style="background:rgba(26,107,42,.15);color:var(--green);border-radius:2px;padding:0 1px">$1</mark>');
  }

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const val = e.target.value;
      if (searchClear) searchClear.classList.toggle('visible', val.length > 0);
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => runSearch(val), 180);
    });
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.length >= 2) runSearch(searchInput.value);
      else showQuickSuggestions();
    });
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeSearch();
      if (e.key === 'Enter') {
        AV.goTo('cars', { q: searchInput.value });
        closeSearch();
      }
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchClear.classList.remove('visible');
      if (searchDropdown) searchDropdown.classList.remove('open');
    });
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('.header-search')) closeSearch();
  });

  function closeSearch() {
    if (searchDropdown) searchDropdown.classList.remove('open');
  }

  /* ─── MOBILE MENU ─── */
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');

  function openMobileMenu() {
    if (mobileMenu) mobileMenu.classList.add('open');
    if (burgerBtn) burgerBtn.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (burgerBtn) burgerBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (burgerBtn) burgerBtn.addEventListener('click', () => {
    mobileMenu?.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });

  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  /* Mobile accordion nav */
  document.querySelectorAll('.mob-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wasOpen = btn.classList.contains('open');
      document.querySelectorAll('.mob-nav-btn').forEach(b => {
        b.classList.remove('open');
        const sub = document.getElementById(b.dataset.sub);
        if (sub) sub.classList.remove('open');
      });
      if (!wasOpen) {
        btn.classList.add('open');
        const sub = document.getElementById(btn.dataset.sub);
        if (sub) sub.classList.add('open');
      }
    });
  });

  /* Mobile search overlay */
  const mobSearchIcon = document.getElementById('mob-search-icon');
  const mobSearchOverlay = document.getElementById('mob-search-overlay');
  const mobSearchClose = document.getElementById('mob-search-close');
  const mobSearchInput = document.getElementById('mob-search-input');
  const mobSearchResults = document.getElementById('mob-search-results');

  if (mobSearchIcon) mobSearchIcon.addEventListener('click', () => {
    if (mobSearchOverlay) { mobSearchOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
    setTimeout(() => mobSearchInput?.focus(), 80);
  });

  function closeMobSearch() {
    if (mobSearchOverlay) mobSearchOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobSearchClose) mobSearchClose.addEventListener('click', closeMobSearch);
  if (mobSearchOverlay) mobSearchOverlay.addEventListener('click', e => { if (e.target === mobSearchOverlay) closeMobSearch(); });

  if (mobSearchInput) {
    mobSearchInput.addEventListener('input', e => {
      const val = e.target.value;
      if (val.length < 2) { if (mobSearchResults) mobSearchResults.innerHTML = ''; return; }
      const q = val.toLowerCase();
      const res = searchIndex.filter(c => c.searchText.includes(q)).slice(0, 8);
      if (mobSearchResults) {
        if (!res.length) {
          mobSearchResults.innerHTML = `<div class="search-no-results">No results for "<b>${val}</b>"</div>`;
        } else {
          mobSearchResults.innerHTML = res.map(r => `
            <div class="search-result-item" onclick="AV.openDetail('${r.slug}');closeMobSearch()">
              <img class="search-result-img" src="${r.image}" alt="${r.display}" loading="lazy">
              <div style="flex:1;min-width:0">
                <div class="search-result-name">${r.display}</div>
                <div class="search-result-meta">${r.year} · ${r.type}</div>
              </div>
              <div class="search-result-price">${r.price}</div>
            </div>`).join('');
        }
      }
    });
    mobSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobSearch();
      if (e.key === 'Enter') { AV.goTo('cars'); closeMobSearch(); }
    });
  }

  /* expose closeMobileMenu globally */
  window.closeMobileMenu = closeMobileMenu;
  window.closeMobSearch = closeMobSearch;

  /* ─── INIT ─── */
  document.addEventListener('DOMContentLoaded', initSearch);
  if (document.readyState !== 'loading') initSearch();

  /* ─── EXPORT to AV.nav ─── */
  window.AV = window.AV || {};
  window.AV.nav = { closeSearch, closeMobileMenu, openMobileMenu };

})();