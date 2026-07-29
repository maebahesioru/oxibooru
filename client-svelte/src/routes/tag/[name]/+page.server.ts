import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { cached, invalidate } from '$lib/server/cache';
import { setFlash } from '$lib/server/flash';
import { renderMarkdown } from '$lib/markdown';
import { splitWhitespace } from '$lib/format';
import type { Category, Tag } from '$lib/types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const { api, can } = locals;
    if (!can('tag_view')) error(403, "閲覧権限がありません:  tags.");

    const tag = await api.get<Tag>(`/tag/${encodeURIComponent(params.name)}`);
    const categories = await cached('tag-categories', 60_000, () =>
        api.get<{ results: Category[] }>('/tag-categories').then((r) => r.results)
    );

    return {
        tag,
        categories: categories.map((c) => c.name),
        descriptionHtml: renderMarkdown(tag.description),
        can: {
            edit: can('tag_edit'),
            names: can('tag_edit_name'),
            category: can('tag_edit_category'),
            implications: can('tag_edit_implication'),
            suggestions: can('tag_edit_suggestion'),
            description: can('tag_edit_description'),
            merge: can('tag_merge'),
            delete: can('tag_delete')
        }
    };
};

export const actions: Actions = {
    save: async ({ request, params, locals, cookies }) => {
        const form = await request.formData();
        const body: Record<string, unknown> = { version: Number(form.get('version')) };
        if (form.has('names')) body.names = splitWhitespace(String(form.get('names')));
        if (form.has('category')) body.category = String(form.get('category'));
        if (form.has('description')) body.description = String(form.get('description'));
        if (form.has('implications')) body.implications = splitWhitespace(String(form.get('implications')));
        if (form.has('suggestions')) body.suggestions = splitWhitespace(String(form.get('suggestions')));

        let saved: Tag;
        try {
            saved = await locals.api.put<Tag>(`/tag/${encodeURIComponent(params.name)}`, body);
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        invalidate('tag-categories');
        setFlash(cookies, { type: 'success', message: 'タグを保存しました。' });
        redirect(303, `/tag/${encodeURIComponent(saved.names[0])}`);
    },

    merge: async ({ request, params, locals, cookies }) => {
        const form = await request.formData();
        const target = String(form.get('target') ?? '');
        try {
            const remove = await locals.api.get<Tag>(`/tag/${encodeURIComponent(params.name)}`);
            const mergeTo = await locals.api.get<Tag>(`/tag/${encodeURIComponent(target)}`);
            await locals.api.post('/tag-merge', {
                remove: remove.names[0],
                removeVersion: remove.version,
                mergeTo: mergeTo.names[0],
                mergeToVersion: mergeTo.version
            });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        setFlash(cookies, { type: 'success', message: 'タグを統合しました。' });
        redirect(303, `/tag/${encodeURIComponent(target)}`);
    },

    delete: async ({ request, params, locals, cookies }) => {
        const form = await request.formData();
        try {
            await locals.api.del(`/tag/${encodeURIComponent(params.name)}`, {
                version: Number(form.get('version'))
            });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        setFlash(cookies, { type: 'success', message: 'タグを削除しました。' });
        redirect(303, '/tags');
    }
};