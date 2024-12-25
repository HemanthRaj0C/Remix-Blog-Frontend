import { Form, useNavigate, useActionData, useLoaderData } from "@remix-run/react";
import BackToPrev from "~/assets/BackToPrev";
import type { BlogPost } from "~/constants/type";

export default function EditBlogForm() {
  const navigate = useNavigate();
  const post = useLoaderData<BlogPost>();
  const actionData = useActionData() as { error?: string };

  return (
    <div className="max-w-xl mx-auto min-h-screen space-y-10">
      <BackToPrev href="/blog/my-blogs">
        Back to My Blogs
      </BackToPrev>
      
      <h2 className="font-semibold text-black dark:text-white">
        Edit Blog Post
      </h2>

      <Form method="post" className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={post.title}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Short Description
          </label>
          <input
            type="text"
            name="shortDescription"
            defaultValue={post.shortDescription}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Content
          </label>
          <textarea
            name="content"
            defaultValue={post.content}
            required
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {actionData?.error && (
          <p className="text-red-500 text-sm">{actionData.error}</p>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg 
                   hover:bg-blue-700 transition-colors"
        >
          Update Post
        </button>
      </Form>
    </div>
  );
}