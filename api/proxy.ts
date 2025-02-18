const DOMAINS = {
  LOCAL: "http://localhost:5173",
  API: "https://frontend-take-home-service.fetch.com",
  DEPLOYMENT: "https://offline-assignment-fetch.vercel.app",
};

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const origin = req.headers.get("origin");

  if (!origin) {
    return new Response(JSON.stringify({ error: "Missing Origin header" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const allowedOrigins = [DOMAINS.LOCAL, DOMAINS.DEPLOYMENT];

  if (isMyVercelPreview(origin)) {
    allowedOrigins.push(origin);
  }

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(origin, allowedOrigins),
    });
  }

  const url = new URL(req.url);
  const backendURL =
    DOMAINS.API + url.pathname.replace("/api", "") + url.search;

  try {
    const backendResponse = await fetch(backendURL, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
      credentials: "include",
    });

    const responseHeaders = new Headers(backendResponse.headers);
    Object.entries(getCorsHeaders(origin, allowedOrigins)).forEach(
      ([key, value]) => {
        responseHeaders.set(key, value);
      },
    );

    const setCookieHeaders = backendResponse.headers.get("Set-Cookie");
    if (setCookieHeaders) {
      const modifiedCookies = setCookieHeaders
        .split(", ")
        .map((cookie) =>
          cookie.startsWith("fetch-access-token=")
            ? makeCookieSecureAgain(cookie, origin)
            : cookie,
        )
        .join(", ");

      responseHeaders.set("Set-Cookie", modifiedCookies);
    }

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch from backend" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...getCorsHeaders(origin, allowedOrigins),
        },
      },
    );
  }
}

function getCorsHeaders(origin: string | null, allowedOrigins: string[]) {
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };

  if (origin && allowedOrigins.includes(origin)) {
    return {
      ...headers,
      "Access-Control-Allow-Origin": origin,
    };
  }

  return headers;
}

function makeCookieSecureAgain(cookie: string, origin: string): string {
  const domain = new URL(origin).hostname;
  return cookie
    .replace(/;\s*Secure/i, "")
    .replace(/;\s*SameSite=[^;]*/i, "")
    .replace(/;\s*HttpOnly/i, "")
    .replace(/;\s*Domain=[^;]*/i, "")
    .concat(`; Secure; HttpOnly; SameSite=Lax; Domain=${domain}; Path=/`);
}

function isMyVercelPreview(origin: string): boolean {
  const hostname = new URL(origin).hostname;
  return (
    hostname.includes("offline-assignment-fetch") &&
    hostname.endsWith(".nxracs-projects.vercel.app")
  );
}
