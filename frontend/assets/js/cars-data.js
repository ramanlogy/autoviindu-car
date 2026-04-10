/* ═══════════════════════════════════════════════
   AUTOVIINDU — CARS DATABASE
   Scalable: add entries to CARS_DB array.
   Each car: id, brand, model, slug, year, type,
   body, badge, price (array by variant),
   specs, features, variants, colors, images
═══════════════════════════════════════════════ */
window.CARS_DB = [
  {
    id: 1,
    slug: "mg-hector-2024",
    brand: "MG",
    model: "Hector",
    year: 2024,
    type: "Petrol",
    body: "SUV",
    badge: "popular",
    tagline: "Connected SUV at its best",
    rating: 4.3,
    reviews: 342,
    expertScore: 8.2,
    baseEMI: 11094,
    overview: "The MG Hector redefines the connected SUV experience in Nepal. With its striking design, massive 14\" infotainment system, and 5 well-defined variants, it lets you choose exactly how much tech and luxury you want.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=560&fit=crop&q=85",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=560&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1547744152-14d985cb937f?w=900&h=560&fit=crop",
    ],
    colors: [
      { name: "Midnight Black", hex: "#1A1A2E" },
      { name: "Carnival Red", hex: "#C0392B" },
      { name: "Aurora Silver", hex: "#BDC3C7" },
      { name: "Candy White", hex: "#ECF0F1" },
      { name: "Starry Forest", hex: "#1A6B2A" },
    ],
    variants: [
      {
        name: "Style",
        price: 2598000,
        label: "Rs. 25.98L",
        popular: false,
        transmission: "MT",
        fuel: "Petrol",
        features: ["1.5L Turbo Petrol", "14\" iSmart Screen", "Rear Camera", "6 Airbags", "17\" Alloys"],
        specs: { power: "141 hp", torque: "250 Nm", efficiency: "15.8 km/l", transmission: "6MT" }
      },
      {
        name: "Super",
        price: 2798000,
        label: "Rs. 27.98L",
        popular: false,
        transmission: "CVT",
        fuel: "Petrol",
        features: ["Electric Sunroof", "Rear AC Vents", "Cruise Control", "360° Camera", "Style features+"],
        specs: { power: "141 hp", torque: "250 Nm", efficiency: "15.2 km/l", transmission: "CVT" }
      },
      {
        name: "Smart",
        price: 3078000,
        label: "Rs. 30.78L",
        popular: true,
        transmission: "CVT",
        fuel: "Petrol",
        features: ["Connected Car Tech", "Wireless Charging", "ADAS Level 1", "Wireless CarPlay", "Super features+"],
        specs: { power: "141 hp", torque: "250 Nm", efficiency: "15.2 km/l", transmission: "CVT" }
      },
      {
        name: "Sharp",
        price: 3328000,
        label: "Rs. 33.28L",
        popular: false,
        transmission: "CVT",
        fuel: "Petrol",
        features: ["Ventilated Front Seats", "BOSE 6-Speaker", "Heated Rear Seats", "Dual-zone Climate", "Smart features+"],
        specs: { power: "141 hp", torque: "250 Nm", efficiency: "15.2 km/l", transmission: "CVT" }
      },
      {
        name: "Savvy",
        price: 3650000,
        label: "Rs. 36.50L",
        popular: false,
        transmission: "CVT",
        fuel: "Petrol",
        features: ["Panoramic Sunroof", "Level 2 ADAS", "Head-Up Display", "Premium LED DRL", "Sharp features+"],
        specs: { power: "141 hp", torque: "250 Nm", efficiency: "15.2 km/l", transmission: "CVT" }
      },
    ],
    specs: {
      "Engine": "1.5L Turbo Petrol",
      "Power": "141 hp @ 5,000 rpm",
      "Torque": "250 Nm @ 1,600 rpm",
      "Fuel Efficiency": "15.8 km/l",
      "Fuel Tank": "60 L",
      "Transmission": "CVT / 6MT",
      "0–100 km/h": "10.4 sec",
      "Top Speed": "185 km/h",
      "Drive": "FWD",
      "Seating": "5",
      "Boot Space": "587 L",
      "Wheelbase": "2,750 mm",
      "Length": "4,655 mm",
      "Ground Clearance": "192 mm",
      "Kerb Weight": "1,514 kg"
    },
    pros: ["Massive 587L boot space", "5 well-differentiated variants", "14\" screen is best-in-class", "Good ground clearance for Nepal", "Competitive pricing"],
    cons: ["CVT sluggish on steep climbs", "Petrol only — no diesel/hybrid", "Infotainment can occasionally lag", "Rear legroom just average"],
    highlights: ["587L Boot", "14\" iSmart", "6 Airbags", "192mm Ground Clearance"]
  },
  {
    id: 2,
    slug: "hyundai-ioniq5-2024",
    brand: "Hyundai",
    model: "IONIQ 5",
    year: 2024,
    type: "Electric",
    body: "SUV",
    badge: "ev",
    tagline: "800V ultra-fast charging EV",
    rating: 4.6,
    reviews: 89,
    expertScore: 9.1,
    baseEMI: 22200,
    overview: "The IONIQ 5 brings 800V ultra-rapid charging to Nepal — charge 10–80% in just 18 minutes. Its flat-floor interior and AWD variants make it the most practical premium EV available today.",
    images: [
      "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&h=560&fit=crop",
    ],
    colors: [
      { name: "Abyss Black", hex: "#1B2A3B" },
      { name: "Atlas White", hex: "#F5F5F0" },
      { name: "Cyber Gray", hex: "#7F8C8D" },
      { name: "Digital Teal", hex: "#2E7D32" },
    ],
    variants: [
      {
        name: "Standard Range",
        price: 5200000,
        label: "Rs. 52L",
        popular: false,
        transmission: "Auto",
        fuel: "Electric",
        features: ["58 kWh Battery", "325 km Range", "220V AC Charging", "FWD", "12.3\" Dual Screens"],
        specs: { power: "170 hp", torque: "350 Nm", efficiency: "325 km", transmission: "Single-speed" }
      },
      {
        name: "Long Range RWD",
        price: 5800000,
        label: "Rs. 58L",
        popular: true,
        transmission: "Auto",
        fuel: "Electric",
        features: ["72.6 kWh Battery", "481 km Range", "800V DC Fast Charging", "V2L 3.6kW", "Relaxation Seats"],
        specs: { power: "225 hp", torque: "350 Nm", efficiency: "481 km", transmission: "Single-speed" }
      },
      {
        name: "Long Range AWD",
        price: 6500000,
        label: "Rs. 65L",
        popular: false,
        transmission: "Auto",
        fuel: "Electric",
        features: ["AWD Dual Motor", "306 hp", "5.1 sec 0-100", "HDA Highway Assist", "All LR RWD features"],
        specs: { power: "306 hp", torque: "605 Nm", efficiency: "481 km", transmission: "Single-speed AWD" }
      },
    ],
    specs: {
      "Battery": "72.6 kWh (Long Range)",
      "Motor Power": "225 kW (306 hp AWD)",
      "Torque": "605 Nm (AWD)",
      "Range (WLTP)": "481 km",
      "AC Charging": "11 kW",
      "DC Fast Charging": "220 kW (800V)",
      "0–100 km/h": "5.1 sec",
      "Top Speed": "185 km/h",
      "Drive": "AWD available",
      "Seating": "5",
      "Boot Space": "527 L",
      "Wheelbase": "3,000 mm",
      "Length": "4,635 mm",
      "Ground Clearance": "160 mm",
      "Kerb Weight": "2,100 kg"
    },
    pros: ["Best-in-class 800V charging", "Flat-floor spacious interior", "V2L perfect for Nepal load-shedding", "AWD option available", "Premium build quality"],
    cons: ["Very high price", "Limited Hyundai EV service centers", "DC charging network sparse", "Heavy at 2,100 kg"],
    highlights: ["800V Charging", "481km Range", "V2L Capable", "AWD Option"]
  },
  {
    id: 3,
    slug: "kia-seltos-2024",
    brand: "Kia",
    model: "Seltos",
    year: 2024,
    type: "Diesel",
    body: "SUV",
    badge: "popular",
    tagline: "#1 selling compact SUV in Nepal",
    rating: 4.3,
    reviews: 678,
    expertScore: 8.3,
    baseEMI: 12173,
    overview: "The Kia Seltos continues to dominate Nepal's compact SUV segment with class-leading diesel torque, extensive features, and the widest service coverage across Nepal.",
    images: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=900&h=560&fit=crop",
    ],
    colors: [
      { name: "Glacier White", hex: "#ECF0F1" },
      { name: "Imperial Red", hex: "#E74C3C" },
      { name: "Pewter Olive", hex: "#5D6D4E" },
      { name: "Aurora Black", hex: "#1A1A2E" },
      { name: "Intense Blue", hex: "#2C3E7F" },
    ],
    variants: [
      {
        name: "HTX",
        price: 2850000,
        label: "Rs. 28.50L",
        popular: false,
        transmission: "AT",
        fuel: "Diesel",
        features: ["1.5L CRDi Diesel", "10.25\" Touchscreen", "Rear Camera", "6 Airbags", "ESP + Hill Assist"],
        specs: { power: "115 hp", torque: "250 Nm", efficiency: "21.4 km/l", transmission: "6-Speed AT" }
      },
      {
        name: "HTX+",
        price: 3120000,
        label: "Rs. 31.20L",
        popular: true,
        transmission: "AT",
        fuel: "Diesel",
        features: ["Panoramic Sunroof", "Wireless Charging", "360° Camera", "Ventilated Seats", "HTX features+"],
        specs: { power: "115 hp", torque: "250 Nm", efficiency: "21.4 km/l", transmission: "6-Speed AT" }
      },
      {
        name: "GTX+",
        price: 3450000,
        label: "Rs. 34.50L",
        popular: false,
        transmission: "AT",
        fuel: "Diesel",
        features: ["BOSE 8-Speaker", "8 Airbags", "ADAS Pack", "Blind Spot Monitor", "HTX+ features+"],
        specs: { power: "115 hp", torque: "250 Nm", efficiency: "21.4 km/l", transmission: "6-Speed AT" }
      },
      {
        name: "GTX+ AWD",
        price: 3800000,
        label: "Rs. 38L",
        popular: false,
        transmission: "AT",
        fuel: "Diesel",
        features: ["AWD Drive System", "5 Terrain Modes", "e-LSD", "Heavy-duty Suspension", "GTX+ features+"],
        specs: { power: "115 hp", torque: "250 Nm", efficiency: "18.9 km/l", transmission: "6-Speed AT AWD" }
      },
    ],
    specs: {
      "Engine": "1.5L U2 CRDi Diesel",
      "Power": "115 hp @ 4,000 rpm",
      "Torque": "250 Nm @ 1,500 rpm",
      "Fuel Efficiency": "21.4 km/l",
      "Fuel Tank": "50 L",
      "Transmission": "6-Speed AT",
      "0–100 km/h": "11.2 sec",
      "Top Speed": "175 km/h",
      "Drive": "FWD / AWD",
      "Seating": "5",
      "Boot Space": "433 L",
      "Wheelbase": "2,610 mm",
      "Length": "4,315 mm",
      "Ground Clearance": "190 mm",
      "Kerb Weight": "1,490 kg"
    },
    pros: ["Best diesel torque in class (250 Nm)", "Widest Kia service network Nepal", "AWD option available", "BOSE audio on GTX+", "4 sensibly-priced variants"],
    cons: ["Diesel NVH at idle", "Rear headroom average", "Base trim misses sunroof", "Some features overpriced on top"],
    highlights: ["250 Nm Diesel", "AWD Option", "21.4 km/l", "10.25\" Screen"]
  },
  {
    id: 4,
    slug: "toyota-prius-2024",
    brand: "Toyota",
    model: "Prius",
    year: 2024,
    type: "Hybrid",
    body: "Sedan",
    badge: "hybrid",
    tagline: "Best fuel efficiency in Nepal – 26 km/l",
    rating: 4.4,
    reviews: 212,
    expertScore: 8.7,
    baseEMI: 14952,
    overview: "The all-new 5th gen Toyota Prius is dramatically redesigned with a dramatic low-slung profile and class-leading 26 km/l efficiency. A masterpiece of hybrid engineering.",
    images: [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=900&h=560&fit=crop",
    ],
    colors: [
      { name: "Platinum White Pearl", hex: "#ECF0F1" },
      { name: "Black", hex: "#1A1A2E" },
      { name: "Emotional Red", hex: "#E74C3C" },
      { name: "Amethyst", hex: "#8E44AD" },
      { name: "Wind Chill Pearl", hex: "#D6EAF8" },
    ],
    variants: [
      {
        name: "E",
        price: 3500000,
        label: "Rs. 35L",
        popular: false,
        transmission: "e-CVT",
        fuel: "Hybrid",
        features: ["1.8L HEV Hybrid", "26 km/l", "12.3\" Display", "Toyota Safety Sense", "LED Headlights"],
        specs: { power: "121 hp combined", torque: "142 Nm", efficiency: "26 km/l", transmission: "e-CVT" }
      },
      {
        name: "G",
        price: 3800000,
        label: "Rs. 38L",
        popular: true,
        transmission: "e-CVT",
        fuel: "Hybrid",
        features: ["Wireless CarPlay/Android", "JBL 8-Speaker", "Electric Sunroof", "Head-Up Display", "E features+"],
        specs: { power: "121 hp combined", torque: "142 Nm", efficiency: "26 km/l", transmission: "e-CVT" }
      },
      {
        name: "Z",
        price: 4200000,
        label: "Rs. 42L",
        popular: false,
        transmission: "e-CVT",
        fuel: "Hybrid",
        features: ["Panoramic View Monitor", "Ventilated Front Seats", "Ambient Lighting", "Digital Rear Mirror", "G features+"],
        specs: { power: "121 hp combined", torque: "142 Nm", efficiency: "26 km/l", transmission: "e-CVT" }
      },
    ],
    specs: {
      "Engine": "1.8L Atkinson Cycle + Electric",
      "Combined Power": "121 hp",
      "Torque": "142 Nm",
      "Fuel Efficiency": "26 km/l",
      "Fuel Tank": "43 L",
      "Transmission": "e-CVT",
      "0–100 km/h": "10.6 sec",
      "Top Speed": "180 km/h",
      "Drive": "FWD",
      "Seating": "5",
      "Boot Space": "401 L",
      "Wheelbase": "2,750 mm",
      "Length": "4,600 mm",
      "Kerb Weight": "1,420 kg"
    },
    pros: ["Nepal's best fuel efficiency (26 km/l)", "Legendary Toyota reliability", "Very low running cost", "TSS 3.0 safety comprehensive", "Excellent resale value"],
    cons: ["Not driver-focused", "e-CVT hesitant on overtakes", "Boot space reduced vs old gen", "Firm ride on rough roads"],
    highlights: ["26 km/l", "Toyota Safety Sense", "JBL Audio", "Hybrid"]
  },
  {
    id: 5,
    slug: "honda-city-2024",
    brand: "Honda",
    model: "City",
    year: 2024,
    type: "Petrol",
    body: "Sedan",
    badge: "popular",
    tagline: "Nepal's best-loved sedan, now smarter",
    rating: 4.2,
    reviews: 445,
    expertScore: 8.1,
    baseEMI: 8324,
    overview: "The Honda City has been Nepal's top-selling sedan for over a decade. With Honda SENSING standard on V and above, it brings a new safety dimension to this segment.",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=900&h=560&fit=crop",
    ],
    colors: [
      { name: "Platinum White", hex: "#ECF0F1" },
      { name: "Midnight Blue", hex: "#1A2A4A" },
      { name: "Radiant Red", hex: "#E74C3C" },
      { name: "Meteoroid Gray", hex: "#7F8C8D" },
    ],
    variants: [
      {
        name: "S",
        price: 1950000,
        label: "Rs. 19.50L",
        popular: false,
        transmission: "MT",
        fuel: "Petrol",
        features: ["1.5L i-VTEC Petrol", "7\" Honda CONNECT", "6 Airbags", "Rear Camera", "LED Headlights"],
        specs: { power: "119 hp", torque: "145 Nm", efficiency: "18.4 km/l", transmission: "6-Speed MT" }
      },
      {
        name: "V",
        price: 2200000,
        label: "Rs. 22L",
        popular: true,
        transmission: "MT",
        fuel: "Petrol",
        features: ["8\" Touchscreen", "Honda SENSING", "Electric Sunroof", "Lane Watch Camera", "S features+"],
        specs: { power: "119 hp", torque: "145 Nm", efficiency: "18.4 km/l", transmission: "6-Speed MT" }
      },
      {
        name: "VX",
        price: 2450000,
        label: "Rs. 24.50L",
        popular: false,
        transmission: "MT",
        fuel: "Petrol",
        features: ["Wireless CarPlay", "Ventilated Front Seats", "Bose Audio", "Ambient Lighting", "V features+"],
        specs: { power: "119 hp", torque: "145 Nm", efficiency: "18.4 km/l", transmission: "6-Speed MT" }
      },
      {
        name: "VX CVT",
        price: 2550000,
        label: "Rs. 25.50L",
        popular: false,
        transmission: "CVT",
        fuel: "Petrol",
        features: ["CVT Automatic", "Paddle Shifters", "Auto AC", "Smart Cruise Control", "VX features"],
        specs: { power: "119 hp", torque: "145 Nm", efficiency: "17.8 km/l", transmission: "CVT" }
      },
    ],
    specs: {
      "Engine": "1.5L i-VTEC DOHC Petrol",
      "Power": "119 hp @ 6,600 rpm",
      "Torque": "145 Nm @ 4,300 rpm",
      "Fuel Efficiency": "18.4 km/l",
      "Fuel Tank": "40 L",
      "Transmission": "CVT / 6-Speed MT",
      "0–100 km/h": "9.7 sec",
      "Top Speed": "195 km/h",
      "Drive": "FWD",
      "Seating": "5",
      "Boot Space": "506 L",
      "Wheelbase": "2,600 mm",
      "Length": "4,553 mm",
      "Ground Clearance": "135 mm",
      "Kerb Weight": "1,153 kg"
    },
    pros: ["506L class-best boot space", "Honda SENSING standard on V+", "Excellent resale value", "Best Honda service network Nepal", "Refined VTEC engine"],
    cons: ["CVT only on top trim", "Turbo version not offered", "Rear legroom average", "Slightly premium-priced"],
    highlights: ["506L Boot", "Honda SENSING", "18.4 km/l", "Best Resale"]
  },
  {
    id: 6,
    slug: "byd-atto3-2024",
    brand: "BYD",
    model: "Atto 3",
    year: 2024,
    type: "Electric",
    body: "SUV",
    badge: "ev",
    tagline: "Most feature-packed EV at this price",
    rating: 4.3,
    reviews: 156,
    expertScore: 8.4,
    baseEMI: 19234,
    overview: "The BYD Atto 3 delivers 420 km real-world range and a host of smart features at the most competitive price in Nepal's EV market. LFP battery with 6-year warranty.",
    images: [
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=560&fit=crop",
    ],
    colors: [
      { name: "Commuter Black", hex: "#1A1A2E" },
      { name: "Alpine White", hex: "#ECF0F1" },
      { name: "Flame Red", hex: "#E74C3C" },
      { name: "Island Green", hex: "#1A6B2A" },
    ],
    variants: [
      {
        name: "Standard",
        price: 4200000,
        label: "Rs. 42L",
        popular: false,
        transmission: "Auto",
        fuel: "Electric",
        features: ["60.5 kWh LFP Battery", "350 km Range", "80 kW DC Charging", "10.1\" Rotating Screen", "6 Airbags"],
        specs: { power: "201 hp", torque: "310 Nm", efficiency: "350 km", transmission: "Single-speed" }
      },
      {
        name: "Extended",
        price: 4500000,
        label: "Rs. 45L",
        popular: true,
        transmission: "Auto",
        fuel: "Electric",
        features: ["420 km Range", "ADAS Level 2", "Heated Seats", "360° Camera", "Standard features+"],
        specs: { power: "201 hp", torque: "310 Nm", efficiency: "420 km", transmission: "Single-speed" }
      },
    ],
    specs: {
      "Battery": "60.5 kWh LFP",
      "Motor Power": "201 hp (150 kW)",
      "Torque": "310 Nm",
      "Range (WLTP)": "420 km",
      "AC Charging": "11 kW",
      "DC Fast Charging": "80 kW",
      "0–100 km/h": "7.3 sec",
      "Top Speed": "160 km/h",
      "Drive": "FWD",
      "Seating": "5",
      "Boot Space": "440 L",
      "Wheelbase": "2,720 mm",
      "Length": "4,455 mm",
      "Ground Clearance": "175 mm",
      "Kerb Weight": "1,750 kg"
    },
    pros: ["Best value EV in Nepal", "420 km real-world range", "Unique rotating 10.1\" screen", "6-year battery warranty", "80 kW DC fast charging"],
    cons: ["No AWD option in Nepal", "Limited BYD service network", "Build quality average vs rivals", "Heavier than some rivals"],
    highlights: ["420 km Range", "80kW DC Fast", "Rotating Screen", "6yr Battery Warranty"]
  },
  {
    id: 7,
    slug: "suzuki-swift-2024",
    brand: "Suzuki",
    model: "Swift",
    year: 2024,
    type: "Petrol",
    body: "Hatchback",
    badge: "popular",
    tagline: "Nepal's most affordable first car",
    rating: 4.1,
    reviews: 1204,
    expertScore: 7.8,
    baseEMI: 4488,
    overview: "The all-new Maruti Suzuki Swift brings a sportier design and the efficient Z-Series mild-hybrid engine. Cheapest cost of ownership in Nepal.",
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=560&fit=crop",
      "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=900&h=560&fit=crop",
    ],
    colors: [
      { name: "Magma Grey", hex: "#7F8C8D" },
      { name: "Arctic White", hex: "#ECF0F1" },
      { name: "Café Red", hex: "#E74C3C" },
      { name: "Lucent Orange", hex: "#E67E22" },
      { name: "Midnight Blue", hex: "#1A2A4A" },
    ],
    variants: [
      {
        name: "Std",
        price: 1050000,
        label: "Rs. 10.50L",
        popular: false,
        transmission: "MT",
        fuel: "Petrol",
        features: ["1.2L Z-Series Hybrid", "Manual Transmission", "Rear Camera", "2 Airbags", "Power Windows"],
        specs: { power: "82 hp", torque: "112 Nm", efficiency: "24.8 km/l", transmission: "5-Speed MT" }
      },
      {
        name: "VXi",
        price: 1200000,
        label: "Rs. 12L",
        popular: true,
        transmission: "MT",
        fuel: "Petrol",
        features: ["6 Airbags", "SmartPlay Pro+ 9\"", "ESP + Hill Assist", "Wireless CarPlay", "Std features+"],
        specs: { power: "82 hp", torque: "112 Nm", efficiency: "24.8 km/l", transmission: "5-Speed MT" }
      },
      {
        name: "ZXi",
        price: 1350000,
        label: "Rs. 13.50L",
        popular: false,
        transmission: "MT",
        fuel: "Petrol",
        features: ["360° Camera", "Cruise Control", "Ambient Lighting", "LED Headlights", "VXi features+"],
        specs: { power: "82 hp", torque: "112 Nm", efficiency: "24.8 km/l", transmission: "5-Speed MT" }
      },
      {
        name: "ZXi+ AMT",
        price: 1450000,
        label: "Rs. 14.50L",
        popular: false,
        transmission: "AMT",
        fuel: "Petrol",
        features: ["AMT Auto Gear", "Push Button Start", "Keyless Entry", "Premium Finish", "ZXi features"],
        specs: { power: "82 hp", torque: "112 Nm", efficiency: "23.8 km/l", transmission: "AMT" }
      },
    ],
    specs: {
      "Engine": "1.2L Z-Series Petrol + Mild Hybrid",
      "Power": "82 hp @ 6,000 rpm",
      "Torque": "112 Nm @ 4,400 rpm",
      "Fuel Efficiency": "24.8 km/l",
      "Fuel Tank": "37 L",
      "Transmission": "5MT / AMT",
      "0–100 km/h": "12.1 sec",
      "Top Speed": "165 km/h",
      "Drive": "FWD",
      "Seating": "5",
      "Boot Space": "265 L",
      "Wheelbase": "2,450 mm",
      "Length": "3,860 mm",
      "Ground Clearance": "163 mm",
      "Kerb Weight": "865 kg"
    },
    pros: ["Most affordable entry price", "Best hatchback fuel efficiency (24.8 km/l)", "Very low maintenance cost", "Wide Suzuki service network", "Fun peppy city character"],
    cons: ["Small 265L boot", "Manual only up to ZXi", "Limited highway refinement", "Basic interior on lower trims"],
    highlights: ["24.8 km/l", "Rs. 10.50L Start", "6 Airbags (VXi+)", "Lowest Maintenance"]
  },
  // ─────────────────────────────────────────────────────────────────────────────
//  Hyundai Grand i10 Nios — AutoViindu cars-db.js entry
//  Source: CarDekho specs + Laxmi Hyundai Nepal pricing (Sept 2024)
//  Nepal variants: Era | Magna | Sportz | Sportz AMT
//  Nepal ex-showroom prices: Rs. 32.56L → Rs. 40.56L (Laxmi Intercontinental)
//  ⚠️  variant.price fields use India ex-showroom (INR) for structural
//      consistency with existing Swift/other entries. Update to NPR when
//      you have confirmed Laxmi showroom sheet.
// ─────────────────────────────────────────────────────────────────────────────

{
  id: 8, // ← adjust to your next sequential id
  slug: "hyundai-grand-i10-nios-2024",
  brand: "Hyundai",
  model: "Grand i10 Nios",
  year: 2024,
  type: "Petrol",
  body: "Hatchback",
  badge: "value",                      // options: popular | new | value | top-rated
  tagline: "Feature-packed city hatch with 6 airbags at an honest price",
  rating: 4.2,
  reviews: 3627,
  expertScore: 7.6,
  baseEMI: 2350,                       // rough INR EMI at base Era price; update for NPR
  overview: "The Hyundai Grand i10 Nios packs a refined 1.2L Kappa engine, 6 airbags, an 8-inch touchscreen with wireless CarPlay, and a class-leading fit-and-finish into a compact hatchback. Nepal's go-to safe city car with Laxmi's wide service network.",

  // ── Images ─────────────────────────────────────────────────────────────────
  // Unsplash placeholders — replace with actual Hyundai Grand i10 Nios photos
  images: [
    "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=900&h=560&fit=crop",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=900&h=560&fit=crop",
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&h=560&fit=crop",
    "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=900&h=560&fit=crop",
  ],

  // ── Colors (all 8 official colors from CarDekho/Hyundai India) ─────────────
  colors: [
    { name: "Fiery Red",                  hex: "#C0392B" },
    { name: "Typhoon Silver",             hex: "#A8AFBA" },
    { name: "Atlas White",                hex: "#F5F5F5" },
    { name: "Atlas White / Abyss Black",  hex: "#D0D0D0", dual: true, accent: "#1C1C1C" },
    { name: "Titan Grey",                 hex: "#5A5E63" },
    { name: "Amazon Grey",                hex: "#7D8C7C" },
    { name: "Teal Blue",                  hex: "#1A7A8A" },
    { name: "Spark Green",                hex: "#39C160" },
  ],

  // ── Variants (Nepal-available: Era / Magna / Sportz / Sportz AMT) ──────────
  variants: [
    {
      name: "Era",
      price: 555000,               // India ex-showroom ₹5.55L | Nepal: ~Rs. 32.56L
      label: "Rs. 5.55L",         // ← change label to "Rs. 32.56L" when using NPR
      popular: false,
      transmission: "MT",
      fuel: "Petrol",
      features: [
        "1.2L Kappa Petrol Engine",
        "5-Speed Manual",
        "Dual Airbags",
        "ABS with EBD",
        "Power Windows (Front)",
        "AC with Heater",
        "155/80 R13 Tyres",
      ],
      specs: {
        power:        "82 hp @ 6,000 rpm",
        torque:       "113.8 Nm @ 4,000 rpm",
        efficiency:   "18 km/l",
        transmission: "5-Speed MT",
      },
    },
    {
      name: "Magna",
      price: 630000,               // India ~₹6.30L | Nepal: ~Rs. 35.96L
      label: "Rs. 6.30L",
      popular: false,
      transmission: "MT",
      fuel: "Petrol",
      features: [
        "Height-Adj Driver Seat",
        "Tilt Steering",
        "Power Windows (Rear)",
        "Power ORVM",
        "Rear Defogger",
        "8\" Touchscreen Infotainment",
        "Android Auto / Apple CarPlay",
        "Era features+",
      ],
      specs: {
        power:        "82 hp @ 6,000 rpm",
        torque:       "113.8 Nm @ 4,000 rpm",
        efficiency:   "18 km/l",
        transmission: "5-Speed MT",
      },
    },
    {
      name: "Sportz",
      price: 682000,               // India ~₹6.82L | Nepal: ~Rs. 37.56L
      label: "Rs. 6.82L",
      popular: true,
      transmission: "MT",
      fuel: "Petrol",
      features: [
        "6 Airbags",
        "ESC + VSM + Hill Assist",
        "TPMS",
        "Rear Camera + Sensors",
        "Smart Key + Push Start",
        "Wireless Phone Charging",
        "Type-C Fast Charging",
        "15\" Alloy Wheels",
        "175/60 R15 Tyres",
        "Cruise Control",
        "Projector Headlamps",
        "LED DRLs",
        "Magna features+",
      ],
      specs: {
        power:        "82 hp @ 6,000 rpm",
        torque:       "113.8 Nm @ 4,000 rpm",
        efficiency:   "18 km/l",
        transmission: "5-Speed MT",
      },
    },
    {
      name: "Sportz AMT",
      price: 762000,               // India ~₹7.62L | Nepal: ~Rs. 40.56L
      label: "Rs. 7.62L",
      popular: false,
      transmission: "AMT",
      fuel: "Petrol",
      features: [
        "AMT Automatic Transmission",
        "All Sportz features",
        "Paddle Shifters",
        "Auto Gear Shift Indicator",
      ],
      specs: {
        power:        "82 hp @ 6,000 rpm",
        torque:       "113.8 Nm @ 4,000 rpm",
        efficiency:   "17.2 km/l",
        transmission: "AMT",
      },
    },
  ],

  // ── Full Specs ──────────────────────────────────────────────────────────────
  specs: {
    "Engine":           "1.2L Kappa Dual VTVT Petrol (BS6)",
    "Displacement":     "1,197 cc",
    "Power":            "82 hp @ 6,000 rpm",
    "Torque":           "113.8 Nm @ 4,000 rpm",
    "Fuel Efficiency":  "18 km/l (MT) / 17.2 km/l (AMT)",
    "Fuel Tank":        "37 L",
    "Transmission":     "5-Speed MT / AMT",
    "Drive":            "FWD",
    "Seating":          "5",
    "Boot Space":       "260 L",
    "Length":           "3,815 mm",
    "Width":            "1,680 mm",
    "Height":           "1,520 mm",
    "Wheelbase":        "2,450 mm",
    "Ground Clearance": "165 mm",
    "Kerb Weight":      "870 kg",
    "Suspension (F)":   "McPherson Strut",
    "Suspension (R)":   "Coupled Torsion Beam Axle",
    "Brakes (F)":       "Disc",
    "Brakes (R)":       "Drum",
    "Tyres (Era/Magna)":"165/70 R14",
    "Tyres (Sportz)":   "175/60 R15",
    "Airbags":          "2 (Era/Magna) / 6 (Sportz+)",
    "NCAP Rating":      "3 Star (Global NCAP)",
  },

  // ── Pros & Cons ────────────────────────────────────────────────────────────
  pros: [
    "6 airbags standard on Sportz — best safety in class",
    "Refined and quiet 1.2L Kappa engine",
    "Excellent fit, finish, and interior quality",
    "Wide Laxmi Hyundai service network in Nepal",
    "Wireless CarPlay + Type-C charging on Sportz",
    "Comfortable rear seat with good knee room",
  ],
  cons: [
    "No turbo-petrol option",
    "AMT gearbox can feel jerky at low speeds",
    "Small 260L boot (less than Swift)",
    "No sunroof in any variant",
    "Bouncy ride at higher highway speeds",
  ],

  // ── Highlights (shown on card badges) ──────────────────────────────────────
  highlights: [
    "6 Airbags (Sportz)",
    "Rs. 32.56L Start",
    "18 km/l Efficiency",
    "8\" Wireless CarPlay",
  ],
}
];

/* Search index — built from cars data */
window.buildSearchIndex = function() {
  return window.CARS_DB.map(car => ({
    id: car.id,
    slug: car.slug,
    searchText: [car.brand, car.model, car.type, car.body, car.year,
      car.variants.map(v => v.name).join(' '),
      car.tagline, car.overview
    ].join(' ').toLowerCase(),
    display: `${car.brand} ${car.model}`,
    price: car.variants[0].label,
    badge: car.badge,
    image: car.images[0],
    year: car.year,
    type: car.type,
    body: car.body
  }));
};
