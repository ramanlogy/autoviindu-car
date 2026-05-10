import os
import re

public_dir = '/home/raman/Desktop/autoviindu/public'

# Define all known root files
root_files = [
    'book-service.html', 'car-database-team.html', 'cardatabase.html',
    'dotm-services.html', 'finance.html', 'googlesheet.html', 'index.html',
    'insurance-finance.html', 'insurance-services.html', 'maintenance-repairs.html',
    'other-services.html', 'parts-accessories.html', 'services.html', 'skip.html',
    'videos.html', 'whatcarcanyouaffoard.html'
]

# Walk through all HTML files
for root, _, files in os.walk(public_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            
            # Determine prefix to root
            rel_path = os.path.relpath(filepath, public_dir)
            depth = rel_path.count(os.sep)
            
            if depth == 0:
                prefix = ""
            else:
                prefix = "../" * depth
                
            with open(filepath, 'r') as f:
                content = f.read()

            new_content = content
            
            # Fix typos first
            new_content = new_content.replace('car-servicing-booking.html', 'book-service.html')
            new_content = new_content.replace('insurance-financing.html', 'insurance-finance.html')
            new_content = new_content.replace('/form/maintenanceform           ', 'form/maintenanceform.html')
            new_content = new_content.replace('/form/maintenanceform"', 'form/maintenanceform.html"')
            
            # 1. Replace absolute paths: href="/something" -> href="prefix/something"
            # We use a function to properly avoid replacing external links like href="https://..."
            
            def replace_absolute(m):
                attr = m.group(1)
                path = m.group(2)
                # Ignore empty or just '/'
                if path == '/' or path == '':
                    return f'{attr}="{prefix}index.html"'
                if path.startswith('/'):
                    # remove leading slash and prepend prefix
                    return f'{attr}="{prefix}{path[1:]}"'
                return m.group(0)

            new_content = re.sub(r'(href|src)="(/[^"]*)"', replace_absolute, new_content)
            
            # 2. Fix relative paths that are missing prefix
            # For files in subdirectories, they might link to "assets/..." or "other-services.html"
            if depth > 0:
                def replace_relative(m):
                    attr = m.group(1)
                    path = m.group(2)
                    
                    # If it's already absolute, or starts with http, mailto, tel, #, etc., skip
                    if path.startswith('/') or path.startswith('http') or path.startswith('mailto:') or path.startswith('tel:') or path.startswith('#') or path.startswith('javascript:'):
                        return m.group(0)
                        
                    # If it starts with '../', we assume it's already correct (though we could verify)
                    if path.startswith('../'):
                        return m.group(0)
                        
                    # Check if it's referring to an asset
                    if path.startswith('assets/'):
                        return f'{attr}="{prefix}{path}"'
                        
                    # Check if it's referring to a root html file
                    base_path = path.split('#')[0].split('?')[0]
                    if base_path in root_files:
                        return f'{attr}="{prefix}{path}"'
                        
                    return m.group(0)

                new_content = re.sub(r'(href|src)="([^"]+)"', replace_relative, new_content)
            else:
                # If depth == 0 (root), absolute paths like href="/assets/..." were fixed above.
                # Relative paths like href="assets/..." are already correct.
                pass

            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {rel_path}")

print("Done fixing links.")
