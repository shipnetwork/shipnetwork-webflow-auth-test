// Globe Visualization Types
// Re-export from mock data for convenience

export type {
  Warehouse,
  Destination,
  Order,
  Stats,
} from "@/lib/globe-mock-data";

// Globe-specific types
export interface GlobeConfig {
  rotationSpeed: number;
  maxArcs: number;
  arcDuration: number;
  atmosphereColor: string;
  pointColor: string;
}

export const DEFAULT_GLOBE_CONFIG: GlobeConfig = {
  rotationSpeed: 0.3,
  maxArcs: 75,
  arcDuration: 2000,
  atmosphereColor: "#00d4ff",
  pointColor: "#00d4ff",
};

