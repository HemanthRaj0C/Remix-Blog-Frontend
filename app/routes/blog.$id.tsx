// routes/blog.$id.tsx
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import BackToPrev from "../assets/BackToPrev";
import type { BlogPost } from "../constants/type";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Choose your preferred style

interface LoaderData {
  post: BlogPost;
}

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const response = await fetch(`http://localhost:3001/blogs/${params.id}`);
    if (!response.ok) {
      throw new Response("Not Found", { status: 404 });
    }
    const post = await response.json();
    return json<LoaderData>({ post });
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
};

export default function BlogDetails() {
  const { post } = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  return (
    <div className="max-w-xl min-h-screen mx-auto px-4">
      <BackToPrev href="/blogs">
        Back to Blog
      </BackToPrev>

      <article className="mt-8 space-y-8">
        <header className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {post.title}
          </h1>
          
          <div className="flex flex-col items-start gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={post.createdAt}>
            <span>&bull;</span> {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </time>
            {post.updatedAt !== post.createdAt && (
              <>
                <div className="text-sm">
                <span>&bull;</span> Updated {format(new Date(post.updatedAt), 'MMMM d, yyyy')}
                </div>
              </>
            )}
          </div>

          {post.shortDescription && (
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {post.shortDescription}
            </p>
          )}
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown
                children={post.content}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
            />
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  Written by
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {post.author.username}
                </p>
              </div>
            </div>
            <div className="flex space-x-4 text-sm">
              <time 
                className="text-gray-600 dark:text-gray-400"
                dateTime={post.createdAt}
              >
                Published {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </time>
            </div>
          </div>
        </footer>
      </article>

      {/* Optional: Add a section for related posts or comments here */}
    </div>
  );
}

// Optional: Error Boundary
export function ErrorBoundary() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Post not found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Sorry, the blog post you're looking for doesn't exist or has been removed.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        ← Go back
      </button>
    </div>
  );
}