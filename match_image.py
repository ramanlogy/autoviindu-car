"""
Nepal Car DB — Image Injector for window.CARS_DB
=================================================
Handles the exact format of frontend/assets/js/data/cars-db.js:
  - window.CARS_DB = [ ... ]
  - Unquoted JS keys (id:, slug:, brand:, etc.)
  - JS comments (// and /* */)
  - Trailing commas
  - Replaces only the `images: [ ... ]` array for each car
  - NO JSON parsing — works directly on raw JS text

HOW TO RUN:
  Place this script in your project root (autoviindu/)
  python3 inject_images_carsdb.py

PROJECT LAYOUT EXPECTED:
  autoviindu/
  ├── inject_images_carsdb.py        <- this script
  ├── car_images/                    <- your downloaded images
  │   ├── suzuki/swift/exterior/
  │   ├── toyota/fortuner/interior/
  │   └── ...
  └── frontend/
      └── assets/
          ├── js/data/cars-db.js     <- READ & UPDATED IN PLACE
          └── images/cars/           <- images COPIED here
"""

import re, shutil, sys
from pathlib import Path

# ─── SETTINGS ──────────────────────────────────────────────────────────────
CARS_DB_FILE  = "frontend/assets/js/data/cars-db.js"
IMAGES_SRC    = "car_images"
IMAGES_DST    = "frontend/assets/images/cars"

# Match the path style already in your file: '/frontend/assets/images/cars/...'
WEB_PREFIX    = "/frontend/assets/images/cars"

IMAGE_EXT     = [".jpg", ".jpeg", ".png", ".webp"]
MAX_EXTERIOR  = 4
MAX_INTERIOR  = 2
COPY_IMAGES   = True
FORCE_REPLACE = True   # True = always replace existing images arrays
DRY_RUN       = False  # True = preview only, nothing saved
# ───────────────────────────────────────────────────────────────────────────


def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', str(text).lower()).strip('-')


def find_all_cars(content):
    """
    Scan raw JS content for every car's brand, model, and the
    exact character span of its  images: [ ... ]  block.
    No JSON parsing — pure regex + bracket counting.
    Returns list of dicts sorted by img_start ascending.
    """
    results = []

    for img_match in re.finditer(r'\bimages\s*:\s*\[', content):
        img_start = img_match.start()

        # Count brackets to find the matching closing ]
        bracket_pos = content.index('[', img_start)
        depth = 0
        img_end = None
        for i in range(bracket_pos, len(content)):
            if content[i] == '[':
                depth += 1
            elif content[i] == ']':
                depth -= 1
                if depth == 0:
                    img_end = i + 1
                    break
        if img_end is None:
            continue

        # Look backwards up to 10 000 chars to find brand + model for this car
        lookback = content[max(0, img_start - 10000): img_start]

        brand_val = None
        model_val = None
        # Find LAST occurrence of brand: '...' and model: '...' before this images block
        for m in re.finditer(r'''\bbrand\s*:\s*['"]([^'"]+)['"]''', lookback):
            brand_val = m.group(1)
        for m in re.finditer(r'''\bmodel\s*:\s*['"]([^'"]+)['"]''', lookback):
            model_val = m.group(1)

        if brand_val and model_val:
            results.append({
                "brand":     brand_val,
                "model":     model_val,
                "img_start": img_start,
                "img_end":   img_end,
            })

    return results


def find_image_folder(brand, model):
    """
    Locate car_images/{brand-slug}/{model-slug}/ with fuzzy fallback.
    """
    brand_slug = slugify(brand)
    model_slug = slugify(model)

    # 1. Exact match
    direct = Path(IMAGES_SRC) / brand_slug / model_slug
    if direct.exists():
        return direct

    src = Path(IMAGES_SRC)
    if not src.exists():
        return None

    # 2. Fuzzy brand match
    brand_dir = None
    for d in sorted(src.iterdir()):
        if not d.is_dir():
            continue
        if d.name == brand_slug or brand_slug in d.name or d.name in brand_slug:
            brand_dir = d
            break
    if not brand_dir:
        return None

    # 3. Fuzzy model match inside brand folder
    model_parts = [p for p in model_slug.split('-') if len(p) > 2]
    best, best_score = None, 0
    for d in sorted(brand_dir.iterdir()):
        if not d.is_dir():
            continue
        if d.name == model_slug:
            return d  # perfect match
        score = sum(1 for p in model_parts if p in d.name)
        if score > best_score:
            best_score, best = score, d

    return best if best_score > 0 else None


def get_images(folder):
    """Return valid image files: exterior first, then interior."""
    def ls(d):
        if not d.exists():
            return []
        return sorted([
            f for f in d.iterdir()
            if f.suffix.lower() in IMAGE_EXT and f.stat().st_size > 2000
        ])
    return ls(folder / "exterior")[:MAX_EXTERIOR] + ls(folder / "interior")[:MAX_INTERIOR]


def copy_and_web_path(img_path, brand, model):
    bs = slugify(brand)
    ms = slugify(model)
    dst_dir = Path(IMAGES_DST) / bs / ms
    if COPY_IMAGES and not DRY_RUN:
        dst_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(img_path, dst_dir / img_path.name)
    return f"{WEB_PREFIX}/{bs}/{ms}/{img_path.name}"


def build_images_block(web_paths):
    """Build replacement JS snippet:  images: [ 'path1', 'path2', ... ]"""
    inner = ",\n    ".join(f"'{p}'" for p in web_paths)
    return f"images: [\n    {inner},\n  ]"


def main():
    print("=" * 65)
    print("  Nepal Car DB — JS Image Injector")
    print(f"  Target  : {CARS_DB_FILE}")
    print(f"  Src     : {IMAGES_SRC}/")
    print(f"  Dst     : {IMAGES_DST}/")
    print(f"  Prefix  : {WEB_PREFIX}")
    print(f"  Dry run : {'YES — no files will change' if DRY_RUN else 'NO'}")
    print("=" * 65)

    js_file = Path(CARS_DB_FILE)
    if not js_file.exists():
        print(f"\n❌  Not found: {js_file.resolve()}")
        print("    Run from your project root: cd ~/Desktop/autoviindu")
        sys.exit(1)

    content = js_file.read_text(encoding="utf-8")
    original = content

    cars = find_all_cars(content)
    print(f"\nFound {len(cars)} cars with images: blocks\n")

    if not cars:
        print("❌  No cars found. Is the file path correct?")
        sys.exit(1)

    ok = fail = skip = 0

    # Process in REVERSE order so earlier char positions stay valid
    for car in reversed(cars):
        brand     = car["brand"]
        model     = car["model"]
        img_start = car["img_start"]
        img_end   = car["img_end"]

        existing_block = content[img_start:img_end]

        # Skip if already local and FORCE_REPLACE is off
        if not FORCE_REPLACE:
            has_local = "/frontend/assets/images" in existing_block or \
                        "assets/images/cars" in existing_block
            has_remote = "unsplash" in existing_block or "http" in existing_block
            if has_local and not has_remote:
                print(f"  ⏭  {brand} {model}")
                skip += 1
                continue

        folder = find_image_folder(brand, model)
        if not folder:
            print(f"  ✗  {brand:<20} {model:<25} no folder in {IMAGES_SRC}/")
            fail += 1
            continue

        imgs = get_images(folder)
        if not imgs:
            print(f"  ✗  {brand:<20} {model:<25} folder exists but no images inside")
            fail += 1
            continue

        web_paths = [copy_and_web_path(img, brand, model) for img in imgs]
        new_block = build_images_block(web_paths)
        content   = content[:img_start] + new_block + content[img_end:]

        print(f"  ✓  {brand:<20} {model:<25} {len(web_paths)} images")
        ok += 1

    # Write back
    if not DRY_RUN and content != original:
        backup = js_file.with_suffix(".js.bak")
        shutil.copy2(js_file, backup)
        print(f"\n  💾  Backup  → {backup.name}")
        js_file.write_text(content, encoding="utf-8")
        print(f"  💾  Updated → {CARS_DB_FILE}")
    elif DRY_RUN:
        print("\n  [DRY RUN] No files changed.")
    else:
        print("\n  ⚠️  No changes made (nothing matched or all skipped).")

    print(f"\n{'='*65}")
    print(f"  ✅ Updated  : {ok}")
    print(f"  ✗  No match : {fail}")
    print(f"  ⏭  Skipped  : {skip}")
    print(f"  Total       : {len(cars)}")
    print("=" * 65)

    if fail > 0:
        print(f"""
TIP — For failed cars, check your car_images/ folder matches:
  car_images/{{brand-slug}}/{{model-slug}}/exterior/
  car_images/{{brand-slug}}/{{model-slug}}/interior/

Correct examples:
  car_images/suzuki/swift/
  car_images/maruti-suzuki/grand-vitara/
  car_images/toyota/land-cruiser-prado/
  car_images/bmw/3-series/
  car_images/hyundai/creta-electric/

Run:  ls {IMAGES_SRC}/   to see what folders you have.
""")


if __name__ == "__main__":
    main()