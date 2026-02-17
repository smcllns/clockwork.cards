const SUPERSCRIPTS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function sup(n: number): string {
  return String(n)
    .split("")
    .map((d) => SUPERSCRIPTS[+d])
    .join("");
}

export function expandBase(n: number, base: number, minDigits = 1): string[] {
  const repr = base === 2 ? n.toString(2) : String(n);
  const digits = repr.split("").map(Number);
  while (digits.length < minDigits) digits.unshift(0);
  const sub = base === 10 ? "₁₀" : "₂";

  const terms = digits.map(
    (d, i) => `(${d}×${base}${sup(digits.length - 1 - i)})`
  );
  const values = digits.map(
    (d, i) => d * Math.pow(base, digits.length - 1 - i)
  );

  return [
    `${repr}${sub} = ${terms.join(" + ")}`,
    `= ${values.join(" + ")} = ${n}`,
  ];
}

const BASE_10_PLACES = [
  "one",
  "ten",
  "hundred",
  "thousand",
  "ten-thousand",
];
const BASE_2_PLACES = [
  "one",
  "two",
  "four",
  "eight",
  "sixteen",
  "thirty-two",
  "sixty-four",
];

function pluralize(count: number, word: string): string {
  return count === 1 ? `${count} ${word}` : `${count} ${word}s`;
}

export function describeBase(n: number, base: number, minDigits = 1): string {
  const repr = base === 2 ? n.toString(2) : String(n);
  const digits = repr.split("").map(Number);
  while (digits.length < minDigits) digits.unshift(0);
  const places = base === 10 ? BASE_10_PLACES : BASE_2_PLACES;

  const parts = digits.map((d, i) => {
    const placeIdx = digits.length - 1 - i;
    return pluralize(d, places[placeIdx]);
  });

  if (parts.length <= 2) return parts.join(" and ");
  return parts.slice(0, -1).join(", ") + ", and " + parts[parts.length - 1];
}

export function ordinalSuffix(s: string): string {
  const n = parseInt(s);
  const last2 = n % 100;
  if (last2 >= 11 && last2 <= 13) return "th";
  const last1 = n % 10;
  if (last1 === 1) return "st";
  if (last1 === 2) return "nd";
  if (last1 === 3) return "rd";
  return "th";
}
