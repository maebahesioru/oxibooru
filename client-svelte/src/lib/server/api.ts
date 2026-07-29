const BASE = (process.env.BACKEND_URL ?? 'http://localhost:6666').replace(/\/+$/, '');

export class ApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
        readonly name_: string | null = null
    ) {
        super(message);
    }
}

export type Auth = { token: { user: string; token: string } } | { basic: { user: string; password: string } } | null;

function authHeader(auth: Auth): Record<string, string> {
    if (!auth) return {};
    if ('token' in auth) {
        const raw = `${auth.token.user}:${auth.token.token}`;
        return { Authorization: `Token ${Buffer.from(raw).toString('base64')}` };
    }
    const raw = `${auth.basic.user}:${auth.basic.password}`;
    return { Authorization: `Basic ${Buffer.from(raw).toString('base64')}` };
}

export interface Query {
    [key: string]: string | number | boolean | string[] | undefined | null;
}

function qs(query?: Query): string {
    if (!query) return '';
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null || value === '') continue;
        params.set(key, Array.isArray(value) ? value.join(',') : String(value));
    }
    const out = params.toString();
    return out ? `?${out}` : '';
}

// Custom fetch wrapper using node:http to avoid undici "bad port" bug
async function nodeFetch(url: string, options: { method: string; headers: Record<string, string>; body?: string }): Promise<Response> {
    const u = new URL(url);
    const http = u.protocol === 'https:' ? await import('node:https') : await import('node:http');
    
    return new Promise((resolve, reject) => {
        const req = http.request(
            u,
            {
                method: options.method,
                headers: options.headers,
            },
            (res) => {
                let data = '';
                res.on('data', (chunk: string) => (data += chunk));
                res.on('end', () => {
                    resolve(new Response(data, {
                        status: res.statusCode ?? 500,
                        statusText: res.statusMessage ?? '',
                        headers: res.headers as Record<string, string>,
                    }));
                });
            }
        );
        req.on('error', reject);
        if (options.body) req.write(options.body);
        req.end();
    });
}

export class Api {
    constructor(
        private readonly _fetchFn: typeof fetch,
        readonly auth: Auth
    ) {}

    private async request<T>(
        method: string,
        path: string,
        body?: unknown,
        files?: Record<string, File | string | null>
    ): Promise<T> {
        const url = `${BASE}${path}`;
        const headers: Record<string, string> = {
            Accept: 'application/json',
            ...authHeader(this.auth)
        };

        let payload: string | undefined;
        const fileEntries = Object.entries(files ?? {}).filter(([, v]) => v !== null && v !== undefined);

        if (fileEntries.length) {
            // For file uploads, use fetch
            const form = new FormData();
            const meta: Record<string, unknown> = { ...(body as object) };
            for (const [key, value] of fileEntries) {
                if (typeof value === 'string') meta[`${key}Url`] = value;
                else form.append(key, value as File);
            }
            form.append('metadata', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
            const res = await this._fetchFn(url, { method, headers, body: form });
            const text = await res.text();
            const json = text ? JSON.parse(text) : null;
            if (!res.ok) {
                throw new ApiError(json?.description ?? `HTTP ${res.status}`, res.status, json?.name ?? null);
            }
            return json as T;
        }

        if (body !== undefined) {
            headers['Content-Type'] = 'application/json';
            payload = JSON.stringify(body);
        }

        // Use native http for non-file requests to avoid undici issues
        const res = await nodeFetch(url, { method, headers, body: payload });
        const text = await res.text();
        const json = text ? JSON.parse(text) : null;

        if (!res.ok) {
            throw new ApiError(json?.description ?? `HTTP ${res.status}`, res.status, json?.name ?? null);
        }
        return json as T;
    }

    get<T>(path: string, query?: Query) {
        return this.request<T>('GET', `${path}${qs(query)}`);
    }
    post<T>(path: string, body?: unknown, files?: Record<string, File | string | null>) {
        return this.request<T>('POST', path, body ?? {}, files);
    }
    put<T>(path: string, body?: unknown, files?: Record<string, File | string | null>) {
        return this.request<T>('PUT', path, body ?? {}, files);
    }
    del<T>(path: string, body?: unknown) {
        return this.request<T>('DELETE', path, body ?? {});
    }
}

export function createApi(fetchFn: typeof fetch, auth: Auth) {
    return new Api(fetchFn, auth);
}
