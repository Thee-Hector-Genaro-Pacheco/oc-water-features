export interface ServiceCity {
  name: string;
  county: string;
  popularServices: string[];
}

export const serviceAreasData: ServiceCity[] = [
  { name: "Irvine", county: "Orange County", popularServices: ["HOA Water Features", "Fountain Maintenance", "Leak Detection"] },
  { name: "Newport Beach", county: "Orange County", popularServices: ["Estate Fountain Repair", "Koi Pond Cleaning", "Custom Water Walls"] },
  { name: "Huntington Beach", county: "Orange County", popularServices: ["Waterfall Repair", "Pump Replacement", "Pond Cleaning"] },
  { name: "Laguna Beach", county: "Orange County", popularServices: ["Coastal Fountain Care", "Koi Pond Maintenance", "Leak Sealing"] },
  { name: "Anaheim", county: "Orange County", popularServices: ["Commercial Plaza Fountains", "Pump Replacement", "Fountain Repair"] },
  { name: "Orange", county: "Orange County", popularServices: ["Courtyard Fountains", "Pond Maintenance", "Leak Detection"] },
  { name: "Mission Viejo", county: "Orange County", popularServices: ["Residential Water Features", "Filter Servicing", "Pond Cleanout"] },
  { name: "Fullerton", county: "Orange County", popularServices: ["Fountain Restoration", "Pump Repair", "Algae Control"] },
  { name: "Costa Mesa", county: "Orange County", popularServices: ["Commercial Water Walls", "Tiered Fountain Service", "Auto-Fill Repair"] },
  { name: "San Clemente", county: "Orange County", popularServices: ["Hillside Waterfalls", "Koi Pond Servicing", "Leak Detection"] },
  { name: "Yorba Linda", county: "Orange County", popularServices: ["Estate Fountain Maintenance", "Pond Cleanout", "Pump Upgrades"] },
  { name: "Tustin", county: "Orange County", popularServices: ["Courtyard Water Walls", "Fountain Cleaning", "Chemical Balancing"] },
  { name: "Laguna Niguel", county: "Orange County", popularServices: ["Pond Care", "Fountain Restoration", "Auto-Fill Systems"] },
  { name: "Aliso Viejo", county: "Orange County", popularServices: ["HOA Fountains", "Waterfall Maintenance", "Pump Repair"] },
  { name: "Lake Forest", county: "Orange County", popularServices: ["Resort & HOA Pools", "Fountain Maintenance", "Leak Sealing"] }
];
