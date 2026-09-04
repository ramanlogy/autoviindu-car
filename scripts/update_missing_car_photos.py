#!/usr/bin/env python3
"""Update images/thumb for existing Car rows (phase-1 missing cars that were
inserted with no photos) using newly-sourced real photos in the scratch
missing-cars/images/ folder. UPDATE only, never INSERT.

Usage:
  python3 update_missing_car_photos.py --dry-run
  python3 update_missing_car_photos.py --apply
"""
import os, json, glob, shutil, sqlite3, argparse

PROJECT_ROOT = "/mnt/3EEA50CCEA508257/Downloads/autoviindu-car (2)"
SCRATCH = "/tmp/claude-1000/-mnt-3EEA50CCEA508257-Downloads-autoviindu-car--2-/0166f1b6-bf05-4380-8ed8-18f59c89f9a2/scratchpad/missing-cars"
DB_PATH = os.path.join(PROJECT_ROOT, "dev.db")
IMAGES_DEST_ROOT = os.path.join(PROJECT_ROOT, "public", "assets", "images", "car_images")

TARGET_SLUGS = [
    "bmw-x7-2026", "bmw-ix1-2026", "bmw-ix2-2026",
    "skoda-kylaq-2026", "skoda-slavia-2026",
    "kia-sportage-2026", "kia-sorento-2026", "kia-carnival-2026", "kia-niro-ev-2026", "kia-ev9-2026",
    "hyundai-ioniq-9-2026", "tata-nexon-k3-ev-2026",
    "mahindra-be-6-2026", "mahindra-xev-9e-2026", "mahindra-xev-9s-2026",
]


def model_slug_for(slug, brandSlug, year):
    prefix, suffix = brandSlug + "-", "-" + str(year)
    if slug.startswith(prefix) and slug.endswith(suffix):
        return slug[len(prefix):-len(suffix)]
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    apply_mode = args.apply

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    for slug in TARGET_SLUGS:
        cur.execute("SELECT id, brandSlug, year, images FROM Car WHERE slug = ?", (slug,))
        row = cur.fetchone()
        if not row:
            print(f"SKIP {slug}: not found in dev.db")
            continue
        car_id, brandSlug, year, existing_images = row
        model_slug = model_slug_for(slug, brandSlug, year)
        src_dir = os.path.join(SCRATCH, "images", brandSlug, model_slug)
        if not os.path.isdir(src_dir):
            print(f"SKIP {slug}: no scratch images dir at {src_dir}")
            continue
        files = sorted(os.listdir(src_dir))
        if not files:
            print(f"SKIP {slug}: scratch dir empty")
            continue

        dest_dir = os.path.join(IMAGES_DEST_ROOT, brandSlug, model_slug)
        public_paths = []
        for fname in files:
            public_path = f"/assets/images/car_images/{brandSlug}/{model_slug}/{fname}"
            public_paths.append(public_path)
            if apply_mode:
                os.makedirs(dest_dir, exist_ok=True)
                shutil.copyfile(os.path.join(src_dir, fname), os.path.join(dest_dir, fname))

        thumb = public_paths[0]
        print(f"{'UPDATE' if apply_mode else 'WOULD UPDATE'} {slug}: {len(public_paths)} images -> thumb={thumb}")

        if apply_mode:
            cur.execute(
                "UPDATE Car SET images = ?, thumb = ?, updatedAt = datetime('now') WHERE id = ?",
                (json.dumps(public_paths), thumb, car_id),
            )

    if apply_mode:
        conn.commit()
        print("\nCommitted image updates to dev.db.")
    else:
        print("\nDRY RUN — re-run with --apply to commit.")
    conn.close()


if __name__ == "__main__":
    main()
