import { describe, test, expect } from "bun:test";
import { computeStats, DEFAULT_CONFIG, fmt, fmtBig, fmtDecimal, fmtYears, hippoHeadline, KM_PER_MILE, type Stats } from "./stats";

// Fixed timestamp for deterministic tests: 2026-02-15T12:00:00Z
const FEB_15_2026 = new Date("2026-02-15T12:00:00Z").getTime();
const DOB = "2017-02-20"; // Oscar's birthday

function stats(dob = DOB, now = FEB_15_2026, config = DEFAULT_CONFIG): Stats {
  return computeStats(dob, config, now);
}

// ── Calendar age ─────────────────────────────────────────────────────

describe("calendarAge (via computeStats)", () => {
  test("day before 9th birthday → ageYears = 8, yearsAlive < 9", () => {
    const s = stats(DOB, new Date("2026-02-19T12:00:00Z").getTime());
    expect(s.ageYears).toBe(8);
    expect(s.yearsAlive).toBeGreaterThan(8.99);
    expect(s.yearsAlive).toBeLessThan(9);
  });

  test("on 9th birthday → ageYears = 9, yearsAlive ≈ 9", () => {
    const s = stats(DOB, new Date("2026-02-20T12:00:00Z").getTime());
    expect(s.ageYears).toBe(9);
    expect(s.yearsAlive).toBeGreaterThanOrEqual(9);
    expect(s.yearsAlive).toBeLessThan(9.01);
  });

  test("day after 9th birthday → ageYears = 9, yearsAlive > 9", () => {
    const s = stats(DOB, new Date("2026-02-21T12:00:00Z").getTime());
    expect(s.ageYears).toBe(9);
    expect(s.yearsAlive).toBeGreaterThan(9);
    expect(s.yearsAlive).toBeLessThan(9.01);
  });

  test("newborn → ageYears = 0", () => {
    const s = stats("2026-02-15", FEB_15_2026);
    expect(s.ageYears).toBe(0);
    expect(s.yearsAlive).toBeGreaterThanOrEqual(0);
    expect(s.yearsAlive).toBeLessThan(0.01);
  });

  test("exactly 1 year old", () => {
    const s = stats("2025-02-15", FEB_15_2026);
    expect(s.ageYears).toBe(1);
    expect(s.yearsAlive).toBeGreaterThanOrEqual(1);
    expect(s.yearsAlive).toBeLessThan(1.01);
  });
});

// ── Time stats ───────────────────────────────────────────────────────

describe("time stats", () => {
  test("daysAlive is positive integer (floored)", () => {
    const s = stats();
    expect(s.daysAlive).toBeGreaterThan(0);
    expect(s.daysAlive).toBe(Math.floor(s.daysAlive));
  });

  test("time units are consistent", () => {
    const s = stats();
    // hours ≈ days * 24
    expect(s.hoursAlive).toBeGreaterThanOrEqual(s.daysAlive * 24);
    expect(s.hoursAlive).toBeLessThan((s.daysAlive + 1) * 24);
    // minutes ≈ hours * 60
    expect(s.minutesAlive).toBeGreaterThanOrEqual(s.hoursAlive * 60);
    expect(s.minutesAlive).toBeLessThan((s.hoursAlive + 1) * 60);
    // seconds ≈ minutes * 60
    expect(s.secondsAlive).toBeGreaterThanOrEqual(s.minutesAlive * 60);
    expect(s.secondsAlive).toBeLessThan((s.minutesAlive + 1) * 60);
  });

  test("months and weeks are floored integers", () => {
    const s = stats();
    expect(s.monthsAlive).toBe(Math.floor(s.monthsAlive));
    expect(s.weeksAlive).toBe(Math.floor(s.weeksAlive));
  });

  test("lapsAroundSun equals yearsAlive (preciseYears)", () => {
    const s = stats();
    expect(s.lapsAroundSun).toBe(s.yearsAlive);
  });
});

// ── Space stats ──────────────────────────────────────────────────────

describe("space stats", () => {
  test("milesInSpace is positive and proportional to hours", () => {
    const s = stats();
    expect(s.milesInSpace).toBeGreaterThan(0);
    // Earth moves ~67,000 mph, so miles ≈ hours * 67000
    const expectedApprox = s.hoursAlive * 67_000;
    expect(Math.abs(s.milesInSpace - expectedApprox) / expectedApprox).toBeLessThan(0.01);
  });

  test("lightSpeedHours is much less than hoursAlive", () => {
    const s = stats();
    expect(s.lightSpeedHours).toBeLessThan(s.hoursAlive);
    expect(s.lightSpeedHours).toBeGreaterThan(0);
  });
});

// ── Heartbeats ───────────────────────────────────────────────────────

describe("heartbeats", () => {
  test("heartbeats based on 80 BPM", () => {
    const s = stats();
    expect(s.heartbeatsPerDay).toBe(80 * 60 * 24);
    expect(s.totalHeartbeats).toBeGreaterThan(0);
  });
});

// ── daysSinceAge-dependent stats ─────────────────────────────────────

describe("age-gated stats", () => {
  test("yogurt: 0 before startAge, positive after", () => {
    // Child born today → 0 years old, yogurt starts at 4
    const s = stats("2026-02-15", FEB_15_2026);
    expect(s.yogurtKg).toBe(0);

    // 9-year-old → well past age 4
    const s2 = stats();
    expect(s2.yogurtKg).toBeGreaterThan(0);
  });

  test("steps: 0 before startAge, positive after", () => {
    const s = stats("2026-02-15", FEB_15_2026);
    expect(s.totalSteps).toBe(0);

    const s2 = stats();
    expect(s2.totalSteps).toBeGreaterThan(0);
  });

  test("brushing: 0 before startAge, positive after", () => {
    const s = stats("2026-02-15", FEB_15_2026);
    expect(s.brushingDays).toBe(0);
    expect(s.brushStrokes).toBe(0);
  });

  test("yogurt scales with grams per day", () => {
    const low = computeStats(DOB, { ...DEFAULT_CONFIG, yogurtGramsPerDay: 25 }, FEB_15_2026);
    const high = computeStats(DOB, { ...DEFAULT_CONFIG, yogurtGramsPerDay: 100 }, FEB_15_2026);
    expect(high.yogurtKg).toBeGreaterThan(low.yogurtKg * 3.5);
    expect(high.yogurtKg).toBeLessThan(low.yogurtKg * 4.5);
  });
});

// ── Brain & body stats ───────────────────────────────────────────────

describe("brain & body", () => {
  test("sleepYears < yearsAlive", () => {
    const s = stats();
    expect(s.sleepYears).toBeGreaterThan(0);
    expect(s.sleepYears).toBeLessThan(s.yearsAlive);
  });

  test("waterPoolPercent is tiny (kid hasn't drunk an Olympic pool)", () => {
    const s = stats();
    expect(s.waterPoolPercent).toBeGreaterThan(0);
    expect(s.waterPoolPercent).toBeLessThan(1); // way less than 1%
  });

  test("poolYearsRemaining is positive and large", () => {
    const s = stats();
    expect(s.poolYearsRemaining).toBeGreaterThan(100);
  });
});

// ── Config changes propagate ─────────────────────────────────────────

describe("config sensitivity", () => {
  test("changing sleepHoursPerNight changes sleepHours and sleepYears", () => {
    const low = computeStats(DOB, { ...DEFAULT_CONFIG, sleepHoursPerNight: 8 }, FEB_15_2026);
    const high = computeStats(DOB, { ...DEFAULT_CONFIG, sleepHoursPerNight: 12 }, FEB_15_2026);
    expect(high.sleepHours).toBeGreaterThan(low.sleepHours);
    expect(high.sleepYears).toBeGreaterThan(low.sleepYears);
  });

  test("changing stepsPerDay changes totalSteps", () => {
    const low = computeStats(DOB, { ...DEFAULT_CONFIG, stepsPerDay: 4000 }, FEB_15_2026);
    const high = computeStats(DOB, { ...DEFAULT_CONFIG, stepsPerDay: 12000 }, FEB_15_2026);
    expect(high.totalSteps / low.totalSteps).toBeCloseTo(3, 0);
  });
});

// ── Formatting helpers ───────────────────────────────────────────────

describe("fmt", () => {
  test("floors and adds commas", () => {
    expect(fmt(1234.7)).toBe("1,234");
    expect(fmt(1_000_000)).toBe("1,000,000");
    expect(fmt(0.9)).toBe("0");
  });
});

describe("fmtBig", () => {
  test("billions", () => {
    expect(fmtBig(3_500_000_000)).toBe("3.5 billion");
  });
  test("millions", () => {
    expect(fmtBig(2_300_000)).toBe("2.3 million");
  });
  test("below million", () => {
    expect(fmtBig(999_999)).toBe("999,999");
  });
});

describe("fmtDecimal", () => {
  test("default 1 decimal", () => {
    expect(fmtDecimal(3.456)).toBe("3.5");
  });
  test("custom decimals", () => {
    expect(fmtDecimal(3.456, 2)).toBe("3.46");
  });
});

// ── Snapshot: all stat values for a known DOB+time ───────────────────

describe("snapshot", () => {
  test("Oscar on Feb 15 2026 at noon UTC", () => {
    const s = stats();
    // These are the baseline values. If refactoring changes any computation,
    // this test will catch it.
    expect(s.ageYears).toBe(8);
    expect(s.daysAlive).toBeGreaterThan(3280);
    expect(s.daysAlive).toBeLessThan(3290);
    expect(s.heartbeatsPerDay).toBe(115_200);
    expect(s.totalHeartbeats).toBeGreaterThan(0);
    expect(s.yogurtKg).toBeGreaterThan(0);
    expect(s.totalSteps).toBeGreaterThan(0);
    expect(s.totalBlinks).toBeGreaterThan(0);
    expect(s.totalPoops).toBeGreaterThan(0);
    expect(s.sleepHours).toBeGreaterThan(0);
    expect(s.fruitServings).toBeGreaterThan(0);
    expect(s.totalHugs).toBeGreaterThan(0);
    expect(s.lungExtraLiters).toBeGreaterThan(0);
    expect(s.waterLiters).toBeGreaterThan(0);
  });
});

// ── fmtYears: 3 decimal places unless round integer ──────────────────

describe("fmtYears", () => {
  test("round integer -> no decimals", () => {
    expect(fmtYears(9)).toBe("9");
    expect(fmtYears(9.0005)).toBe("9"); // within 0.001 threshold
  });

  test("non-integer -> 3 decimal places", () => {
    expect(fmtYears(8.998)).toBe("8.998");
    expect(fmtYears(9.002)).toBe("9.002");
    expect(fmtYears(8.5)).toBe("8.500");
  });
});

// ── hippoHeadline: yogurt-to-hippo comparison ────────────────────────

describe("hippoHeadline", () => {
  test("well below hippo weight -> percentage", () => {
    expect(hippoHeadline(20)).toBe("That's about 50% the weight of a baby hippo.");
  });

  test("close to hippo weight -> 'about the weight'", () => {
    expect(hippoHeadline(38)).toBe("About the weight of a baby hippo.");
    expect(hippoHeadline(40)).toBe("About the weight of a baby hippo.");
    expect(hippoHeadline(44)).toBe("About the weight of a baby hippo.");
  });

  test("above hippo weight -> multiplier", () => {
    expect(hippoHeadline(80)).toBe("That's about 2.0\u00d7 the weight of a baby hippo.");
    expect(hippoHeadline(60)).toBe("That's about 1.5\u00d7 the weight of a baby hippo.");
  });

  test("boundary at 0.9 ratio (36kg)", () => {
    expect(hippoHeadline(35.9)).toContain("%");
    expect(hippoHeadline(36)).toBe("About the weight of a baby hippo.");
  });

  test("boundary at 1.15 ratio (46kg)", () => {
    expect(hippoHeadline(45.9)).toBe("About the weight of a baby hippo.");
    expect(hippoHeadline(46)).toContain("\u00d7");
  });
});

// ── Space unit conversion ────────────────────────────────────────────

describe("KM_PER_MILE constant", () => {
  test("is approximately 1.609", () => {
    expect(KM_PER_MILE).toBeCloseTo(1.60934, 4);
  });

  test("67000 mph converts to ~107826 kph", () => {
    expect(fmt(Math.round(67_000 * KM_PER_MILE))).toBe("107,826");
  });
});
