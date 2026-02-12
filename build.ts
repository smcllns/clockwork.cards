import tailwind from "bun-plugin-tailwind";

const define: Record<string, string> = {};
for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith("DEFAULT_")) {
    define[`process.env.${key}`] = JSON.stringify(value);
  }
}

await Bun.build({
  entrypoints: ["./index.html"],
  outdir: "./dist",
  minify: true,
  plugins: [tailwind],
  define,
});
