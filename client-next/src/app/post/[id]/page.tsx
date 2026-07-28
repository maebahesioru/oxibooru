import { getPost, getPostAround, type Post } from "@/lib/api";
import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const postId = Number(id);
  if (isNaN(postId)) return { title: "Not Found | hikabooru" };

  try {
    const post = await getPost(postId);
    const tags = post.tags?.map((t) => t.names?.[0]).filter(Boolean) ?? [];
    const title = tags.slice(0, 8).join(" ") + ` | Post #${postId} | hikabooru`;
    const desc = `Tags: ${tags.slice(0, 25).join(", ")}`;
    const image =
      post.thumbnailUrl?.startsWith("http")
        ? post.thumbnailUrl
        : `https://hikabooru.hikamer.f5.si/${post.thumbnailUrl}`;

    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        type: "article",
        url: `https://hikabooru.hikamer.f5.si/post/${postId}`,
        images: image ? [image] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: desc,
        images: image ? [image] : [],
      },
    };
  } catch {
    return { title: `Post #${postId} | hikabooru` };
  }
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const postId = Number(id);
  if (isNaN(postId)) {
    return (
      <div className="content-wrapper">
        <div className="messages error">Invalid post ID</div>
      </div>
    );
  }

  let post: Post;
  let around: { prev: Post | null; next: Post | null };
  try {
    [post, around] = await Promise.all([
      getPost(postId),
      getPostAround(postId),
    ]);
  } catch (e: any) {
    return (
      <div className="content-wrapper">
        <div className="messages error">
          {e?.message || "Failed to load post"}
        </div>
      </div>
    );
  }

  const tags = post.tags ?? [];
  const [prevPostId, nextPostId] = [around.prev?.id, around.next?.id];

  return (
    <div className="content-wrapper transparent-container post-view">
      <aside className="sidebar">
        <nav className="buttons">
          <article className="previous-post">
            {prevPostId ? (
              <a rel="prev" href={`/post/${prevPostId}`}>
                <i className="fa fa-chevron-left"></i>
                <span className="vim-nav-hint">&lt; Previous post</span>
              </a>
            ) : (
              <a className="inactive">
                <i className="fa fa-chevron-left"></i>
                <span className="vim-nav-hint">&lt; Previous post</span>
              </a>
            )}
          </article>
          <article className="next-post">
            {nextPostId ? (
              <a rel="next" href={`/post/${nextPostId}`}>
                <i className="fa fa-chevron-right"></i>
                <span className="vim-nav-hint">Next post &gt;</span>
              </a>
            ) : (
              <a className="inactive">
                <i className="fa fa-chevron-right"></i>
                <span className="vim-nav-hint">Next post &gt;</span>
              </a>
            )}
          </article>
        </nav>

        <div className="sidebar-container">
          {/* Tag list */}
          <nav className="tags">
            <h1>Tags ({tags.length})</h1>
            <ul>
              {tags.map((tag) => {
                const name = tag.names?.[0];
                if (!name) return null;
                return (
                  <li key={name}>
                    <a href={`/tag/${encodeURIComponent(name)}`}>
                      <i className="fa fa-tag"></i>
                    </a>
                    <Link href={`/tag/${encodeURIComponent(name)}`}>{name}</Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Post info */}
          <div className="post-info">
            <p>
              <i className="fa fa-download"></i>{" "}
              <a href={post.contentUrl} download>
                {formatBytes(post.fileSize)} {post.type?.toUpperCase()}
              </a>{" "}
              ({post.canvasWidth}x{post.canvasHeight})
            </p>
            <p>
              Uploaded by{" "}
              <Link href={`/user/${post.user?.name}`}>{post.user?.name}</Link>,{" "}
              {formatDate(post.creationTime)}
            </p>
            <p>
              Safety:{" "}
              <span className={`safety safety-${post.safety?.toLowerCase()}`}>
                {post.safety}
              </span>
            </p>
            {post.source && (
              <p>
                Source:{" "}
                <a href={post.source} rel="external noopener noreferrer">
                  {new URL(post.source).hostname}
                </a>
              </p>
            )}
            <p>
              <span>Score: {post.score ?? 0}</span>
              {" · "}
              <span>Favorites: {post.favorites ?? 0}</span>
            </p>
          </div>
        </div>
      </aside>

      <div className="content">
        <div className="post-container">
          <PostContent post={post} />
        </div>

        {post.description && (
          <div className="description-container">
            <details open>
              <summary>Description</summary>
              <div
                dangerouslySetInnerHTML={{
                  __html: post.description,
                }}
              />
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

function PostContent({ post }: { post: Post }) {
  const src = post.contentUrl;
  if (!src) return <p>No content available</p>;

  if (post.type === "image" || post.type === "jpg" || post.type === "png" || post.type === "gif" || post.type === "webp") {
    return (
      <div className="post-content">
        <a href={src}>
          <img
            src={post.thumbnailUrl || src}
            alt="post"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </a>
        <div className="post-content-controls">
          <a href={src}>Original zoom</a>
          {" · "}
          <a href="#">fit width</a>
          {" · "}
          <a href="#">height</a>
          {" · "}
          <a href="#">both</a>
        </div>
      </div>
    );
  }

  if (post.type === "video" || post.type === "mp4" || post.type === "webm") {
    return (
      <div className="post-content">
        <video
          controls
          preload="metadata"
          poster={post.thumbnailUrl}
          style={{ maxWidth: "100%" }}
        >
          <source src={src} />
        </video>
      </div>
    );
  }

  if (post.type === "swf" || post.type === "flash") {
    return (
      <div className="post-content">
        <object
          type="application/x-shockwave-flash"
          data={src}
          style={{ maxWidth: "100%" }}
        >
          <param name="movie" value={src} />
        </object>
      </div>
    );
  }

  return (
    <div className="post-content">
      <a href={src}>Download {post.type}</a>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
