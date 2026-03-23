import { handleAuthRequest } from "@/lib/auth/server";
import { NextRequest } from "next/server";

async function handler(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/");
  return handleAuthRequest(request, path);
}

export { handler as GET, handler as POST };
