// app/utils/auth.server.ts
import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function requireAuth(request: LoaderFunctionArgs["request"]) {
  const cookie = request.headers.get("Cookie");
  
  if (!cookie || !cookie.includes("access_token")) {
    throw redirect("/login");
  }
  
  return true;
}

// Optional: Helper to get token from cookie
export function getToken(request: LoaderFunctionArgs["request"]) {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;
  
  const match = cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}