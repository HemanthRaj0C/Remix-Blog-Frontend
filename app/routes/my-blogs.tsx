import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import ArrowCard from "~/components/ArrowCard";
import { BlogPost, PostsByYear } from "../constants/type";
import BackToPrev from "~/assets/BackToPrev";
import { requireAuth, getToken } from "../utils/auth.server";
import { motion } from "framer-motion";

// Loader function with authentication
export const loader: LoaderFunction = async ({ request }) => {
  // Ensure user is authenticated
  await requireAuth(request);

  try {
    // Retrieve JWT token
    const token = getToken(request);

    // Fetch data from the backend
    const response = await fetch('http://localhost:3001/blogs/my-blogs', {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in Authorization header
      },
    });

    // Handle unsuccessful response
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    // Parse JSON response directly
    const posts: BlogPost[] = await response.json();

    // Group posts by year
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

// React Component for Blogs
export default function BlogIndex() {
  const { postsByYear, years } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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

  return (
    <div className="space-y-10 max-w-xl mx-auto min-h-screen">
      <BackToPrev href="/">
        Back to Home
      </BackToPrev>
      
      <div className="flex items-center justify-between">
        <div className="font-semibold text-black text-2xl dark:text-white">
          Blog
        </div>
        <div>
        <motion.button
          onClick={() => navigate('/blog/new')}
          className="relative group flex flex-nowrap py-2 px-4 pr-8 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-all transform duration-300 hover:scale-105"
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
      </div>

      {/* Filter by Year */}
      <div className="flex items-center gap-4">
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="px-1 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800"
        >
          <option value="">All Years</option>
          {years.map((year: string) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Blog List by Year */}
      <div className="space-y-4">
        {filteredYears.map((year: string) => (
          <section key={year} className="space-y-4">
            <div className="font-semibold text-black dark:text-white">
              {year}
            </div>
            <div>
              <ul className="flex flex-col gap-4">
                {postsByYear[year].map((post: BlogPost) => (
                  <li key={post.id}>
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
                        whileHover={{ scale: 1.02 }}
                        transition={{ 
                          duration: 0.3,
                        }}
                        onClick={() => navigate(`/${post.id}/edit`)}
                        className="relative group flex flex-nowrap py-1 px-3 pr-7 rounded-lg border border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 text-blue-600 transition-colors"
                      >
                        Edit
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="absolute top-1/2 right-2 -translate-y-1/2 h-5 w-5 stroke-2 fill-none stroke-current"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" className="translate-x-3 group-hover:translate-x-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
                          <polyline points="12 5 19 12 12 19" className="-translate-x-1 group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                        </svg>
                      </motion.button>
                      </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
