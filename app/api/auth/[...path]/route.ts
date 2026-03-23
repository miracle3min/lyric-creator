import { auth } from "@/lib/auth/server";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = async (req: Request) => {
  try {
    return await handler.GET(req);
  } catch (error: any) {
    console.error("AUTH GET ERROR:", error);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const POST = async (req: Request) => {
  try {
    return await handler.POST(req);
  } catch (error: any) {
    console.error("AUTH POST ERROR:", error);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
