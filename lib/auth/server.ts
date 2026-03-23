import { betterAuth } from "better-auth";
import { Pool } from "@neondatabase/serverless";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  basePath: "/api/auth",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});

// Helper to get session from request headers
export async function getSession() {
  try {
    const { headers } = await import("next/headers");
    const headersList = headers();
    const cookieHeader = headersList.get("cookie") || "";

    const response = await auth.api.getSession({
      headers: new Headers({ cookie: cookieHeader }),
    });

    return response;
  } catch {
    return null;
  }
}
