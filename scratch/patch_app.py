import re

with open("/home/raman/Desktop/autoviindu/public/assets/js/app.js", "r") as f:
    content = f.read()

categorized_func = """
  function buildCategorizedView() {
    const section = (title, items, filterAction) => {
      if (!items || !items.length) return '';
      return `
        <div class="cat-section" style="margin-bottom: 40px;">
          <div class="cat-head" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px; border-bottom: 2px solid var(--border); padding-bottom: 10px;">
            <h3 class="cat-title" style="font-size: 20px; font-weight: 700; color: var(--ink); margin: 0;">${title}</h3>
            <button class="cat-view-all" onclick="${filterAction}; window.scrollTo({top: 0, behavior: 'smooth'});" style="font-size: 14px; font-weight: 600; color: var(--g3); cursor: pointer; display: flex; align-items: center; gap: 4px; background: none; border: none;">View all ${IC.chevR}</button>
          </div>
          <div class="car-carousel" style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px; scroll-snap-type: x mandatory;">
            ${items.map(c => `<div style="min-width: 280px; max-width: 300px; flex-shrink: 0; scroll-snap-align: start;">${carCard(c)}</div>`).join('')}
          </div>
        </div>
      `;
    };

    const trending = [...CARS_DB].filter(c => c.isBestSeller || (c.reviews && c.reviews > 100)).slice(0, 8);
    const under40 = [...CARS_DB].filter(c => _carPrice(c) > 0 && _carPrice(c) <= 40).sort((a,b) => _carPrice(a) - _carPrice(b)).slice(0, 8);
    const premium = [...CARS_DB].filter(c => _carPrice(c) >= 80).sort((a,b) => _carPrice(b) - _carPrice(a)).slice(0, 8);
    const ev = [...CARS_DB].filter(c => c.isEV || c.type === 'Electric').slice(0, 8);
    const suv = [...CARS_DB].filter(c => c.bodyType === 'suv' || c.body === 'SUV').slice(0, 8);
    const maruti = [...CARS_DB].filter(c => c.brand === 'Suzuki' || c.brand === 'Maruti Suzuki').slice(0, 8);

    return `
      <div class="categorized-wrapper" style="width: 100%; animation: fadeIn 0.3s ease;">
        ${section('Trending & Popular', trending, "AV.sfSort('rating')")}
        ${section('Top Electric Vehicles', ev, "AV.sfToggle('fuels', 'Electric', null)")}
        ${section('Budget Friendly (Under Rs. 40L)', under40, "AV.sfSetPrice(0, 40)")}
        ${section('Premium & Luxury', premium, "AV.sfSetPrice(80, 999)")}
        ${section('Top SUVs', suv, "AV.sfToggle('bodies', 'SUV', null)")}
        ${section('Most Searched: Suzuki', maruti, "AV.sfToggle('brands', 'Suzuki', null)")}
      </div>
    `;
  }
"""

# Insert the function before _sfApply
content = content.replace("function _sfApply() {", categorized_func + "\n  function _sfApply() {")

# Add sfSetPrice to window.AV
content = content.replace("sfClear() {", "sfSetPrice(min, max) {\n      const maxSl = window._sf?._maxSlider || 600;\n      window._sf.minP = min;\n      window._sf.maxP = max > maxSl ? maxSl : max;\n      const lo = document.getElementById('lf-price-lo'), hi = document.getElementById('lf-price-hi');\n      if (lo) lo.value = window._sf.minP;\n      if (hi) hi.value = window._sf.maxP;\n      const loV = document.getElementById('lf-lo-val'), hiV = document.getElementById('lf-hi-val');\n      if (loV) loV.textContent = 'Rs. ' + window._sf.minP + 'L';\n      if (hiV) hiV.textContent = 'Rs. ' + window._sf.maxP + 'L';\n      _sfApply();\n    },\n    sfClear() {")

# Patch the rendering logic inside _sfApply
old_render = """    if (cars.length) {
      g.innerHTML = cars.map(c => carCard(c)).join('');
      if (empty) empty.style.display = 'none';
    } else {"""

new_render = """    const isFiltered = sf.q || sf.brands.length || sf.fuels.length || sf.bodies.length || sf.transmissions.length || sf.years.length || sf.minP > 0 || sf.maxP < sf._maxSlider || sf.budget || sf.sort;
    if (!isFiltered) {
      g.innerHTML = buildCategorizedView();
      g.classList.remove('cars-grid');
      g.style.display = 'block';
      if (empty) empty.style.display = 'none';
    } else if (cars.length) {
      g.innerHTML = cars.map(c => carCard(c)).join('');
      g.classList.add('cars-grid');
      g.style.display = '';
      if (empty) empty.style.display = 'none';
    } else {"""

content = content.replace(old_render, new_render)

with open("/home/raman/Desktop/autoviindu/public/assets/js/app.js", "w") as f:
    f.write(content)

print("Patched app.js successfully.")
