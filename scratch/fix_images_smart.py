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

cars = json.load(open("/home/raman/Desktop/autoviindu/backend/data/cars.json"))
expected_images = []
for c in cars:
    if c.get("thumb"):
        expected_images.append(c["thumb"])
    if c.get("images"):
        expected_images.extend(c["images"])

# Make unique
expected_images = list(set(expected_images))

copied = 0

for img_path in expected_images:
    if not img_path.startswith("/assets/images/cars/"):
        continue
    
    parts = img_path.split("/")
    if len(parts) < 6:
        continue
        
    brand = parts[-3].lower()
    model = parts[-2].lower()
    filename = parts[-1].lower()
    
    target_path = os.path.join("/home/raman/Desktop/autoviindu/public", img_path.lstrip("/"))
    if os.path.exists(target_path):
        continue
        
    # Find best match in car_images
    best_match = None
    for f in all_files:
        f_lower = f.lower()
        if filename in f_lower:
            # check if brand and model are in the path somewhere
            if brand in f_lower or model in f_lower:
                best_match = f
                break
            # if neither brand nor model in path, keep as fallback but continue
            if not best_match:
                best_match = f
                
    if best_match:
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        shutil.copy2(best_match, target_path)
        copied += 1

print(f"Smarter copy: copied {copied} more images.")
