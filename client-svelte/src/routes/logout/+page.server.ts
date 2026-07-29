import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { setFlash } from '$lib/server/flash';

export const actions: Actions = {
    default: async ({ cookies, locals }) => {
        const raw = cookies.get('auth');
        if (raw) {
            try {
                const { user, token } = JSON.parse(raw);
                await locals.api.del(`/user-token/${encodeURIComponent(user)}/${token}`);
            } catch {
                /* トークンが既に無効でも続行 */
            }
        }
        cookies.delete('auth', { path: '/' });
        setFlash(cookies, { type: 'success', message: 'ログアウトしました。' });
        redirect(303, '/');
    }
};