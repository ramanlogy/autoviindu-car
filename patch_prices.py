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
            
        vt = f"{variant} {trim}".strip()
        
        cars.append({
            'brand': current_brand,
            'model': current_model,
            'variant': vt,
            'price': price
        })
    return cars

def simplify(s):
    # alphanumeric only, lowercase
    return re.sub(r'[^a-z0-9]', '', s.lower())

def match_score(db_str, nc_str):
    if not nc_str:
        return 0
    db_s = simplify(db_str)
    nc_s = simplify(nc_str)
    
    if db_s == nc_s:
        return 100
    if nc_s in db_s:
        return len(nc_s) / len(db_s) * 80
    if db_s in nc_s:
        return len(db_s) / len(nc_s) * 80
    return 0

def update_js(tsv_file, js_file):
    new_cars = parse_tsv(tsv_file)
    
    with open(js_file, 'r') as f:
        content = f.read()

    lines = content.split('\n')
    
    current_db_brand = None
    current_db_model = None
    current_variant_name = None
    
    for i, line in enumerate(lines):
        m_brand = re.search(r"^\s*brand:\s*['\"](.*?)['\"]", line)
        if m_brand:
            current_db_brand = m_brand.group(1)
            
        m_model = re.search(r"^\s*model:\s*['\"](.*?)['\"]", line)
        if m_model:
            current_db_model = m_model.group(1)
            
        m_var_name = re.search(r"^\s*name:\s*['\"](.*?)['\"]", line)
        if m_var_name:
            current_variant_name = m_var_name.group(1)
            
        m_price = re.search(r"^\s*price:\s*(\d+),", line)
        if m_price and current_db_brand and current_db_model and current_variant_name:
            old_price = int(m_price.group(1))
            
            best_match = None
            best_score = 0
            
            for nc in new_cars:
                b_score = match_score(current_db_brand, nc['brand'])
                if b_score > 50:
                    m_score = match_score(current_db_model, nc['model'])
                    if m_score > 40:
                        v_score = match_score(current_variant_name, nc['variant'])
                        # if nc variant is empty, we might use model score if variant name is inside nc model
                        if nc['variant'] == "":
                            v_score = match_score(current_variant_name, nc['model'])
                            
                        total_score = b_score + m_score + v_score
                        
                        if total_score > best_score and v_score > 30:
                            best_score = total_score
                            best_match = nc

            if best_match:
                new_price = best_match['price']
                if old_price != new_price:
                    print(f"Update: {current_db_brand} | {current_db_model} | {current_variant_name} -> {old_price} to {new_price} (Matched: {best_match['model']} {best_match['variant']})")
                    lines[i] = re.sub(r"price:\s*\d+,", f"price: {new_price},", line)
                    
    with open(js_file, 'w') as f:
        f.write('\n'.join(lines))

if __name__ == '__main__':
    update_js('new_prices.tsv', 'public/assets/js/data/cars-db.js')
