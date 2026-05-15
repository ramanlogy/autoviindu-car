import os
import re

files = [
    "public/form/partsandacc.html",
    "public/form/maintenanceform.html",
    "public/form/otherserviceform.html",
    "public/form/insuranceform.html",
    "public/form/dotmform.html",
    "public/insurance-services.html"
]

fetch_code = """
    // Collect data automatically
    const data = { formId: form.id || type || 'unknown' };
    const elements = form.querySelectorAll('input, select, textarea');
    elements.forEach((el, i) => {
      let label = el.name || el.placeholder;
      if (!label) {
        const group = el.closest('.form-group') || el.closest('div');
        if (group) {
          const lblEl = group.querySelector('.form-label') || group.querySelector('label');
          if (lblEl) label = lblEl.innerText.replace('*', '').trim();
        }
      }
      if (!label) label = 'field_' + i;
      
      if (el.type === 'radio' || el.type === 'checkbox') {
        if (el.checked) data[label] = el.value || 'checked';
      } else {
        data[label] = el.value;
      }
    });

    fetch('/api/forms/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(err => console.error(err));
"""

for f in files:
    path = os.path.join('/home/raman/Desktop/autoviindu', f)
    if not os.path.exists(path):
        print(f"Skipping {f}, not found")
        continue
    with open(path, 'r') as file:
        content = file.read()
    
    # We inject the fetch_code right after e.preventDefault();
    if "fetch('/api/forms/submit'" not in content:
        new_content = re.sub(
            r'(e\.preventDefault\(\);)', 
            r'\1\n    const form = e.target;\n    const type = arguments.length > 1 ? arguments[1] : null;' + fetch_code, 
            content
        )
        with open(path, 'w') as file:
            file.write(new_content)
        print(f"Updated {f}")
    else:
        print(f"Already updated {f}")
        
print("Forms updated.")
