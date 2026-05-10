import re

# 1. Update index.html
with open('/home/raman/Desktop/autoviindu/public/index.html', 'r') as f:
    html = f.read()

overlay_html = """
  <!-- MOBILE SEARCH OVERLAY -->
  <div class="mobile-search-overlay" id="mob-search-overlay">
    <div class="mob-overlay-box">
      <div class="mob-overlay-input-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="mob-hs-input" placeholder="Search brand, model, fuel type...">
        <div class="mob-overlay-close" id="mob-search-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      </div>
      <div class="mob-search-results" id="mob-search-results">
        <div class="mob-overlay-suggestions">
          <div class="mob-overlay-label">Popular Searches</div>
          <div class="mob-overlay-chips">
            <span class="mob-overlay-chip" onclick="AV.goTo('cars');closeMobSearch()">MG Hector</span>
            <span class="mob-overlay-chip" onclick="AV.goTo('cars');closeMobSearch()">IONIQ 5</span>
            <span class="mob-overlay-chip" onclick="AV.goTo('cars');closeMobSearch()">BYD Atto 3</span>
            <span class="mob-overlay-chip" onclick="AV.goTo('cars');closeMobSearch()">Swift 2024</span>
          </div>
        </div>
      </div>
    </div>
  </div>
"""

if "mob-search-overlay" not in html:
    html = html.replace('</body>', overlay_html + '\n</body>')
    with open('/home/raman/Desktop/autoviindu/public/index.html', 'w') as f:
        f.write(html)
        print("Updated index.html")

# 2. Update app.js
with open('/home/raman/Desktop/autoviindu/public/assets/js/app.js', 'r') as f:
    js = f.read()

js_code = """
/* ─ MOBILE SEARCH ─ */
const mobSearchBtn = document.getElementById('mob-search-btn');
const mobSearchOverlay = document.getElementById('mob-search-overlay');
const mobSearchClose = document.getElementById('mob-search-close');
const mobHsInput = document.getElementById('mob-hs-input');
const mobSearchResults = document.getElementById('mob-search-results');

window.closeMobSearch = function() {
  if (mobSearchOverlay) mobSearchOverlay.classList.remove('open');
};

if (mobSearchBtn && mobSearchOverlay) {
  mobSearchBtn.addEventListener('click', () => {
    mobSearchOverlay.classList.add('open');
    setTimeout(() => mobHsInput?.focus(), 100);
  });
  
  mobSearchClose.addEventListener('click', closeMobSearch);
  
  mobHsInput.addEventListener('input', e => {
    const v = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (v.length < 2) {
        mobSearchResults.innerHTML = `<div class="mob-overlay-suggestions"><div class="mob-overlay-label">Popular Searches</div><div class="mob-overlay-chips"><span class="mob-overlay-chip" onclick="AV.goTo('cars');closeMobSearch()">MG Hector</span><span class="mob-overlay-chip" onclick="AV.goTo('cars');closeMobSearch()">IONIQ 5</span><span class="mob-overlay-chip" onclick="AV.goTo('cars');closeMobSearch()">BYD Atto 3</span><span class="mob-overlay-chip" onclick="AV.goTo('cars');closeMobSearch()">Swift 2024</span></div></div>`;
        return;
      }
      const q = v.toLowerCase();
      const res = searchIdx.filter(c => c.searchText.includes(q)).slice(0, 6);
      if (!res.length) {
        mobSearchResults.innerHTML = `<div style="padding:18px;text-align:center;font-size:13px;color:var(--ink4)">No results for "<strong>${v}</strong>"</div>`;
      } else {
        mobSearchResults.innerHTML = res.map(r => `<div class="search-result-item" onclick="AV.openDetail('${r.slug}');closeMobSearch()"><img class="search-result-img" src="${r.image}" alt=""><div style="flex:1;min-width:0"><div class="search-result-name">${r.display}</div><div class="search-result-meta">${r.year} · ${r.type} · ${r.body}</div></div><div class="search-result-price">${r.price}</div></div>`).join('');
      }
    }, 180);
  });
  
  mobHsInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobSearch();
    if (e.key === 'Enter') {
      AV.goTo('cars', {q: mobHsInput.value});
      closeMobSearch();
    }
  });
}
"""

if "mobSearchOverlay" not in js:
    # Insert right before /* ─ KEYBOARD ─ */
    js = js.replace('/* ─ KEYBOARD ─ */', js_code + '\n/* ─ KEYBOARD ─ */')
    with open('/home/raman/Desktop/autoviindu/public/assets/js/app.js', 'w') as f:
        f.write(js)
        print("Updated app.js")

