const CONTACT_EMAIL = "sophiaalnawasreh@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const message = String(data.message || "").trim();
  const honeypot = String(data.company || "").trim();

  // Bots fill hidden fields — pretend success and drop it silently.
  if (honeypot) return json({ ok: true });

  if (!name || !email || !message) {
    return json({ error: "Please fill in every field." }, 400);
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return json({ error: "That input is too long." }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ error: "That email address looks invalid." }, 400);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: CONTACT_EMAIL,
      reply_to: email,
      subject: `New project inquiry from ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
    }),
  });

  if (!res.ok) {
    return json({ error: "Could not send right now — please email me directly." }, 502);
  }

  return json({ ok: true });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
