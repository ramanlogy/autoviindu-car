import re

def parse_tsv(filepath):
    cars = []
    current_brand = ""
    current_model = ""
    
    with open(filepath, 'r') as f:
        lines = f.readlines()
        
    for line in lines[1:]:  # Skip header
        parts = line.strip('\n').split('\t')
        if len(parts) < 7:
            parts += [''] * (7 - len(parts))
            
        importer = parts[1].strip()
        brand = parts[2].strip()
        model = parts[3].strip()
        variant = parts[4].strip()
        trim = parts[5].strip()
        price_str = parts[6].strip().replace(',', '')
        
        if brand:
            current_brand = brand
        if model:
            current_model = model
            
        if not price_str:
            continue
            
        try:
            price = int(price_str)
        except:
            continue
            
        cars.append({
            'brand': current_brand,
            'model': current_model,
            'variant': variant,
            'trim': trim,
            'price': price
        })
    return cars

def update_js(tsv_file, js_file):
    new_cars = parse_tsv(tsv_file)
    
    with open(js_file, 'r') as f:
        content = f.read()

    # We will iterate through cars-db.js and update prices
    # Since brand, model, and variants are separated by lines, we can split by 'brand: ' and 'model: '
    
    for car in new_cars:
        print(f"Looking for {car['brand']} - {car['model']} - {car['variant']} {car['trim']} -> {car['price']}")
        
if __name__ == '__main__':
    update_js('new_prices.tsv', 'public/assets/js/data/cars-db.js')
