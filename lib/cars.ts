export interface Car {
  brand: string
  model: string
  year: number
  price: number
  km: number
  fuel: string
  trans: string
  body: string
  power: number
  highlight?: boolean
  addedAt: string
}

export const cars: Car[] = [
  { brand:'BMW', model:'M3 Competition', year:2023, price:89900, km:12500, fuel:'Benzin', trans:'Automatik', body:'Limousine', power:510, highlight:true, addedAt:'2025-08-12' },
  { brand:'Mercedes-Benz', model:'S 500 4MATIC', year:2022, price:95000, km:28000, fuel:'Hybrid', trans:'Automatik', body:'Limousine', power:435, highlight:true, addedAt:'2025-09-03' },
  { brand:'Audi', model:'RS6 Avant Performance', year:2021, price:119500, km:34000, fuel:'Benzin', trans:'Automatik', body:'Kombi', power:630, highlight:true, addedAt:'2025-09-22' },
  { brand:'Porsche', model:'911 Carrera S', year:2020, price:138000, km:21000, fuel:'Benzin', trans:'Automatik', body:'Coupé', power:450, addedAt:'2025-07-15' },
  { brand:'Volkswagen', model:'Golf 8 GTI', year:2022, price:32500, km:18500, fuel:'Benzin', trans:'Schalter', body:'Kleinwagen', power:245, addedAt:'2025-10-04' },
  { brand:'Tesla', model:'Model 3 Performance', year:2023, price:54900, km:9800, fuel:'Elektro', trans:'Automatik', body:'Limousine', power:513, addedAt:'2025-11-08' },
  { brand:'Land Rover', model:'Range Rover Sport HSE', year:2021, price:89000, km:42000, fuel:'Diesel', trans:'Automatik', body:'SUV', power:300, addedAt:'2025-06-18' },
  { brand:'BMW', model:'3er Touring 330d xDrive', year:2020, price:42500, km:67000, fuel:'Diesel', trans:'Automatik', body:'Kombi', power:286, addedAt:'2025-05-22' },
  { brand:'Audi', model:'A4 Avant 2.0 TDI quattro', year:2019, price:28900, km:89000, fuel:'Diesel', trans:'Automatik', body:'Kombi', power:190, addedAt:'2025-04-11' },
  { brand:'Mercedes-Benz', model:'E 220d AMG-Line', year:2021, price:38500, km:54000, fuel:'Diesel', trans:'Automatik', body:'Limousine', power:194, addedAt:'2025-08-30' },
  { brand:'Skoda', model:'Octavia RS iV', year:2022, price:34900, km:24000, fuel:'Hybrid', trans:'Automatik', body:'Limousine', power:245, addedAt:'2025-09-14' },
  { brand:'Volkswagen', model:'Tiguan R-Line 2.0 TSI', year:2023, price:48900, km:14500, fuel:'Benzin', trans:'Automatik', body:'SUV', power:245, addedAt:'2025-10-19' },
  { brand:'BMW', model:'X5 xDrive40d M-Sport', year:2021, price:72000, km:38000, fuel:'Diesel', trans:'Automatik', body:'SUV', power:340, addedAt:'2025-07-28' },
  { brand:'Audi', model:'Q5 50 TFSI e quattro', year:2022, price:51500, km:22000, fuel:'Hybrid', trans:'Automatik', body:'SUV', power:299, addedAt:'2025-09-30' },
  { brand:'Porsche', model:'Cayenne S Coupé', year:2020, price:78900, km:48000, fuel:'Benzin', trans:'Automatik', body:'SUV', power:440, addedAt:'2025-06-05' },
  { brand:'Mercedes-Benz', model:'GLE 350 d 4MATIC', year:2021, price:68000, km:41000, fuel:'Diesel', trans:'Automatik', body:'SUV', power:272, addedAt:'2025-08-17' },
  { brand:'Mini', model:'Cooper S Cabrio', year:2022, price:28900, km:19500, fuel:'Benzin', trans:'Automatik', body:'Cabrio', power:178, addedAt:'2025-10-01' },
  { brand:'Ford', model:'Mustang GT 5.0 V8', year:2019, price:46500, km:32000, fuel:'Benzin', trans:'Schalter', body:'Coupé', power:450, addedAt:'2025-05-09' },
  { brand:'Volvo', model:'XC60 T8 AWD Recharge', year:2022, price:54900, km:18000, fuel:'Hybrid', trans:'Automatik', body:'SUV', power:390, addedAt:'2025-10-25' },
  { brand:'Hyundai', model:'IONIQ 5 Long Range', year:2023, price:44900, km:8500, fuel:'Elektro', trans:'Automatik', body:'SUV', power:217, addedAt:'2025-11-12' },
]
