import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from '$lib/server/flash';
import type { Post } from '$lib/types';

export const load: PageServerLoad = ({ locals }) => {
    if (!locals.can('post_create')) error(403, "You don't have privileges to upload posts.");
    return {
        canUploadAnonymously: locals.can('post_create_anonymous'),
        safetyEnabled: locals.info.config.enableSafety
    };
};

export const actions: Actions = {
    default: async ({ request, locals, cookies }) => {
        const form = await request.formData();
        const safety = String(form.get('safety') ?? 'safe');
        const anonymous = form.get('anonymous') === 'on';
        const skipDuplicates = form.get('skipDuplicates') === 'on';
        const tags = String(form.get('tags') ?? '')
            .split(/\s+/)
            .filter(Boolean);

        const items: (File | string)[] = [
            ...form.getAll('content').filter((f): f is File => f instanceof File && f.size > 0),
            ...String(form.get('urls') ?? '')
                .split(/[\r\n]+/)
                .map((u) => u.trim())
                .filter(Boolean)
        ];

        if (!items.length) return fail(400, { message: 'アップロードするファイルまたは URL を指定してください。' });

        const created: number[] = [];
        const errors: string[] = [];

        for (const item of items) {
            try {
                const reverse = await locals.api.post<{
                    exactPost: Post | null;
                    similarPosts: { post: Post; distance: number }[];
                }>('/posts/reverse-search', {}, { content: item });

                if (reverse.exactPost) {
                    if (skipDuplicates) continue;
                    errors.push(`既に存在します (@${reverse.exactPost.id})`);
                    continue;
                }

                const post = await locals.api.post<Post>(
                    '/posts',
                    {
                        safety,
                        tags,
                        anonymous,
                        ...(typeof item === 'string' ? { source: item } : {})
                    },
                    { content: item }
                );
                created.push(post.id);
            } catch (e) {
                errors.push((e as Error).message);
            }
        }

        if (errors.length && !created.length) return fail(400, { message: errors.join('\n') });

        setFlash(cookies, {
            type: errors.length ? 'info' : 'success',
            message: `${created.length} 件アップロードしました。${errors.length ? `\n${errors.join('\n')}` : ''}`
        });
        redirect(303, created.length === 1 ? `/post/${created[0]}/edit` : '/posts');
    }
};