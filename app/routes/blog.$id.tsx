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
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import 'highlight.js/styles/github-dark.css';
import { useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";  
import BlogSkeleton from "../components/BlogSkeleton";
import { calculateReadTime, formatReadTime } from "../libs/util";
import { motion } from "framer-motion";

interface LoaderData {
  post: BlogPost;
}

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const response = await fetch(`${process.env.LOCALHOST}/blogs/${params.id}`);
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

  const readingTime = formatReadTime(post.content);
  console.log(readingTime);

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (navigation.state === "loading" || isLoading) {
    return <BlogSkeleton />;
  }

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline ? (
        <SyntaxHighlighter
          style={a11yDark}
          language={language}
          PreTag="div"
          className="rounded-lg"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-stone-800 rounded px-1 py-40" {...props}>
          {children}
        </code>
      );
    },
    blockquote({ children }: any) {
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600 dark:text-gray-400">
          {children}
        </blockquote>
      );
    },
    table({ children }: any) {
      return (
        <div className="overflow-x-auto my-8">
          <motion.table
            className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.table>
        </div>
      );
    },
    th({ children }: any) {
      return (
        <motion.th
          className="px-6 py-3 bg-gray-50 dark:bg-stone-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.th>
      );
    },
    td({ children }: any) {
      return (
        <motion.td
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.td>
      );
    },
    img({ src, alt }: any) {
      return (
        <motion.img
          src={src}
          alt={alt}
          className="rounded-lg shadow-lg max-w-full h-auto my-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      );
    },
  };

  return (
    <motion.div 
      className="max-w-2xl min-h-screen mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BackToPrev href="/blogs">
        Back to Blog
      </BackToPrev>

      <motion.article 
        className="mt-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="space-y-6">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.5 }}
          >
            {post.title}
          </motion.h1>
          
          <motion.div 
            className="flex flex-col items-start gap-y-2 text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <time dateTime={post.createdAt}>
              Published on {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </time>
            {post.updatedAt !== post.createdAt && (
              <div className="text-sm">
                Updated on {format(new Date(post.updatedAt), 'MMMM d, yyyy')}
              </div>
            )}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-gray-600 dark:text-gray-400">
              &bull; {readingTime}
            </p>
          </motion.div>
        </header>

        <motion.div 
          className="prose dark:prose-invert max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>

        <motion.footer 
          className="mt-12 pt-6 border-t dark:border-stone-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-base">
                <p className="text-gray-600 font-semibold dark:text-gray-400">
                  Written by
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {post.author.username}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.footer>
      </motion.article>
    </motion.div>
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
