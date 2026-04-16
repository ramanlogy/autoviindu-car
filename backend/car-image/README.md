# Nepal Car Database – Image Asset Structure
## 1,356 image slots across 113 car models | 22 brands

---

## 📁 FOLDER STRUCTURE

```
car_images/
├── README.md              ← This file
├── IMAGE_MANIFEST.txt     ← Full list of all filenames expected
├── SOURCE_GUIDE.md        ← Where to download images (free & legal)
│
├── audi/
│   ├── q3/
│   │   ├── exterior/
│   │   │   ├── audi-q3-exterior-front-white-bg.jpg
│   │   │   ├── audi-q3-exterior-rear-white-bg.jpg
│   │   │   ├── audi-q3-exterior-side-left-white-bg.jpg
│   │   │   ├── audi-q3-exterior-side-right-white-bg.jpg
│   │   │   ├── audi-q3-exterior-three-quarter-front-white-bg.jpg
│   │   │   └── audi-q3-exterior-three-quarter-rear-white-bg.jpg
│   │   └── interior/
│   │       ├── audi-q3-interior-dashboard.jpg
│   │       ├── audi-q3-interior-seats-front.jpg
│   │       ├── audi-q3-interior-seats-rear.jpg
│   │       ├── audi-q3-interior-infotainment.jpg
│   │       ├── audi-q3-interior-steering-wheel.jpg
│   │       └── audi-q3-interior-cargo-space.jpg
│   ├── q4-e-tron/
│   ├── q5/
│   ├── q7/
│   └── a4/
│
├── bmw/
├── byd/
├── chery/
├── deepal/
├── ford/
├── geely/
├── haval/
├── hyundai/
├── kia/
├── mahindra/
├── maruti-suzuki/
├── maxus/
├── nissan/
├── proton/
├── renault/
├── riddara/
├── suzuki/
├── toyota/
└── volkswagen/
```

---

## 🏷️ SEO NAMING CONVENTION

### Exterior (white/plain background):
`{brand}-{model}-exterior-{angle}-white-bg.jpg`

**Angles used:**
| Slug | Description |
|---|---|
| `front` | Straight-on front shot |
| `rear` | Straight-on rear shot |
| `side-left` | Full side profile, driver side |
| `side-right` | Full side profile, passenger side |
| `three-quarter-front` | 3/4 angle from front-left |
| `three-quarter-rear` | 3/4 angle from rear-right |

### Interior:
`{brand}-{model}-interior-{view}.jpg`

**Views used:**
| Slug | Description |
|---|---|
| `dashboard` | Full dashboard view |
| `seats-front` | Front seats |
| `seats-rear` | Rear seats/legroom |
| `infotainment` | Screen/touchscreen close-up |
| `steering-wheel` | Steering wheel & cluster |
| `cargo-space` | Boot/trunk/bed area |

---

## ✅ IMAGE SPECS RECOMMENDED

| Property | Value |
|---|---|
| Format | JPG (exterior), JPG (interior) |
| Resolution | Minimum 1200×800px |
| Exterior BG | Pure white (#FFFFFF) or transparent PNG |
| Color profile | sRGB |
| File size | Keep under 300KB (compress with TinyPNG) |

