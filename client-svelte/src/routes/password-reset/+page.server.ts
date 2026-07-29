import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = ({ locals }) => ({
    canSendMails: locals.info.config.canSendMails,
    contactEmail: locals.info.config.contactEmail
});

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const form = await request.formData();
        const target = String(form.get('userNameOrEmail') ?? '').trim();
        if (!target) return fail(400, { message: 'ユーザー名または E-mail を入力してください。' });

        try {
            await locals.api.get(`/password-reset/${encodeURIComponent(target)}`);
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }

        return {
            success: true,
            message: 'E-mail を送信しました。メール内のリンクを開いて手続きを完了してください。'
        };
    }
};