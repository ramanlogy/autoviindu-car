import re

def fix_mobile_search():
    # 1. Clean up index.html
    with open('/home/raman/Desktop/autoviindu/public/index.html', 'r') as f:
        html = f.read()

    # Remove the overlay I added
    overlay_start = '<!-- MOBILE SEARCH OVERLAY -->'
    if overlay_start in html:
        html = html[:html.find(overlay_start)] + '</body>\n</html>'

    # Add back button before header-search
    if 'id="mob-search-back"' not in html:
        back_btn = """
      <div class="mobile-search-back" id="mob-search-back" style="display:none; align-items:center; padding-right:12px; cursor:pointer;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </div>
"""
        html = html.replace('<div class="header-search" id="header-search-wrap">', back_btn + '      <div class="header-search" id="header-search-wrap">')

    with open('/home/raman/Desktop/autoviindu/public/index.html', 'w') as f:
        f.write(html)

    # 2. Add CSS to nav.css
    with open('/home/raman/Desktop/autoviindu/public/assets/css/nav.css', 'r') as f:
        css = f.read()
        
    custom_css = """
/* ─ MOBILE SEARCH TOGGLE ─ */
@media (max-width: 959px) {
  .header-in.search-active #honk-wrapper,
  .header-in.search-active .mob-icons,
  .header-in.search-active .burger,
  .header-in.search-active .header-ctas {
    display: none !important;
  }
  .header-in.search-active .header-search {
    display: block !important;
    flex: 1;
    max-width: 100%;
  }
  .header-in.search-active #mob-search-back {
    display: flex !important;
  }
  /* The dropdown should span full width on mobile */
  .search-dropdown {
    position: fixed !important;
    top: var(--nav-h) !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    border-radius: 0 !important;
    border: none !important;
    box-shadow: none !important;
    overflow-y: auto !important;
  }
}
"""
    if '/* ─ MOBILE SEARCH TOGGLE ─ */' not in css:
        with open('/home/raman/Desktop/autoviindu/public/assets/css/nav.css', 'a') as f:
            f.write(custom_css)

    # 3. Clean up app.js and add toggle logic
    with open('/home/raman/Desktop/autoviindu/public/assets/js/app.js', 'r') as f:
        js = f.read()

    # Remove the mobile search block I added
    if '/* ─ MOBILE SEARCH ─ */' in js:
        js = re.sub(r'/\* ─ MOBILE SEARCH ─ \*/.*?/\* ─ KEYBOARD ─ \*/', '/* ─ KEYBOARD ─ */', js, flags=re.DOTALL)

    js_toggle = """
/* ─ MOBILE SEARCH TOGGLE ─ */
const mobSearchBtn2 = document.getElementById('mob-search-btn');
const mobSearchBack2 = document.getElementById('mob-search-back');
const headerIn2 = document.querySelector('.header-in');

if(mobSearchBtn2 && mobSearchBack2 && headerIn2) {
  mobSearchBtn2.addEventListener('click', () => {
    headerIn2.classList.add('search-active');
    document.body.style.overflow = 'hidden'; // prevent background scrolling while searching
    setTimeout(() => {
      document.getElementById('hs-input')?.focus();
    }, 100);
  });
  mobSearchBack2.addEventListener('click', () => {
    headerIn2.classList.remove('search-active');
    document.body.style.overflow = '';
    closeSD();
  });
}
"""
    if 'mobSearchBtn2' not in js:
        js = js.replace('/* ─ KEYBOARD ─ */', js_toggle + '\n/* ─ KEYBOARD ─ */')
        
    with open('/home/raman/Desktop/autoviindu/public/assets/js/app.js', 'w') as f:
        f.write(js)

fix_mobile_search()
print("Done fixing mobile search.")
