import json
import re

updates = {
    "Hyundai": {
        "All New Creta FL": {
            "S(O) MT (Made in Nepal)": 6556000,
            "SX MT (Made in Nepal)": 6856000
        },
        "Tucson": {
            "GLX+ 2WD AT (2.0L Petrol)": 14496000
        }
    },
    "Toyota": {
        "Hilux": {
            "2.4L Standard": 12200000,
            "2.8L High": 14900000
        },
        "Fortuner": {
            "2.7 Petrol MT": 27000000,
            "2.8 Diesel AT": 28300000
        },
        "Corolla Cross": {
            "Entry": 18100000,
            "High": 18100000
        },
        "RAV4": {
            "MT Petrol": 21300000,
            "AT Petrol": 21300000,
            "AWD Petrol": 21300000
        },
        "Land Cruiser Prado": {
            "VX": 32200000,
            "VXR": 37900000
        }
    },
    "BYD": {
        "Atto 2": {
            "Standard": 4595000
        },
        "Sealion 7": {
            "Premium RWD": 7985000
        }
    },
    "Deepal": {
        "S07": {
            "Standard Range RWD": 7499000,
            "Long Range RWD": 8499000,
            "Long Range AWD": 8499000
        },
        "L07": {
            "REEV Standard": 6999000,
            "REEV Premium": 6999000
        },
        "S05": {
            "Standard": 5399000,
            "Premium": 5999000
        }
    },
    "Chery": {
        "Omoda E5": {
            "Standard": 5499000,
            "Premium": 5549000
        }
    }
}

def update_js(js_file):
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
            
            if current_db_brand in updates and current_db_model in updates[current_db_brand]:
                model_updates = updates[current_db_brand][current_db_model]
                if current_variant_name in model_updates:
                    new_price = model_updates[current_variant_name]
                    if new_price != old_price:
                        print(f"Updated {current_db_brand} {current_db_model} {current_variant_name} from {old_price} to {new_price}")
                        lines[i] = re.sub(r"price:\s*\d+,", f"price: {new_price},", line)
                    
    with open(js_file, 'w') as f:
        f.write('\n'.join(lines))

if __name__ == '__main__':
    update_js('public/assets/js/data/cars-db.js')
