import re

def list_cars(js_file):
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
            print(f"DB: {current_db_brand} | {current_db_model} | {current_variant_name} -> {old_price}")

if __name__ == '__main__':
    list_cars('public/assets/js/data/cars-db.js')
