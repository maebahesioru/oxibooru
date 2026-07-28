import { getConfig } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let config;
  try {
    config = await getConfig();
  } catch {
    config = {
      name: "hikabooru",
      postCount: 0,
      diskUsage: 0,
      version: "",
      buildDate: "",
      isDevelopmentMode: false,
    };
  }

  return (
    <div className="content-wrapper transparent-container" id="home">
      <div className="messages"></div>
      <header>
        <h1>{config.name}</h1>
      </header>
      <form className="horizontal" action="/posts" method="GET">
        <input
          type="text"
          name="search-text"
          id="search-text"
          placeholder="enter some tags"
        />
        <input type="submit" value="Search" />
        <span className="sep">or</span>
        <a href="/posts">browse all posts</a>
      </form>
      <div className="post-info-container"></div>
      <footer className="footer-container">
        <ul>
          <li>{config.postCount} posts</li>
          <span className="sep"> </span>
          <li>{formatBytes(config.diskUsage)}</li>
          <span className="sep"> </span>
          <li>
            Build{" "}
            <a
              className="version"
              href="https://github.com/maebahesioru/oxibooru/commits/master"
            >
              {config.version || "custom"}
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
