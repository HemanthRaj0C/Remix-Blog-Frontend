// app/routes/logout.tsx
import { ActionFunctionArgs, redirect } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  // Only handle POST requests
  if (request.method !== "POST") {
    return redirect("/");
  }

  // Clear the access_token cookie
  return redirect("/", {
    headers: {
      "Set-Cookie": "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict"
    },
  });
};

// Redirect any direct access to this route
export const loader = async () => {
  return redirect("/");
};