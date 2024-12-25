import { json, redirect, type ActionFunction, type LoaderFunction } from "@remix-run/node";
import { requireAuth, getToken } from "~/utils/auth.server";
import CreateBlogForm from "~/components/CreateBlogForm";

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuth(request);
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  await requireAuth(request);
  const token = getToken(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const shortDescription = formData.get("shortDescription");
  const content = formData.get("content");

  try {
    const response = await fetch('http://localhost:3001/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, shortDescription, content }),
    });

    if (!response.ok) {
      throw new Error('Failed to create blog');
    }

    return redirect('/my-blogs');
  } catch (error) {
    return json({ error: 'Failed to create blog post' }, { status: 400 });
  }
};

export default function NewBlog() {
  return <CreateBlogForm />;
}