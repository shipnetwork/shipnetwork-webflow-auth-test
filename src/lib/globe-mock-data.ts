// Globe Mock Data Generator - ShipNetwork Order Tracker
// All orders originate FROM warehouses and go TO customer destinations

// ============================================================================
// TYPES
// ============================================================================

export interface Warehouse {
  name: string;
  lat: number;
  lng: number;
  intensity: number; // 0-1, based on recent order volume
}

export interface Destination {
  city: string;
  state?: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  from: Warehouse;
  to: Destination;
  timestamp: Date;
  value: number;
  units: number;
  category: string;
}

export interface Stats {
  totalOrders: number;
  totalUnits: number;
  totalValue: number;
  topStates: { state: string; count: number }[];
  topCategories: { category: string; count: number; percentage: number }[];
}

// ============================================================================
// SHIPNETWORK WAREHOUSE LOCATIONS (10 Fulfillment Centers)
// ============================================================================

export const WAREHOUSES: Warehouse[] = [
  { name: "Anaheim, CA", lat: 33.8366, lng: -117.9143, intensity: 0.8 },
  { name: "Reno, NV", lat: 39.5296, lng: -119.8138, intensity: 0.6 },
  { name: "Las Vegas, NV", lat: 36.1699, lng: -115.1398, intensity: 0.7 },
  { name: "Salt Lake City, UT", lat: 40.7608, lng: -111.8910, intensity: 0.5 },
  { name: "Houston, TX", lat: 29.7604, lng: -95.3698, intensity: 0.75 },
  { name: "Chicago, IL", lat: 41.8781, lng: -87.6298, intensity: 0.85 },
  { name: "Atlanta, GA", lat: 33.7490, lng: -84.3880, intensity: 0.7 },
  { name: "West Hazleton, PA", lat: 40.9584, lng: -75.9946, intensity: 0.65 },
  { name: "Scranton, PA", lat: 41.4090, lng: -75.6624, intensity: 0.55 },
  { name: "Olean, NY", lat: 42.0784, lng: -78.4297, intensity: 0.5 },
];

// ============================================================================
// CUSTOMER DESTINATION LOCATIONS (US Cities + Some International)
// ============================================================================

const US_DESTINATIONS: Destination[] = [
  // West Coast
  { city: "Los Angeles", state: "CA", country: "USA", lat: 34.0522, lng: -118.2437 },
  { city: "San Francisco", state: "CA", country: "USA", lat: 37.7749, lng: -122.4194 },
  { city: "San Diego", state: "CA", country: "USA", lat: 32.7157, lng: -117.1611 },
  { city: "Seattle", state: "WA", country: "USA", lat: 47.6062, lng: -122.3321 },
  { city: "Portland", state: "OR", country: "USA", lat: 45.5152, lng: -122.6784 },
  { city: "Phoenix", state: "AZ", country: "USA", lat: 33.4484, lng: -112.0740 },
  { city: "Denver", state: "CO", country: "USA", lat: 39.7392, lng: -104.9903 },
  
  // South
  { city: "Miami", state: "FL", country: "USA", lat: 25.7617, lng: -80.1918 },
  { city: "Orlando", state: "FL", country: "USA", lat: 28.5383, lng: -81.3792 },
  { city: "Tampa", state: "FL", country: "USA", lat: 27.9506, lng: -82.4572 },
  { city: "Dallas", state: "TX", country: "USA", lat: 32.7767, lng: -96.7970 },
  { city: "Austin", state: "TX", country: "USA", lat: 30.2672, lng: -97.7431 },
  { city: "San Antonio", state: "TX", country: "USA", lat: 29.4241, lng: -98.4936 },
  { city: "New Orleans", state: "LA", country: "USA", lat: 29.9511, lng: -90.0715 },
  { city: "Nashville", state: "TN", country: "USA", lat: 36.1627, lng: -86.7816 },
  { city: "Charlotte", state: "NC", country: "USA", lat: 35.2271, lng: -80.8431 },
  
  // Northeast
  { city: "New York", state: "NY", country: "USA", lat: 40.7128, lng: -74.0060 },
  { city: "Boston", state: "MA", country: "USA", lat: 42.3601, lng: -71.0589 },
  { city: "Philadelphia", state: "PA", country: "USA", lat: 39.9526, lng: -75.1652 },
  { city: "Washington", state: "DC", country: "USA", lat: 38.9072, lng: -77.0369 },
  { city: "Baltimore", state: "MD", country: "USA", lat: 39.2904, lng: -76.6122 },
  { city: "Pittsburgh", state: "PA", country: "USA", lat: 40.4406, lng: -79.9959 },
  
  // Midwest
  { city: "Detroit", state: "MI", country: "USA", lat: 42.3314, lng: -83.0458 },
  { city: "Minneapolis", state: "MN", country: "USA", lat: 44.9778, lng: -93.2650 },
  { city: "St. Louis", state: "MO", country: "USA", lat: 38.6270, lng: -90.1994 },
  { city: "Indianapolis", state: "IN", country: "USA", lat: 39.7684, lng: -86.1581 },
  { city: "Columbus", state: "OH", country: "USA", lat: 39.9612, lng: -82.9988 },
  { city: "Cleveland", state: "OH", country: "USA", lat: 41.4993, lng: -81.6944 },
  { city: "Kansas City", state: "MO", country: "USA", lat: 39.0997, lng: -94.5786 },
  { city: "Milwaukee", state: "WI", country: "USA", lat: 43.0389, lng: -87.9065 },
];

const INTERNATIONAL_DESTINATIONS: Destination[] = [
  { city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  { city: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },
  { city: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673 },
  { city: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332 },
  { city: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
];

// Combine all destinations (weighted toward US)
const ALL_DESTINATIONS: Destination[] = [
  ...US_DESTINATIONS,
  ...US_DESTINATIONS, // Double weight for US
  ...US_DESTINATIONS, // Triple weight for US
  ...INTERNATIONAL_DESTINATIONS,
];

// ============================================================================
// PRODUCT CATEGORIES
// ============================================================================

const PRODUCT_CATEGORIES = [
  "Electronics",
  "Apparel",
  "Home & Garden",
  "Health & Beauty",
  "Sports & Outdoors",
  "Toys & Games",
  "Food & Beverage",
  "Office Supplies",
  "Pet Supplies",
  "Automotive",
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// ============================================================================
// ORDER GENERATION
// ============================================================================

export function generateOrder(): Order {
  const warehouse = randomElement(WAREHOUSES);
  const destination = randomElement(ALL_DESTINATIONS);
  
  return {
    id: generateId(),
    from: { ...warehouse }, // Clone to avoid mutation
    to: destination,
    timestamp: new Date(),
    value: randomFloat(25, 750),
    units: randomInt(1, 12),
    category: randomElement(PRODUCT_CATEGORIES),
  };
}

export function generateBatchOrders(count: number): Order[] {
  return Array.from({ length: count }, () => generateOrder());
}

// ============================================================================
// STATS CALCULATION
// ============================================================================

export function calculateStats(orders: Order[]): Stats {
  if (orders.length === 0) {
    return {
      totalOrders: 0,
      totalUnits: 0,
      totalValue: 0,
      topStates: [],
      topCategories: [],
    };
  }

  // Total orders and units
  const totalOrders = orders.length;
  const totalUnits = orders.reduce((sum, order) => sum + order.units, 0);
  const totalValue = orders.reduce((sum, order) => sum + order.value, 0);

  // Calculate top states
  const stateCount: Record<string, number> = {};
  orders.forEach((order) => {
    const state = order.to.state || order.to.country;
    stateCount[state] = (stateCount[state] || 0) + 1;
  });
  
  const topStates = Object.entries(stateCount)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate top categories
  const categoryCount: Record<string, number> = {};
  orders.forEach((order) => {
    categoryCount[order.category] = (categoryCount[order.category] || 0) + 1;
  });
  
  const topCategories = Object.entries(categoryCount)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalOrders) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalOrders,
    totalUnits,
    totalValue,
    topStates,
    topCategories,
  };
}

// ============================================================================
// WAREHOUSE INTENSITY UPDATE
// ============================================================================

export function updateWarehouseIntensity(
  warehouses: Warehouse[],
  recentOrders: Order[]
): Warehouse[] {
  // Count orders from each warehouse
  const ordersByWarehouse: Record<string, number> = {};
  recentOrders.forEach((order) => {
    ordersByWarehouse[order.from.name] = (ordersByWarehouse[order.from.name] || 0) + 1;
  });

  // Find max for normalization
  const maxOrders = Math.max(...Object.values(ordersByWarehouse), 1);

  // Update intensities
  return warehouses.map((warehouse) => ({
    ...warehouse,
    intensity: Math.min(
      0.3 + ((ordersByWarehouse[warehouse.name] || 0) / maxOrders) * 0.7,
      1
    ),
  }));
}

// ============================================================================
// INITIAL DATA FOR GLOBE
// ============================================================================

export function getInitialData() {
  // Generate some initial orders so the globe isn't empty
  const initialOrders = generateBatchOrders(20);
  const stats = calculateStats(initialOrders);
  const warehouses = updateWarehouseIntensity(WAREHOUSES, initialOrders);

  return {
    warehouses,
    orders: initialOrders,
    stats,
  };
}

// ============================================================================
// HISTORICAL DATA GENERATION
// ============================================================================

/**
 * Generate historical orders for a given time range
 * Used for replay mode
 */
export function generateHistoricalOrders(
  startDate: Date,
  endDate: Date,
  ordersPerHour: number = 50
): Order[] {
  const orders: Order[] = [];
  const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const totalOrders = Math.floor(hours * ordersPerHour);
  
  for (let i = 0; i < totalOrders; i++) {
    const warehouse = randomElement(WAREHOUSES);
    const destination = randomElement(ALL_DESTINATIONS);
    
    // Random timestamp within the range
    const timestamp = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    );
    
    orders.push({
      id: `historical-${i}-${Math.random().toString(36).substr(2, 9)}`,
      from: { ...warehouse },
      to: destination,
      timestamp,
      value: randomFloat(25, 750),
      units: randomInt(1, 12),
      category: randomElement(PRODUCT_CATEGORIES),
    });
  }
  
  // Sort by timestamp for replay
  return orders.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

/**
 * Get time range dates based on mode
 */
export function getTimeRangeDates(mode: string): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  let startDate: Date;
  
  switch (mode) {
    case "1h":
      startDate = new Date(endDate.getTime() - 60 * 60 * 1000);
      break;
    case "24h":
      startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "7d":
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      // Live mode - use last hour
      startDate = new Date(endDate.getTime() - 60 * 60 * 1000);
  }
  
  return { startDate, endDate };
}

/**
 * Get orders per hour based on time range
 * Shorter ranges = more orders per hour for smoother playback
 */
export function getOrdersPerHour(mode: string): number {
  switch (mode) {
    case "1h":
      return 120; // More detail for short timeframe
    case "24h":
      return 60;
    case "7d":
      return 30;
    case "30d":
      return 15; // Less detail for long timeframe
    default:
      return 60;
  }
}

