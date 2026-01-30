export const SPACE = {
  ROTATION_MPH: 1040,
  ORBIT_MPH: 67000,
  GALAXY_MPH: 450000,
  MOON_DISTANCE: 238900,
} as const

export const DISTANCE_COMPARISONS = [
  { threshold: 100, label: "a few towns over" },
  { threshold: 300, label: "New York to Washington DC" },
  { threshold: 800, label: "New York to Chicago" },
  { threshold: 1500, label: "New York to Miami" },
  { threshold: 2500, label: "New York to Denver" },
  { threshold: 3000, label: "coast to coast" },
] as const

export function getDistanceComparison(miles: number): string {
  for (const { threshold, label } of DISTANCE_COMPARISONS) {
    if (miles < threshold) return label
  }
  return "across the USA and back"
}
