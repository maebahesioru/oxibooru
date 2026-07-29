import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from '$lib/server/flash';
import type { Post } from '$lib/types';

export const load: PageServerLoad = async ({ params, locals, url }) => {
    if (!locals.can('post_merge')) error(403, "You don't have privileges to merge posts.");

    const left = await locals.api.get<Post>(`/post/${params.id}`);
    const targetId = url.searchParams.get('target');

    let right: Post | null = null;
    let lookupError: string | null = null;
    if (targetId) {
        try {
            right = await locals.api.get<Post>(`/post/${Number(targetId)}`);
        } catch (e) {
            lookupError = (e as Error).message;
        }
    }

    return { left, right, lookupError };
};

export const actions: Actions = {
    merge: async ({ request, locals, cookies }) => {
        const form = await request.formData();
        const target = String(form.get('target')); // 'left' | 'right'
        const content = String(form.get('content')); // 'left' | 'right'

        const leftId = Number(form.get('leftId'));
        const leftVersion = Number(form.get('leftVersion'));
        const rightId = Number(form.get('rightId'));
        const rightVersion = Number(form.get('rightVersion'));

        const keep = target === 'left' ? { id: leftId, version: leftVersion } : { id: rightId, version: rightVersion };
        const drop = target === 'left' ? { id: rightId, version: rightVersion } : { id: leftId, version: leftVersion };

        try {
            await locals.api.post('/post-merge', {
                remove: drop.id,
                removeVersion: drop.version,
                mergeTo: keep.id,
                mergeToVersion: keep.version,
                replaceContent: content !== target
            });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }

        setFlash(cookies, { type: 'success', message: '投稿を統合しました。' });
        redirect(303, `/post/${keep.id}`);
    }
};