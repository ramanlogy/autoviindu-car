import re

with open('public/index.html', 'r') as f:
    content = f.read()

m = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if m:
    print("Style block lines:", len(m.group(1).split('\n')))
else:
    print("No <style> block")
