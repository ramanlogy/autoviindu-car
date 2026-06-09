const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf-8');

const jsdom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  resources: "usable"
});

const window = jsdom.window;
window.location.hash = '#used';

const carsDb = fs.readFileSync(path.join(__dirname, 'public/assets/js/data/cars-db.js'), 'utf-8');
const usedCarsDb = fs.readFileSync(path.join(__dirname, 'public/assets/js/data/used-cars-db.js'), 'utf-8');
const homeRender = fs.readFileSync(path.join(__dirname, 'public/assets/js/home-render.js'), 'utf-8');
const app = fs.readFileSync(path.join(__dirname, 'public/assets/js/app.js'), 'utf-8');

try {
  window.eval(carsDb);
  window.eval(usedCarsDb);
  window.eval(homeRender);
  window.eval(app);
  
  if (window.AV && window.AV.goTo) {
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  }

  setTimeout(() => {
    try {
      console.log("Calling renderUsed...");
      window.AV.goTo('used');
      console.log("Success! Hash is now:", window.location.hash);
      const grid = window.document.getElementById('used-grid');
      console.log("Used count:", window.document.getElementById('used-count') ? window.document.getElementById('used-count').innerHTML : "null");
      console.log("Grid content length:", grid ? grid.innerHTML.length : "null");
    } catch(e) {
      console.error("CRASH DURING renderUsed:", e);
    }
  }, 1000);

} catch (e) {
  console.error("CRASH DURING LOAD:", e);
}
