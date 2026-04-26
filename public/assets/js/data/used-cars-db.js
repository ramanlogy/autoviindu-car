window.USED_CARS_DB = [
{
  id: 'u1',
  brand: 'Toyota',
  model: 'Corolla',
  year: 2007,
  km: '90,000',
  type: 'Petrol',
  body: 'Sedan',
  priceNum: 1250000,
  price: 'Rs. 12.5L',
  variant: 'LX E120',
  transmission: 'Manual',
  owners: 4,
  color: 'Light Blue Metallic',
  location: 'Nayabazzar, Kathmandu',
  rating: 4.2,
  reviews: 12,
  emiEst: 32739,
  certified: false,

  img: 'assets/images/cars/used car/corollafront.webp',
  images: [
    'assets/images/cars/used car/corollafront.webp',
    'assets/images/cars/used car/corolla_back.webp',
    'assets/images/cars/used car/corolla_side.webp',
  ],

  overview: 'Well-maintained Corolla with no accident history. Smooth driving experience and reliable engine. Suitable for daily use.',

  highlights: [
    'No Accident',
    'Test Drive Available',
    'Good Driving Condition',
    'Insurance Valid till Dec 2026'
  ],

  specs: {
    Efficiency: '12 km/l',
    Drive: 'FWD',
    Engine: '1.5L Petrol',
    Power: 'Approx 110 bhp',
    Boot: '450L',
    GroundClearance: '158mm'
  },

  tags: [
    '4+ Owners',
    'Duplicate Billbook',
    'Third-Party Insurance',
    'Partial Documentation'
  ],

  features: [
    'Power Steering',
    'Manual AC',
    'Alloy Wheels',
    'Reverse Camera',
    'Parking Sensors',
    'ABS',
    'EBD'
  ],

  seller: {
    name: 'Autoviindu',
    verified: true,
    sold: 0,
    rating: 4.2,
    phone: ['9828364940', '9701076240']
  },

  inspection: [
    { label: 'Engine', status: 'Good condition', ok: true },
    { label: 'Transmission', status: 'Manual, no issues reported', ok: true },
    { label: 'Brakes', status: 'Working well', ok: true },
    { label: 'AC System', status: 'Manual AC functional', ok: true },
    { label: 'Body & Paint', status: 'Average exterior condition', ok: false },
    { label: 'Tyres', status: 'Standard wear', ok: true },
    { label: 'Suspension', status: 'Good condition', ok: true },
    { label: 'Electrical', status: 'All systems working', ok: true },
  ],

  // 👉 THIS is where your missing data belongs
  meta: {
    odometer: 90000,
    serviceHistory: 'Unknown',
    lastServiceDate: '2026-01-23',
    accidentHistory: 'No Accident',
    insurance: {
      type: 'Third-Party',
      validTill: 'Dec 2026'
    },
    roadTaxValidTill: 'FY 83/84',
    loanStatus: 'Clear / No Loan',
    billbook: 'Duplicate',
    documentation: 'Partial',
    nocAvailable: true,
    showroomVisit: true,
    testDriveAvailable: true,
    inspectionScore: 4.22,
    grade: 'B'
  }
}
];