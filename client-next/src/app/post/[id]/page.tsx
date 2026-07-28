import { getPost, getPostAround } from "@/lib/api";
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
    const title =
      tags.slice(0, 8).join(" ") + ` | Post #${postId} | hikabooru`;
    const desc = `Tags: ${tags.slice(0, 25).join(", ")}`;
    const image = post.thumbnailUrl?.startsWith("http")
      ? post.thumbnailUrl
      : `https://hikabooru.hikamer.f5.si/${post.thumbnailUrl}`;

    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        type: "article",
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
        <div className="messages">
          <div className="message-wrapper">
            <div className="message error">Invalid post ID</div>
          </div>
        </div>
      </div>
    );
  }

  let post, around;
  try {
    [post, around] = await Promise.all([
      getPost(postId),
      getPostAround(postId),
    ]);
  } catch (e: any) {
    return (
      <div className="content-wrapper">
        <div className="messages">
          <div className="message-wrapper">
            <div className="message error">{e?.message || "Failed to load"}</div>
          </div>
        </div>
      </div>
    );
  }

  const prevPostId = around.prev?.id ?? null;
  const nextPostId = around.next?.id ?? null;
  const tags = post.tags ?? [];
  const relations = post.relations ?? [];
  const mimeType = post.type || "";
  const mimeLabel = mimeLabels[mimeType] || mimeType.replace("image/", "").replace("video/", "").toUpperCase() || "FILE";

  return (
    <div className="content-wrapper transparent-container post-view">
      <aside className="sidebar">
        {/* Navigation buttons */}
        <nav className="buttons">
          <article className="previous-post">
            {prevPostId ? (
              <a rel="prev" href={`/post/${prevPostId}`}>
                <i className="fa fa-chevron-left"></i>
                <span className="vim-nav-hint">&lt; Previous post</span>
              </a>
            ) : (
              <a rel="prev" className="inactive">
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
              <a rel="next" className="inactive">
                <i className="fa fa-chevron-right"></i>
                <span className="vim-nav-hint">Next post &gt;</span>
              </a>
            )}
          </article>
        </nav>

        {/* Sidebar container — readonly sidebar */}
        <div className="sidebar-container">
          <div className="readonly-sidebar">
            <article className="details">
              {/* Download section */}
              <section className="download">
                <a href={post.contentUrl} download>
                  <i className="fa fa-download"></i>
                  {formatBytes(post.fileSize)} {mimeLabel}
                </a>
                ({post.canvasWidth}x{post.canvasHeight})
                {(post.flags ?? []).includes("loop") ? (
                  <i className="fa fa-repeat"></i>
                ) : null}
                {(post.flags ?? []).includes("sound") ? (
                  <i className="fa fa-volume-up"></i>
                ) : null}
              </section>

              {/* Upload info */}
              <section className="upload-info">
                <Link href={`/user/${post.user?.name ?? "unknown"}`}>
                  {post.user?.name ?? "unknown"}
                </Link>
                , {formatDate(post.creationTime)}
              </section>

              {/* Safety */}
              <section className="safety">
                <i
                  className={`fa fa-circle safety-${(post.safety ?? "safe").toLowerCase()}`}
                ></i>
                {capFirst(post.safety ?? "safe")}
              </section>

              {/* Zoom controls */}
              <section className="zoom">
                <a href="#" className="fit-original">
                  Original zoom
                </a>{" "}
                &middot;{" "}
                <a href="#" className="fit-width">
                  fit width
                </a>{" "}
                &middot;{" "}
                <a href="#" className="fit-height">
                  height
                </a>{" "}
                &middot;{" "}
                <a href="#" className="fit-both">
                  both
                </a>
              </section>

              {/* Source */}
              {post.source && (
                <section className="source">
                  Source:{" "}
                  <a
                    href={post.source}
                    title={post.source}
                    rel="external noopener noreferrer"
                  >
                    {extractDomain(post.source)}
                  </a>
                </section>
              )}

              {/* Search */}
              <section className="search">
                Search on{" "}
                <a
                  href={`http://iqdb.org/?url=${encodeURIComponent(post.contentUrl)}`}
                >
                  IQDB
                </a>{" "}
                &middot;{" "}
                <a
                  href={`https://danbooru.donmai.us/posts?tags=md5:${post.checksum || ""}`}
                >
                  Danbooru
                </a>{" "}
                &middot;{" "}
                <a
                  href={`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(post.contentUrl)}`}
                >
                  Google Images
                </a>
              </section>

              {/* Social — score + fav */}
              <section className="social">
                <div className="score-container">
                  <span>Score: {post.score ?? 0}</span>
                  {" · "}
                  <span>Favorites: {post.favorites ?? 0}</span>
                </div>
                <div className="fav-container"></div>
              </section>
            </article>

            {/* Relations */}
            {relations.length > 0 && (
              <nav className="relations">
                <h1>Relations ({relations.length})</h1>
                <ul>
                  {relations.map((rel) => (
                    <li key={rel.id}>
                      <a href={`/post/${rel.id}`}>
                        <img
                          src={rel.thumbnailUrl}
                          alt=""
                          width={200}
                          height={150}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Tags */}
            <nav className="tags">
              <h1>Tags ({tags.length})</h1>
              {tags.length > 0 ? (
                <ul className="compact-tags">
                  {tags.map((tag) => {
                    const name = tag.names?.[0];
                    if (!name) return null;
                    return (
                      <li key={name}>
                        <a
                          href={`/tag/${encodeURIComponent(name)}`}
                          className="tag"
                        >
                          <i className="fa fa-tag"></i>
                        </a>
                        <a
                          href={`/posts?query=${encodeURIComponent(name)}`}
                          className="tag"
                        >
                          {name}
                        </a>{" "}
                        <span
                          className="tag-usages"
                          data-pseudo-content={tag.usages}
                        ></span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No tags yet!</p>
              )}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="content">
        <div className="post-container">
          <PostContent post={post} />
        </div>

        {post.description ? (
          <div className="description-container">
            <details open>
              <summary>Description</summary>
              <div dangerouslySetInnerHTML={{ __html: post.description }} />
            </details>
          </div>
        ) : null}

        <div className="after-mobile-controls">
          {/* Comments section — placeholder for future interactivity */}
          <div className="comments-container"></div>
        </div>
      </div>
    </div>
  );
}

function PostContent({ post }: { post: any }) {
  const src = post.contentUrl;
  const type = post.type || "";
  const mimeType = post.mimeType || "";

  // Normalize type for rendering
  if (type.startsWith("image/") || type === "image" || type === "animation") {
    return (
      <div className={`post-content post-type-${type}`}>
        <img
          className="resize-listener"
          alt=""
          src={src}
          draggable="false"
        />
        <div className="post-overlay resize-listener"></div>
      </div>
    );
  }

  if (type === "flash" || type === "application/x-shockwave-flash") {
    return (
      <div
        className="post-content post-type-flash"
        style={{ backgroundImage: `url(${post.thumbnailUrl})` }}
      >
        <object
          className="resize-listener"
          width={post.canvasWidth}
          height={post.canvasHeight}
          data={src}
        >
          <param name="wmode" value="transparent" />
          <param name="movie" value={src} />
          <div className="messages">
            <div className="message-wrapper">
              <div className="message error">
                Your browser does not support Flash.
              </div>
            </div>
          </div>
        </object>
        <div className="post-overlay resize-listener"></div>
      </div>
    );
  }

  if (type === "video" || type.startsWith("video/")) {
    return (
      <div className={`post-content post-type-video`}>
        <video
          className="resize-listener"
          controls
          loop={(post.flags ?? []).includes("loop")}
          playsInline
          autoPlay={false}
        >
          <source type={post.mimeType || "video/mp4"} src={src} />
          Your browser doesn&apos;t support HTML5 videos.
        </video>
        <div className="post-overlay resize-listener"></div>
      </div>
    );
  }

  return (
    <div className={`post-content post-type-${type}`}>
      <a href={src} download>
        Download
      </a>
      <div className="post-overlay resize-listener"></div>
    </div>
  );
}

// Helpers
const mimeLabels: Record<string, string> = {
  "image/gif": "GIF",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WEBP",
  "image/bmp": "BMP",
  "image/avif": "AVIF",
  "image/heif": "HEIF",
  "image/heic": "HEIC",
  "video/webm": "WEBM",
  "video/mp4": "MPEG-4",
  "video/quicktime": "MOV",
  "application/x-shockwave-flash": "SWF",
  "image": "JPEG",
  "animation": "GIF",
  "video": "MP4",
  "flash": "SWF",
};

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

function capFirst(s: string): string {
  if (!s) return "";
  return s[0].toUpperCase() + s.slice(1);
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
