import { cookies } from "next/headers";

const NEON_AUTH_BASE_URL = process.env.NEON_AUTH_BASE_URL!;

// Proxy handler for auth API routes
export async function handleAuthRequest(request: Request, path: string) {
  const url = new URL(request.url);
  const targetUrl = `${NEON_AUTH_BASE_URL}/${path}${url.search}`;

  const headers = new Headers();
  headers.set("Content-Type", request.headers.get("Content-Type") || "application/json");

  // Forward cookies for session management
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      fetchOptions.body = await request.text();
    } catch {
      // No body
    }
  }

  const response = await fetch(targetUrl, fetchOptions);

  // Forward response with all headers (especially Set-Cookie)
  const responseHeaders = new Headers();
  response.headers.forEach((value, key) => {
    responseHeaders.append(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

// Get current session from Neon Auth
export async function getSession() {
  try {
    const cookieStore = cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(`${NEON_AUTH_BASE_URL}/get-session`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.session ? data : null;
  } catch {
    return null;
  }
}
