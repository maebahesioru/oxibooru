import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from '$lib/server/flash';
import type { User } from '$lib/types';

export const load: PageServerLoad = async ({ parent }) => {
    const { can } = await parent();
    if (!can.editAnything) error(403, "編集権限がありません。");
    return {};
};

export const actions: Actions = {
    default: async ({ request, params, locals, cookies }) => {
        const form = await request.formData();
        const body: Record<string, unknown> = { version: Number(form.get('version')) };

        const pick = (key: string) => {
            const value = form.get(key);
            return typeof value === 'string' && value.length ? value : null;
        };

        const newName = pick('name');
        const password = pick('password');
        const rank = pick('rank');
        const avatarStyle = pick('avatarStyle');
        if (newName) body.name = newName;
        if (password) body.password = password;
        if (rank) body.rank = rank;
        if (form.has('email')) body.email = String(form.get('email')) || null;
        if (avatarStyle) body.avatarStyle = avatarStyle;

        const files: Record<string, File | null> = {};
        const avatar = form.get('avatar');
        if (avatar instanceof File && avatar.size) {
            files.avatar = avatar;
            body.avatarStyle = 'manual';
        }

        let saved: User;
        try {
            saved = await locals.api.put<User>(
                `/user/${encodeURIComponent(params.name)}`,
                body,
                files
            );
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }

        // 自分自身の改名／パスワード変更時はトークンを再取得できないため再ログインを促す
        const isSelf = locals.user?.name.toLowerCase() === params.name.toLowerCase();
        if (isSelf && (newName || password)) {
            cookies.delete('auth', { path: '/' });
            setFlash(cookies, {
                type: 'info',
                message: '認証情報が変更されました。再度ログインしてください。'
            });
            redirect(303, '/login');
        }

        setFlash(cookies, { type: 'success', message: '設定を保存しました。' });
        redirect(303, `/user/${encodeURIComponent(saved.name)}/edit`);
    }
};