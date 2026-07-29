import type { Handle, HandleServerError } from '@sveltejs/kit';
import { createApi } from '$lib/server/api';
import { cached } from '$lib/server/cache';
import { makeCan } from '$lib/privileges';
import { parseSettings, SETTINGS_COOKIE } from '$lib/settings';
import type { Info, User } from '$lib/types';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { Readable } from 'node:stream';

const DATA_DIR = resolve('/data');
const MIME: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.swf': 'application/x-shockwave-flash',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
};

function serveDataFile(event: Parameters<Handle>[0]['event']) {
    const rawPath = event.url.pathname;
    if (!rawPath.startsWith('/data/')) return null;

    const relative = rawPath.slice('/data/'.length);
    const safe = normalize(relative).replace(/^(\.\.(\/|\\|$))+/, '');
    const filePath = join(DATA_DIR, safe);

    if (!existsSync(filePath)) return new Response('見つかりません', { status: 404 });

    try {
        const stat = statSync(filePath);
        const ext = extname(filePath).toLowerCase();
        const contentType = MIME[ext] ?? 'application/octet-stream';

        // Support range requests for video
        const range = event.request.headers.get('range');
        if (range && stat.size > 0) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
            const chunkSize = end - start + 1;
            const stream = createReadStream(filePath, { start, end });
            return new Response(Readable.toWeb(stream) as ReadableStream, {
                status: 206,
                headers: {
                    'Content-Type': contentType,
                    'Content-Range': `bytes ${start}-${end}/${stat.size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': String(chunkSize),
                    'Cache-Control': 'public, max-age=2592000',
                },
            });
        }

        const stream = createReadStream(filePath);
        return new Response(Readable.toWeb(stream) as ReadableStream, {
            headers: {
                'Content-Type': contentType,
                'Content-Length': String(stat.size),
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=2592000',
            },
        });
    } catch {
        return new Response('内部エラー', { status: 500 });
    }
}

export const handle: Handle = async ({ event, resolve }) => {
    // Serve /data/ files directly from mounted volume
    const dataResponse = serveDataFile(event);
    if (dataResponse) return dataResponse;

    const settings = parseSettings(event.cookies.get(SETTINGS_COOKIE));

    let auth: { user: string; token: string } | null = null;
    try {
        const raw = event.cookies.get('auth');
        if (raw) auth = JSON.parse(raw);
    } catch {
        auth = null;
    }

    const api = createApi(event.fetch, auth ? { token: auth } : null);

    const info = await cached<Info>('info', 30_000, () => api.get<Info>('/info'));

    let user: User | null = null;
    if (auth) {
        try {
            user = await api.get<User>(`/user/${encodeURIComponent(auth.user)}`);
        } catch {
            event.cookies.delete('auth', { path: '/' });
        }
    }

    event.locals.api = api;
    event.locals.info = info;
    event.locals.user = user;
    event.locals.can = makeCan(info, user);
    event.locals.settings = settings;

    const theme = settings.theme === 'system' ? 'booru' : settings.theme;

    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%booru.theme%', theme)
    });
};

export const handleError: HandleServerError = ({ error, status }) => {
    if (status !== 404) console.error(error);
    return { message: error instanceof Error ? error.message : '予期せぬエラー' };
};
