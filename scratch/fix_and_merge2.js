const fs = require('fs');
const vm = require('vm');

const backendFile = '/home/raman/Desktop/autoviindu/backend/data/cars.json';
const dbFile = '/home/raman/Desktop/autoviindu/public/assets/js/data/cars-db.js.bak';

let dbContent = fs.readFileSync(dbFile, 'utf8');

let backendCars = [];
try {
  backendCars = JSON.parse(fs.readFileSync(backendFile, 'utf8'));
} catch (e) {}

const context = { window: {}, console: console };
vm.createContext(context);

try {
    vm.runInContext(dbContent, context);
} catch(e) {
    console.error("Evaluation failed", e);
    process.exit(1);
}

const carsToAdd = context.window.CARS_DB || context.window.allBrandsCars || [];

if (!carsToAdd.length) {
    console.log("No cars found in CARS_DB.");
    process.exit(1);
}

console.log(`Found ${carsToAdd.length} cars from cars-db.js.bak`);

let addedCount = 0;
let updatedCount = 0;

for (const newCar of carsToAdd) {
    if (!newCar.id) newCar.id = Math.floor(Math.random() * 10000) + 1000;
    
    const existingIdx = backendCars.findIndex(c => c.slug === newCar.slug || (c.brand === newCar.brand && c.model === newCar.model));
    if (existingIdx > -1) {
        const oldImporter = backendCars[existingIdx].importer;
        backendCars[existingIdx] = { ...backendCars[existingIdx], ...newCar, importer: oldImporter || newCar.importer };
        updatedCount++;
    } else {
        backendCars.push(newCar);
        addedCount++;
    }
}

fs.writeFileSync(backendFile, JSON.stringify(backendCars, null, 2));

console.log(`Successfully merged. Added: ${addedCount}, Updated: ${updatedCount}, Total cars in database now: ${backendCars.length}`);
