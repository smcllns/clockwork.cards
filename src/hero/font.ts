const G: Record<string, string> = {
  A: '01110 10001 10001 11111 10001 10001 10001',
  B: '11110 10001 10001 11110 10001 10001 11110',
  C: '01110 10001 10000 10000 10000 10001 01110',
  D: '11100 10010 10001 10001 10001 10010 11100',
  E: '11111 10000 10000 11110 10000 10000 11111',
  F: '11111 10000 10000 11110 10000 10000 10000',
  G: '01110 10001 10000 10111 10001 10001 01110',
  H: '10001 10001 10001 11111 10001 10001 10001',
  I: '11111 00100 00100 00100 00100 00100 11111',
  J: '00111 00001 00001 00001 00001 10001 01110',
  K: '10001 10010 10100 11000 10100 10010 10001',
  L: '10000 10000 10000 10000 10000 10000 11111',
  M: '10001 11011 10101 10001 10001 10001 10001',
  N: '10001 11001 10101 10011 10001 10001 10001',
  O: '01110 10001 10001 10001 10001 10001 01110',
  P: '11110 10001 10001 11110 10000 10000 10000',
  Q: '01110 10001 10001 10001 10101 10010 01101',
  R: '11110 10001 10001 11110 10100 10010 10001',
  S: '01111 10000 10000 01110 00001 00001 11110',
  T: '11111 00100 00100 00100 00100 00100 00100',
  U: '10001 10001 10001 10001 10001 10001 01110',
  V: '10001 10001 10001 10001 01010 01010 00100',
  W: '10001 10001 10001 10101 10101 11011 10001',
  X: '10001 10001 01010 00100 01010 10001 10001',
  Y: '10001 10001 01010 00100 00100 00100 00100',
  Z: '11111 00001 00010 00100 01000 10000 11111',
  '0': '01110 10001 10011 10101 11001 10001 01110',
  '1': '00100 01100 00100 00100 00100 00100 01110',
  '2': '01110 10001 00001 00110 01000 10000 11111',
  '3': '01110 10001 00001 00110 00001 10001 01110',
  '4': '00010 00110 01010 10010 11111 00010 00010',
  '5': '11111 10000 11110 00001 00001 10001 01110',
  '6': '00110 01000 10000 11110 10001 10001 01110',
  '7': '11111 00001 00010 00100 01000 01000 01000',
  '8': '01110 10001 10001 01110 10001 10001 01110',
  '9': '01110 10001 10001 01111 00001 00010 01100',
};

export const FONT: Record<string, number[][]> = Object.fromEntries(
  Object.entries(G).map(([ch, s]) => [ch, s.split(' ').map(r => [...r].map(Number))])
);

export const CHAR_W = 5;
export const CHAR_H = 7;
export const CHAR_GAP = 1;
export const LINE_GAP = 3;
export const SPACE_W = 3;

export type Pixel = {
  x: number;
  y: number;
  radius: number;
  letter: number;
  gridRow: number;
  gridCol: number;
};

export function ordinalSuffix(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return 'TH';
  switch (n % 10) {
    case 1: return 'ST';
    case 2: return 'ND';
    case 3: return 'RD';
    default: return 'TH';
  }
}

export function birthdayLines(name: string, age: number): string[] {
  return [`HAPPY ${age}${ordinalSuffix(age)}`, 'BIRTHDAY', name.toUpperCase()];
}

export function getTextPixels(lines: string[], width: number, height: number): Pixel[] {
  type CharPos = { char: string; col: number };
  const layouts: { chars: CharPos[]; width: number }[] = [];

  for (const line of lines) {
    const chars: CharPos[] = [];
    let col = 0;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === ' ') { col += SPACE_W; continue; }
      chars.push({ char: ch, col });
      col += CHAR_W;
      if (i + 1 < line.length && line[i + 1] !== ' ') col += CHAR_GAP;
    }
    layouts.push({ chars, width: col });
  }

  const maxLineW = Math.max(...layouts.map(l => l.width));
  const totalH = lines.length * CHAR_H + (lines.length - 1) * LINE_GAP;

  const padX = width * 0.05;
  const padY = height * 0.12;
  const cellSize = Math.min((width - padX * 2) / maxLineW, (height - padY * 2) / totalH);
  const radius = cellSize * 0.4;

  const blockW = maxLineW * cellSize;
  const blockH = totalH * cellSize;
  const originX = (width - blockW) / 2;
  const originY = (height - blockH) / 2;

  const pixels: Pixel[] = [];
  let letterIndex = 0;

  for (let li = 0; li < layouts.length; li++) {
    const { chars, width: lineW } = layouts[li];
    const lineOffsetX = (blockW - lineW * cellSize) / 2;
    const lineOffsetY = li * (CHAR_H + LINE_GAP) * cellSize;

    for (const { char, col } of chars) {
      const glyph = FONT[char];
      if (!glyph) { letterIndex++; continue; }

      for (let row = 0; row < CHAR_H; row++) {
        for (let c = 0; c < CHAR_W; c++) {
          if (glyph[row][c]) {
            pixels.push({
              x: originX + lineOffsetX + (col + c + 0.5) * cellSize,
              y: originY + lineOffsetY + (row + 0.5) * cellSize,
              radius,
              letter: letterIndex,
              gridRow: row,
              gridCol: c,
            });
          }
        }
      }
      letterIndex++;
    }
  }

  return pixels;
}
