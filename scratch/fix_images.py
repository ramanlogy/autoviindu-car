import json
import os
import shutil

base_car_images = "/home/raman/Desktop/autoviindu/public/assets/images/car_images"
base_cars = "/home/raman/Desktop/autoviindu/public/assets/images/cars"

# Find all files in car_images
all_files = []
for root, dirs, files in os.walk(base_car_images):
    for f in files:
        all_files.append(os.path.join(root, f))

# Map filename to its full path
file_map = {os.path.basename(f): f for f in all_files}

# Check cars.json for expected paths
cars = json.load(open("/home/raman/Desktop/autoviindu/backend/data/cars.json"))
expected_images = []
for c in cars:
    if c.get("thumb"):
        expected_images.append(c["thumb"])
    if c.get("images"):
        expected_images.extend(c["images"])

# Create symlinks or copy
copied = 0
for img_path in set(expected_images):
    if not img_path.startswith("/assets/images/cars/"):
        continue
    
    # Target path in public
    target_path = os.path.join("/home/raman/Desktop/autoviindu/public", img_path.lstrip("/"))
    
    if os.path.exists(target_path):
        continue # Already exists
    
    filename = os.path.basename(img_path)
    if filename in file_map:
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        shutil.copy2(file_map[filename], target_path)
        copied += 1

print(f"Copied {copied} images to match cars.json paths.")
