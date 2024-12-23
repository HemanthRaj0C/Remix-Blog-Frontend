// routes/blog.$id.tsx
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import BackToPrev from "../assets/BackToPrev";
import type { BlogPost } from "../constants/type";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import 'highlight.js/styles/github-dark.css';
import { useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";  
import BlogSkeleton from "../components/BlogSkeleton";

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

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Update this condition
  if (navigation.state === "loading" || isLoading) {
    return <BlogSkeleton />;
  }

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline ? (
        <SyntaxHighlighter
          style={coldarkDark}
          language={language}
          PreTag="div"
          className="rounded-lg"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props}>
          {children}
        </code>
      );
    },
    // Custom styling for other markdown elements
    blockquote({ children }: any) {
      return (
        <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400">
          {children}
        </blockquote>
      );
    },
    table({ children }: any) {
      return (
        <div className="overflow-x-auto my-8">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            {children}
          </table>
        </div>
      );
    },
    th({ children }: any) {
      return (
        <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {children}
        </th>
      );
    },
    td({ children }: any) {
      return (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {children}
        </td>
      );
    },
    img({ src, alt }: any) {
      return (
        <img
          src={src}
          alt={alt}
          className="rounded-lg shadow-lg max-w-full h-auto my-8"
        />
      );
    },
  };

  return (
    <div className="max-w-2xl min-h-screen mx-auto px-4 py-8">
      <BackToPrev href="/blogs">
        Back to Blog
      </BackToPrev>

      <article className="mt-8 space-y-8">
        <header className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {post.title}
          </h1>
          
          <div className="flex flex-col items-start gap-y-2 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={post.createdAt}>
              Published on {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </time>
            {post.updatedAt !== post.createdAt && (
              <div className="text-sm">
                Updated on {format(new Date(post.updatedAt), 'MMMM d, yyyy')}
              </div>
            )}
          </div>

          {post.shortDescription && (
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              {post.shortDescription}
            </p>
          )}
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown
            components={MarkdownComponents}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeRaw,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }]
            ]}
          >
            {post.content}
          </ReactMarkdown>
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
          </div>
        </footer>
      </article>
    </div>
  );
}

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