import { Link } from "@remix-run/react";
import { motion } from "framer-motion";

const ArrowCard = ({ title, description, href }) => {
  return (
    <Link to={href} className="block">
      <motion.div
        className="relative group flex flex-nowrap py-3 px-4 pr-10 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ 
          duration: 0.3,
        }}
      >
        <motion.div 
          className="flex flex-col flex-1 truncate"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.div>
          <motion.div 
            className="text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {description}
          </motion.div>
        </motion.div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="absolute top-1/2 right-2 -translate-y-1/2 h-5 w-5 stroke-2 fill-none stroke-current"
        >
          <line
            x1="5"
            y1="12"
            x2="19"
            y2="12"
            className="translate-x-3 group-hover:translate-x-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"
          />
          <polyline
            points="12 5 19 12 12 19"
            className="-translate-x-1 group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
          />
        </svg>
      </motion.div>
    </Link>
  );
};

export default ArrowCard;