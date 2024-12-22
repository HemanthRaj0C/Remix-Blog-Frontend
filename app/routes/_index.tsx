import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import ArrowCard from "~/components/ArrowCard";
import { BlogPost } from "../constants/type";
import { SITE, SOCIALS } from "../constants/site";

interface LoaderData {
  blogPosts: BlogPost[];
}

export const loader: LoaderFunction = async () => {
  try {
    const blogResponse = await fetch(`${process.env.LOCALHOST}/blogs`);
    if (!blogResponse.ok) throw new Error('Failed to fetch blog posts');

    const blogPosts: BlogPost[] = await blogResponse.json();
    return json<LoaderData>({
      blogPosts,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return json<LoaderData>({ blogPosts: [] });
  }
};

export default function HomePage() {
  const { blogPosts } = useLoaderData<LoaderData>();

  return (
    <div className="space-y-16 max-w-xl mx-auto min-h-screen">
      <section>
        <h4 className="font-semibold text-black dark:text-white">
          Hi, I'm Nano <span className="text-xl">👋🏻</span>
        </h4>
        <br />
        <article className="space-y-4">
          <p>
            I am a minimal, seo friendly, accessible portfolio and blog for developers.
            I have lighthouse scores of 100 across the board for performance,
            accessibility, best practices and SEO.
          </p>
          <p>
            I come packed with full type safety, a sitemap, an rss feed, markdown
            and mdx support through Remix integrations.
            I am styled with tailwind and come preconfigured with light, dark and
            system/os theme preferences out of the box.
          </p>
        </article>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap gap-y-2 items-center justify-between">
          <h5 className="font-semibold text-black dark:text-white">
            Latest posts
          </h5>
          <Link 
            to="/blogs" 
            className="hover:underline hover:text-gray-300 transition-colors"
          >
            See all posts
          </Link>
        </div>
        <ul className="flex flex-col gap-4">
          {blogPosts
            .slice(0, SITE.NUM_POSTS_ON_HOMEPAGE)
            .map((post: BlogPost) => (
              <li key={post.id}>
                <ArrowCard
                  title={post.title}
                  description={post.shortDescription}
                  href={`/blog/${post.id}`}
                />
              </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h5 className="font-semibold text-black dark:text-white">
          Let's Connect
        </h5>
        <article>
          <p>
            If you want to get in touch with me about something or just to say hi,
            reach out on social media or send me an email.
          </p>
        </article>
        <ul className="flex flex-wrap gap-2">
          {SOCIALS.map((social) => (
            <li key={social.NAME} className="flex gap-x-2 text-nowrap">
              <a 
                href={social.HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                aria-label={`${SITE.NAME} on ${social.NAME}`}
              >
                {social.NAME}
              </a>
              {"/"}
            </li>
          ))}
          <li className="line-clamp-1">
            <a 
              href={`mailto:${SITE.EMAIL}`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              aria-label={`Email ${SITE.NAME}`}
            >
              {SITE.EMAIL}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
