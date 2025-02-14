import { VercelRequest, VercelResponse } from "@vercel/node";
import { URLS } from "../src/services/dogApi/consts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    res.writeHead(backendResponse.status, Object.fromEntries(responseHeaders));

    void backendResponse.body?.pipeTo(res as any);
  } catch {
    res.status(500).json({ error: "Failed to fetch from backend" });
  }
}
