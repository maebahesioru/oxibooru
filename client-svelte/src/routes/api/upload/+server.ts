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

    const anonymous = form.get('anonymous') === '1' && locals.can('post_create_anonymous');

    try {
        const post = await locals.api.post<Post>(
            '/posts',
            {
                safety: String(form.get('safety') ?? 'safe'),
                tags: String(form.get('tags') ?? '')
                    .split(/\s+/)
                    .filter(Boolean),
                relations: String(form.get('relations') ?? '')
                    .split(/\s+/)
                    .filter(Boolean)
                    .map(Number),
                anonymous,
                ...(typeof content === 'string' ? { source: content } : {})
            },
            { content }
        );
        return json({ id: post.id });
    } catch (e) {
        return json({ error: (e as Error).message }, { status: 400 });
    }
};