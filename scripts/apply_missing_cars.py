#!/usr/bin/env python3
"""Insert phase-1 missing-car records into dev.db, copying real sourced images
into public/assets/images/car_images/. Reads all brand-group JSON files from
the scratch missing-cars/data/ folder, cross-references the scratch images/
folder, and writes into the Car table.

Usage:
  python3 apply_missing_cars.py --dry-run   # validate + print summary only
  python3 apply_missing_cars.py --apply     # actually copy images + insert rows
"""
import sys, os, json, glob, shutil, sqlite3, argparse

PROJECT_ROOT = "/mnt/3EEA50CCEA508257/Downloads/autoviindu-car (2)"
SCRATCH = "/tmp/claude-1000/-mnt-3EEA50CCEA508257-Downloads-autoviindu-car--2-/0166f1b6-bf05-4380-8ed8-18f59c89f9a2/scratchpad/missing-cars"
DB_PATH = os.path.join(PROJECT_ROOT, "dev.db")
IMAGES_DEST_ROOT = os.path.join(PROJECT_ROOT, "public", "assets", "images", "car_images")

REQUIRED_FIELDS = [
    "slug", "brand", "brandSlug", "model", "year", "type", "bodyType", "body",
    "badge", "budgetTier", "isEV", "isNew", "isFeatured", "isBestSeller",
    "tagline", "rating", "reviews", "expertScore", "baseEMI", "overview",
    "colors", "variants", "specs", "pros", "cons", "highlights",
]


def load_records():
    records = []
    for f in sorted(glob.glob(os.path.join(SCRATCH, "data", "*.json"))):
        data = json.load(open(f))
        for rec in data:
            rec["_source_file"] = os.path.basename(f)
            records.append(rec)
    return records


def model_slug_for(rec):
    slug, brandSlug, year = rec["slug"], rec["brandSlug"], str(rec["year"])
    prefix = brandSlug + "-"
    suffix = "-" + year
    if slug.startswith(prefix) and slug.endswith(suffix):
        return slug[len(prefix):-len(suffix)]
    # fallback: slugify the model name
    return "".join(c if c.isalnum() else "-" for c in rec["model"].lower()).strip("-")


def find_manifest_order(brandSlug, model_slug, manifest_cache):
    for f in glob.glob(os.path.join(SCRATCH, "manifest", "*.json")):
        if f not in manifest_cache:
            manifest_cache[f] = json.load(open(f))
        m = manifest_cache[f]
        if model_slug in m:
            return m[model_slug]
    return None


def gather_images(rec, manifest_cache):
    brandSlug = rec["brandSlug"]
    model_slug = model_slug_for(rec)
    src_dir = os.path.join(SCRATCH, "images", brandSlug, model_slug)
    if not os.path.isdir(src_dir):
        return model_slug, []
    order = find_manifest_order(brandSlug, model_slug, manifest_cache)
    files = os.listdir(src_dir)
    if order:
        ordered = [f for f in order if f in files]
        ordered += [f for f in sorted(files) if f not in ordered]
    else:
        ordered = sorted(files)
    return model_slug, [os.path.join(src_dir, f) for f in ordered]


def validate(rec):
    missing = [f for f in REQUIRED_FIELDS if f not in rec]
    return missing


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="actually copy images + insert into dev.db")
    ap.add_argument("--dry-run", action="store_true", help="validate + print summary only (default)")
    args = ap.parse_args()
    apply_mode = args.apply

    records = load_records()
    print(f"Loaded {len(records)} car records from {SCRATCH}/data/\n")

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    manifest_cache = {}
    inserted, skipped = [], []

    for rec in records:
        missing = validate(rec)
        if missing:
            print(f"SKIP {rec.get('slug','?')}: missing fields {missing}")
            skipped.append(rec.get("slug", "?"))
            continue

        cur.execute("SELECT id FROM Car WHERE slug = ?", (rec["slug"],))
        if cur.fetchone():
            print(f"SKIP {rec['slug']}: slug already exists in dev.db")
            skipped.append(rec["slug"])
            continue

        model_slug, image_srcs = gather_images(rec, manifest_cache)
        dest_dir = os.path.join(IMAGES_DEST_ROOT, rec["brandSlug"], model_slug)
        public_paths = []
        for src in image_srcs:
            fname = os.path.basename(src)
            public_path = f"/assets/images/car_images/{rec['brandSlug']}/{model_slug}/{fname}"
            public_paths.append(public_path)
            if apply_mode:
                os.makedirs(dest_dir, exist_ok=True)
                shutil.copyfile(src, os.path.join(dest_dir, fname))

        thumb = public_paths[0] if public_paths else None

        print(f"{'INSERT' if apply_mode else 'WOULD INSERT'} {rec['slug']}  "
              f"({len(public_paths)} images, {len(rec.get('variants', []))} variants)"
              + ("" if public_paths else "  [NO PHOTOS YET]"))

        if apply_mode:
            cur.execute(
                """
                INSERT INTO Car (
                    slug, brand, brandSlug, model, year, type, bodyType, body, badge, budgetTier,
                    isEV, isNew, isFeatured, isBestSeller, tagline, rating, reviews, expertScore,
                    baseEMI, overview, images, colors, variants, specs, pros, cons, highlights,
                    thumb, createdAt, updatedAt
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))
                """,
                (
                    rec["slug"], rec["brand"], rec["brandSlug"], rec["model"], int(rec["year"]),
                    rec["type"], rec["bodyType"], rec.get("body"), rec.get("badge"), rec.get("budgetTier"),
                    1 if rec["isEV"] else 0, 1 if rec["isNew"] else 0,
                    1 if rec.get("isFeatured") else 0, 1 if rec.get("isBestSeller") else 0,
                    rec.get("tagline"), rec.get("rating"), rec.get("reviews"), rec.get("expertScore"),
                    rec.get("baseEMI"), rec.get("overview"),
                    json.dumps(public_paths), json.dumps(rec.get("colors", [])),
                    json.dumps(rec.get("variants", [])), json.dumps(rec.get("specs", {})),
                    json.dumps(rec.get("pros", [])), json.dumps(rec.get("cons", [])),
                    json.dumps(rec.get("highlights", [])), thumb,
                ),
            )
        inserted.append(rec["slug"])

    if apply_mode:
        conn.commit()
        print(f"\nCommitted {len(inserted)} new Car rows to dev.db.")
    else:
        print(f"\nDRY RUN — would insert {len(inserted)} rows, skip {len(skipped)}. Re-run with --apply to commit.")

    conn.close()


if __name__ == "__main__":
    main()
