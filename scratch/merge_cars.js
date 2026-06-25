const fs = require('fs');

// Read current backend JSON
const backendFile = '/home/raman/Desktop/autoviindu/backend/data/cars.json';
let backendCars = [];
try {
  backendCars = JSON.parse(fs.readFileSync(backendFile, 'utf8'));
} catch (e) {
  console.log("Error reading backend/data/cars.json:", e);
}

// Read cars-db.js file
const dbFile = '/home/raman/Desktop/autoviindu/public/assets/js/data/cars-db.js';
let dbContent = fs.readFileSync(dbFile, 'utf8');

// We need to parse the array out of cars-db.js
// It usually starts with 'const CARS_DB = [' or similar.
// Since the user pasted 'const allBrandsCars = [', we'll extract that.
let match = dbContent.match(/const\s+(?:CARS_DB|allBrandsCars)\s*=\s*(\[\s*\{[\s\S]*\}\s*\])\s*;/);

if (!match) {
    // Try a more relaxed match or eval
    dbContent = dbContent.replace(/const\s+(CARS_DB|allBrandsCars)\s*=/g, 'global.$1 =');
    try {
        eval(dbContent);
    } catch(e) {
        console.log("Eval error, trying fallback extraction");
    }
}

let carsToAdd = global.CARS_DB || global.allBrandsCars || [];

if (!carsToAdd.length) {
    console.log("Could not extract cars from cars-db.js. Please verify the variable name.");
    process.exit(1);
}

console.log(`Found ${carsToAdd.length} cars in cars-db.js`);

let addedCount = 0;
let updatedCount = 0;

for (const newCar of carsToAdd) {
    const existingIdx = backendCars.findIndex(c => c.slug === newCar.slug || (c.brand === newCar.brand && c.model === newCar.model));
    if (existingIdx > -1) {
        // Keep the old importer field if we're updating
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

