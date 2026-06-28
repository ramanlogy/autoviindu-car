import re

with open("/home/raman/Desktop/autoviindu/public/assets/js/app.js", "r") as f:
    content = f.read()

old_render = """    const isFiltered = sf.q || sf.brands.length || sf.fuels.length || sf.bodies.length || sf.transmissions.length || sf.years.length || sf.minP > 0 || sf.maxP < sf._maxSlider || sf.budget || sf.sort;
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

new_render = """    if (cars.length) {
      g.innerHTML = cars.map(c => carCard(c)).join('');
      if (empty) empty.style.display = 'none';
    } else {"""

content = content.replace(old_render, new_render)

with open("/home/raman/Desktop/autoviindu/public/assets/js/app.js", "w") as f:
    f.write(content)

print("Reverted app.js successfully.")
