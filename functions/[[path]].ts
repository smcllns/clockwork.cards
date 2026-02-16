interface Env {
  KV: KVNamespace;
  ASSETS: Fetcher;
}

interface CardConfig {
  name: string;
  displayName: string;
  dob: string;
  sex?: string;
  tier?: string;
  sections?: number;
  theme?: string;
  ownerEmail?: string;
  createdAt?: string;
}

const RESERVED = new Set([
  "api", "admin", "about", "pricing", "login", "signup",
  "assets", "static", "favicon.ico", "_headers", "_redirects",
]);

function isStaticAsset(path: string): boolean {
  return /\.(js|css|html|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|webp|avif)$/.test(path);
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname.slice(1); // strip leading /

  // Root — serve landing page (SPA for now)
  if (!path || path === "") {
    return context.env.ASSETS.fetch(context.request);
  }

  // Static assets — pass through
  if (isStaticAsset(path) || path.startsWith("_")) {
    return context.env.ASSETS.fetch(context.request);
  }

  // Reserved paths — pass through
  if (RESERVED.has(path.split("/")[0])) {
    return context.env.ASSETS.fetch(context.request);
  }

  // Card route: KV lookup
  const cardName = path.toLowerCase();
  const config = await context.env.KV.get<CardConfig>(`cards:${cardName}`, "json");

  if (!config) {
    return new Response(notFoundHTML(cardName), {
      status: 404,
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  }

  // Serve the SPA with injected config
  const asset = await context.env.ASSETS.fetch(new URL("/index.html", url.origin));

  return new HTMLRewriter()
    .on("head", {
      element(el) {
        el.append(
          `<script>window.__CARD__=${JSON.stringify(config)}</script>`,
          { html: true }
        );
      },
    })
    .on("title", {
      element(el) {
        el.setInnerContent(`${config.displayName ?? config.name} — Clockwork Cards`);
      },
    })
    .transform(asset);
};

function notFoundHTML(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Card Not Found — Clockwork Cards</title>
  <style>
    body { font-family: 'Space Grotesk', system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #fafaf9; color: #1c1917; }
    .container { text-align: center; padding: 2rem; }
    h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; }
    p { color: #78716c; margin-bottom: 1.5rem; }
    a { color: #d97706; text-decoration: none; font-weight: 500; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>clockwork.cards/${name}</h1>
    <p>This card doesn't exist yet.</p>
    <a href="/">Create your own card</a>
  </div>
</body>
</html>`;
}
