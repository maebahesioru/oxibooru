"use strict";

/**
 * SEO module: dynamically updates meta tags based on current page.
 * Called after each route change to ensure proper SEO for crawlers
 * that execute JavaScript (Google, etc.).
 */

const api = require("../api.js");

const SITE_NAME = "hikabooru";
const BASE_URL = window.location.origin;
const DEFAULT_DESC = "ヒカマニ関連コンテンツの投稿・共有サイト";
const OG_IMAGE = BASE_URL + "/img/apple-touch-icon.png";

function setMeta(selector, attr, value) {
    let el;
    if (selector.indexOf("property=") === 0) {
        const prop = selector.match(/property="([^"]+)"/)[1];
        el = document.querySelector(`meta[property="${prop}"]`);
        if (!el) {
            el = document.createElement("meta");
            el.setAttribute("property", prop);
            document.head.appendChild(el);
        }
    } else if (selector.indexOf("name=") === 0) {
        const name = selector.match(/name="([^"]+)"/)[1];
        el = document.querySelector(`meta[name="${name}"]`);
        if (!el) {
            el = document.createElement("meta");
            el.setAttribute("name", name);
            document.head.appendChild(el);
        }
    }
    if (el) el.setAttribute(attr, value);
}

function setAll(title, desc, url, type, image) {
    document.title = title;
    setMeta('name="description"', "content", desc);
    setMeta('property="og:title"', "content", title);
    setMeta('property="og:description"', "content", desc);
    setMeta('property="og:url"', "content", url);
    setMeta('property="og:type"', "content", type || "website");
    setMeta('property="og:image"', "content", image || OG_IMAGE);
    setMeta('name="twitter:title"', "content", title);
    setMeta('name="twitter:description"', "content", desc);
}

function update() {
    const path = window.location.pathname;
    const siteName = api.getName ? api.getName() : SITE_NAME;
    let title = siteName;
    let desc = DEFAULT_DESC;
    let url = BASE_URL + path;
    let type = "website";
    let image = OG_IMAGE;

    // Home page
    if (path === "/" || path === "") {
        title = siteName;
        desc = DEFAULT_DESC;
    }

    // Post pages: /post/:id, /post/:id/edit
    const postMatch = path.match(/^\/post\/(\d+)/);
    if (postMatch) {
        const postId = postMatch[1];
        type = "article";
        title = "Post #" + postId + " | " + siteName;

        // Try to extract tags from the DOM
        const tagNav = document.querySelector("nav.tags");
        const tagLinks = tagNav ? tagNav.querySelectorAll("a") : [];
        const tags = [];
        const seen = {};
        tagLinks.forEach((a) => {
            // Skip icon-only links (fa-tag)
            if (a.querySelector("i.fa-tag")) return;
            const t = a.textContent.trim();
            if (t && t.length > 0 && t !== "+" && !seen[t]) {
                seen[t] = true;
                tags.push(t);
            }
        });

        if (tags.length > 0) {
            const tagStr = tags.slice(0, 20).join(", ");
            title = tags.slice(0, 5).join(" ") + " | " + title;
            desc = "Tags: " + tagStr;
        }

        // Try to find post image for OGP
        const postImg = document.querySelector(
            ".post-content img, " +
            ".post-content video[poster], " +
            "#content-holder img[alt='thumbnail']"
        );
        if (postImg) {
            const src = postImg.getAttribute("src") ||
                       postImg.getAttribute("poster") ||
                       postImg.getAttribute("data-src");
            if (src) {
                image = src.startsWith("http") ? src : BASE_URL + (src.startsWith("/") ? src : "/" + src);
            }
        }

        // Get source URL for canonical
        const sourceLink = document.querySelector(".source a");
        if (sourceLink && sourceLink.href.startsWith("http")) {
            url = sourceLink.href;
        }
    }

    // Tag pages: /tag/:name
    const tagMatch = path.match(/^\/tag\/([^/]+)/);
    if (tagMatch) {
        const tagName = decodeURIComponent(tagMatch[1]);
        title = tagName + " | " + siteName;
        desc = "Tag: " + tagName + " - " + siteName + "でタグ付けされた投稿を閲覧";
    }

    // Pool pages: /pool/:id, /pools
    const poolMatch = path.match(/^\/pool\/([^/]+)/);
    if (poolMatch) {
        const poolName = decodeURIComponent(poolMatch[1]);
        title = poolName + " | " + siteName;
        desc = "Pool: " + poolName;
    }

    // User pages: /user/:name
    const userMatch = path.match(/^\/user\/([^/]+)/);
    if (userMatch) {
        const userName = decodeURIComponent(userMatch[1]);
        title = userName + " | " + siteName;
        desc = "User: " + userName;
    }

    // Help page
    if (path === "/help") {
        title = "Help | " + siteName;
        desc = siteName + " help and documentation";
    }

    // Comments page
    if (path === "/comments") {
        title = "Comments | " + siteName;
        desc = "Latest comments on " + siteName;
    }

    // Tags listing
    if (path === "/tags") {
        title = "Tags | " + siteName;
        desc = "Browse all tags on " + siteName;
    }

    // Pools listing
    if (path === "/pools") {
        title = "Pools | " + siteName;
        desc = "Browse all pools on " + siteName;
    }

    // Users listing
    if (path === "/users") {
        title = "Users | " + siteName;
        desc = "Browse all users on " + siteName;
    }

    setAll(title, desc, url, type, image);
}

module.exports = { update };
