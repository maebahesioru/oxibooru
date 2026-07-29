import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { decorateQuery } from '$lib/settings';
import { setFlash } from '$lib/server/flash';
import { renderMarkdown } from '$lib/markdown';
import type { Post } from '$lib/types';

export const load: PageServerLoad = async ({ params, locals, url }) => {
    const { api, can, settings, info } = locals;
    if (!can('post_view')) error(403, "You don't have privileges to view posts.");

    const id = Number(params.id);
    const query = url.searchParams.get('query') ?? '';

    const [post, around] = await Promise.all([
        api.get<Post>(`/post/${id}`),
        api
            .get<{ prev: { id: number } | null; next: { id: number } | null }>(`/post/${id}/around`, {
                query: decorateQuery(query, settings, info.config.enableSafety),
                fields: 'id'
            })
            .catch(() => ({ prev: null, next: null }))
    ]);

    return {
        post,
        query,
        descriptionHtml: renderMarkdown(post.description),
        commentsHtml: post.comments.map((c) => ({ id: c.id, html: renderMarkdown(c.text) })),
        prevPostId: around.prev?.id ?? null,
        nextPostId: around.next?.id ?? null,
        can: {
            edit: can('post_edit'),
            delete: can('post_delete'),
            feature: can('post_feature'),
            merge: can('post_merge'),
            score: can('post_score'),
            favorite: can('post_favorite'),
            listComments: can('comment_list'),
            createComments: can('comment_create'),
            scoreComments: can('comment_score'),
            viewTags: can('tag_view'),
            listPosts: can('post_list')
        }
    };
};

export const actions: Actions = {
    score: async ({ request, params, locals }) => {
        const form = await request.formData();
        try {
            await locals.api.put(`/post/${params.id}/score`, { score: Number(form.get('score')) });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        return { success: true };
    },

    favorite: async ({ request, params, locals }) => {
        const form = await request.formData();
        const on = form.get('on') === '1';
        try {
            if (on) await locals.api.post(`/post/${params.id}/favorite`);
            else await locals.api.del(`/post/${params.id}/favorite`);
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        return { success: true };
    },

    addComment: async ({ request, params, locals }) => {
        const form = await request.formData();
        const text = String(form.get('text') ?? '').trim();
        if (!text) return fail(400, { message: 'コメントが空です。' });
        try {
            await locals.api.post('/comments', { postId: Number(params.id), text });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        return { success: true };
    },

    editComment: async ({ request, locals }) => {
        const form = await request.formData();
        try {
            await locals.api.put(`/comment/${form.get('id')}`, {
                version: Number(form.get('version')),
                text: String(form.get('text') ?? '')
            });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        return { success: true };
    },

    scoreComment: async ({ request, locals }) => {
        const form = await request.formData();
        try {
            await locals.api.put(`/comment/${form.get('id')}/score`, { score: Number(form.get('score')) });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        return { success: true };
    },

    deleteComment: async ({ request, locals }) => {
        const form = await request.formData();
        try {
            await locals.api.del(`/comment/${form.get('id')}`, { version: Number(form.get('version')) });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        return { success: true };
    },

    feature: async ({ params, locals, cookies }) => {
        try {
            await locals.api.post('/featured-post', { id: Number(params.id) });
            setFlash(cookies, { type: 'success', message: 'この投稿をトップに掲載しました。' });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        return { success: true };
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
    }
};