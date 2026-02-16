interface Env {
  KV: KVNamespace;
  ASSETS: Fetcher;
  POLAR_WEBHOOK_SECRET: string;
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
  polarCustomerId?: string;
  polarOrderId?: string;
}

const RESERVED = new Set([
  "api", "admin", "about", "pricing", "login", "signup",
  "assets", "static", "favicon.ico", "_headers", "_redirects",
]);

const NAME_PATTERN = /^[a-z0-9][a-z0-9-]{0,28}[a-z0-9]$/;

function isStaticAsset(path: string): boolean {
  return /\.(js|css|html|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|webp|avif)$/.test(path);
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname.slice(1);

  // Root — serve SPA (welcome mat mode, no __CARD__ injected)
  if (!path || path === "") {
    return context.env.ASSETS.fetch(new URL("/index.html", url.origin));
  }

  // Static assets — pass through
  if (isStaticAsset(path) || path.startsWith("_")) {
    return context.env.ASSETS.fetch(context.request);
  }

  // API routes
  if (path.startsWith("api/")) {
    return handleAPI(path, context);
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

async function handleAPI(
  path: string,
  context: { request: Request; env: Env }
): Promise<Response> {
  // POST /api/webhook — Polar webhook
  if (path === "api/webhook" && context.request.method === "POST") {
    return handleWebhook(context.request, context.env);
  }

  // GET /api/check/<name>
  if (path.startsWith("api/check/")) {
    const name = decodeURIComponent(path.slice("api/check/".length)).toLowerCase();

    if (name.length < 2) {
      return json({ available: false, reason: "too_short" });
    }
    if (!NAME_PATTERN.test(name)) {
      return json({ available: false, reason: "invalid" });
    }
    if (RESERVED.has(name)) {
      return json({ available: false, reason: "reserved" });
    }

    const existing = await context.env.KV.get(`cards:${name}`);
    return json({ available: !existing });
  }

  return json({ error: "not_found" }, 404);
}

// — Polar Webhook Handler —

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  const body = await request.text();

  const valid = await verifyWebhookSignature(
    body,
    request.headers,
    env.POLAR_WEBHOOK_SECRET
  );
  if (!valid) {
    return json({ error: "invalid_signature" }, 401);
  }

  const event = JSON.parse(body);

  if (event.type !== "order.paid") {
    return json({ ok: true, skipped: event.type });
  }

  const order = event.data;
  const metadata = order.metadata ?? {};
  const cardName = (metadata.cardName ?? "").toLowerCase();
  const dob = metadata.dob ?? "";
  const displayName = metadata.displayName ?? cardName;

  if (!cardName || !dob) {
    return json({ error: "missing_metadata", metadata }, 400);
  }

  if (!NAME_PATTERN.test(cardName)) {
    return json({ error: "invalid_card_name", cardName }, 400);
  }

  // Don't overwrite existing cards
  const existing = await env.KV.get(`cards:${cardName}`);
  if (existing) {
    return json({ error: "card_already_exists", cardName }, 409);
  }

  const config: CardConfig = {
    name: cardName,
    displayName,
    dob,
    tier: "standard",
    ownerEmail: order.customer?.email ?? order.customer_email ?? "",
    createdAt: new Date().toISOString(),
    polarCustomerId: order.customer?.id ?? "",
    polarOrderId: order.id ?? "",
  };

  await env.KV.put(`cards:${cardName}`, JSON.stringify(config));

  return json({ ok: true, card: cardName });
}

// Standard Webhooks (Svix) signature verification
async function verifyWebhookSignature(
  body: string,
  headers: Headers,
  secret: string
): Promise<boolean> {
  const msgId = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signature = headers.get("webhook-signature");

  if (!msgId || !timestamp || !signature) return false;

  // Reject timestamps older than 5 minutes
  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(timestamp, 10);
  if (Math.abs(now - ts) > 300) return false;

  // Secret is "whsec_" prefix + base64-encoded key
  const secretBytes = base64Decode(secret.replace(/^whsec_/, ""));

  const toSign = `${msgId}.${timestamp}.${body}`;
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(toSign));
  const expected = base64Encode(new Uint8Array(sig));

  // Signature header can contain multiple signatures: "v1,<sig1> v1,<sig2>"
  const signatures = signature.split(" ");
  return signatures.some((s) => {
    const [, val] = s.split(",", 2);
    return val === expected;
  });
}

function base64Decode(str: string): Uint8Array {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64Encode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function notFoundHTML(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Card Not Found — Clockwork Cards</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Outfit:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Outfit', system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #faf7f2; color: #2a2420; }
    .container { text-align: center; padding: 2rem; }
    h1 { font-family: 'Fraunces', serif; font-size: 1.4rem; font-weight: 600; margin-bottom: 0.5rem; }
    p { color: #8a8279; margin-bottom: 1.5rem; }
    a { display: inline-block; background: #b5650a; color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: background 0.2s; }
    a:hover { background: #d4820a; }
  </style>
</head>
<body>
  <div class="container">
    <h1>clockwork.cards/${name}</h1>
    <p>This card doesn't exist yet.</p>
    <a href="/">Claim this name</a>
  </div>
</body>
</html>`;
}
