import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Add loader type and function
export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  return json({
    isAuthenticated: Boolean(cookie && cookie.includes("access_token")),
  });
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Update Layout to accept and use auth status
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="">
        <div className="py-36">
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
        <Footer />
      </body>
    </html>
  );
}

// Update App to handle auth state
export default function App() {
  const { isAuthenticated } = useLoaderData<typeof loader>();
  return(
    <div>
      <Navbar isAuthenticated={isAuthenticated} />
      <Outlet />
    </div>
  ) 

}