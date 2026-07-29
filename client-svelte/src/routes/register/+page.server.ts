import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from '$lib/server/flash';

export const load: PageServerLoad = ({ locals }) => {
    const canSelf = locals.can('user_create_self');
    const canAny = locals.can('user_create_any');
    if (!canSelf && !canAny) error(403, 'Registration is closed.');
    return {
        userNamePattern: locals.info.config.userNameRegex,
        passwordPattern: locals.info.config.passwordRegex,
        asAdmin: !!locals.user
    };
};

export const actions: Actions = {
    default: async ({ request, locals, cookies }) => {
        const form = await request.formData();
        const name = String(form.get('name') ?? '').trim();
        const password = String(form.get('password') ?? '');
        const email = String(form.get('email') ?? '').trim() || null;

        try {
            await locals.api.post('/users', { name, password, email });
        } catch (e) {
            return fail(400, { message: (e as Error).message, name, email });
        }

        if (locals.user) {
            setFlash(cookies, { type: 'success', message: 'ユーザーを追加しました。' });
            redirect(303, '/users');
        }
        setFlash(cookies, { type: 'success', message: 'アカウントを作成しました。ログインしてください。' });
        redirect(303, '/login');
    }
};