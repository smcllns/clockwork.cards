import { useState } from "react";
import { getAge, daysSinceAge } from "../utils";
import {
  MS_PER_DAY, AVG_BLINKS_PER_DAY, AVG_CHILD_BPM,
  HARD_PLAY_LITERS_PER_MIN, KM_PER_MILE, EARTH_ORBITAL_MPH,
  LIGHT_SPEED_MPH, OLYMPIC_POOL_LITERS, GLASS_ML,
} from "../constants";

const TIME_UNITS = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"] as const;
export type TimeUnit = typeof TIME_UNITS[number];
export { TIME_UNITS };

export function useTimeMetrics(dob: Date, now: number) {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("seconds");
  const msAlive = now - dob.getTime();
  const daysAlive = msAlive / MS_PER_DAY;
  const values: Record<TimeUnit, number> = {
    years: getAge(dob, now),
    months: Math.floor(daysAlive / (365.25 / 12)),
    weeks: Math.floor(daysAlive / 7),
    days: Math.floor(daysAlive),
    hours: Math.floor(msAlive / 3_600_000),
    minutes: Math.floor(msAlive / 60_000),
    seconds: Math.floor(msAlive / 1000),
  };
  const formattedValue = timeUnit === "years"
    ? values.years.toFixed(3)
    : values[timeUnit].toLocaleString();
  return { timeUnit, setTimeUnit, TIME_UNITS, values, formattedValue, daysAlive, msAlive };
}

export function useSpaceMetrics(dob: Date, now: number) {
  const [unit, setUnit] = useState<"miles" | "km">("miles");
  const hoursAlive = (now - dob.getTime()) / 3_600_000;
  const milesInSpace = hoursAlive * EARTH_ORBITAL_MPH;
  const lightSpeedHours = milesInSpace / LIGHT_SPEED_MPH;
  const lapsAroundSun = getAge(dob, now);
  const k = unit === "km" ? KM_PER_MILE : 1;
  const unitLabel = unit === "km" ? "kph" : "mph";
  const orbitalSpeed = Math.round(EARTH_ORBITAL_MPH * k);
  const lightSpeed = Math.round(LIGHT_SPEED_MPH * k);
  return { unit, setUnit, milesInSpace, lightSpeedHours, lapsAroundSun, k, unitLabel, orbitalSpeed, lightSpeed };
}

export function useStepsMetrics(dob: Date, now: number) {
  const [stepsPerDay, setStepsPerDay] = useState(8_000);
  const [startAge, setStartAge] = useState(3);
  const totalSteps = daysSinceAge(dob, startAge, now) * stepsPerDay;
  const age = getAge(dob, now, 2);
  return { stepsPerDay, setStepsPerDay, startAge, setStartAge, totalSteps, age };
}

export function useYogurtMetrics(dob: Date, now: number) {
  const [gramsPerDay, setGramsPerDay] = useState(50);
  const [startAge, setStartAge] = useState(4);
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const yogurtKg = (daysSinceAge(dob, startAge, now) * gramsPerDay) / 1000;
  const display = unit === "lbs" ? Math.floor(yogurtKg * 2.205) : Math.floor(yogurtKg);
  const ratio = yogurtKg / 40;
  const hippoHeadline =
    ratio < 0.9 ? `That's about ${Math.round(ratio * 100)}% the weight of a baby hippo.` :
    ratio < 1.15 ? "About the weight of a baby hippo." :
    `That's about ${ratio.toFixed(1)}× the weight of a baby hippo.`;
  return { gramsPerDay, setGramsPerDay, startAge, setStartAge, unit, setUnit, yogurtKg, display, hippoHeadline };
}

export function useHeartMetrics(dob: Date, now: number) {
  const minutesAlive = (now - dob.getTime()) / 60_000;
  const totalHeartbeats = minutesAlive * AVG_CHILD_BPM;
  const heartbeatsPerDay = AVG_CHILD_BPM * 60 * 24;
  return { totalHeartbeats, heartbeatsPerDay };
}

export function useFruitMetrics(dob: Date, now: number) {
  const [servingsPerDay, setServingsPerDay] = useState(3);
  const daysAlive = Math.floor((now - dob.getTime()) / MS_PER_DAY);
  const fruitServings = daysAlive * servingsPerDay;
  return { servingsPerDay, setServingsPerDay, fruitServings };
}

export function useHugsMetrics(dob: Date, now: number) {
  const [hugsPerDay, setHugsPerDay] = useState(2);
  const daysAlive = Math.floor((now - dob.getTime()) / MS_PER_DAY);
  const totalHugs = daysAlive * hugsPerDay;
  return { hugsPerDay, setHugsPerDay, totalHugs };
}

export function useLungsMetrics(dob: Date, now: number) {
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const daysAlive = Math.floor((now - dob.getTime()) / MS_PER_DAY);
  const lungExtraLiters = daysAlive * hoursPerDay * 60 * HARD_PLAY_LITERS_PER_MIN;
  return { hoursPerDay, setHoursPerDay, lungExtraLiters };
}

export function useSleepMetrics(dob: Date, now: number) {
  const [hoursPerNight, setHoursPerNight] = useState(10);
  const daysAlive = Math.floor((now - dob.getTime()) / MS_PER_DAY);
  const sleepHours = daysAlive * hoursPerNight;
  const sleepYears = sleepHours / (24 * 365.25);
  return { hoursPerNight, setHoursPerNight, sleepHours, sleepYears };
}

export function useBrushingMetrics(dob: Date, now: number) {
  const [minutes, setMinutes] = useState(2);
  const [strokesPerMin, setStrokesPerMin] = useState(170);
  const [blinksPerDay, setBlinksPerDay] = useState(AVG_BLINKS_PER_DAY);
  const minutesTotal = daysSinceAge(dob, 3, now) * minutes * 2;
  const brushStrokes = minutesTotal * strokesPerMin;
  const daysAlive = Math.floor((now - dob.getTime()) / MS_PER_DAY);
  const totalBlinks = daysAlive * blinksPerDay;
  return { minutes, setMinutes, strokesPerMin, setStrokesPerMin, blinksPerDay, setBlinksPerDay, brushStrokes, totalBlinks };
}

export function useWaterMetrics(dob: Date, now: number) {
  const [glassesPerDay, setGlassesPerDay] = useState(6);
  const daysAlive = Math.floor((now - dob.getTime()) / MS_PER_DAY);
  const litersPerDay = (glassesPerDay * GLASS_ML) / 1000;
  const waterLiters = daysAlive * litersPerDay;
  const waterPoolPercent = (waterLiters / OLYMPIC_POOL_LITERS) * 100;
  const poolYearsRemaining = (OLYMPIC_POOL_LITERS - waterLiters) / litersPerDay / 365.25;
  return { glassesPerDay, setGlassesPerDay, waterLiters, waterPoolPercent, poolYearsRemaining };
}

export function usePoopsMetrics(dob: Date, now: number) {
  const [perDay, setPerDay] = useState(1.5);
  const daysAlive = Math.floor((now - dob.getTime()) / MS_PER_DAY);
  const totalPoops = Math.floor(daysAlive * perDay);
  const age = getAge(dob, now, 2);
  return { perDay, setPerDay, totalPoops, age };
}

export function useHairMetrics(dob: Date, now: number) {
  const [cmPerMonth, setCmPerMonth] = useState(1.2);
  const age = getAge(dob, now);
  const totalM = (age * 12 * cmPerMonth) / 100;
  return { cmPerMonth, setCmPerMonth, totalM };
}

export function useClosingMetrics(dob: Date, now: number) {
  const age = Math.floor(getAge(dob, now));
  const binary = age.toString(2);
  return { age, binary };
}
