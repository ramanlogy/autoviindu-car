#!/usr/bin/env python3
"""Update Car.images and Car.thumb in dev.db for a given slug.
Usage: update_car_images_db.py <slug> <path1> <path2> ...
First path becomes thumb.
"""
import sys, sqlite3, json, os

PROJECT_ROOT = "/mnt/3EEA50CCEA508257/Downloads/autoviindu-car (2)"

def main():
    slug = sys.argv[1]
    paths = sys.argv[2:]
    if not paths:
        print("no paths given", file=sys.stderr)
        return 1
    conn = sqlite3.connect(os.path.join(PROJECT_ROOT, "dev.db"))
    cur = conn.cursor()
    images_json = json.dumps(paths)
    thumb = paths[0]
    cur.execute("UPDATE Car SET images = ?, thumb = ?, updatedAt = datetime('now') WHERE slug = ?", (images_json, thumb, slug))
    conn.commit()
    print(f"Updated {slug}: {cur.rowcount} row(s), {len(paths)} images")
    conn.close()
    return 0

if __name__ == '__main__':
    sys.exit(main())
