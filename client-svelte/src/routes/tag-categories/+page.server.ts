import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { invalidate } from '$lib/server/cache';
import { saveCategories } from '$lib/server/categories';
import { setFlash } from '$lib/server/flash';
import type { CategoryPayload } from '$lib/categories';
import type { Category } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
    const { api, can } = locals;
    if (!can('tag_category_list')) error(403, "閲覧権限がありません:  tag categories.");

    const { results } = await api.get<{ results: Category[] }>('/tag-categories');
    const rows = results
        .map((c) => ({
            origName: c.name,
            name: c.name,
            color: c.color,
            order: c.order ?? 1,
            usages: c.usages,
            version: c.version,
            isDefault: c.default
        }))
        .sort((a, b) =>
            a.isDefault !== b.isDefault
                ? a.isDefault
                    ? -1
                    : 1
                : (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)
        );

    return {
        rows,
        can: {
            name: can('tag_category_edit_name'),
            color: can('tag_category_edit_color'),
            order: can('tag_category_edit_order'),
            create: can('tag_category_create'),
            delete: can('tag_category_delete'),
            setDefault: can('tag_category_set_default')
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
            await saveCategories(locals.api, 'tag', payload, true);
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        invalidate('tag-categories');
        setFlash(cookies, { type: 'success', message: '変更を保存しました。' });
        redirect(303, '/tag-categories');
    }
};