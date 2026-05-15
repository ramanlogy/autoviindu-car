const fs = require('fs');
const path = require('path');

const carsDbPath = path.join(__dirname, '../public/assets/js/data/cars-db.js');
const newCarsPath = path.join(__dirname, 'new_cars.txt');

let carsDbContent = fs.readFileSync(carsDbPath, 'utf8');
let newCarsContent = fs.readFileSync(newCarsPath, 'utf8');

// Find the last index of `];`
const lastBracketIndex = carsDbContent.lastIndexOf('];');

if (lastBracketIndex !== -1) {
  // Replace the last `];` with a comma, then the new cars, then `];`
  carsDbContent = carsDbContent.slice(0, lastBracketIndex) + ',\n' + newCarsContent + '\n];\n';
  fs.writeFileSync(carsDbPath, carsDbContent, 'utf8');
  console.log('Successfully appended new cars to cars-db.js');
} else {
  console.error('Could not find the closing bracket in cars-db.js');
}
