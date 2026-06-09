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

// We need to wait for scripts to load, but we can also just evaluate them
const carsDb = fs.readFileSync(path.join(__dirname, 'public/assets/js/data/cars-db.js'), 'utf-8');
const usedCarsDb = fs.readFileSync(path.join(__dirname, 'public/assets/js/data/used-cars-db.js'), 'utf-8');
const homeRender = fs.readFileSync(path.join(__dirname, 'public/assets/js/home-render.js'), 'utf-8');
const app = fs.readFileSync(path.join(__dirname, 'public/assets/js/app.js'), 'utf-8');

try {
  window.eval(carsDb);
  window.eval(usedCarsDb);
  window.eval(homeRender);
  window.eval(app);

  // Trigger init manually just in case
  if (window.AV && window.AV.goTo) {
    // window.AV is populated, meaning app.js executed.
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  }

  setTimeout(() => {
    try {
      console.log("Calling AV.openDetail('samjhana cars')");
      window.AV.openDetail('samjhana cars');
      console.log("Success! Hash is now:", window.location.hash);
      console.log("App root length:", window.document.getElementById('app-root').innerHTML.length);
    } catch(e) {
      console.error("CRASH DURING openDetail:", e);
    }
  }, 1000);

} catch (e) {
  console.error("CRASH DURING LOAD:", e);
}
