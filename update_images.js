const fs = require('fs');
const path = require('path');

// 1. Read the images
const imagesDir = path.join(__dirname, 'public/assets/images/car_images');
const allImages = [];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else {
      if (/\.(jpg|jpeg|png|webp|avif)$/i.test(item)) {
        allImages.push(fullPath.replace(__dirname + '/public', ''));
      }
    }
  }
}
scanDir(imagesDir);

// Build an index mapping "brandSlug/modelSlug" to images
// For example: "/assets/images/car_images/hyundai/creta/exterior/img.jpg"
// We can parse the path parts.
const imgMap = {};
for (const img of allImages) {
  // e.g. /assets/images/car_images/hyundai/creta/exterior/img.jpg
  const parts = img.split('/');
  const idx = parts.indexOf('car_images');
  if (idx !== -1 && parts.length > idx + 2) {
    const brand = parts[idx + 1].toLowerCase();
    const model = parts[idx + 2].toLowerCase();
    const key = brand + '/' + model;
    if (!imgMap[key]) imgMap[key] = [];
    imgMap[key].push(img);
  }
}

// 2. Read cars-db.js
const dbPath = path.join(__dirname, 'public/assets/js/data/cars-db.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');

// Use a regex or simple eval to parse
const prefixMatch = dbContent.match(/([\s\S]*?window\.CARS_DB\s*=\s*)([\s\S]*);/);
if (!prefixMatch) {
  console.error("Could not parse cars-db.js");
  process.exit(1);
}

const prefix = prefixMatch[1];
const arrStr = prefixMatch[2];

// Use new Function to parse
const getArr = new Function('return ' + arrStr);
const cars = getArr();

// 3. Update the array
let updatedCount = 0;

for (const car of cars) {
  if (!car.brand || !car.model) continue;
  
  const brandSlug = car.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const modelSlug = car.model.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // Try exact match, e.g. "maruti-suzuki/swift"
  let possibleKeys = [
    brandSlug + '/' + modelSlug,
    car.brand.toLowerCase() + '/' + modelSlug,
    // Just in case, try brandSlug = 'suzuki' if maruti-suzuki
    brandSlug.replace('maruti-', '') + '/' + modelSlug
  ];
  
  let foundKey = possibleKeys.find(k => imgMap[k]);
  
  if (foundKey) {
    // If the car currently has unsplash images, or old images, replace them all
    // Wait, the user said "remove those unsplash random images" - maybe some cars had random unsplash images assigned to them?
    const oldImages = car.images || [];
    const hasUnsplash = oldImages.some(img => img.includes('unsplash.com'));
    
    // We will replace with the new images from the folder
    car.images = imgMap[foundKey].sort((a, b) => {
      // Put exterior before interior
      const aExt = a.includes('exterior') ? 0 : 1;
      const bExt = b.includes('exterior') ? 0 : 1;
      return aExt - bExt;
    });
    updatedCount++;
  } else {
    // Check if it has unsplash images, just clear them to remove them?
    // User: "remove those unsplash random images"
    if (car.images) {
      car.images = car.images.filter(img => !img.includes('unsplash.com'));
    }
  }
}

// 4. Write back
const newArrStr = JSON.stringify(cars, null, 2);
fs.writeFileSync(dbPath, prefix + newArrStr + ';\n', 'utf8');
console.log('Updated cars:', updatedCount);

