import { MS_PER_DAY, DAYS_PER_YEAR } from "./constants";

// Days elapsed since the child turned a given age
export function daysSinceAge(dob: Date, age: number, now: number): number {
  const start = new Date(dob);
  start.setFullYear(start.getFullYear() + age);
  return Math.max(0, (now - start.getTime()) / MS_PER_DAY);
}

// Precise fractional years alive (e.g. 8.992), accounting for calendar year lengths
export function getAge(dob: Date, now: number, decimals?: number): number {
  const nowDate = new Date(now);
  let age = nowDate.getFullYear() - dob.getFullYear();
  const monthDiff = nowDate.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && nowDate.getDate() < dob.getDate())) {
    age--;
  }
  const lastBirthday = new Date(dob);
  lastBirthday.setFullYear(dob.getFullYear() + age);
  const nextBirthday = new Date(dob);
  nextBirthday.setFullYear(dob.getFullYear() + age + 1);
  const yearMs = nextBirthday.getTime() - lastBirthday.getTime();
  const precise = age + (now - lastBirthday.getTime()) / yearMs;
  if (decimals === undefined) return precise;
  if (decimals === 0) return Math.floor(precise);
  const f = 10 ** decimals;
  return Math.round(precise * f) / f;
}

// Formatting
export function fmt(n: number): string {
  return Math.floor(n).toLocaleString();
}

export function fmtBig(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`;
  return fmt(n);
}

export function fmtDecimal(n: number, decimals = 1): string {
  return n.toFixed(decimals);
}

export function fmtYears(n: number): string {
  if (Math.abs(n - Math.round(n)) < 0.001) return Math.round(n).toLocaleString();
  return n.toFixed(3);
}
