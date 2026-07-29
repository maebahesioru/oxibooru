import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from '$lib/server/flash';

interface Token {
    token: string;
    note: string | null;
    enabled: boolean;
    expirationTime: string | null;
    creationTime: string;
    lastUsageTime: string | null;
    version: number;
}

export const load: PageServerLoad = async ({ params, locals, parent }) => {
    const { can } = await parent();
    if (!can.listTokens) error(403, "You don't have privileges to view user tokens.");

    const current = (() => {
        try {
            return JSON.parse(locals.api.auth && 'token' in locals.api.auth ? '""' : '""');
        } catch {
            return '';
        }
    })();

    const res = await locals.api
        .get<{ results: Token[] }>(`/user-tokens/${encodeURIComponent(params.name)}`)
        .catch(() => ({ results: [] as Token[] }));

    const activeToken =
        locals.api.auth && 'token' in locals.api.auth ? locals.api.auth.token.token : null;

    return {
        tokens: res.results.map((t) => ({ ...t, isCurrent: t.token === activeToken })),
        _current: current
    };
};

export const actions: Actions = {
    create: async ({ request, params, locals, cookies }) => {
        const form = await request.formData();
        const note = String(form.get('note') ?? '').trim();
        const expires = String(form.get('expirationTime') ?? '');

        try {
            const res = await locals.api.post<{ token: string }>(
                `/user-token/${encodeURIComponent(params.name)}`,
                {
                    enabled: true,
                    ...(note ? { note } : {}),
                    ...(expires ? { expirationTime: new Date(expires).toISOString() } : {})
                }
            );
            setFlash(cookies, { type: 'success', message: `Token ${res.token} を作成しました。` });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        redirect(303, `/user/${encodeURIComponent(params.name)}/list-tokens`);
    },

    updateNote: async ({ request, params, locals, cookies }) => {
        const form = await request.formData();
        try {
            await locals.api.put(
                `/user-token/${encodeURIComponent(params.name)}/${form.get('token')}`,
                { version: Number(form.get('version')), note: String(form.get('note') ?? '') }
            );
            setFlash(cookies, { type: 'success', message: 'トークンを更新しました。' });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        redirect(303, `/user/${encodeURIComponent(params.name)}/list-tokens`);
    },

    delete: async ({ request, params, locals, cookies }) => {
        const form = await request.formData();
        const token = String(form.get('token'));
        const isCurrent = form.get('isCurrent') === '1';

        try {
            await locals.api.del(`/user-token/${encodeURIComponent(params.name)}/${token}`, {
                version: Number(form.get('version'))
            });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }

        if (isCurrent) {
            cookies.delete('auth', { path: '/' });
            setFlash(cookies, { type: 'info', message: 'ログアウトしました。' });
            redirect(303, '/');
        }

        setFlash(cookies, { type: 'success', message: `Token ${token} を削除しました。` });
        redirect(303, `/user/${encodeURIComponent(params.name)}/list-tokens`);
    }
};