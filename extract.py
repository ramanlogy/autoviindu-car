import re

with open('public/index.html', 'r') as f:
    content = f.read()

# Extract topbar HTML
m = re.search(r'(<div class="topbar">.*?)<header class="site-header"', content, re.DOTALL)
topbar_html = m.group(1).strip() if m else ""

# Extract header HTML
m = re.search(r'(<header class="site-header" id="site-header">.*?</header>)', content, re.DOTALL)
header_html = m.group(1).strip() if m else ""

# Extract footer HTML
m = re.search(r'(<footer class="site-footer">.*?</footer>)', content, re.DOTALL)
footer_html = m.group(1).strip() if m else ""

print("Found topbar:", len(topbar_html))
print("Found header:", len(header_html))
print("Found footer:", len(footer_html))

# Write extracted chunks to check them
with open('topbar.txt', 'w') as f: f.write(topbar_html)
with open('header.txt', 'w') as f: f.write(header_html)
with open('footer.txt', 'w') as f: f.write(footer_html)
