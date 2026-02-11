import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const ROOT = join(import.meta.dir, "..");
const DIST = join(ROOT, "dist");
const isWatch = process.argv.includes("--watch");

async function buildClient() {
  const result = await Bun.build({
    entrypoints: [join(ROOT, "src/index.tsx")],
    outdir: DIST,
    minify: !isWatch,
    sourcemap: isWatch,
    target: "browser",
  });
  if (!result.success) {
    console.error("Build failed:", result.logs);
    process.exit(1);
  }
  return result;
}

async function buildCss() {
  const args = ["tailwindcss", "-i", join(ROOT, "src/index.css"), "-o", join(DIST, "index.css"), ...(isWatch ? ["--watch"] : [])];
  const proc = Bun.spawn(["bunx", ...args], { cwd: ROOT, stdout: "inherit", stderr: "inherit" });
  if (!isWatch) {
    const code = await proc.exited;
    if (code !== 0) process.exit(code);
  }
  return proc;
}

function writeDistHtml() {
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
  return writeFile(join(DIST, "index.html"), html, "utf-8");
}

async function main() {
  await mkdir(DIST, { recursive: true });

  await buildClient();
  if (isWatch) {
    buildCss(); // tailwind --watch (don't await)
    await writeDistHtml();
    console.log("Watching… (run the server with `bun run serve`)");
    return;
  }
  await buildCss();
  await writeDistHtml();
  console.log("Build done → dist/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
