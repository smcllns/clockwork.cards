import { formatNumber, formatCompact, diffDays } from '../src/utils/format' // some standard helpers

type Fact = {
  title: string
  value: number
  format: string
  subtitle: string
  accent: string
  live: boolean
  settings: HeartRateSetting
  math: Record<string, string>[]
  prose: string
}

// END SYSTEM STUFF (All the above wouldn't need to be shown to someone writing their own)

// SIMPLE EXAMPLE

export const TotalPoops = ({now, dob, name}) => {
  const poops = diffDays(now, dob) * 1.25;
  return {
    title: 'Total Poops',
    subtitle: `How many poops has ${name} done?`,
    value: poops,
    prose: `Oh my, assuming 1.25 poops/day, ${name} has done ${poops} since birth!`  
  }
};

// And on the dashboard, add Fact -> select "TotalPoops" -> customize how widget is display (Card, Hero, Sentence, etc)


// COMPLEX EXAMPLE - introduces new variables and settings to modify

type HeartRateSetting = {
  avg: number
  min: number
  max: number
  step: number
  label: string
  unit: string
}

export const hr: HeartRateSetting = { avg: 90, min: 60, max: 120, step: 1, label: 'Heart rate', unit: 'BPM' };

// Useful Constants

const minutesAlive = (now.getTime() - dob.getTime()) / 60000
const totalBeats = minutesAlive * hr.avg
const totalBeatsMillions = (totalBeats / 1000000).toFixed(1)
const beatsPerDay = hr.avg * 60 * 24

// FACTS

export const TotalBeats: Fact = {
  title: 'Total Heartbeats',
  value: totalBeats,
  format: 'compact',
  subtitle: `${totalBeatsMillions} million`,
  accent: 'warm',
  live: true,
  settings: hr,
  math: [
    { label: 'BPM = Beats Per Minute' },
    { line: 'minutes alive × BPM' },
    { line: `${formatNumber(Math.floor(minutesAlive))} × ${hr.avg}` },
    { line: `= ${formatNumber(Math.floor(totalBeats))}` }
  ],
  prose: `${name}'s heart has beaten about ${formatNumber(totalBeats)} times — without ever taking a break!`,
}

export const BeatsPerDay: Fact = {
  title: 'Beats Per Day',
  value: beatsPerDay,
  format: 'number',
  subtitle: `${hr.avg} × 60 × 24`,
  accent: 'warm',
  math: [
    { label: 'How many beats in one day:' },
    { line: `${hr.avg} beats/min × 60 min/hr × 24 hr/day` },
    { line: `= ${formatNumber(beatsPerDay)} beats/day`, bold: true },
  ],
  prose: `Every single day, that little heart beats ${formatNumber(beatsPerDay)} times. It never stops, even while sleeping!`,
}

// Comments
//
// In my mind it's like there are components like this
// Where the user info (name, dob) can be passed down
// We can set up some variables and calculations for a Thing (in this case Heart, we need some new data for that)
// Then we have Facts that modify and curate how that info will be passed into the widgets
// 
// <User>
//   <Heart>
//     <TotalBeats />
//     <BeatsPerDay />
//   </Heart>
// </User>
//
//
// And then we need a good design system for widgets so that a user really only needs the flexibility we provide them in Thing, Facts and Theme to be able to create a hugely diverse set of web pages (birthday cards!) 
//
// It should be brutally simple to just add a Fact and change how its displayed on the page
// It should be possible to add more complex Facts with settings just the same
// I'm not really happy with how Settings are done above, maybe you can improve
// I'm not sure if such an above syntax will be possible, but I think this is a decent start place since it's so easy for people to understand and use
// I'm of course open to improvements! I don't think this is the final version, just trying to show you a code direction I would find ergonomic and easy