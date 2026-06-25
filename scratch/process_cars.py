import json
import os

importer_mapping = {
    "Force Motors": "Aayam Intercontinental Pvt. Ltd.",
    "Mahindra": "Agni Incorporated Pvt. Ltd.",
    "Tesla": "Tesla Nepal Pvt. Ltd.",
    "Lifan": "Arksh Group",
    "Maruti Suzuki": "CG (Chaudhary Group)",
    "Suzuki": "CG (Chaudhary Group)",
    "Neta": "CG (Chaudhary Group)",
    "KYC": "CG (Chaudhary Group)",
    "King Long": "CG (Chaudhary Group)",
    "Riddara": "CG (Chaudhary Group)",
    "GAC Aion": "CG (Chaudhary Group)",
    "BYD": "Cimex Inc. Pvt. Ltd.",
    "Kia": "Continental Trading Enterprises Pvt. Ltd.",
    "Isuzu": "Continental Trading Enterprises Pvt. Ltd.",
    "Skywell": "Cosmic Motors Pvt. Ltd.",
    "Xpeng": "Evo Store",
    "Renault": "G.O. Automobiles Pvt. Ltd.",
    "Ford": "G.O. Automobiles Pvt. Ltd.",
    "Jetour": "Gaurishankar Group",
    "Lexus": "Green Automobiles Pvt. Ltd.",
    "GWM": "GWM Nepal (V.G. Automobile)",
    "Haval": "GWM Nepal (V.G. Automobile)",
    "Ora": "GWM Nepal (V.G. Automobile)",
    "Tank": "GWM Nepal (V.G. Automobile)",
    "Maxus": "Himalaya Motrox Pvt. Ltd.",
    "SsangYong": "IMS Motors Pvt. Ltd.",
    "JMC": "JMC Trade Link",
    "Land Rover": "Kaeros International Pvt. Ltd.",
    "Audi": "Kaeros International Pvt. Ltd.",
    "Porsche": "Kaeros International Pvt. Ltd.",
    "SML Isuzu": "Laxmi Commercial Vehicles",
    "Kaiyi": "Laxmi E-Mobility Pvt. Ltd.",
    "Forthing": "Laxmi E-Mobility Pvt. Ltd.",
    "Hyundai": "Laxmi Intercontinental Pvt. Ltd.",
    "BMW": "Laxmi Premium Motors Pvt. Ltd.",
    "Mitsubishi": "Leon Motors Private Limited",
    "Jeep": "Life Automobile Pvt. Ltd.",
    "Geely": "LRR Motors Pvt. Ltd.",
    "BAW": "LRR Motors Pvt. Ltd.",
    "JY": "LRR Motors Pvt. Ltd.",
    "Avatr": "MAW Ride (MAW Group)",
    "IM": "MAW Ride (MAW Group)",
    "Foton": "MAW-Vriddhi Commercial Vehicles Pvt. Ltd.",
    "MAN": "MAW-Vriddhi Commercial Vehicles Pvt. Ltd.",
    "Changan": "MAW Vriddhi AutoCorp Pvt. Ltd.",
    "Deepal": "MAW Vriddhi AutoCorp Pvt. Ltd.",
    "SERES": "MAW Vriddhi AutoCorp Pvt. Ltd.",
    "Dongfeng": "MAW Vriddhi AutoCorp Pvt. Ltd.",
    "Volvo": "Maxpro Motors Pvt. Ltd.",
    "Skoda": "Morang Auto Works (MAW)",
    "BAIC": "M.V. Dugar Group",
    "LS Auto": "Nexon Ventures (Weber Group)",
    "MG": "Paramount Motors Pvt. Ltd.",
    "Mazda": "Paramount Motors Pvt. Ltd.",
    "Wuling": "Paramount Motors Pvt. Ltd.",
    "Proton": "Paramount Motors Pvt. Ltd.",
    "Mercedes-Benz": "Pashupati Roadlinks",
    "Nissan": "Pioneer Moto Corp Pvt. Ltd.",
    "Datsun": "Pioneer Moto Corp Pvt. Ltd.",
    "Zeekr": "Pioneer Moto Corp Pvt. Ltd.",
    "Henrey Volts": "S Cube Enterprises",
    "Citroen": "Shangrila Motors Pvt. Ltd.",
    "Peugeot": "Shangrila Motors Pvt. Ltd.",
    "Leapmotor": "Shangrila Motors Pvt. Ltd.",
    "JAC Motors": "Shangrila Motors Pvt. Ltd.",
    "SWM": "Shangrila Motors Pvt. Ltd.",
    "Keyton": "Shasheela Motors Pvt. Ltd.",
    "Foday": "Shree Automotive Trade and Suppliers",
    "Tata Motors": "Sipradi Trading Pvt. Ltd.",
    "Tata": "Sipradi Trading Pvt. Ltd.",
    "Chery": "Sipradi Trading Pvt. Ltd.",
    "Omoda": "SPG Automobiles Pvt. Ltd.",
    "Jaecoo": "SPG Automobiles Pvt. Ltd.",
    "Honda": "Syakar Trading Company Pvt. Ltd.",
    "DFSK": "thee GO Motors",
    "CHTC": "thee GO Motors",
    "Toyota": "United Traders Syndicate Pvt. Ltd.",
    "Subaru": "Vijay Motors Pvt. Ltd.",
    "Volkswagen": "Vishal Group",
    "I Car": "Chery" # Guessing from I Car / Jaecoo / Omoda
}

cars_file = "/home/raman/Desktop/autoviindu/backend/data/cars.json"

with open(cars_file, "r") as f:
    cars = json.load(f)

brands_in_db = set()
for car in cars:
    brand = car.get("brand", "")
    if brand:
        brands_in_db.add(brand)
        if brand in importer_mapping:
            car["importer"] = importer_mapping[brand]

with open(cars_file, "w") as f:
    json.dump(cars, f, indent=2)

brands_left_to_add = [b for b in importer_mapping.keys() if b not in brands_in_db]

print("Successfully updated backend/data/cars.json with importer data.")
print(f"Cars Left to Add (Brands with no cars in DB): {sorted(brands_left_to_add)}")
