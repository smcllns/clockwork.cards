interface Env {
  WAITLIST: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const existing = await env.WAITLIST.get(`email:${email}`);
  if (existing) {
    return Response.json({ success: true });
  }

  await env.WAITLIST.put(`email:${email}`, JSON.stringify({ signedUpAt: new Date().toISOString() }));
  return Response.json({ success: true });
};
