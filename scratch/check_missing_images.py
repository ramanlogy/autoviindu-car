import json
import os

cars = json.load(open("/home/raman/Desktop/autoviindu/backend/data/cars.json"))
expected_images = []
for c in cars:
    if c.get("thumb"):
        expected_images.append(c["thumb"])
    if c.get("images"):
        expected_images.extend(c["images"])

expected_images = list(set(expected_images))

missing = []
for img_path in expected_images:
    if not img_path.startswith("/assets/images/cars/"):
        continue
    target_path = os.path.join("/home/raman/Desktop/autoviindu/public", img_path.lstrip("/"))
    if not os.path.exists(target_path):
        missing.append(img_path)

print(f"Total expected: {len(expected_images)}")
print(f"Total missing: {len(missing)}")
for m in missing[:10]:
    print(f"Missing: {m}")
