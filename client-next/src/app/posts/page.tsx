import { getPosts } from "@/lib/api";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posts | hikabooru",
  description: "Browse all posts on hikabooru",
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ query?: string; offset?: string }>;
}

export default async function PostsPage({ searchParams }: Props) {
  const { query = "", offset = "0" } = await searchParams;
  const off = Number(offset) || 0;

  let data;
  try {
    data = await getPosts(query, off, 50);
  } catch {
    return (
      <div className="content-wrapper" id="posts">
        <h1>Posts</h1>
        <p>Failed to load posts.</p>
      </div>
    );
  }

  return (
    <div className="content-wrapper" id="posts">
      <h1>Posts</h1>
      <form className="horizontal" action="/posts" method="GET">
        <input
          type="text"
          name="query"
          defaultValue={query}
          placeholder="search posts..."
          className="search-input"
        />
        <input type="submit" value="Search" />
      </form>

      <div className="post-list-container">
        {data.results.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <ul className="post-list">
            {data.results.map((post) => (
              <li key={post.id} className="post-list-item">
                <Link href={`/post/${post.id}`}>
                  <img
                    src={post.thumbnailUrl}
                    alt=""
                    loading="lazy"
                    width={200}
                    height={150}
                  />
                </Link>
                <div className="post-list-info">
                  <Link href={`/post/${post.id}`}>#{post.id}</Link>
                  <span className="safety">{post.safety}</span>
                  <span className="score">{post.score ?? 0}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <nav className="pager">
        {off > 0 && (
          <a href={`/posts?query=${query}&offset=${Math.max(0, off - 50)}`}>
            ← Previous
          </a>
        )}
        {data.results.length >= 50 && (
          <a href={`/posts?query=${query}&offset=${off + 50}`}>Next →</a>
        )}
      </nav>
    </div>
  );
}
