# AutoViindu – Images Folder Guide
# ═══════════════════════════════════════════════

## Folder Structure

assets/images/
├── cars/               ← Car photos (main shots, gallery, interior)
├── brands/             ← Brand logos (PNG, transparent background)
├── services/           ← Service photos (detailing, workshop, etc.)
├── banners/            ← Homepage & section hero banners
├── og/                 ← Open Graph / social sharing images
├── icons/              ← App icons (PWA, favicon variants)
└── team/               ← Team member photos (optional)


## Naming Convention

### Cars folder:
  {slug}-1.jpg          ← Main hero/exterior shot (used in listings)
  {slug}-2.jpg          ← Second gallery shot
  {slug}-3.jpg          ← Interior shot
  {slug}-4.jpg          ← Detail / angle shot
  {slug}-thumb.jpg      ← Optimized thumbnail (400×250)

  Example:
    mg-hector-2024-1.jpg
    mg-hector-2024-2.jpg
    toyota-prius-2024-1.jpg

### Brands folder:
  {brand-lowercase}.png          ← Brand logo (200×80, transparent PNG)
  {brand-lowercase}-white.png    ← White version for dark backgrounds

  Example:
    mg.png
    toyota.png
    hyundai.png

### Banners folder:
  hero-desktop.jpg      ← Homepage hero (1920×680)
  hero-mobile.jpg       ← Mobile hero (768×480)
  ev-banner.jpg         ← Electric cars section banner
  service-banner.jpg    ← Services section banner
  used-cars-banner.jpg  ← Used cars banner

### OG (Open Graph) folder:
  home.jpg              ← Homepage (1200×630)
  new-cars.jpg          ← Cars listing page (1200×630)
  electric-cars.jpg     ← EV page (1200×630)
  logo.png              ← Logo for schema markup (512×512)
  favicon.ico           ← Favicon (32×32, 16×16)
  favicon-32.png        ← PNG favicon (32×32)
  apple-touch-icon.png  ← iOS home screen icon (180×180)

### Icons folder (for PWA manifest.json):
  icon-72x72.png
  icon-96x96.png
  icon-128x128.png
  icon-144x144.png
  icon-152x152.png
  icon-192x192.png      ← Required for Android PWA
  icon-384x384.png
  icon-512x512.png      ← Required for install prompt


## Image Specs & Best Practices

| Use Case          | Format | Size        | Max File Size |
|-------------------|--------|-------------|---------------|
| Car main photo    | JPEG   | 900×560     | 150 KB        |
| Car thumbnail     | JPEG   | 400×250     | 50 KB         |
| Brand logo        | PNG    | 200×80      | 20 KB         |
| Hero banner       | JPEG   | 1920×680    | 300 KB        |
| OG image          | JPEG   | 1200×630    | 200 KB        |
| App icon          | PNG    | varies      | 30 KB each    |

- Use WebP format where possible for 30% smaller files
- Always compress with tinypng.com or squoosh.app before uploading
- Keep alt text descriptive: "MG Hector 2024 Price in Nepal"
- Car images: use white/light backgrounds for consistency


## How Car Images are Used in cars-data.js

In cars-data.js, each car has an `images` array:
  images: [
    "assets/images/cars/mg-hector-2024-1.jpg",   // main photo
    "assets/images/cars/mg-hector-2024-2.jpg",   // gallery 2
    "assets/images/cars/mg-hector-2024-3.jpg",   // gallery 3
    "assets/images/cars/mg-hector-2024-4.jpg",   // gallery 4
  ]

IMPORTANT: Replace the Unsplash placeholder URLs in cars-data.js
with your actual local image paths once you upload photos.


## Quick Checklist Before Launch

[ ] Upload car photos for all 8+ cars in cars-data.js
[ ] Create brand logos for MG, Toyota, Kia, Honda, Hyundai, BYD, Suzuki
[ ] Design/generate OG images (1200×630) for home, cars, EV pages
[ ] Create favicon.ico and apple-touch-icon.png
[ ] Generate 8 PWA icon sizes (see icons/ folder)
[ ] Upload hero banners for homepage
[ ] Test images load correctly on mobile (check lazy loading)