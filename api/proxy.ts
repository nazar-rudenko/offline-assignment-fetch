const API_URL = "https://frontend-take-home-service.fetch.com";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const origin = req.headers.get("Origin");
  const requestedBy = req.headers.get("X-Requested-By");

  if (requestedBy !== "dogs-app") {
    return new Response(JSON.stringify({ error: "Invalid Request" }), {
      status: 403,
    });
  }

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(origin),
    });
  }

  const url = new URL(req.url);
  const backendURL = API_URL + url.pathname.replace("/api", "") + url.search;

  try {
    req.headers.delete("X-Requested-By");
    const backendResponse = await fetch(backendURL, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
    });

    // Add CORS headers and remove original Set-Cookie
    const responseHeaders = new Headers(backendResponse.headers);
    responseHeaders.delete("Set-Cookie");
    Object.entries(getCorsHeaders(origin)).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    // Modify auth cookie and pack the rest of them back to response
    const setCookieValues = backendResponse.headers.getSetCookie();
    if (setCookieValues.length && origin) {
      setCookieValues
        .map((cookie) =>
          cookie.startsWith("fetch-access-token=")
            ? makeCookieSecureAgain(cookie, origin)
            : cookie,
        )
        .forEach((cookie) => responseHeaders.set("Set-Cookie", cookie));
    }

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(origin),
      },
    });
  }
}

function getCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };

  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

// Make browser happy and willing to give cookie back
function makeCookieSecureAgain(cookie: string, origin: string): string {
  const domain = new URL(origin).hostname;

  let expiresMatch = cookie.match(/;\s*expires=([^;]+)/i);
  let expiresValue = expiresMatch ? `; Expires=${expiresMatch[1]}` : "";

  return cookie
    .replace(/;\s*Secure/i, "")
    .replace(/;\s*SameSite=[^;]*/i, "")
    .replace(/;\s*HttpOnly/i, "")
    .replace(/;\s*Domain=[^;]*/i, "")
    .replace(/;\s*Path=[^;]*/i, "")
    .replace(/;\s*Expires=[^;]*/i, expiresValue)
    .concat(`; Secure; HttpOnly; SameSite=Strict; Domain=${domain}; Path=/`);
}
