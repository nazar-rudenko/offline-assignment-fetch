import { URLS } from "../src/services/dogApi/consts";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    "http://localhost:5173",
    "https://offline-assignment-fetch.vercel.app",
  ];

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(origin, allowedOrigins),
    });
  }

  const url = new URL(req.url);
  const backendURL = URLS.BASE + url.pathname.replace("/api", "") + url.search;

  console.log(`Request URL: ${url}`);
  console.log(`Backend URL: ${backendURL}`);

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

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error(err);
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
