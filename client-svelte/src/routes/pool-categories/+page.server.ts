import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { invalidate } from '$lib/server/cache';
import { saveCategories } from '$lib/server/categories';
import { setFlash } from '$lib/server/flash';
import type { CategoryPayload } from '$lib/categories';
import type { Category } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
    const { api, can } = locals;
    if (!can('pool_category_list')) error(403, "You don't have privileges to view pool categories.");

    const { results } = await api.get<{ results: Category[] }>('/pool-categories');
    const rows = results
        .map((c) => ({
            origName: c.name,
            name: c.name,
            color: c.color,
            usages: c.usages,
            version: c.version,
            isDefault: c.default
        }))
        .sort((a, b) => (a.isDefault !== b.isDefault ? (a.isDefault ? -1 : 1) : a.name.localeCompare(b.name)));

    return {
        rows,
        can: {
            name: can('pool_category_edit_name'),
            color: can('pool_category_edit_color'),
            order: false,
            create: can('pool_category_create'),
            delete: can('pool_category_delete'),
            setDefault: can('pool_category_set_default')
        }
    };
};

export const actions: Actions = {
    default: async ({ request, locals, cookies }) => {
        const form = await request.formData();
        let payload: CategoryPayload;
        try {
            payload = JSON.parse(String(form.get('payload') ?? '{}'));
        } catch {
            return fail(400, { message: 'ペイロードが不正です。' });
        }
        try {
            await saveCategories(locals.api, 'pool', payload, false);
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        invalidate('pool-categories');
        setFlash(cookies, { type: 'success', message: '変更を保存しました。' });
        redirect(303, '/pool-categories');
    }
};