import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import ArrowCard from "~/components/ArrowCard";
import { BlogPost, PostsByYear } from "../constants/type";
import BackToPrev from "~/assets/BackToPrev";

export const loader: LoaderFunction = async () => {
  try {
    const response = await fetch(`${process.env.LOCALHOST}/blogs`);
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
    console.error('Error fetching blog posts:', error);
    return json({ postsByYear: {}, years: [] });
  }
};

export default function BlogIndex() {
  const { postsByYear, years } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedYear = searchParams.get('year') || '';

  const handleYearChange = (year: string) => {
    setSearchParams(prev => {
      if (year === '') {
        prev.delete('year');
      } else {
        prev.set('year', year);
      }
      return prev;
    });
  };

  const filteredYears = selectedYear 
    ? years.filter((year: string) => year === selectedYear)
    : years;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const selectVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <motion.div 
      className="space-y-10 max-w-xl mx-auto min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        whileHover={{ x: -5 }}
        transition={{ duration: 0.2 }}
      >
        <BackToPrev href="/">
          Back to Home
        </BackToPrev>
      </motion.div>

      <motion.div 
        className="font-semibold text-2xl text-black dark:text-white"
        variants={itemVariants}
      >
        Blog
      </motion.div>

      <motion.div 
        className="flex items-center gap-4"
        variants={itemVariants}
      >
        <motion.select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="px-1 py-2 rounded-lg border border-gray-700 bg-stone-900/5 cursor-pointer"
          variants={selectVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <option value="" className="text-black">All Years</option>
          {years.map((year : string) => (
            <option className="text-black" key={year} value={year}>{year}</option>
          ))}
        </motion.select>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div 
          className="space-y-4"
          key={selectedYear}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {filteredYears.map((year : string) => (
            <motion.section 
              key={year} 
              className="space-y-4"
              variants={itemVariants}
            >
              <motion.div 
                className="font-semibold text-black dark:text-white"
                variants={itemVariants}
              >
                {year}
              </motion.div>
              <div>
                <motion.ul 
                  className="flex flex-col gap-4"
                  variants={containerVariants}
                >
                  {postsByYear[year].map((post: BlogPost, index: number) => (
                    <motion.li 
                      key={post.id}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ scale: 1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowCard
                        title={post.title}
                        description={post.shortDescription}
                        content={post.content}
                        href={`/blog/${post.id}`}
                      />
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.section>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}