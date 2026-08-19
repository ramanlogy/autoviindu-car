#!/usr/bin/env node
/**
 * Script to match car images from the car_images directory to cars.json entries
 * and update all image paths + thumbs accordingly.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CARS_JSON = path.join(PROJECT_ROOT, 'backend/data/cars.json');
const CAR_IMAGES_DIR = path.join(PROJECT_ROOT, 'public/assets/images/car_images');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

const cars = JSON.parse(fs.readFileSync(CARS_JSON, 'utf8'));

function getFilesRecursive(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...getFilesRecursive(fullPath));
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.gif'].includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  } catch(e) {}
  return results;
}

function buildImageMap() {
  const map = {};
  if (!fs.existsSync(CAR_IMAGES_DIR)) return map;
  
  const brandDirs = fs.readdirSync(CAR_IMAGES_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
  
  for (const brandDir of brandDirs) {
    const brandPath = path.join(CAR_IMAGES_DIR, brandDir.name);
    let modelDirs;
    try {
      modelDirs = fs.readdirSync(brandPath, { withFileTypes: true }).filter(d => d.isDirectory());
    } catch(e) { continue; }
    
    for (const modelDir of modelDirs) {
      const modelPath = path.join(brandPath, modelDir.name);
      const files = getFilesRecursive(modelPath);
      const relativePaths = files.map(f => '/' + path.relative(PUBLIC_DIR, f));
      
      const key = `${brandDir.name}/${modelDir.name}`;
      map[key] = relativePaths;
    }
  }
  
  // Special case: arcfox t1 has exterior/interior directly under brand (no model folder)
  const arcfoxPath = path.join(CAR_IMAGES_DIR, 'arcfox t1');
  if (fs.existsSync(arcfoxPath)) {
    const files = getFilesRecursive(arcfoxPath);
    const relativePaths = files.map(f => '/' + path.relative(PUBLIC_DIR, f));
    if (relativePaths.length > 0) {
      map['arcfox t1/_root'] = relativePaths;
    }
  }
  
  return map;
}

const imageMap = buildImageMap();
const allKeys = Object.keys(imageMap);

function norm(str) {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/\s+/g, '-');
}

// Manual overrides: car slug/id -> image map key
const manualOverrides = {
  // Deepal S07 (id 1001 is actually Changan Deepal S07)
  'deepal-s07-2025': 'deepal/s07',
  
  // GWM Haval cars -> haval/ folder
  'gwm-haval-jolion-2024': 'haval/jolion',
  'gwm-haval-h6-2024': 'haval/h6',
  
  // Maruti Suzuki cars with suzuki brandSlug -> maruti-suzuki/ or suzuki/ folder
  'suzuki-wagon-r-2025': 'suzuki/wagon-r',
  'suzuki-swift-2025': 'suzuki/swift',
  'suzuki-dzire-2025': 'maruti-suzuki/dzire',
  'suzuki-eeco-2025': 'suzuki/eeco-cargo',
  
  // Arcfox Alpha -> arcfox t1 folder
  'arcfox-alpha': 'arcfox t1/_root',
  
  // Omoda 4 -> chery/omoda-4
  'omoda-4': 'chery/omoda-4',
  
  // Mitsubishi
  'mitsubishi-xpander-2024': 'mitsubishi/xpander',
  'mitsubishi-pajero-sport-2024': 'mitsubishi/pajero sport',
  
  // Isuzu
  'isuzu-dmax-vcross-3-0': 'isuzu/d-max vcross',
  
  // SERES SF5 -> seres/seres3
  'seres-sf5-nepal': 'seres/seres3',
  
  // Riddara RF20 -> riddara/rd6
  'riddara-rf20-nepal': 'riddara/rd6',
  
  // GAC Aion
  'gac-aion-y-2024': 'aion/ut', // closest available
  'gac-aion-v-2024': 'aion/v',
  
  // Jetour  (trailing space)
  'jetour-t2': 'jetour /t2',
  
  // Toyota Land Cruiser 250
  'toyota-land-cruiser-250-2024': 'toyota/land-cruiser-250',
  
  // Ford Ranger Raptor
  'ford-ranger-raptor-2025': 'ford/ranger-raptor',
  
  // Maxus D60
  'maxus-d60-2025': 'maxus/d60',
  
  // Geely Azkarra
  'geely-azkarra-2025': 'geely/azkarra',
  
  // Audi Q4 e-tron (id 702)
  'audi-q4-etron-2025': 'audi/q4-e-tron',
};

function findImages(car) {
  // Check manual overrides first
  if (manualOverrides[car.slug]) {
    const key = manualOverrides[car.slug];
    if (imageMap[key] && imageMap[key].length > 0) {
      return { key, images: imageMap[key] };
    }
  }
  
  const brand = car.brand || '';
  const brandSlug = car.brandSlug || '';
  const model = car.model || '';
  const slug = car.slug || '';
  
  const brandCandidates = [...new Set([
    norm(brandSlug),
    norm(brand),
    brand.toLowerCase().trim(),
  ].filter(Boolean))];
  
  // Brand aliases
  const brandAliasMap = {
    'maruti-suzuki': ['maruti-suzuki', 'suzuki'],
    'suzuki': ['suzuki', 'maruti-suzuki'],
    'tata': ['tata', 'Tata'],
    'mercedes-benz': ['mercedes-benz', 'mercedes'],
    'leapmotor': ['leapmotor', 'leap motors', 'leap-motors'],
    'leap-motors': ['leap-motors', 'leap motors', 'leapmotor'],
    'citroen': ['citroen', 'citron'],
    'citron': ['citron', 'citroen'],
    'icar': ['icar', 'icaur'],
    'icaur': ['icaur', 'icar'],
    'neta': ['neta', 'Neta'],
    'arcfox': ['arcfox', 'arcfox t1'],
    'jetour': ['jetour', 'jetour '],
    'seres': ['seres'],
    'aion': ['aion'],
    'baic': ['baic'],
    'gwm': ['gwm', 'haval'],
    'gwm-haval': ['gwm', 'haval'],
    'gac-aion': ['gac-aion', 'aion'],
    'gac': ['gac', 'aion'],
    'tesla': ['tesla'],
    'volvo': ['volvo'],
    'volkswagen': ['volkswagen', 'volswagen'],
  };
  
  // Get all unique brand folders
  const brandFoldersRaw = [...new Set(allKeys.map(k => k.split('/')[0]))];
  
  let matchedBrands = new Set();
  for (const candidate of brandCandidates) {
    for (const bf of brandFoldersRaw) {
      if (norm(bf) === norm(candidate)) {
        matchedBrands.add(bf);
      }
    }
    const aliases = brandAliasMap[candidate] || [];
    for (const alias of aliases) {
      for (const bf of brandFoldersRaw) {
        if (norm(bf) === norm(alias)) {
          matchedBrands.add(bf);
        }
      }
    }
  }
  
  matchedBrands = [...matchedBrands];
  if (matchedBrands.length === 0) return null;
  
  // Model candidates
  const slugModel = slug.replace(new RegExp(`^${norm(brandSlug)}-`, 'i'), '').replace(/-\d{4}.*$/, '').replace(/-nepal$/, '');
  
  const modelCandidates = [...new Set([
    norm(model),
    model.toLowerCase().trim(),
    model.trim(),
    slugModel,
    norm(slugModel),
  ].filter(Boolean))];
  
  // Model aliases
  const modelAliasMap = {
    'wagon-r': ['wagon-r', 'wagonr'],
    'wagonr': ['wagonr', 'wagon-r'],
    'alto-k10': ['alto-k10', 'alto'],
    'e.mas-7': ['e.mas-7', 'emas-7', 'emas 7'],
    'model-y': ['model-y', 'model Y', 'model y'],
    'avatr-11': ['avatr-11', 'avatr 11'],
    'xc60': ['xc60', 'volvo xc60'],
    'xc90': ['xc90', 'volvo xc90'],
    'punch-facelift': ['punch-facelift', 'punch'],
    'tiago-facelift': ['tiago-facelift', 'tiago', 'Tiago'],
    'rav4-hybrid': ['rav4-hybrid', 'rav4'],
    'creta-electric': ['creta-electric'],
    'forester': ['subaru forestor', 'forestor', 'forester'],
    'q4-e-tron': ['q4-e-tron', 'q4-etron'],
    'q4-etron': ['q4-e-tron', 'q4-etron'],
    'q4-35-e-tron': ['q4-e-tron', 'q4-etron'],
    'glc-300': ['Mercedes-Benz GLC 300', 'glc-300', 'mercedes-benz glc 300'],
    'gla-200': ['gla-200'],
    'ev4': ['ev4'],
    'zs-ev': ['zs-ev'],
    'eeco': ['eeco-cargo', 'eeco'],
    'eeco-cargo': ['eeco-cargo', 'eeco'],
    'jolion': ['jolion'],
    'h6': ['h6'],
    'h9': ['h9'],
    'dargo': ['dargo'],
    'sf5': ['sf5', 'seres3'],
    'rf20': ['rf20', 'rd6'],
    'd-max-v-cross': ['d-max vcross'],
    'dmax-vcross': ['d-max vcross'],
    'mu-x': ['mu-x', 'mux'],
    'aion-y': ['ut', 'aion y'],
    'aion-v': ['v', 'aion v'],
    'ut': ['ut'],
    'xpander': ['xpander'],
    'pajero-sport': ['pajero sport'],
    'bj30': ['bj30'],
    't2': ['t2'],
    'traveller-t2': ['t2'],
    'e-hs9': ['e-hs9'],
    'd60': ['d60'],
  };
  
  for (const brandFolder of matchedBrands) {
    const modelFoldersForBrand = allKeys
      .filter(k => k.startsWith(brandFolder + '/'))
      .map(k => k.split('/')[1]);
    
    // Direct matching
    for (const mc of modelCandidates) {
      for (const mf of modelFoldersForBrand) {
        if (norm(mf) === norm(mc) || mf.toLowerCase().trim() === mc.toLowerCase().trim()) {
          const key = `${brandFolder}/${mf}`;
          if (imageMap[key] && imageMap[key].length > 0) return { key, images: imageMap[key] };
        }
      }
    }
    
    // Alias matching
    for (const mc of modelCandidates) {
      const aliases = modelAliasMap[norm(mc)] || [];
      for (const alias of aliases) {
        for (const mf of modelFoldersForBrand) {
          if (norm(mf) === norm(alias)) {
            const key = `${brandFolder}/${mf}`;
            if (imageMap[key] && imageMap[key].length > 0) return { key, images: imageMap[key] };
          }
        }
      }
    }
    
    // Fuzzy: substring matching
    for (const mf of modelFoldersForBrand) {
      const mfN = norm(mf);
      for (const mc of modelCandidates) {
        const mcN = norm(mc);
        if (mcN.length > 2 && mfN.length > 2 && (mfN.includes(mcN) || mcN.includes(mfN))) {
          const key = `${brandFolder}/${mf}`;
          if (imageMap[key] && imageMap[key].length > 0) return { key, images: imageMap[key] };
        }
      }
    }
  }
  
  return null;
}

function sortImages(images) {
  const ext = images.filter(i => i.toLowerCase().includes('/exterior/'));
  const int = images.filter(i => i.toLowerCase().includes('/interior/'));
  const other = images.filter(i => !i.toLowerCase().includes('/exterior/') && !i.toLowerCase().includes('/interior/'));
  return [...ext, ...int, ...other];
}

let updated = 0, alreadyCorrect = 0, noMatch = 0;
const noMatchList = [], updateLog = [];

for (const car of cars) {
  const match = findImages(car);
  
  if (match) {
    const sorted = sortImages(match.images);
    const oldImages = JSON.stringify(car.images);
    const oldThumb = car.thumb;
    
    car.images = sorted;
    car.thumb = sorted[0];
    
    if (oldImages !== JSON.stringify(sorted) || oldThumb !== sorted[0]) {
      updated++;
      updateLog.push(`✅ UPDATED [${car.id}] ${car.brand} ${car.model} → ${sorted.length} images from ${match.key}`);
    } else {
      alreadyCorrect++;
    }
  } else {
    noMatch++;
    noMatchList.push(`❌ NO MATCH [${car.id}] ${car.brand} ${car.model} (slug: ${car.slug})`);
  }
}

fs.writeFileSync(CARS_JSON, JSON.stringify(cars, null, 2), 'utf8');

console.log('\n========== IMAGE MAPPING REPORT ==========\n');
console.log(`Total cars in DB: ${cars.length}`);
console.log(`Updated: ${updated}`);
console.log(`Already correct: ${alreadyCorrect}`);
console.log(`No image match: ${noMatch}`);

if (updateLog.length) {
  console.log('\n--- Updated Cars ---');
  updateLog.forEach(l => console.log(l));
}

if (noMatchList.length) {
  console.log('\n--- Cars WITHOUT images ---');
  noMatchList.forEach(l => console.log(l));
}

const usedKeys = new Set();
for (const car of cars) {
  const m = findImages(car);
  if (m) usedKeys.add(m.key);
}
const unused = Object.keys(imageMap).filter(k => !usedKeys.has(k));
if (unused.length) {
  console.log('\n--- Unused image folders ---');
  unused.forEach(f => console.log(`  📁 ${f} (${imageMap[f].length} images)`));
}

console.log('\n==========================================\n');
