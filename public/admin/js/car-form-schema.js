/* ═══════════════════════════════════════════════════════════════════════════
   AUTOVIINDU — CAR FORM SCHEMA  (single source of truth for the admin editors)

   window.CAR_FORM_SCHEMA = { NEW_CAR, USED_CAR }

   Each schema is an ordered list of TABS. Each tab has SECTIONS (rendered as
   collapsible accordions in the admin modal). Each "fields" section has FIELDS.

   Field shape:
     { key, label, type, store, options?, placeholder?, span? }
       key         — the property name written on save
       type        — text | number | textarea | list | select | toggle
                     ("list" = one value per line -> string array)
       store       — "top"   : written as body[key]        (a DB column)
                     "specs" : written as body.specs[key]  (the JSON blob)
       options     — for select
       span        — 2 to make the field span both grid columns

   Section shapes:
     { title, kind: 'fields',  store, fields:[...] }   store = default for fields
     { title, kind: 'repeat',  store, itemFields:[...] }  (variants / colors)
     { title, kind: 'images',  store }                    (URL list)

   The category names + field labels below are copied verbatim from the public
   site renderers in public/assets/js/app.js (SPEC_SCHEMA / FEAT_SCHEMA at
   ~line 1283, and UC_*_SCHEMA at ~line 5443). If those ever change on the site,
   update this file to match — see the caveat in the plan.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Turn a { "1. Category": ["Field A", "Field B"] } map (verbatim from app.js)
  // into an array of { title, kind:'fields', store:'specs', fields:[...] } sections.
  function specSections(map, store) {
    store = store || 'specs';
    return Object.entries(map).map(function (entry) {
      return {
        title: entry[0],
        kind: 'fields',
        store: store,
        fields: entry[1].map(function (label) {
          return { key: label, label: label, type: 'text', store: store };
        }),
      };
    });
  }

  /* ── verbatim from app.js SPEC_SCHEMA ──────────────────────────────────── */
  var SPEC_SCHEMA = {
    "1. Engine, Motor & Performance": ["Engine Type", "Engine Position", "Displacement (cc)", "Cylinder Configuration", "Valve Configuration", "Variable Valve Timing", "Bore x Stroke (mm)", "Compression Ratio", "Fuel System", "Aspiration", "Engine Cooling System", "Start-Stop System", "Max Engine Power", "Max Engine Torque", "Max RPM (Redline)", "Motor Type", "Motor Position", "Motor Cooling System", "Max Motor Power", "Max Motor Torque", "Combined System Output", "Low Range 4WD", "Top Speed (km/h)", "Acceleration 0–100 km/h", "Power-to-Weight Ratio", "Drive Modes", "Regenerative Braking", "Boost / Overboost Function"],
    "2. Transmission & Drivetrain": ["Transmission Type", "Drive Type", "Drivetrain", "Number of Gears", "Shift-by-Wire", "Paddle Shifters", "Gear Shift Indicator", "Clutch Type", "Steering Type", "Steering Modes", "Variable Steering Ratio", "Differential Type", "Center Differential Lock", "Rear Differential Lock", "Transfer Case Type", "Torque Vectoring"],
    "3. Battery & Range": ["Battery Type", "Battery Cell Format", "Battery Capacity (kWh)", "Usable Battery Capacity (kWh)", "Battery Voltage (V)", "Battery Cooling", "Battery Management System (BMS)", "State of Health (SoH) Monitoring", "Certified Range (km)", "Real-world Range (km)", "Electric-only Range (km)", "Energy Consumption (kWh/100km)", "AC Charging Max Rate (kW)", "DC Fast Charging Max Rate (kW)", "Normal Charging Time (AC)", "Fast Charging Time (DC)", "Charging Port Type", "Vehicle-to-Load (V2L)", "Vehicle-to-Grid (V2G)", "Vehicle-to-Home (V2H)"],
    "4. Fuel & Emission": ["Fuel Type", "Hybrid System Type", "Fuel Tank Capacity (L)", "Certified Fuel Efficiency (km/l)", "Real-World Mileage City (km/l)", "Real-World Mileage Highway (km/l)", "EV Mode Efficiency (km/kWh)", "Emission Standard", "CO2 Emissions (g/km)", "Emission Control Technology", "Driving Range on Full Tank (km)", "Combined Driving Range HEV (km)", "NOx Emissions (g/km)", "Particulate Emissions (mg/km)", "Fuel Grade Required"],
    "6. Dimensions & Weight": ["Overall Length (mm)", "Overall Width (mm)", "Overall Width with Mirrors (mm)", "Overall Height (mm)", "Wheelbase (mm)", "Wheelbase Type", "Ground Clearance (mm)", "Turning Radius (m)", "Kerb Weight (kg)", "Gross Vehicle Weight (GVW)", "Seating Capacity", "Boot Space (litres)", "Boot Space Seats Folded (litres)", "Low Boot Loading Lip Height (mm)", "Frunk Capacity (litres)", "Weight Distribution", "Drag Coefficient (Cd)", "Underbody Aerodynamic Paneling", "Active Aero Elements", "Front Overhang (mm)", "Rear Overhang (mm)", "Track Width Front/Rear (mm)", "Payload Capacity (kg)", "Towing Capacity (kg)", "Roof Load Capacity (kg)", "Number of Doors", "Body Type"],
    "7. Suspension, Brakes & Tyres": ["Front Suspension Type", "Rear Suspension Type", "Front Stabilizer Bar", "Rear Stabilizer Bar", "Suspension Damper Type", "Drive Mode-Linked Suspension", "Electric Adjustable Suspension", "Adaptive Ride Height", "Front Brakes", "Rear Brakes", "Brake Caliper Type", "Electronic Parking Brake (EPB)", "Brake Assist (BA)", "Auto Hold", "Hill Start Assist (HSA)", "Hill Descent Control (HDC)", "Tyre Size", "Wheel Size (inches)", "Wheel Type", "Tyre Brand", "TPMS", "Spare Tyre", "Low Rolling Resistance Tyres", "Run-Flat Tyres", "All-Terrain Tyres"],
    "12. Warranty & Service": ["Standard Vehicle Warranty", "Battery Warranty", "Charging System Warranty", "Extended Warranty Offer", "Corrosion / Rust Warranty", "Paintwork Warranty", "Free Service Count & Intervals", "Annual Maintenance Package", "Roadside Assistance (RSA)"],
    "13. Variants & Colors": ["Total Number of Variants", "Variant Names", "Trim Level Names", "Transmission-based Variants", "Battery-based Variants", "Motor/Drive-based Variants", "Total Number of Colors", "Color Finish Type", "Dual-Tone Available", "Brand Hero/Signature Color", "Special Edition Variants"],
    "14. ADD ON Benefits from AV": ["Cash Discount", "Loyalty Bonus", "Exchange/Trade-In Bonus", "Festival Offer", "Special Corporate/Government Discount", "Free Insurance (1st Year)", "Free Registration Assistance", "Free Accessories Package", "Free Service Package", "EMI / Finance Assistance", "Zero Down Payment Offer", "Free Home Delivery", "EV Charging Setup Assistance", "Free Ceramic Coating", "Free Dashcam Installation", "Free PPF (Paint Protection Film)", "Autoviindu Verified Badge", "Price Guarantee"],
    "15. Pricing & On-Road Costs": ["Price", "Cost"],
    "16. Importer & Dealer Info": ["Importer", "Dealer"],
    "17. After Sales & Service Network": ["Network", "Service Center"]
  };

  /* ── verbatim from app.js FEAT_SCHEMA ──────────────────────────────────── */
  var FEAT_SCHEMA = {
    "5. Advanced Driver Assistance Systems (ADAS)": ["Lane Departure Warning", "Forward Collision Warning", "Blind Spot Warning", "Rear Cross Traffic Warning", "Traffic Sign Recognition", "Driver Attention Monitoring", "High Beam Assist", "Adaptive Cruise Control (ACC)", "Lane Keep Assist", "Auto Emergency Braking (AEB)", "Blind Spot Collision Avoidance", "Autonomous Parking Assist", "Traffic Jam Assist", "Highway Driving Assist", "Auto Lane Change", "Remote Smart Parking", "Proactive Safety System", "360° Surround View Camera", "Front/Rear Cameras", "Parking Sensors", "Radar Sensors", "Head-Up Display (HUD)"],
    "8. Safety Features": ["Total Airbag Count", "Airbag Positions", "ABS", "EBD", "High Speed Alert System", "Central Locking", "Remote Central Locking", "Speed Sensing Auto Door Lock", "Child Safety Rear Door Lock", "Seat Belt Reminder", "Adjustable Headrests", "ISOFIX Child Seat Mounts", "Rear Occupant Alert", "Auto Headlamps", "Rain-Sensing Wipers", "Auto-Dimming IRVM", "Cruise Control", "Front/Rear Parking Sensors", "Acoustic/Laminated Windshield", "SOS Emergency Call System", "Crash Notification System", "Pedestrian Protection (Pop-up Hood)", "Night Vision Assist", "Safety Rating"],
    "9. Comfort & Convenience": ["Air Conditioning Type", "AC Zones", "Rear AC Vents", "Air Quality Control / PM2.5 Filter", "Smart Entry (Keyless)", "Push Button Start", "Powered Tailgate (Hands-Free)", "Soft-Close Doors", "Power Windows", "Electric ORVM", "Rear Defogger", "Powered Driver Seat", "Powered Passenger Seat", "Memory Seat Function", "Ventilated Seats", "Heated Seats", "Massage Function", "Ottoman Rear Seats", "Flat Floor Rear Cabin", "Standard / Panoramic Sunroof", "Rear Sunshades", "Front/Rear Armrests", "Rear Parcel Tray", "Cooled Glovebox", "Cabin Lamps", "Steering Adjustments"],
    "10. Exterior & Interior": ["Headlamp Type", "Daytime Running Lights (DRLs)", "Front Fog Lamps", "Tail Lamp Type", "Turn Indicators Type", "Puddle Lamps", "Roof Rails", "Skid Plates", "Exterior Paint Options", "Dashboard Material", "Seat Upholstery", "Leather Wrapped Steering", "Interior Accents", "Interior Color Scheme", "Ambient Lighting", "Digital Instrument Cluster", "Door Handles", "Panoramic Glass Roof"],
    "11. Technology / Infotainment": ["Touchscreen Display", "Touchscreen Size", "Touchscreen Resolution", "Digital Dials / Virtual Cockpit", "Audio System Speaker Count", "Premium Audio Brand", "Amplifier & Subwoofer", "Bluetooth Connectivity", "USB Ports", "Wi-Fi Hotspot", "Smart Watch Connectivity", "Android Auto", "Apple CarPlay", "Remote App Control", "Vehicle Health Monitoring App", "In-Built Navigation", "Connected Car Apps", "OTA Software Updates", "Voice Commands/Assistant", "Multi-User Profile Settings", "Gesture Control", "In-Car Payment System", "Drive Mode-Based UI Themes", "Rear Seat Entertainment System"]
  };

  /* ── verbatim from app.js UC_*_SCHEMA ──────────────────────────────────── */
  var UC_CONDITION_SCHEMA = {
    "2. Core Condition Data": ["Odometer Reading (km)", "Service History", "Last Service Date", "Accident History", "Accident Severity", "Number of Owners", "Ownership Type", "Insurance Status", "Insurance Type", "Road Tax Validity", "Documentation Status", "Loan Status", "Inspection Summary"],
    "All Details Inspection Summary Rating": ["Exterior Score", "Interior Score", "Engine Health Score", "Suspension Score", "Braking Score", "Electrical Score"],
    "Test Drive Summary": ["Driving Experience Score", "Noise Level Score", "Comfort Score"],
    "Autoviindu Condition Score (ACS)": ["Condition Score (ACS)", "Condition Grade", "Inspection Badge"]
  };
  var UC_PRICING_SCHEMA = {
    "3. Pricing & Purchase Info": ["Asking Price (NPR)", "Market Price Indicator", "Booking Amount", "Payment Mode", "Finance Availability", "Finance Partner", "EMI Estimate", "Exchange Option", "Exchange Details"]
  };
  var UC_FEAT_SPEC_SCHEMA = {
    "4. Features & Specifications": ["Infotainment System", "AC Type", "Steering Type", "Seating Capacity", "Seat Material", "Airbags", "Safety Rating", "Safety Features", "Parking Assist", "Lighting", "Wheels & Tyres", "Ground Clearance (mm)", "Boot Space (Liters)", "Mileage / Range (Real-World)", "Sunroof", "Test Drive Availability"]
  };

  var FUEL = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  var TRANS = ['Manual', 'Automatic', 'CVT', 'AMT', 'DCT', 'iMT'];

  /* ═════════════════════ NEW CAR ═════════════════════ */
  var NEW_CAR = {
    key: 'NEW_CAR',
    tabs: [
      {
        name: 'Overview',
        sections: [
          {
            title: 'Identity', kind: 'fields', store: 'top', open: true,
            fields: [
              { key: 'brand', label: 'Brand', type: 'text', store: 'top', placeholder: 'e.g. Hyundai' },
              { key: 'model', label: 'Model', type: 'text', store: 'top', placeholder: 'e.g. Creta' },
              { key: 'year', label: 'Model Year', type: 'number', store: 'top' },
              { key: 'type', label: 'Fuel / Powertrain', type: 'select', store: 'top', options: FUEL },
              { key: 'bodyType', label: 'Body Type', type: 'text', store: 'top', placeholder: 'e.g. SUV, Hatchback' },
              { key: 'body', label: 'Body (site filter key)', type: 'text', store: 'top', placeholder: 'e.g. suv, sedan' },
              { key: 'badge', label: 'Card Badge', type: 'select', store: 'top', options: ['', 'new', 'popular', 'ev', 'hybrid'] },
              { key: 'budgetTier', label: 'Budget Tier', type: 'text', store: 'top', placeholder: 'e.g. mid' },
              { key: 'tagline', label: 'Marketing Tagline', type: 'text', store: 'top', span: 2 },
              { key: 'overview', label: 'Overview Description', type: 'textarea', store: 'top', span: 2 },
            ],
          },
          {
            title: 'Ratings & Finance', kind: 'fields', store: 'top', open: true,
            fields: [
              { key: 'rating', label: 'Overall Rating (0–5)', type: 'number', store: 'top' },
              { key: 'reviews', label: 'Review Count', type: 'number', store: 'top' },
              { key: 'expertScore', label: 'Expert Score (0–10)', type: 'number', store: 'top' },
              { key: 'baseEMI', label: 'Base Monthly EMI (NPR)', type: 'number', store: 'top' },
            ],
          },
          {
            title: 'Listing & Visibility', kind: 'fields', store: 'top', open: true,
            fields: [
              { key: 'thumb', label: 'Thumbnail Image URL', type: 'text', store: 'top', span: 2, placeholder: 'https://…' },
              { key: 'brochureUrl', label: 'Official Brochure URL', type: 'text', store: 'top', span: 2, placeholder: 'https://…' },
              { key: 'isEV', label: 'Is Electric (EV)', type: 'toggle', store: 'top' },
              { key: 'isNew', label: 'Brand New', type: 'toggle', store: 'top', default: true },
              { key: 'isFeatured', label: 'Feature on Home', type: 'toggle', store: 'top' },
              { key: 'isBestSeller', label: 'Best Seller Banner', type: 'toggle', store: 'top' },
            ],
          },
        ],
      },
      {
        name: 'Specifications',
        sections: specSections(SPEC_SCHEMA, 'specs'),
      },
      {
        name: 'Features',
        sections: specSections(FEAT_SCHEMA, 'specs').concat([
          {
            title: 'Highlights, Pros & Cons', kind: 'fields', store: 'top', open: true,
            fields: [
              { key: 'highlights', label: 'Key Highlights (one per line)', type: 'list', store: 'top', span: 2 },
              { key: 'pros', label: 'Pros (one per line)', type: 'list', store: 'top', span: 2 },
              { key: 'cons', label: 'Cons (one per line)', type: 'list', store: 'top', span: 2 },
            ],
          },
        ]),
      },
      {
        name: 'Variants',
        sections: [
          {
            title: 'Price Variants', kind: 'repeat', store: 'variants', open: true,
            note: 'Each trim shows its own specs & features on the car page. "Variant specs" below OVERRIDE the shared Specifications tab for that trim only — enter just what differs (motor, battery, range, wheels…); blanks fall back to the shared sheet.',
            itemFields: [
              { key: 'name', label: 'Variant Name', type: 'text', placeholder: 'e.g. SX (O) Diesel' },
              { key: 'price', label: 'Ex-showroom Price (NPR)', type: 'number' },
              { key: 'label', label: 'Tier Label', type: 'text', placeholder: 'Base / Mid / Top' },
              { key: 'popular', label: 'Best Value', type: 'toggle' },
              { key: 'transmission', label: 'Transmission', type: 'text', placeholder: 'e.g. 6MT' },
              { key: 'fuel', label: 'Fuel', type: 'text', placeholder: 'e.g. Petrol' },
              { key: 'features', label: 'Variant Features (one per line)', type: 'list', span: 2 },
              { key: 'specs', label: 'Variant specs — one "Name: value" per line (overrides the shared Specifications tab for this trim)', type: 'kv', span: 2, placeholder: 'Max Motor Power: 160 kW (218 PS)\nBattery Capacity (kWh): 79.97\nCertified Range (km): 485 (WLTP)\nWheel Size (inches): 20' },
            ],
          },
        ],
      },
      {
        name: 'Colors',
        sections: [
          {
            title: 'Exterior Colors', kind: 'repeat', store: 'colors', open: true,
            itemFields: [
              { key: 'name', label: 'Color Name', type: 'text', placeholder: 'e.g. Polar White' },
              { key: 'hex', label: 'Swatch', type: 'color' },
            ],
          },
        ],
      },
      {
        name: 'Gallery',
        sections: [
          { title: 'Photo URLs (order = slideshow order)', kind: 'images', store: 'images', open: true },
        ],
      },
    ],
  };

  /* ═════════════════════ USED CAR ═════════════════════ */
  var USED_CAR = {
    key: 'USED_CAR',
    tabs: [
      {
        name: 'Overview',
        sections: [
          {
            title: 'Identity & Listing', kind: 'fields', store: 'top', open: true,
            fields: [
              { key: 'brand', label: 'Make / Brand', type: 'text', store: 'top', placeholder: 'e.g. Toyota' },
              { key: 'model', label: 'Model', type: 'text', store: 'top', placeholder: 'e.g. Corolla' },
              { key: 'year', label: 'Year of Manufacture', type: 'number', store: 'top' },
              { key: 'price', label: 'Listing Price', type: 'text', store: 'top', placeholder: 'e.g. Rs. 42L' },
              { key: 'mileage', label: 'Odometer (km)', type: 'text', store: 'top', placeholder: 'e.g. 38,450' },
              { key: 'fuelType', label: 'Fuel Type', type: 'select', store: 'top', options: FUEL },
              { key: 'transmission', label: 'Transmission', type: 'select', store: 'top', options: TRANS },
              { key: 'condition', label: 'Condition', type: 'text', store: 'top', placeholder: 'e.g. Excellent' },
              { key: 'location', label: 'Location (City / Area)', type: 'text', store: 'top', span: 2, placeholder: 'e.g. Nayabazar, Kathmandu' },
              { key: 'ownerCount', label: 'Number of Owners', type: 'number', store: 'top' },
            ],
          },
          {
            title: 'Vehicle Details', kind: 'fields', store: 'specs', open: true,
            fields: [
              { key: 'Generation', label: 'Generation', type: 'text', store: 'specs' },
              { key: 'Variant', label: 'Variant', type: 'text', store: 'specs' },
              { key: 'Trim Detail', label: 'Trim Detail', type: 'text', store: 'specs' },
              { key: 'Registration Year', label: 'Registration Year', type: 'text', store: 'specs' },
              { key: 'Color', label: 'Color', type: 'text', store: 'specs' },
              { key: 'Body Type', label: 'Body Type', type: 'text', store: 'specs' },
              { key: 'Powertrain', label: 'Powertrain', type: 'text', store: 'specs' },
              { key: 'Drivetrain', label: 'Drivetrain', type: 'text', store: 'specs' },
              { key: 'Overview', label: 'Overview Description', type: 'textarea', store: 'specs', span: 2 },
            ],
          },
        ],
      },
      {
        name: 'Condition & Inspection',
        sections: specSections(UC_CONDITION_SCHEMA, 'specs'),
      },
      {
        name: 'Pricing',
        sections: specSections(UC_PRICING_SCHEMA, 'specs'),
      },
      {
        name: 'Features & Specs',
        sections: [
          {
            title: 'Key Features', kind: 'fields', store: 'top', open: true,
            fields: [
              { key: 'features', label: 'Key Features (one per line)', type: 'list', store: 'top', span: 2 },
            ],
          },
        ].concat(specSections(UC_FEAT_SPEC_SCHEMA, 'specs')),
      },
      {
        name: 'Gallery',
        sections: [
          { title: 'Photo URLs', kind: 'images', store: 'images', open: true },
        ],
      },
    ],
  };

  window.CAR_FORM_SCHEMA = { NEW_CAR: NEW_CAR, USED_CAR: USED_CAR };
})();
