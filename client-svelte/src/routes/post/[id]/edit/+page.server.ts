import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from '$lib/server/flash';
import { splitWhitespace } from '$lib/format';
import type { Category, Post } from '$lib/types';
import { cached } from '$lib/server/cache';

export const load: PageServerLoad = async ({ params, locals, url }) => {
    const { api, can } = locals;
    if (!can('post_edit')) error(403, "編集権限がありません:  posts.");

    const post = await api.get<Post>(`/post/${params.id}`);
    const tagCategories = await cached('tag-categories', 60_000, () =>
        api.get<{ results: Category[] }>('/tag-categories').then((r) => r.results)
    );

    return {
        post,
        query: url.searchParams.get('query') ?? '',
        tagCategories,
        can: {
            safety: can('post_edit_safety'),
            source: can('post_edit_source'),
            tags: can('post_edit_tag'),
            relations: can('post_edit_relation'),
            notes: can('post_edit_note') && post.type !== 'video' && post.type !== 'flash',
            flags: can('post_edit_flag'),
            content: can('post_edit_content'),
            thumbnail: can('post_edit_thumbnail'),
            description: can('post_edit_description'),
            pools: can('pool_edit_post'),
            feature: can('post_feature'),
            merge: can('post_merge'),
            delete: can('post_delete')
        }
    };
};

export const actions: Actions = {
    save: async ({ request, params, locals, cookies }) => {
        const form = await request.formData();
        const body: Record<string, unknown> = { version: Number(form.get('version')) };

        const str = (key: string) => (form.has(key) ? String(form.get(key)) : undefined);

        if (form.has('safety')) body.safety = str('safety');
        if (form.has('source')) body.source = str('source');
        if (form.has('description')) body.description = str('description');
        if (form.has('tags')) body.tags = splitWhitespace(str('tags') ?? '');
        if (form.has('relations'))
            body.relations = splitWhitespace(str('relations') ?? '').map((x) => Number(x));
        if (form.has('notes')) {
            try {
                body.notes = JSON.parse(str('notes') || '[]');
            } catch {
                return fail(400, { message: 'ノートの JSON が不正です。' });
            }
        }
        if (form.has('flagLoop') || form.has('flagSound')) {
            const flags: string[] = [];
            if (form.get('flagLoop')) flags.push('loop');
            if (form.get('flagSound')) flags.push('sound');
            body.flags = flags;
        }

        const files: Record<string, File | string | null> = {};
        const content = form.get('content');
        const contentUrl = str('contentUrl');
        if (content instanceof File && content.size) files.content = content;
        else if (contentUrl) files.content = contentUrl;
        const thumbnail = form.get('thumbnail');
        if (thumbnail instanceof File && thumbnail.size) files.thumbnail = thumbnail;

        try {
            await locals.api.put(`/post/${params.id}`, body, files);
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }

        setFlash(cookies, { type: 'success', message: '投稿を保存しました。' });
        redirect(303, `/post/${params.id}`);
    },

    delete: async ({ request, params, locals, cookies }) => {
        const form = await request.formData();
        try {
            await locals.api.del(`/post/${params.id}`, { version: Number(form.get('version')) });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        setFlash(cookies, { type: 'success', message: '投稿を削除しました。' });
        redirect(303, '/posts');
    },

    feature: async ({ params, locals, cookies }) => {
        await locals.api.post('/featured-post', { id: Number(params.id) });
        setFlash(cookies, { type: 'success', message: 'トップに掲載しました。' });
        redirect(303, `/post/${params.id}`);
    }
};