import { VercelRequest, VercelResponse } from "@vercel/node";
import { URLS } from "../src/services/dogApi/consts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const backendURL = URLS.BASE + req.url;

  console.log("Request URL:", req.url);
  console.log("Backend URL:", backendURL);

  try {
    const backendResponse = await fetch(backendURL, {
      method: req.method,
      headers: req.headers as HeadersInit,
      body:
        req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    });

    const responseHeaders = new Headers(backendResponse.headers);
    responseHeaders.set("Access-Control-Allow-Credentials", "true");
    responseHeaders.set("Access-Control-Allow-Origin", "*");

    res.writeHead(backendResponse.status, Object.fromEntries(responseHeaders));

    void backendResponse.body?.pipeTo(res as any);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from backend" });
  }
}
