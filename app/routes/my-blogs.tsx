import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import ArrowCard from "~/components/ArrowCard";
import { BlogPost, PostsByYear } from "../constants/type";
import BackToPrev from "~/assets/BackToPrev";
import { requireAuth, getToken } from "../utils/auth.server";

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
      <div className="font-semibold text-black dark:text-white">
        Blog
      </div>

      {/* Filter by Year */}
      <div className="flex items-center gap-4">
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="px-1 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
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
