#!/usr/bin/env python3
"""Download images for a car into public/assets/images/car_images/<brand>/<model>/<kind>/
Usage: dl_car_images.py <brandSlug> <modelSlug> <kind: exterior|interior> <url1> <url2> ...
Prints the saved public-relative paths, one per line, on success.
"""
import sys, os, subprocess, hashlib, imghdr

PROJECT_ROOT = "/mnt/3EEA50CCEA508257/Downloads/autoviindu-car (2)"

def main():
    brand, model, kind = sys.argv[1], sys.argv[2], sys.argv[3]
    urls = sys.argv[4:]
    out_dir = os.path.join(PROJECT_ROOT, "public/assets/images/car_images", brand, model, kind)
    os.makedirs(out_dir, exist_ok=True)
    saved = []
    for i, url in enumerate(urls):
        ext_guess = url.split('?')[0].split('.')[-1].lower()
        if ext_guess not in ('jpg','jpeg','png','webp','avif'):
            ext_guess = 'jpg'
        h = hashlib.md5(url.encode()).hexdigest()[:10]
        fname = f"{kind[:3]}-{i+1}-{h}.{ext_guess}"
        fpath = os.path.join(out_dir, fname)
        tmp_path = fpath + ".part"
        try:
            r = subprocess.run(
                ["curl", "-sL", "--max-time", "25", "-A",
                 "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
                 "-o", tmp_path, url],
                capture_output=True, timeout=30
            )
        except Exception as e:
            print(f"FAIL {url} -> {e}", file=sys.stderr)
            continue
        if not os.path.isfile(tmp_path) or os.path.getsize(tmp_path) < 5000:
            print(f"FAIL(small/missing) {url}", file=sys.stderr)
            if os.path.isfile(tmp_path): os.remove(tmp_path)
            continue
        kind_check = imghdr.what(tmp_path)
        if kind_check is None:
            # webp/avif sometimes not detected by imghdr; check magic bytes
            with open(tmp_path, 'rb') as f:
                head = f.read(16)
            if not (head[:4] == b'RIFF' or head[4:8] == b'ftyp' or head[:3] == b'\xff\xd8\xff'):
                print(f"FAIL(not-image) {url}", file=sys.stderr)
                os.remove(tmp_path)
                continue
            if head[:4] == b'RIFF':
                kind_check = 'webp'
            elif head[4:8] == b'ftyp':
                kind_check = 'avif'
        real_ext = {'jpeg':'jpg','jpg':'jpg','png':'png','webp':'webp','avif':'avif'}.get(kind_check, ext_guess)
        final_path = fpath.rsplit('.',1)[0] + '.' + real_ext
        os.replace(tmp_path, final_path)
        rel = '/' + os.path.relpath(final_path, os.path.join(PROJECT_ROOT, 'public'))
        saved.append(rel)
        print(rel)
    return 0

if __name__ == '__main__':
    sys.exit(main())
