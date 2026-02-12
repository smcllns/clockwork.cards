import tailwind from "bun-plugin-tailwind";

const EXPECTED_DEFAULTS = ["DEFAULT_NAME", "DEFAULT_DOB", "DEFAULT_SEX"];
const define: Record<string, string> = {};
for (const key of EXPECTED_DEFAULTS) {
  define[`process.env.${key}`] = JSON.stringify(process.env[key] ?? "");
}

await Bun.build({
  entrypoints: ["./index.html"],
  outdir: "./dist",
  minify: true,
  plugins: [tailwind],
  define,
});
