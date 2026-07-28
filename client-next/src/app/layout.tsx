import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hikabooru",
  description: "ヒカマニ関連コンテンツの投稿・共有サイト",
  openGraph: {
    title: "hikabooru",
    description: "ヒカマニ関連コンテンツの投稿・共有サイト",
    type: "website",
    url: "https://hikabooru.hikamer.f5.si/",
    images: ["/img/apple-touch-icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "hikabooru",
    description: "ヒカマニ関連コンテンツの投稿・共有サイト",
    images: ["/img/apple-touch-icon.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="stylesheet" href="/vendor.css" />
        <link rel="stylesheet" href="/app.css" />
        <link rel="shortcut icon" type="image/png" href="/img/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
        <meta name="theme-color" content="#24aadd" />
      </head>
      <body>
        <TopNavigation />
        <div id="content-holder">{children}</div>
        <script src="https://unpkg.com/@ruffle-rs/ruffle" async />
      </body>
    </html>
  );
}

import Link from "next/link";

function TopNavigation() {
  const items = [
    { key: "home", title: "Home", url: "/", accessKey: "h" },
    { key: "posts", title: "Posts", url: "/posts", accessKey: "p" },
    { key: "comments", title: "Comments", url: "/comments", accessKey: "c" },
    { key: "tags", title: "Tags", url: "/tags", accessKey: "t" },
    { key: "pools", title: "Pools", url: "/pools", accessKey: "o" },
  ];

  const authItems = [
    { key: "register", title: "Register", url: "/register" },
    { key: "login", title: "Log in", url: "/login" },
    { key: "help", title: "Help", url: "/help" },
  ];

  return (
    <nav id="top-navigation" className="buttons">
      <ul>
        <button id="mobile-navigation-toggle">
          <span className="site-name">hikabooru</span>
          <span className="toggle-icon">
            <i className="fa fa-bars"></i>
          </span>
        </button>
        {items.map((item) => (
          <li key={item.key} data-name={item.key}>
            <Link href={item.url} accessKey={item.accessKey}>
              <span className="text">{item.title}</span>
            </Link>
          </li>
        ))}
        {authItems.map((item) => (
          <li key={item.key} data-name={item.key}>
            <Link href={item.url}>
              <span className="text">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
