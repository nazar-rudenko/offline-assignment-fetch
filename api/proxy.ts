import { DOMAINS, PATHS } from "../src/services/dogApi/consts";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const origin = req.headers.get("origin");
  const allowedOrigins = [DOMAINS.LOCAL, DOMAINS.DEPLOYMENT];

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(origin, allowedOrigins),
    });
  }

  const url = new URL(req.url);
  const backendURL = PATHS.BASE + url.pathname.replace("/api", "") + url.search;

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

    const setCookieHeaders: string = backendResponse.headers.get("Set-Cookie");
    if (setCookieHeaders) {
      const modifiedCookies = setCookieHeaders
        .split(", ")
        .map((cookie) =>
          cookie.startsWith("fetch-access-token=")
            ? makeSecureCookie(cookie)
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

function makeSecureCookie(setCookieHeader: string): string {
  return setCookieHeader
    .replace(/;\s*Secure/i, "")
    .replace(/;\s*SameSite=[^;]*/i, "")
    .replace(/;\s*HttpOnly/i, "")
    .replace(/;\s*Domain=[^;]*/i, "")
    .concat(
      "; Secure; HttpOnly; SameSite=Lax; Domain=offline-assignment-fetch.vercel.app; Path=/",
    );
}
