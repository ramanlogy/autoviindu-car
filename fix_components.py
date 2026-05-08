import re
import os

with open('public/index.html', 'r') as f:
    html_content = f.read()

# Extract topbar and header
m = re.search(r'(<div class="topbar">.*?</header>)', html_content, re.DOTALL)
if not m:
    print("Could not find topbar/header in index.html")
    exit(1)
header_html = m.group(1).strip()

# Extract footer
m = re.search(r'(<footer class="site-footer".*?</footer>)', html_content, re.DOTALL)
if not m:
    print("Could not find footer in index.html")
    exit(1)
footer_html = m.group(1).strip()

# Fix links in header and footer
header_html = header_html.replace('href="/', 'href="')
footer_html = footer_html.replace('href="/', 'href="')

# Escape backticks and ${}
header_html = header_html.replace('`', '\\`').replace('${', '\\${')
footer_html = footer_html.replace('`', '\\`').replace('${', '\\${')

# Define the script to add AV.goTo if it doesn't exist
fallback_script = """
  // Fallback for pages that don't load app.js
  window.AV = window.AV || {};
  if (!window.AV.goTo) {
    window.AV.goTo = function(page, opts) {
      // Very basic fallback
      window.location.href = 'index.html';
    };
  }
"""

# Read av-nav.js
with open('public/assets/js/components/av-nav.js', 'r') as f:
    nav_js = f.read()

# Replace the HTML in av-nav.js
nav_js = re.sub(r'const topbarHTML = `.*?`;', '', nav_js, flags=re.DOTALL)
nav_js = re.sub(r'const headerHTML = `.*?`;', f'const headerHTML = `\\n{header_html}\\n`;', nav_js, flags=re.DOTALL)

# Add fallback script to the top of av-nav.js IIFE
nav_js = nav_js.replace("'use strict';", "'use strict';" + fallback_script)

# We also need the CSS. Let's just grab the whole <style> block from index.html and put it in a separate shared.css file?
# Actually, the user asked to "restructure the file and change all the link to each other correctly".
# Let's extract all the CSS related to topbar, header, footer, av-* from index.html's style block.
style_match = re.search(r'<style>(.*?)</style>', html_content, re.DOTALL)
if style_match:
    style_content = style_match.group(1)
    
    css_rules = []
    # Simple regex to get top-level rules
    # This is a bit risky if there are media queries. 
    # Let's write the whole style block to public/assets/css/shared-header-footer.css 
    # Wait, the 6000 lines contain EVERYTHING for index.html.
    # It might be safer to extract lines matching `.topbar`, `.site-header`, `.site-footer`, `.av-` 
    pass

print("Extracted header length:", len(header_html))
print("Extracted footer length:", len(footer_html))
