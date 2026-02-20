import tailwind from "bun-plugin-tailwind";

const EXPECTED_DEFAULTS = ["DEFAULT_NAME", "DEFAULT_DOB", "DEFAULT_SEX"];
const define: Record<string, string> = {};
for (const key of EXPECTED_DEFAULTS) {
  define[`process.env.${key}`] = process.env[key] ? JSON.stringify(process.env[key]) : "undefined";
}

await Bun.build({
  entrypoints: ["./index.html"],
  outdir: "./dist",
  minify: true,
  plugins: [tailwind],
  define,
});

// Copy static PWA assets
await Bun.write("./dist/manifest.json", Bun.file("./manifest.json"));
await Bun.write("./dist/src/icons/clockwork-icon.svg", Bun.file("./src/icons/clockwork-icon.svg"));
await Bun.write("./dist/src/icons/clockwork-ios.png", Bun.file("./src/icons/clockwork-ios.png"));
await Bun.write("./dist/buy.html", Bun.file("./buy.html"));
