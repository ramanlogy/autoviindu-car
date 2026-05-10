find public/assets/js -type f -name "*.js" -print0 | xargs -0 sed -i 's/\.variants\[0\]\.label/.variants[0].price/g'
