import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import type { Post } from '$lib/types';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.can('post_create')) error(403, 'forbidden');

    const form = await request.formData();
    const file = form.get('content');
    const url = String(form.get('url') ?? '');

    const content = file instanceof File && file.size ? file : url || null;
    if (!content) error(400, 'no content');

    const res = await locals.api.post<{
        exactPost: Post | null;
        similarPosts: { post: Post; distance: number }[];
    }>('/posts/reverse-search', {}, { content });

    return json({
        exactPost: res.exactPost
            ? { id: res.exactPost.id, thumbnailUrl: res.exactPost.thumbnailUrl }
            : null,
        similarPosts: res.similarPosts.map((s) => ({
            distance: s.distance,
            post: {
                id: s.post.id,
                thumbnailUrl: s.post.thumbnailUrl,
                tagNames: s.post.tags.map((t) => t.names[0])
            }
        }))
    });
};