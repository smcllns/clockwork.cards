import { useState, useEffect } from "react";

// ── Constants ──────────────────────────────────────────────────────
const MS_PER_SEC = 1000;
const MS_PER_MIN = MS_PER_SEC * 60;
const MS_PER_HOUR = MS_PER_MIN * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const DAYS_PER_YEAR = 365.25;

export const KM_PER_MILE = 1.60934;
export const EARTH_ORBITAL_MPH = 67_000;
export const LIGHT_SPEED_MPH = 669_600_000;
const AVG_CHILD_BPM = 80;
const BLINKS_PER_DAY = 15_000;
const OLYMPIC_POOL_LITERS = 2_500_000;
const GLASS_ML = 250;
const BRUSH_STROKES_PER_MIN = 170;
const HARD_PLAY_LITERS_PER_MIN = 50;

// ── Config (the [bracketed] inputs from the content spec) ──────────
export interface StatsConfig {
  yogurtGramsPerDay: number;
  yogurtStartAge: number;
  stepsPerDay: number;
  stepsStartAge: number;
  brushMinutes: number;
  brushStartAge: number;
  hairGrowthCmPerMonth: number;
  poopsPerDay: number;
  sleepHoursPerNight: number;
  fruitServingsPerDay: number;
  hugsPerDay: number;
  playHoursPerDay: number;
  waterGlassesPerDay: number;
}

export const DEFAULT_CONFIG: StatsConfig = {
  yogurtGramsPerDay: 50,
  yogurtStartAge: 4,
  stepsPerDay: 8_000,
  stepsStartAge: 3,
  brushMinutes: 2,
  brushStartAge: 3,
  hairGrowthCmPerMonth: 1.2,
  poopsPerDay: 1.5,
  sleepHoursPerNight: 10,
  fruitServingsPerDay: 3,
  hugsPerDay: 2,
  playHoursPerDay: 1,
  waterGlassesPerDay: 6,
};

// ── Computed stats ─────────────────────────────────────────────────
export interface Stats {
  // Time
  ageYears: number;
  yearsAlive: number;
  monthsAlive: number;
  weeksAlive: number;
  daysAlive: number;
  hoursAlive: number;
  minutesAlive: number;
  secondsAlive: number;

  // Space
  lapsAroundSun: number;
  milesInSpace: number;
  lightSpeedHours: number; // how quickly light covers that same distance

  // Heartbeats
  totalHeartbeats: number;
  heartbeatsPerDay: number;

  // Life in Numbers
  yogurtKg: number;
  totalSteps: number;
  brushingDays: number;
  brushStrokes: number;
  totalBlinks: number;
  hairLengthCm: number;
  totalPoops: number;

  // Brain & Body
  sleepHours: number;
  sleepYears: number;
  fruitServings: number;
  totalHugs: number;
  lungExtraLiters: number;
  waterLiters: number;
  waterPoolPercent: number;
  poolYearsRemaining: number;
}

function daysSinceAge(dob: Date, age: number, now: number): number {
  const start = new Date(dob);
  start.setFullYear(start.getFullYear() + age);
  return Math.max(0, (now - start.getTime()) / MS_PER_DAY);
}

// Calendar-based age: returns integer age and precise fractional years
function calendarAge(dob: Date, nowMs: number): { ageYears: number; preciseYears: number } {
  const now = new Date(nowMs);
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  // Fractional part: how far through the current year of life
  const lastBirthday = new Date(dob);
  lastBirthday.setFullYear(dob.getFullYear() + age);
  const nextBirthday = new Date(dob);
  nextBirthday.setFullYear(dob.getFullYear() + age + 1);
  const yearMs = nextBirthday.getTime() - lastBirthday.getTime();
  const elapsed = nowMs - lastBirthday.getTime();
  return { ageYears: age, preciseYears: age + elapsed / yearMs };
}

export function computeStats(dob: string, config: StatsConfig, now: number): Stats {
  const dobDate = new Date(dob);
  const msAlive = now - dobDate.getTime();
  const daysAlive = msAlive / MS_PER_DAY;
  const hoursAlive = msAlive / MS_PER_HOUR;
  const minutesAlive = msAlive / MS_PER_MIN;
  const secondsAlive = msAlive / MS_PER_SEC;
  const { ageYears, preciseYears } = calendarAge(dobDate, now);
  const monthsAlive = daysAlive / (DAYS_PER_YEAR / 12);
  const wholeDays = Math.floor(daysAlive);
  const since = (age: number) => daysSinceAge(dobDate, age, now);

  // Space
  const milesInSpace = hoursAlive * EARTH_ORBITAL_MPH;
  const lightSpeedHours = milesInSpace / LIGHT_SPEED_MPH;

  // Heartbeats
  const totalHeartbeats = minutesAlive * AVG_CHILD_BPM;
  const heartbeatsPerDay = AVG_CHILD_BPM * 60 * 24;

  // Life in Numbers
  const yogurtKg = (since(config.yogurtStartAge) * config.yogurtGramsPerDay) / 1000;
  const totalSteps = since(config.stepsStartAge) * config.stepsPerDay;
  const brushMinutesTotal = since(config.brushStartAge) * config.brushMinutes * 2; // 2x per day
  const brushingDays = brushMinutesTotal / (60 * 24);
  const brushStrokes = brushMinutesTotal * BRUSH_STROKES_PER_MIN;
  const totalBlinks = wholeDays * BLINKS_PER_DAY;
  const hairLengthCm = monthsAlive * config.hairGrowthCmPerMonth;
  const totalPoops = Math.floor(daysAlive * config.poopsPerDay);

  // Brain & Body
  const sleepHours = wholeDays * config.sleepHoursPerNight;
  const sleepYears = sleepHours / (24 * DAYS_PER_YEAR);
  const fruitServings = wholeDays * config.fruitServingsPerDay;
  const totalHugs = wholeDays * config.hugsPerDay;
  const lungExtraLiters = wholeDays * config.playHoursPerDay * 60 * HARD_PLAY_LITERS_PER_MIN;
  const waterLitersPerDay = (config.waterGlassesPerDay * GLASS_ML) / 1000;
  const waterLiters = wholeDays * waterLitersPerDay;
  const waterPoolPercent = (waterLiters / OLYMPIC_POOL_LITERS) * 100;
  const litersRemaining = OLYMPIC_POOL_LITERS - waterLiters;
  const poolYearsRemaining = litersRemaining / waterLitersPerDay / DAYS_PER_YEAR;

  return {
    ageYears,
    yearsAlive: preciseYears,
    monthsAlive: Math.floor(monthsAlive),
    weeksAlive: Math.floor(daysAlive / 7),
    daysAlive: Math.floor(daysAlive),
    hoursAlive: Math.floor(hoursAlive),
    minutesAlive: Math.floor(minutesAlive),
    secondsAlive: Math.floor(secondsAlive),
    lapsAroundSun: preciseYears,
    milesInSpace,
    lightSpeedHours,
    totalHeartbeats,
    heartbeatsPerDay,
    yogurtKg,
    totalSteps,
    brushingDays,
    brushStrokes,
    totalBlinks,
    hairLengthCm,
    totalPoops,
    sleepHours,
    sleepYears,
    fruitServings,
    totalHugs,
    lungExtraLiters,
    waterLiters,
    waterPoolPercent,
    poolYearsRemaining,
  };
}

// ── React hook ─────────────────────────────────────────────────────
export function useStats(dob: string, config: StatsConfig = DEFAULT_CONFIG): Stats {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return computeStats(dob, config, now);
}

// ── Formatting helpers ─────────────────────────────────────────────
export function fmt(n: number): string {
  return Math.floor(n).toLocaleString();
}

export function fmtBig(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} billion`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} million`;
  return fmt(n);
}

export function fmtDecimal(n: number, decimals = 1): string {
  return n.toFixed(decimals);
}

export function fmtYears(n: number): string {
  if (Math.abs(n - Math.round(n)) < 0.001) return Math.round(n).toLocaleString();
  return n.toFixed(3);
}

export function hippoHeadline(yogurtKg: number): string {
  const ratio = yogurtKg / 40;
  if (ratio < 0.9) return `That's about ${Math.round(ratio * 100)}% the weight of a baby hippo.`;
  if (ratio < 1.15) return "About the weight of a baby hippo.";
  return `That's about ${fmtDecimal(ratio, 1)}× the weight of a baby hippo.`;
}
