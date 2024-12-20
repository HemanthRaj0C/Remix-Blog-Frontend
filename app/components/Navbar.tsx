import { Link } from "@remix-run/react";
import { SITE } from "../constants/site";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-5xl mx-auto py-4 px-8 fixed inset-x-0 top-0 rounded-xl shadow-lg backdrop-blur z-50"
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
            to="/blog"
            className="hover:underline hover:text-gray-300 transition-colors"
          >
            blog
          </Link>
          <span>/</span>
          <Link
            to="/work"
            className="hover:underline hover:text-gray-300 transition-colors"
          >
            work
          </Link>
          <span>/</span>
          <Link
            to="/projects"
            className="hover:underline hover:text-gray-300 transition-colors"
          >
            projects
          </Link>
        </nav>
      </div>
    </motion.nav>
  );
}
