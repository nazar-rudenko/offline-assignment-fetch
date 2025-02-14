import { URLS } from "../src/services/dogApi/consts";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(),
    });
  }

  const url = new URL(req.url);
  const backendURL = URLS.BASE + url.pathname + url.search;

  console.log("Request URL:", req.url);
  console.log("Backend URL:", backendURL);

  try {
    const backendResponse = await fetch(backendURL, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
    });

    const responseHeaders = new Headers(backendResponse.headers);
    Object.entries(getCorsHeaders()).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

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
          ...getCorsHeaders(),
        },
      },
    );
  }
}

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };
}
