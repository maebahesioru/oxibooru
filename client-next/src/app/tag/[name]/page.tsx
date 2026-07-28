import { getTag } from "@/lib/api";
import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const tagName = decodeURIComponent(name);
  try {
    const tag = await getTag(tagName);
    const desc =
      tag.description ||
      `Browse posts tagged with ${tagName} on hikabooru`;
    return {
      title: `${tagName} | hikabooru`,
      description: desc,
      openGraph: {
        title: `${tagName} | hikabooru`,
        description: desc,
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
      <div className="content-wrapper" id="tag">
        <h1>{tagName}</h1>
        <div className="messages">
          <div className="message-wrapper">
            <div className="message error">Tag not found.</div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = tag.names?.[0] ?? tagName;
  const aliases = tag.names?.slice(1) ?? [];
  const implications = tag.implications ?? [];
  const suggestions = tag.suggestions ?? [];
  const usages = tag.usages ?? 0;

  return (
    <div className="content-wrapper" id="tag">
      <h1>{displayName}</h1>

      <nav className="buttons">
        <ul>
          <li data-name="summary">
            <Link href={`/tag/${encodeURIComponent(displayName)}`}>Summary</Link>
          </li>
        </ul>
      </nav>

      <div className="tag-content-holder">
        <div className="content-wrapper tag-summary">
          <section className="details">
            <section>
              Category: <span className="tag">{tag.category || "none"}</span>
            </section>

            {aliases.length > 0 && (
              <section>
                Aliases:
                <br />
                <ul>
                  {aliases.map((alias, i) => (
                    <li key={i}>
                      <Link href={`/tag/${encodeURIComponent(alias)}`}>
                        {alias}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {implications.length > 0 && (
              <section>
                Implications:
                <br />
                <ul>
                  {implications.map((imp: any, i: number) => (
                    <li key={i}>
                      <Link
                        href={`/tag/${encodeURIComponent(imp.names?.[0] ?? "")}`}
                      >
                        {imp.names?.[0]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {suggestions.length > 0 && (
              <section>
                Suggestions:
                <br />
                <ul>
                  {suggestions.map((sug: any, i: number) => (
                    <li key={i}>
                      <Link
                        href={`/tag/${encodeURIComponent(sug.names?.[0] ?? "")}`}
                      >
                        {sug.names?.[0]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </section>

          <section className="description">
            <hr />
            <div
              dangerouslySetInnerHTML={{
                __html: tag.description || "This tag has no description yet.",
              }}
            />
            <p>
              This tag has{" "}
              <Link
                href={`/posts?query=${encodeURIComponent(displayName)}`}
              >
                {usages} usage(s)
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
