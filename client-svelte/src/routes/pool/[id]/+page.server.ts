import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { cached, invalidate } from '$lib/server/cache';
import { setFlash } from '$lib/server/flash';
import { renderMarkdown } from '$lib/markdown';
import { splitWhitespace } from '$lib/format';
import type { Category, Pool } from '$lib/types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const { api, can } = locals;
    if (!can('pool_view')) error(403, "閲覧権限がありません:  pools.");

    const pool = await api.get<Pool>(`/pool/${params.id}`);
    const categories = await cached('pool-categories', 60_000, () =>
        api.get<{ results: Category[] }>('/pool-categories').then((r) => r.results)
    );

    return {
        pool,
        categories: categories.map((c) => c.name),
        descriptionHtml: renderMarkdown(pool.description),
        can: {
            edit: can('pool_edit'),
            names: can('pool_edit_name'),
            category: can('pool_edit_category'),
            description: can('pool_edit_description'),
            posts: can('pool_edit_post'),
            merge: can('pool_merge'),
            delete: can('pool_delete')
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
        if (form.has('posts')) body.posts = splitWhitespace(String(form.get('posts'))).map(Number);

        try {
            await locals.api.put(`/pool/${params.id}`, body);
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        invalidate('pool-categories');
        setFlash(cookies, { type: 'success', message: 'プールを保存しました。' });
        redirect(303, `/pool/${params.id}`);
    },

    merge: async ({ request, params, locals, cookies }) => {
        const form = await request.formData();
        const targetId = Number(form.get('target'));
        try {
            const remove = await locals.api.get<Pool>(`/pool/${params.id}`);
            const mergeTo = await locals.api.get<Pool>(`/pool/${targetId}`);
            await locals.api.post('/pool-merge', {
                remove: remove.id,
                removeVersion: remove.version,
                mergeTo: mergeTo.id,
                mergeToVersion: mergeTo.version
            });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        setFlash(cookies, { type: 'success', message: 'プールを統合しました。' });
        redirect(303, `/pool/${targetId}`);
    },

    delete: async ({ request, params, locals, cookies }) => {
        const form = await request.formData();
        try {
            await locals.api.del(`/pool/${params.id}`, { version: Number(form.get('version')) });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        setFlash(cookies, { type: 'success', message: 'プールを削除しました。' });
        redirect(303, '/pools');
    }
};