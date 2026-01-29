import type { SectionConfig, MetricContext } from '../types'
import { getSpaceMetrics, SPACE_CONSTANTS } from '../utils/metrics'
import { formatNumber, formatCompact } from '../utils/format'

function spaceData(ctx: MetricContext) {
  const hoursAlive = (ctx.now.getTime() - ctx.birthDate.getTime()) / (1000 * 60 * 60)
  const yearsAlive = hoursAlive / 24 / 365.25
  return { ...getSpaceMetrics(hoursAlive, yearsAlive), hoursAlive }
}

export const space: SectionConfig = {
  id: 'space',
  title: 'Space Travel',
  subtitle: () => 'without leaving Earth',
  metrics: [
    {
      id: 'space-orbits',
      title: 'Trips Around Sun',
      value: (ctx) => spaceData(ctx).orbitsAroundSun,
      format: 'decimal3',
      subtitle: '1 trip = 1 year',
      accent: 'warm',
      live: true,
      math: (ctx) => {
        const s = spaceData(ctx)
        return [
          { label: 'Earth takes 1 year to orbit the sun:' },
          { line: 'trips = years alive' },
          { line: `= ${s.orbitsAroundSun.toFixed(3)} orbits`, bold: true },
          { label: 'Each orbit is about 584 million miles!' },
        ]
      },
      prose: (ctx) => {
        const s = spaceData(ctx)
        return `${ctx.name} has completed ${Math.floor(s.orbitsAroundSun)} full trips around the sun — each one covering 584 million miles!`
      },
    },
    {
      id: 'space-rotation',
      title: 'Miles from Rotation',
      value: (ctx) => spaceData(ctx).milesFromRotation,
      format: 'compact',
      subtitle: `Earth spins at ${formatNumber(SPACE_CONSTANTS.ROTATION_MPH)} mph`,
      accent: 'cool',
      math: (ctx) => {
        const s = spaceData(ctx)
        return [
          { label: 'Earth spins once per day:' },
          { line: `${formatNumber(Math.floor(s.hoursAlive))} hrs × ${formatNumber(SPACE_CONSTANTS.ROTATION_MPH)} mph` },
          { line: `= ${formatNumber(Math.floor(s.milesFromRotation))} miles`, bold: true },
        ]
      },
      prose: (ctx) => {
        const s = spaceData(ctx)
        return `The Earth is spinning right now at ${formatNumber(SPACE_CONSTANTS.ROTATION_MPH)} miles per hour. Since birth, that spin has carried ${ctx.name} ${formatCompact(s.milesFromRotation)} miles.`
      },
    },
    {
      id: 'space-orbit',
      title: 'Miles Around Sun',
      value: (ctx) => spaceData(ctx).milesAroundSun,
      format: 'compact',
      subtitle: `orbiting at ${formatNumber(SPACE_CONSTANTS.ORBIT_MPH)} mph`,
      accent: 'earth',
      math: (ctx) => {
        const s = spaceData(ctx)
        return [
          { label: 'Earth orbits the sun:' },
          { line: `${formatNumber(Math.floor(s.hoursAlive))} hrs × ${formatNumber(SPACE_CONSTANTS.ORBIT_MPH)} mph` },
          { line: `= ${s.milesAroundSun.toExponential(2)} miles`, bold: true },
        ]
      },
      prose: (ctx) => {
        const s = spaceData(ctx)
        return `While just standing still, ${ctx.name} has zoomed ${formatCompact(s.milesAroundSun)} miles around the sun. Earth is fast!`
      },
    },
    {
      id: 'space-moon',
      title: 'Moon Trips',
      value: (ctx) => Math.floor(spaceData(ctx).moonTrips),
      format: 'number',
      subtitle: (ctx) => `could reach the Moon ${formatNumber(Math.floor(spaceData(ctx).moonTrips))}×`,
      accent: 'neutral',
      math: (ctx) => {
        const s = spaceData(ctx)
        return [
          { label: `Moon is ${formatNumber(SPACE_CONSTANTS.MOON_DISTANCE)} miles away:` },
          { line: `${s.milesAroundSun.toExponential(2)} ÷ ${formatNumber(SPACE_CONSTANTS.MOON_DISTANCE)}` },
          { line: `= ${formatNumber(Math.floor(s.moonTrips))} trips`, bold: true },
        ]
      },
      prose: (ctx) => {
        const s = spaceData(ctx)
        return `If you could aim all that distance at the Moon, you would have made the trip ${formatNumber(Math.floor(s.moonTrips))} times!`
      },
    },
    {
      id: 'space-galaxy',
      title: 'Through the Galaxy',
      value: (ctx) => spaceData(ctx).milesThroughGalaxy,
      format: 'compact',
      subtitle: `at ${formatNumber(SPACE_CONSTANTS.GALAXY_MPH)} mph`,
      accent: 'cool',
      math: (ctx) => {
        const s = spaceData(ctx)
        return [
          { label: 'Our solar system moves through the Milky Way:' },
          { line: `${formatNumber(Math.floor(s.hoursAlive))} hrs × ${formatNumber(SPACE_CONSTANTS.GALAXY_MPH)} mph` },
          { line: `= ${s.milesThroughGalaxy.toExponential(2)} miles`, bold: true },
          { label: 'You are a space traveler and you didn\'t even know it!' },
        ]
      },
      prose: (ctx) => {
        const s = spaceData(ctx)
        return `Our whole solar system is zooming through the Milky Way galaxy. ${ctx.name} has traveled ${formatCompact(s.milesThroughGalaxy)} miles through space without even knowing it!`
      },
    },
  ],
}
