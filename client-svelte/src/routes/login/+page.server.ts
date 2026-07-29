import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createApi } from '$lib/server/api';
import { setFlash } from '$lib/server/flash';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) redirect(303, '/');
    return {
        userNamePattern: locals.info.config.userNameRegex,
        passwordPattern: locals.info.config.passwordRegex,
        canSendMails: locals.info.config.canSendMails
    };
};

export const actions: Actions = {
    default: async ({ request, cookies, fetch }) => {
        const form = await request.formData();
        const name = String(form.get('name') ?? '').trim();
        const password = String(form.get('password') ?? '');
        const remember = form.get('remember') === 'on';

        if (!name || !password) return fail(400, { message: 'ユーザー名とパスワードを入力してください。' });

        const api = createApi(fetch, { basic: { user: name, password } });

        try {
            const token = await api.post<{ token: string }>(`/user-token/${encodeURIComponent(name)}`, {
                enabled: true,
                note: 'Web login token',
                ...(remember
                    ? { expirationTime: new Date(Date.now() + 365 * 864e5).toISOString() }
                    : {})
            });

            cookies.set('auth', JSON.stringify({ user: name, token: token.token }), {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: remember ? 60 * 60 * 24 * 365 : undefined
            });
        } catch (e) {
            return fail(400, { message: (e as Error).message, name });
        }

        setFlash(cookies, { type: 'success', message: 'ログインしました。' });
        redirect(303, '/');
    }
};