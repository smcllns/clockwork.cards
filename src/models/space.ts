import type { FactFn } from '../lib/types'
import { SPACE } from '../lib/constants'
import { formatNumber, formatCompact } from '../lib/format'
import { diffHours } from '../lib/time'

export const TripsAroundSun: FactFn = ({ now, dob, name }) => {
  const hours = diffHours(now, dob)
  const orbits = hours / 24 / 365.25
  return {
    title: 'Trips Around Sun',
    value: orbits,
    format: 'decimal3',
    subtitle: '1 trip = 1 year',
    accent: 'warm',
    live: true,
    math: [
      { label: 'Earth takes 1 year to orbit the sun:' },
      { line: 'trips = years alive' },
      { line: `= ${orbits.toFixed(3)} orbits`, bold: true },
      { label: 'Each orbit is about 584 million miles!' },
    ],
    prose: `${name} has completed ${Math.floor(orbits)} full trips around the sun — each one covering 584 million miles!`,
  }
}

export const MilesFromRotation: FactFn = ({ now, dob, name }) => {
  const hours = diffHours(now, dob)
  const miles = hours * SPACE.ROTATION_MPH
  return {
    title: 'Miles from Rotation',
    value: miles,
    format: 'compact',
    subtitle: `Earth spins at ${formatNumber(SPACE.ROTATION_MPH)} mph`,
    accent: 'cool',
    math: [
      { label: 'Earth spins once per day:' },
      { line: `${formatNumber(Math.floor(hours))} hrs × ${formatNumber(SPACE.ROTATION_MPH)} mph` },
      { line: `= ${formatNumber(Math.floor(miles))} miles`, bold: true },
    ],
    prose: `The Earth is spinning right now at ${formatNumber(SPACE.ROTATION_MPH)} miles per hour. Since birth, that spin has carried ${name} ${formatCompact(miles)} miles.`,
  }
}

export const MilesAroundSun: FactFn = ({ now, dob, name }) => {
  const hours = diffHours(now, dob)
  const miles = hours * SPACE.ORBIT_MPH
  return {
    title: 'Miles Around Sun',
    value: miles,
    format: 'compact',
    subtitle: `orbiting at ${formatNumber(SPACE.ORBIT_MPH)} mph`,
    accent: 'earth',
    math: [
      { label: 'Earth orbits the sun:' },
      { line: `${formatNumber(Math.floor(hours))} hrs × ${formatNumber(SPACE.ORBIT_MPH)} mph` },
      { line: `= ${miles.toExponential(2)} miles`, bold: true },
    ],
    prose: `While just standing still, ${name} has zoomed ${formatCompact(miles)} miles around the sun. Earth is fast!`,
  }
}

export const MoonTrips: FactFn = ({ now, dob }) => {
  const hours = diffHours(now, dob)
  const milesAroundSun = hours * SPACE.ORBIT_MPH
  const trips = milesAroundSun / SPACE.MOON_DISTANCE
  return {
    title: 'Moon Trips',
    value: Math.floor(trips),
    format: 'number',
    subtitle: `could reach the Moon ${formatNumber(Math.floor(trips))}×`,
    accent: 'neutral',
    math: [
      { label: `Moon is ${formatNumber(SPACE.MOON_DISTANCE)} miles away:` },
      { line: `${milesAroundSun.toExponential(2)} ÷ ${formatNumber(SPACE.MOON_DISTANCE)}` },
      { line: `= ${formatNumber(Math.floor(trips))} trips`, bold: true },
    ],
    prose: `If you could aim all that distance at the Moon, you would have made the trip ${formatNumber(Math.floor(trips))} times!`,
  }
}

export const ThroughTheGalaxy: FactFn = ({ now, dob, name }) => {
  const hours = diffHours(now, dob)
  const miles = hours * SPACE.GALAXY_MPH
  return {
    title: 'Through the Galaxy',
    value: miles,
    format: 'compact',
    subtitle: `at ${formatNumber(SPACE.GALAXY_MPH)} mph`,
    accent: 'cool',
    math: [
      { label: 'Our solar system moves through the Milky Way:' },
      { line: `${formatNumber(Math.floor(hours))} hrs × ${formatNumber(SPACE.GALAXY_MPH)} mph` },
      { line: `= ${miles.toExponential(2)} miles`, bold: true },
      { label: 'You are a space traveler and you didn\'t even know it!' },
    ],
    prose: `Our whole solar system is zooming through the Milky Way galaxy. ${name} has traveled ${formatCompact(miles)} miles through space without even knowing it!`,
  }
}
