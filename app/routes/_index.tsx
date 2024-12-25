import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import ArrowCard from "~/components/ArrowCard";
import { BlogPost } from "../constants/type";
import { SITE, SOCIALS } from "../constants/site";

interface LoaderData {
  blogPosts: BlogPost[];
}

export const loader: LoaderFunction = async () => {
  try {
    const blogResponse = await fetch(`${process.env.LOCALHOST}/blogs`);
    if (!blogResponse.ok) throw new Error('Failed to fetch blog posts');

    const blogPosts: BlogPost[] = await blogResponse.json();
    return json<LoaderData>({
      blogPosts,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return json<LoaderData>({ blogPosts: [] });
  }
};

export default function HomePage() {
  const { blogPosts } = useLoaderData<LoaderData>();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  return (
    <motion.div 
      className="space-y-16 max-w-xl mx-auto min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={itemVariants}>
        <h4 className="font-semibold text-black dark:text-white">
          Hi, I'm Nano{" "}
          <motion.span 
            className="text-xl inline-block"
            animate={{ rotate: [0, 20, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            👋🏻
          </motion.span>
        </h4>
        <br />
        <article className="space-y-4">
          <motion.p variants={itemVariants}>
            I am a minimal, seo friendly, accessible portfolio and blog for developers.
            I have lighthouse scores of 100 across the board for performance,
            accessibility, best practices and SEO.
          </motion.p>
          <motion.p variants={itemVariants}>
            I come packed with full type safety, a sitemap, an rss feed, markdown
            and mdx support through Remix integrations.
            I am styled with tailwind and come preconfigured with light, dark and
            system/os theme preferences out of the box.
          </motion.p>
        </article>
      </motion.section>

      <motion.section className="space-y-6" variants={itemVariants}>
        <div className="flex flex-wrap gap-y-2 items-center justify-between">
          <h5 className="font-semibold text-black dark:text-white">
            Latest posts
          </h5>
          <Link 
            to="/blogs" 
            className="hover:underline hover:text-gray-300 transition-colors"
          >
            See all posts
          </Link>
        </div>
        <ul className="flex flex-col gap-4">
          {blogPosts
            .slice(0, SITE.NUM_POSTS_ON_HOMEPAGE)
            .map((post: BlogPost, index: number) => (
              <motion.li 
                key={post.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.02 }}
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
        </ul>
      </motion.section>

      <motion.section className="space-y-4" variants={itemVariants}>
        <h5 className="font-semibold text-black dark:text-white">
          Let's Connect
        </h5>
        <article>
          <motion.p variants={itemVariants}>
            If you want to get in touch with me about something or just to say hi,
            reach out on social media or send me an email.
          </motion.p>
        </article>
        <motion.ul 
          className="flex flex-wrap gap-2"
          variants={itemVariants}
        >
          {SOCIALS.map((social) => (
            <motion.li 
              key={social.NAME} 
              className="flex gap-x-2 text-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a 
                href={social.HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 transition-all transform duration-300 dark:hover:text-gray-200 underline"
                aria-label={`${SITE.NAME} on ${social.NAME}`}
              >
                {social.NAME}
              </a>
              {"/"}
            </motion.li>
          ))}
          <motion.li 
            className="line-clamp-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href={`mailto:${SITE.EMAIL}`}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 underline"
              aria-label={`Email ${SITE.NAME}`}
            >
              {SITE.EMAIL}
            </a>
          </motion.li>
        </motion.ul>
      </motion.section>
    </motion.div>
  );
}