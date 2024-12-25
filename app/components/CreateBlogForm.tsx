import { Form, useNavigate, useActionData } from "@remix-run/react";
import BackToPrev from "~/assets/BackToPrev";

interface ActionData {
  error?: string;
}

export default function CreateBlogForm() {
  const navigate = useNavigate();
  const actionData = useActionData<ActionData>();

  return (
    <div className="max-w-xl mx-auto min-h-screen space-y-10">
      <BackToPrev href="/my-blogs">
        Back to My Blogs
      </BackToPrev>
      
      <h2 className="font-semibold text-black dark:text-white">
        Create New Blog Post
      </h2>

      <Form method="post" className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Title
          </label>
          <input
            type="text"
            name="title"
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
          Create Post
        </button>
      </Form>
    </div>
  );
}
