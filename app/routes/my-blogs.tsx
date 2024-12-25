import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import ArrowCard from "~/components/ArrowCard";
import { BlogPost, PostsByYear } from "../constants/type";
import BackToPrev from "~/assets/BackToPrev";
import { requireAuth, getToken } from "../utils/auth.server";

// Loader function with authentication
export const loader: LoaderFunction = async ({ request }) => {
  await requireAuth(request);

  try {
    const token = getToken(request);
    const response = await fetch(`${process.env.LOCALHOST}/blogs/my-blogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const posts: BlogPost[] = await response.json();
    const postsByYear = posts.reduce((acc: PostsByYear, post) => {
      const year = new Date(post.createdAt).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    }, {});

    const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

    return json({ postsByYear, years });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return json({ postsByYear: {}, years: [] });
  }
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function BlogIndex() {
  const { postsByYear, years } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedYear = searchParams.get("year") || "";

  const handleYearChange = (year: string) => {
    setSearchParams((prev) => {
      if (year === "") {
        prev.delete("year");
      } else {
        prev.set("year", year);
      }
      return prev;
    });
  };

  const filteredYears = selectedYear
    ? years.filter((year: string) => year === selectedYear)
    : years;

  return (
    <motion.div
      className="space-y-10 max-w-xl mx-auto min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <BackToPrev href="/">Back to Home</BackToPrev>
      </motion.div>

      <motion.div 
      className="flex items-center justify-between"
      variants={itemVariants}
      >
        <div className="font-semibold text-black text-2xl dark:text-white">
          Blog
        </div>
        <div>
        <motion.button
          onClick={() => navigate('/blog/new')}
          className="relative group flex flex-nowrap py-2 px-3 pr-8 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-all transform duration-300 hover:scale-105"
        >
          Create New Post
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="absolute top-1/2 right-1 -translate-y-1/2 h-5 w-5 stroke-2 fill-none stroke-current"
          >
            <line x1="5" y1="12" x2="19" y2="12" className="translate-x-3 group-hover:translate-x-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
            <polyline points="12 5 19 12 12 19" className="-translate-x-1 group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
          </svg>
        </motion.button>
        </div>
      </motion.div>

      <motion.div className="flex items-center gap-4" variants={itemVariants}>
        <motion.select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="px-1 py-2 rounded-lg border border-gray-700 bg-stone-900/5 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <option value="" className="text-black">All Years</option>
          {years.map((year: string) => (
            <option key={year} value={year} className="text-black">
              {year}
            </option>
          ))}
        </motion.select>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYear}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {filteredYears.map((year: string) => (
            <motion.section key={year} className="space-y-4" variants={itemVariants}>
              <motion.div
                className="font-semibold text-black dark:text-white"
                variants={itemVariants}
              >
                {year}
              </motion.div>
              <motion.ul
                className="flex flex-col gap-4"
                variants={containerVariants}
              >
                {postsByYear[year].map((post: BlogPost) => (
                  <motion.li
                    key={post.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowCard
                      title={post.title}
                      description={post.shortDescription}
                      content={post.content}
                      href={`/blog/${post.id}`}
                    />
                    <div className="flex justify-end my-3">
                      <motion.button
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0 }}
                        onClick={() => navigate(`/${post.id}/edit`)}
                        className="relative group flex flex-nowrap py-1 px-3 pr-8 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-transform duration-300"
                      >
                        Edit
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
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.section>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
