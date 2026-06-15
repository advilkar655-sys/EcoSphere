/**
 * ECOSPHERE EMISSION FACTOR DATABASE
 * Values compiled from IPCC 2024 & EPA Emission Standards.
 * Units: kg CO2e per unit (km, kWh, day, item)
 */
export const EMISSION_FACTORS = {
  transport: {
    petrolCar: 0.170,  // per km
    dieselCar: 0.171,  // per km
    electricCar: 0.047, // per km (grid-mix charging)
    bus: 0.096,        // per passenger-km
    train: 0.035,      // per passenger-km
    flightShort: 0.245, // per passenger-km (<1500km)
    flightLong: 0.150   // per passenger-km (>=1500km)
  },
  energy: {
    electricity: 0.385, // per kWh (national grid average)
    naturalGas: 0.185,  // per kWh
    heatingOil: 0.268   // per kWh
  },
  diet: {
    vegan: 1.5,        // per day
    vegetarian: 2.1,   // per day
    flexitarian: 3.8,  // per day
    meatHeavy: 7.2     // per day
  },
  consumption: {
    clothing: 14.2,    // per item purchased
    electronics: 85.0  // per device purchased
  }
};

export interface LifestyleData {
  transport: {
    carType: 'petrolCar' | 'dieselCar' | 'electricCar' | 'none';
    carDistanceWeekly: number; // km
    publicTransitDistanceWeekly: number; // km
    annualFlightsShort: number; // hours
    annualFlightsLong: number; // hours
  };
  energy: {
    electricityMonthly: number; // kWh
    naturalGasMonthly: number; // kWh
    hasSolar: boolean;
  };
  diet: 'vegan' | 'vegetarian' | 'flexitarian' | 'meatHeavy';
  consumption: {
    clothingMonthly: number; // items
    electronicsMonthly: number; // items
  };
}

export interface FootprintResult {
  transport: number; // Metric Tons CO2e / year
  energy: number;
  diet: number;
  consumption: number;
  total: number;
}

/**
 * Calculates annual carbon footprint.
 * Returns results in metric tons of CO2e per year.
 */
export function calculateFootprint(data: LifestyleData): FootprintResult {
  // 1. Transportation Calculation (converted to annual)
  let transportEmissions = 0;
  if (data.transport.carType !== 'none') {
    transportEmissions += data.transport.carDistanceWeekly * 52 * EMISSION_FACTORS.transport[data.transport.carType];
  }
  transportEmissions += data.transport.publicTransitDistanceWeekly * 52 * EMISSION_FACTORS.transport.bus;
  // Flight averages: short-haul ~800km/hr speed, long-haul ~900km/hr speed
  transportEmissions += data.transport.annualFlightsShort * 800 * EMISSION_FACTORS.transport.flightShort;
  transportEmissions += data.transport.annualFlightsLong * 900 * EMISSION_FACTORS.transport.flightLong;

  // 2. Home Energy (converted to annual, applying solar offsets)
  let energyEmissions = 0;
  const electricityFactor = data.energy.hasSolar ? EMISSION_FACTORS.energy.electricity * 0.2 : EMISSION_FACTORS.energy.electricity;
  energyEmissions += data.energy.electricityMonthly * 12 * electricityFactor;
  energyEmissions += data.energy.naturalGasMonthly * 12 * EMISSION_FACTORS.energy.naturalGas;

  // 3. Diet (converted to annual)
  const dietEmissions = EMISSION_FACTORS.diet[data.diet] * 365;

  // 4. Consumption (converted to annual)
  let consumptionEmissions = 0;
  consumptionEmissions += data.consumption.clothingMonthly * 12 * EMISSION_FACTORS.consumption.clothing;
  consumptionEmissions += data.consumption.electronicsMonthly * 12 * EMISSION_FACTORS.consumption.electronics;

  // Convert kg to metric tons (1 metric ton = 1000 kg)
  const result: FootprintResult = {
    transport: Number((transportEmissions / 1000).toFixed(2)),
    energy: Number((energyEmissions / 1000).toFixed(2)),
    diet: Number((dietEmissions / 1000).toFixed(2)),
    consumption: Number((consumptionEmissions / 1000).toFixed(2)),
    total: 0
  };
  
  result.total = Number((result.transport + result.energy + result.diet + result.consumption).toFixed(2));
  return result;
}
