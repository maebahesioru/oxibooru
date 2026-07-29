import type { Actions, PageServerLoad } from './$types';
import { error, fail } from '@sveltejs/kit';
import { renderMarkdown } from '$lib/markdown';
import type { Paged, Post } from '$lib/types';

const FIELDS = ['id', 'comments', 'commentCount', 'thumbnailUrl'];

export const load: PageServerLoad = async ({ locals, url }) => {
    const { api, can } = locals;
    if (!can('comment_list')) error(403, "閲覧権限がありません:  comments.");

    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 10);

    const page = await api.get<Paged<Post>>('/posts', {
        query: 'sort:comment-date comment-count:1..',
        offset,
        limit,
        fields: FIELDS
    });

    return {
        page,
        rendered: page.results.flatMap((post) =>
            post.comments.map((c) => ({ id: c.id, html: renderMarkdown(c.text) }))
        ),
        can: {
            viewPosts: can('post_view'),
            score: can('comment_score')
        }
    };
};

export const actions: Actions = {
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
            await locals.api.put(`/comment/${form.get('id')}/score`, {
                score: Number(form.get('score'))
            });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        return { success: true };
    },
    deleteComment: async ({ request, locals }) => {
        const form = await request.formData();
        try {
            await locals.api.del(`/comment/${form.get('id')}`, {
                version: Number(form.get('version'))
            });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        return { success: true };
    }
};