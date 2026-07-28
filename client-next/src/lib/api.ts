// Oxibooru API client for Next.js
// Server-side: uses http module (native fetch broken on Alpine)
// Client-side: uses browser fetch through Next.js API proxy

const API_BASE = process.env.BACKEND_URL || "http://server:6666";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hikabooru.hikamer.f5.si";
const isServer = typeof window === "undefined";

// Types (same as before)
export interface Post {
  id: number;
  tags: Tag[];
  safety: string;
  source: string;
  thumbnailUrl: string;
  contentUrl: string;
  type: string;
  checksum: string;
  fileSize: number;
  canvasWidth: number;
  canvasHeight: number;
  creationTime: string;
  lastEditTime: string;
  description: string;
  favorites: number;
  score: number;
  ownFavorite: boolean;
  ownScore: number;
  flags: string[];
  relations: Post[];
  notes: Note[];
  user: MicroUser;
}

export interface Tag {
  names: string[];
  category: string;
  description: string;
  usages: number;
  postCount?: number;
  implications?: Tag[];
  suggestions?: Tag[];
}

export interface MicroUser {
  name: string;
}

export interface Note {
  polygon: number[][];
  text: string;
}

export interface Pool {
  id: number;
  names: string[];
  category: string;
  description: string;
  postCount: number;
}

export interface User {
  name: string;
  email: string;
  rank: string;
  avatarUrl: string;
  creationTime: string;
  lastLoginTime: string;
}

export interface Config {
  name: string;
  postCount: number;
  diskUsage: number;
  version: string;
  buildDate: string;
  isDevelopmentMode: boolean;
}

async function serverFetch<T>(url: string): Promise<T> {
  const http = await import("node:http");
  const https = await import("node:https");
  const isHttps = url.startsWith("https://");
  const mod = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const req = mod.get(url, { headers: { Accept: "application/json" } }, (res) => {
      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`JSON parse error: ${(e as Error).message}`));
          }
        } else {
          reject(new Error(`API error: ${res.statusCode} for ${url}`));
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

async function fetchApi<T>(path: string): Promise<T> {
  const url = isServer
    ? `${API_BASE}/${path}`
    : `/api/${path}`;

  if (isServer) {
    return serverFetch<T>(url);
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} for ${path}`);
  return res.json();
}

export async function getConfig(): Promise<Config> {
  const info = await fetchApi<any>("info");
  return {
    name: info.name || info.config?.name || "hikabooru",
    postCount: info.postCount || 0,
    diskUsage: info.diskUsage || 0,
    version: info.config?.version || "",
    buildDate: "",
    isDevelopmentMode: false,
  };
}

export async function getPost(id: number): Promise<Post> {
  return fetchApi<Post>(`post/${id}`);
}

export async function getPosts(
  query = "",
  offset = 0,
  limit = 50
): Promise<{ results: Post[]; total: number }> {
  const params = new URLSearchParams({
    query,
    offset: String(offset),
    limit: String(limit),
  });
  return fetchApi(`posts?${params}`);
}

export async function getTag(name: string): Promise<Tag> {
  return fetchApi<Tag>(`tag/${encodeURIComponent(name)}`);
}

export async function getPool(id: number): Promise<Pool> {
  return fetchApi<Pool>(`pool/${id}`);
}

export async function getUser(name: string): Promise<User> {
  return fetchApi<User>(`user/${encodeURIComponent(name)}`);
}

export async function getPostAround(
  id: number,
  query = ""
): Promise<{ prev: Post | null; next: Post | null }> {
  try {
    const qs = query ? `?query=${encodeURIComponent(query)}` : "";
    const data = await fetchApi<any>(`post/${id}/around${qs}`);
    return { prev: data.prev || null, next: data.next || null };
  } catch {
    return { prev: null, next: null };
  }
}
