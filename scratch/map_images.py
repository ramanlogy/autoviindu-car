import json
import os
import re

base_dir = "/home/raman/Desktop/autoviindu/public/assets/images/car_images"

all_images = []
for root, _, files in os.walk(base_dir):
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            all_images.append(os.path.join(root, f))

def get_words(s):
    return [w for w in re.split(r'[^a-z0-9]', str(s).lower()) if w and len(w) > 1]

cars_file = "/home/raman/Desktop/autoviindu/backend/data/cars.json"
with open(cars_file, 'r') as f:
    cars = json.load(f)

updated = 0
for c in cars:
    brand_words = get_words(c.get('brand', ''))
    model_words = get_words(c.get('model', ''))
    
    # Score each image
    best_images = []
    for img in all_images:
        img_lower = img.lower()
        score = 0
        for bw in brand_words:
            if bw in img_lower:
                score += 10
        for mw in model_words:
            if mw in img_lower:
                score += 20
        if "exterior" in img_lower:
            score += 5 # prefer exterior for thumb
        if score > 0:
            best_images.append((score, img))
            
    # Sort by score descending
    best_images.sort(key=lambda x: x[0], reverse=True)
    
    # Filter to only keep highest scoring ones
    if best_images:
        top_score = best_images[0][0]
        # If the top score indicates at least some model match or strong brand match
        if top_score >= 20 or (top_score >= 10 and len(model_words) == 0):
            matched_paths = [img for score, img in best_images if score >= top_score - 10]
            
            web_paths = ["/assets/images/car_images/" + os.path.relpath(p, base_dir) for p in matched_paths]
            web_paths = list(dict.fromkeys(web_paths))
            
            c["images"] = web_paths[:4]
            c["thumb"] = web_paths[0]
            updated += 1

with open(cars_file, 'w') as f:
    json.dump(cars, f, indent=2)

print(f"Updated {updated} cars with matched images from car_images folder.")
