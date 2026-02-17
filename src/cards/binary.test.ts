import { describe, test, expect } from "bun:test";
import { expandBase, describeBase, ordinalSuffix } from "./binary";

describe("expandBase", () => {
  test("age 8 base 10 — no padding, single digit", () => {
    expect(expandBase(8, 10)).toBe("8₁₀ = (8×10⁰) = 8 = 8");
  });

  test("age 8 base 10 — padded to 3 digits", () => {
    expect(expandBase(8, 10, 3)).toBe(
      "8₁₀ = (0×10²) + (0×10¹) + (8×10⁰) = 0 + 0 + 8 = 8"
    );
  });

  test("age 8 base 2", () => {
    expect(expandBase(8, 2)).toBe(
      "1000₂ = (1×2³) + (0×2²) + (0×2¹) + (0×2⁰) = 8 + 0 + 0 + 0 = 8"
    );
  });

  test("age 9 base 10 — padded to 3 digits", () => {
    expect(expandBase(9, 10, 3)).toBe(
      "9₁₀ = (0×10²) + (0×10¹) + (9×10⁰) = 0 + 0 + 9 = 9"
    );
  });

  test("age 9 base 2", () => {
    expect(expandBase(9, 2)).toBe(
      "1001₂ = (1×2³) + (0×2²) + (0×2¹) + (1×2⁰) = 8 + 0 + 0 + 1 = 9"
    );
  });

  test("age 10 base 10 — padded to 3 digits", () => {
    expect(expandBase(10, 10, 3)).toBe(
      "10₁₀ = (0×10²) + (1×10¹) + (0×10⁰) = 0 + 10 + 0 = 10"
    );
  });

  test("age 10 base 2", () => {
    expect(expandBase(10, 2)).toBe(
      "1010₂ = (1×2³) + (0×2²) + (1×2¹) + (0×2⁰) = 8 + 0 + 2 + 0 = 10"
    );
  });

  test("age 7 base 2 — three bits", () => {
    expect(expandBase(7, 2)).toBe(
      "111₂ = (1×2²) + (1×2¹) + (1×2⁰) = 4 + 2 + 1 = 7"
    );
  });

  test("age 12 base 10 — padded to 3 digits", () => {
    expect(expandBase(12, 10, 3)).toBe(
      "12₁₀ = (0×10²) + (1×10¹) + (2×10⁰) = 0 + 10 + 2 = 12"
    );
  });

  test("age 12 base 2", () => {
    expect(expandBase(12, 2)).toBe(
      "1100₂ = (1×2³) + (1×2²) + (0×2¹) + (0×2⁰) = 8 + 4 + 0 + 0 = 12"
    );
  });

  test("minDigits has no effect when natural digits already exceed it", () => {
    expect(expandBase(10, 10, 2)).toBe(
      "10₁₀ = (1×10¹) + (0×10⁰) = 10 + 0 = 10"
    );
  });

  test("intermediate values always sum to the number", () => {
    for (const age of [5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 20]) {
      for (const base of [2, 10] as const) {
        const result = expandBase(age, base, base === 10 ? 3 : 1);
        expect(result).toEndWith(`= ${age}`);
        const repr = base === 2 ? age.toString(2) : String(age);
        const sub = base === 10 ? "₁₀" : "₂";
        expect(result).toStartWith(`${repr}${sub} = `);
      }
    }
  });
});

describe("describeBase", () => {
  test("age 8 base 10 — padded to 3 places", () => {
    expect(describeBase(8, 10, 3)).toBe(
      "0 hundreds, 0 tens, and 8 ones"
    );
  });

  test("age 8 base 2", () => {
    expect(describeBase(8, 2)).toBe(
      "1 eight, 0 fours, 0 twos, and 0 ones"
    );
  });

  test("age 10 base 10 — padded to 3 places", () => {
    expect(describeBase(10, 10, 3)).toBe(
      "0 hundreds, 1 ten, and 0 ones"
    );
  });

  test("age 9 base 2", () => {
    expect(describeBase(9, 2)).toBe(
      "1 eight, 0 fours, 0 twos, and 1 one"
    );
  });

  test("age 7 base 2 — all ones", () => {
    expect(describeBase(7, 2)).toBe("1 four, 1 two, and 1 one");
  });

  test("pluralizes correctly — 0 and 2+ get s", () => {
    expect(describeBase(12, 2)).toBe(
      "1 eight, 1 four, 0 twos, and 0 ones"
    );
  });

  test("age 12 base 10 — padded to 3 places", () => {
    expect(describeBase(12, 10, 3)).toBe(
      "0 hundreds, 1 ten, and 2 ones"
    );
  });
});

describe("ordinalSuffix", () => {
  test("1000 → th", () => expect(ordinalSuffix("1000")).toBe("th"));
  test("1001 → st", () => expect(ordinalSuffix("1001")).toBe("st"));
  test("1010 → th", () => expect(ordinalSuffix("1010")).toBe("th"));
  test("1011 → th", () => expect(ordinalSuffix("1011")).toBe("th"));
  test("1100 → th", () => expect(ordinalSuffix("1100")).toBe("th"));
  test("1101 → st", () => expect(ordinalSuffix("1101")).toBe("st"));
  test("111 → th", () => expect(ordinalSuffix("111")).toBe("th"));
  test("1110 → th", () => expect(ordinalSuffix("1110")).toBe("th"));
  test("10 → th", () => expect(ordinalSuffix("10")).toBe("th"));
  test("11 → th", () => expect(ordinalSuffix("11")).toBe("th"));
  test("12 → th", () => expect(ordinalSuffix("12")).toBe("th"));
  test("13 → th", () => expect(ordinalSuffix("13")).toBe("th"));
});
