import { join } from "path";
import { mkdir, writeFile } from "fs/promises";

const ROOT = join(import.meta.dir, "..");
const DIST = join(ROOT, "dist");

async function buildClient() {
  const result = await Bun.build({
    entrypoints: [join(ROOT, "src/index.tsx")],
    outdir: DIST,
    minify: false,
    sourcemap: "linked",
    target: "browser",
  });
  if (!result.success) {
    console.error("Build failed:", result.logs);
    process.exit(1);
  }
}

async function buildCss() {
  const proc = Bun.spawn(
    ["bunx", "tailwindcss", "-i", join(ROOT, "src/index.css"), "-o", join(DIST, "index.css")],
    { cwd: ROOT, stdout: "inherit", stderr: "inherit" }
  );
  const code = await proc.exited;
  if (code !== 0) process.exit(code);
}

async function writeDistHtml() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Happy Metrics</title>
  <link rel="stylesheet" href="/index.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/index.js"></script>
</body>
</html>
`;
  await writeFile(join(DIST, "index.html"), html, "utf-8");
}

async function main() {
  await mkdir(DIST, { recursive: true });
  await buildClient();
  await buildCss();
  await writeDistHtml();
  console.log("Initial build done.");

  // Watch: Tailwind
  Bun.spawn(
    ["bunx", "tailwindcss", "-i", join(ROOT, "src/index.css"), "-o", join(DIST, "index.css"), "--watch"],
    { cwd: ROOT, stdout: "inherit", stderr: "inherit" }
  );

  // Watch: JS bundle
  const watcher = Bun.spawn(
    ["bun", "build", join(ROOT, "src/index.tsx"), "--outdir", DIST, "--watch"],
    { cwd: ROOT, stdout: "inherit", stderr: "inherit" }
  );

  // Server (blocking)
  const serverModule = await import(join(ROOT, "server.ts"));
  // server.ts just calls Bun.serve() so it blocks; no need to call anything else
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
