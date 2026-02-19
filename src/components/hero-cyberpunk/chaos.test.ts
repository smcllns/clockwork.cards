import { describe, expect, it } from "bun:test";

// Guard: chaos mode MUST NOT persist across reloads.
// Reloading is the only escape hatch from chaos mode.
describe("chaos state", () => {
  it("is not initialized from localStorage or sessionStorage", async () => {
    const src = await Bun.file("src/components/hero-cyberpunk/index.tsx").text();
    expect(src).not.toMatch(/localStorage[^;]*chaos/);
    expect(src).not.toMatch(/sessionStorage[^;]*chaos/);
    expect(src).not.toMatch(/searchParams[^;]*chaos/);
  });
});
