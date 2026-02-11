const DIST = "./dist";
const PORT = 3000;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname === "/" ? "/index.html" : url.pathname;

    const file = Bun.file(`${DIST}${path}`);
    if (await file.exists()) {
      return new Response(file, {
        headers: {
          "Content-Type": path.endsWith(".js")
            ? "application/javascript"
            : path.endsWith(".css")
              ? "text/css"
              : path.endsWith(".html")
                ? "text/html"
                : "application/octet-stream",
        },
      });
    }

    // SPA fallback
    const index = Bun.file(`${DIST}/index.html`);
    if (await index.exists()) {
      return new Response(index, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);
