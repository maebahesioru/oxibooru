import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from '$lib/server/flash';

export const load: PageServerLoad = async ({ parent }) => {
    const { can } = await parent();
    if (!can.delete) error(403, "削除権限がありません。");
    return {};
};

export const actions: Actions = {
    default: async ({ request, params, locals, cookies }) => {
        const form = await request.formData();
        const isSelf = locals.user?.name.toLowerCase() === params.name.toLowerCase();

        try {
            await locals.api.del(`/user/${encodeURIComponent(params.name)}`, {
                version: Number(form.get('version'))
            });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }

        if (isSelf) cookies.delete('auth', { path: '/' });
        setFlash(cookies, { type: 'success', message: 'アカウントを削除しました。' });
        redirect(303, isSelf ? '/' : locals.can('user_list') ? '/users' : '/');
    }
};