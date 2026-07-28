import { getTag } from "@/lib/api";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const tagName = decodeURIComponent(name);
  try {
    const tag = await getTag(tagName);
    const desc = tag.description || `Browse posts tagged with ${tagName} on hikabooru`;
    return {
      title: `${tagName} | hikabooru`,
      description: desc,
      openGraph: {
        title: `${tagName} | hikabooru`,
        description: desc,
        url: `https://hikabooru.hikamer.f5.si/tag/${name}`,
      },
    };
  } catch {
    return { title: `${tagName} | hikabooru` };
  }
}

export default async function TagPage({ params }: Props) {
  const { name } = await params;
  const tagName = decodeURIComponent(name);
  let tag;
  try {
    tag = await getTag(tagName);
  } catch {
    return (
      <div className="content-wrapper">
        <h1>{tagName}</h1>
        <p>Tag not found.</p>
      </div>
    );
  }

  return (
    <div className="content-wrapper" id="tag">
      <h1>{tag.names?.[0] ?? tagName}</h1>
      <nav className="buttons">
        <ul>
          <li data-name="summary">
            <a href={`/tag/${encodeURIComponent(tag.names?.[0] ?? tagName)}`}>
              Summary
            </a>
          </li>
        </ul>
      </nav>
      <div className="tag-content-holder">
        {tag.description && (
          <div className="tag-description">
            <h2>Description</h2>
            <div
              dangerouslySetInnerHTML={{ __html: tag.description }}
            />
          </div>
        )}
        <p>
          <strong>Category:</strong> {tag.category || "none"}
        </p>
        <p>
          <strong>Usages:</strong> {tag.usages ?? 0} posts
        </p>
        <p>
          <a href={`/posts?query=${encodeURIComponent(tag.names?.[0] ?? tagName)}`}>
            Browse tagged posts →
          </a>
        </p>
      </div>
    </div>
  );
}
