const express = require('express');
const app = express();
const PORT = 3000;

// Serve everything in /public as static files
app.use(express.static('public'));

// API endpoint — returns list of cars with image URLs
app.get('/api/cars', (req, res) => {
  const cars = [
    {
      id: 1,
      name: 'Suzuki Swift',
      price: 2800000,
      image: '/images/suzuki-swift.jpg'
    },
    {
      id: 2,
      name: 'Riddara EV',
      price: 4500000,
      image: '/images/riddara-ev.jpg'
    },
    // add more cars here
  ];
  res.json(cars);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});