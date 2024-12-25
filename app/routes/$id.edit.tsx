import { json, redirect, type ActionFunction, type LoaderFunction } from "@remix-run/node";
import { requireAuth, getToken } from "~/utils/auth.server";
import EditBlogForm from "~/components/EditBlogForm";

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAuth(request);
  const token = getToken(request);
  
  const response = await fetch(`${process.env.LOCALHOST}/blogs/${params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog');
  }

  return json(await response.json());
};

export const action: ActionFunction = async ({ request, params }) => {
  await requireAuth(request);
  const token = getToken(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const shortDescription = formData.get("shortDescription");
  const content = formData.get("content");

  try {
    const response = await fetch(`${process.env.LOCALHOST}/blogs/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, shortDescription, content }),
    });

    if (!response.ok) {
      throw new Error('Failed to update blog');
    }

    return redirect('/my-blogs');
  } catch (error) {
    return json({ error: 'Failed to update blog post' }, { status: 400 });
  }
};

export default function EditBlog() {
  return <EditBlogForm />;
}