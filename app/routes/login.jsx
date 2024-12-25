import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { motion } from "framer-motion";

// Add a new loader to check authentication status
export const loader = async ({ request }) => {
  const cookie = request.headers.get("Cookie");
  if (cookie && cookie.includes("access_token")) {
    // If already authenticated, redirect to blogs
    return redirect("/blogs");
  }
  return null;
};

export const action = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  // Basic validation
  const errors = {
    email: email ? null : "Email is required",
    password: password ? null : "Password is required",
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors });
  }

  try {
    const response = await fetch(`${process.env.LOCALHOST}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return json({
        errors: {
          form: data.message || "Login failed. Please check your credentials.",
        },
      });
    }

    // Create a proper cookie with all necessary attributes
    const cookieHeader = new Headers();
    cookieHeader.append(
      "Set-Cookie",
      `access_token=${data.access_token}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=3600`
    );

    // Return both the redirect and the cookie
    return redirect("/", {
      headers: cookieHeader,
    });
  } catch (error) {
    console.error(error);
    return json({
      errors: {
        form: "An error occurred. Please try again later.",
      },
    });
  }
};

export default function Login() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const isSubmitting = navigation.state === "submitting";

  return (
    <motion.div 
      className="flex flex-col py-16" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md" 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-200">
          Sign in to your account
        </h2>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="border border-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form method="post" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 bg-transparent py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
                {actionData?.errors?.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {actionData.errors.email}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full bg-transparent px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-2 text-sm font-semibold flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {actionData?.errors?.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {actionData.errors.password}
                  </p>
                )}
              </div>
            </motion.div>

            {actionData?.errors?.form && (
              <motion.div 
                className="rounded-md bg-red-50/50 p-4" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.5 }}
              >
                <p className="text-sm font-medium text-red-700">{actionData.errors.form}</p>
              </motion.div>
            )}

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.5 }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 flex text-center mx-auto justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-gray-300 hover:bg-gray-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 duration-200"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </motion.div>
          </Form>
        </div>
      </motion.div>
    </motion.div>
  );
}
