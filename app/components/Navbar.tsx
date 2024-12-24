import { Link, useOutletContext } from "@remix-run/react";
import { SITE } from "../constants/site";
import { motion } from "framer-motion";

type ContextType = {
  isAuthenticated: boolean;
};

type NavbarProps = {
  isAuthenticated: boolean;
};

export default function Navbar({ isAuthenticated }: NavbarProps) {

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-5xl mx-auto py-4 px-8 fixed inset-x-0 top-0 rounded-xl shadow-lg backdrop-blur-sm z-50"
    >
      <div className="flex items-center justify-between text-white">
        {/* Site Name */}
        <Link to="/">
          <div className="font-semibold text-xl hover:scale-105 hover:animate-pulse border border-transparent hover:border-white p-1 px-5 hover:rounded-full transition-all transform duration-300">
            {SITE.NAME}
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex gap-2 font-medium">
          <Link
            to="/blogs"
            className="hover:underline hover:text-gray-300 transition-colors"
          >
            blogs
          </Link>
          <span>/</span>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-blogs"
                className="hover:underline hover:text-gray-300 transition-colors"
              >
                my-blogs
              </Link>
              <span>/</span>
              <form action="/logout" method="post" className="inline">
                <button
                  type="submit"
                  className="hover:underline hover:text-gray-300 transition-colors"
                >
                  logout
                </button>
              </form>
            </>
          ) : (
            <Link
              to="/login"
              className="hover:underline hover:text-gray-300 transition-colors"
            >
              login
            </Link>
          )}
        </nav>
      </div>
    </motion.nav>
  );
}