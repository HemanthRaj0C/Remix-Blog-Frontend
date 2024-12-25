import { Form, useNavigate, useActionData, useLoaderData } from "@remix-run/react";
import BackToPrev from "~/assets/BackToPrev";
import type { BlogPost } from "~/constants/type";
import MarkdownTipsModal from "~/components/MarkdownTipsModal";
import { motion } from "framer-motion";

export default function EditBlogForm() {
  const navigate = useNavigate();
  const post = useLoaderData<BlogPost>();
  const actionData = useActionData() as { error?: string };

  return (
    <motion.div
      className="max-w-xl mx-auto min-h-screen space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <BackToPrev href="/my-blogs">Back to My Blogs</BackToPrev>
      </motion.div>

      <motion.h2
        className="font-semibold text-black dark:text-white"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Edit Blog Post
      </motion.h2>

      <Form method="post" className="space-y-6">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={post.title}
            required
            className="w-full px-3 py-2 border border-stone-300 rounded-lg 
                     dark:border-stone-700 dark:bg-stone-800 dark:text-white"
          />
        </motion.div>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Short Description
          </label>
          <input
            type="text"
            name="shortDescription"
            defaultValue={post.shortDescription}
            required
            className="w-full px-3 py-2 border border-stone-300 rounded-lg 
                     dark:border-stone-700 dark:bg-stone-800 dark:text-white"
          />
        </motion.div>

        <motion.div
          className="space-y-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Content
          </label>
          <textarea
            name="content"
            defaultValue={post.content}
            required
            rows={8}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg 
                        dark:border-stone-700 dark:bg-stone-800 dark:text-white"
          />
          <div className="text-right">
            <MarkdownTipsModal />
          </div>
        </motion.div>

        {actionData?.error && (
          <motion.p
            className="text-red-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {actionData.error}
          </motion.p>
        )}

        <motion.button
          type="submit"
          className="w-1/4 mx-auto text-center flex justify-center px-4 py-2 text-black bg-gray-300 rounded-lg 
                   hover:bg-gray-950 hover:text-white duration-300 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Update Post
        </motion.button>
      </Form>
    </motion.div>
  );
}
