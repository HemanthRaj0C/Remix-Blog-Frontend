import { useState, useEffect } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { SITE } from "../constants/site";
import BackToTop from "../assets/BackToTop";

export default function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  return (
    <footer className="max-w-4xl mx-auto py-10 px-8 inset-x-0 rounded-full">
      <div className="container mx-auto">
        <div className="relative mb-4">
          <div className="absolute right-0 -top-16">
             <BackToTop />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:animate-pulse">
            &copy; 2024 | {SITE.NAME}
          </div>
          <div className="flex items-center gap-4 hover:scale-110 tarnsition trasnform duration-300">
            <DarkModeSwitch
              checked={isDarkMode}
              onChange={toggleTheme}
              size={24}
              sunColor="orange"
              moonColor="gray"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
