import os
import re

directory = '/home/raman/Desktop/autoviindu/public/assets/js'

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.js'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            new_content = content
            
            # Export Rs to window.Rs in app.js
            if file == 'app.js':
                new_content = new_content.replace(
                    'const Rs=n=>n>=100000?`Rs. ${(n/100000).toFixed(2)}L`:`Rs. ${n.toLocaleString()}`;',
                    'const Rs=n=>n>=100000?`Rs. ${(n/100000).toFixed(2)}L`:`Rs. ${n.toLocaleString()}`;\nwindow.Rs = Rs;'
                )

            # Replace explicit 'Rs. ${...variants[0].label}' in template literals
            new_content = re.sub(
                r'Rs\.\s*\$\{\s*([a-zA-Z0-9_]+)\.variants\[0\]\.label\s*\}',
                r'${window.Rs(\1.variants[0].price)}',
                new_content
            )

            # Replace 'Rs. ' + ...variants[0].label in string concatenation
            new_content = re.sub(
                r"'Rs\.\s*'\s*\+\s*([a-zA-Z0-9_]+)\.variants\[0\]\.label",
                r"window.Rs(\1.variants[0].price)",
                new_content
            )

            # Replace any remaining ${...variants[0].label} in template literals
            new_content = re.sub(
                r'\$\{\s*([a-zA-Z0-9_]+)\.variants\[0\]\.label\s*\}',
                r'${window.Rs(\1.variants[0].price)}',
                new_content
            )

            # Replace any remaining ...variants[0].label in string concatenation
            new_content = re.sub(
                r'([a-zA-Z0-9_]+)\.variants\[0\]\.label',
                r'window.Rs(\1.variants[0].price)',
                new_content
            )

            # Update 'data-price-d' assignments where vr.label is used
            new_content = new_content.replace('textContent=vr.label', 'textContent=window.Rs(vr.price)')
            new_content = new_content.replace('${vr.label}', '${window.Rs(vr.price)}')
            new_content = new_content.replace('${v.label}', '${window.Rs(v.price)}')
            new_content = new_content.replace('${v0.label}', '${window.Rs(v0.price)}')
            new_content = new_content.replace('v.label', 'window.Rs(v.price)')
            new_content = new_content.replace('vr.label', 'window.Rs(vr.price)')
            new_content = new_content.replace('v0.label', 'window.Rs(v0.price)')

            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
