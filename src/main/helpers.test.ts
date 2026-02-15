import { describe, test, expect } from "bun:test";
import { fmtYears, hippoHeadline, KM_PER_MILE, fmt } from "./stats";

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
    // 35.9 / 40 = 0.8975 < 0.9 -> percentage
    expect(hippoHeadline(35.9)).toContain("%");
    // 36 / 40 = 0.9 -> "about the weight"
    expect(hippoHeadline(36)).toBe("About the weight of a baby hippo.");
  });

  test("boundary at 1.15 ratio (46kg)", () => {
    // 45.9 / 40 = 1.1475 < 1.15 -> "about the weight"
    expect(hippoHeadline(45.9)).toBe("About the weight of a baby hippo.");
    // 46 / 40 = 1.15 -> multiplier
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
