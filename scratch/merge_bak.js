const fs = require('fs');

const backendFile = '/home/raman/Desktop/autoviindu/backend/data/cars.json';
let backendCars = [];
try {
  backendCars = JSON.parse(fs.readFileSync(backendFile, 'utf8'));
} catch (e) {
  console.log("Error reading backend/data/cars.json:", e);
}

const dbFile = '/home/raman/Desktop/autoviindu/public/assets/js/data/cars-db.js.bak';
let dbContent = fs.readFileSync(dbFile, 'utf8');

// Use node's vm to evaluate the file safely
const vm = require('vm');
const context = { window: {}, console: console };
vm.createContext(context);

// Make const allBrandsCars global in the context
dbContent = dbContent.replace(/const\s+allBrandsCars\s*=/, 'window.allBrandsCars =');
// Handle potentially other things
dbContent = dbContent.replace(/window\.CARS_DB\s*=/, 'window.allBrandsCars =');

try {
    vm.runInContext(dbContent, context);
} catch(e) {
    console.log("Evaluation failed", e);
    process.exit(1);
}

const carsToAdd = context.window.allBrandsCars || [];

if (!carsToAdd.length) {
    console.log("No cars found.");
    process.exit(1);
}

console.log(`Found ${carsToAdd.length} cars in cars-db.js.bak`);

let addedCount = 0;
let updatedCount = 0;

for (const newCar of carsToAdd) {
    const existingIdx = backendCars.findIndex(c => c.slug === newCar.slug || (c.brand === newCar.brand && c.model === newCar.model));
    if (existingIdx > -1) {
        const oldImporter = backendCars[existingIdx].importer;
        backendCars[existingIdx] = { ...newCar, importer: oldImporter || newCar.importer };
        updatedCount++;
    } else {
        backendCars.push(newCar);
        addedCount++;
    }
}

fs.writeFileSync(backendFile, JSON.stringify(backendCars, null, 2));

console.log(`Successfully merged. Added: ${addedCount}, Updated: ${updatedCount}, Total cars now: ${backendCars.length}`);
