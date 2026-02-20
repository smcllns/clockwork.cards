import { describe, expect, it } from "bun:test";

// Guard: chaos mode MUST NOT persist across reloads.
// Reloading is the only escape hatch from chaos mode.
describe("chaos state", () => {
  it("is not initialized from localStorage or sessionStorage", async () => {
    const src = await Bun.file("src/components/hero/cyberpunk/index.tsx").text();
    // Match actual storage access (getItem/setItem calls), not comments
    expect(src).not.toMatch(/localStorage\.(?:get|set)Item[^;]*chaos/);
    expect(src).not.toMatch(/sessionStorage\.(?:get|set)Item[^;]*chaos/);
    expect(src).not.toMatch(/searchParams\.get[^;]*chaos/);
  });
});
