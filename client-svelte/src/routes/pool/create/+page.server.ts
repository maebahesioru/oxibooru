import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { cached } from '$lib/server/cache';
import { setFlash } from '$lib/server/flash';
import { splitWhitespace } from '$lib/format';
import type { Category, Pool } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.can('pool_create')) error(403, "作成権限がありません:  pools.");
    const categories = await cached('pool-categories', 60_000, () =>
        locals.api.get<{ results: Category[] }>('/pool-categories').then((r) => r.results)
    );
    return {
        categories: categories.map((c) => c.name),
        namePattern: locals.info.config.poolNameRegex
    };
};

export const actions: Actions = {
    default: async ({ request, locals, cookies }) => {
        const form = await request.formData();
        const names = splitWhitespace(String(form.get('names') ?? ''));
        if (!names.length) return fail(400, { message: 'Pools must have at least one name.' });

        const posts = splitWhitespace(String(form.get('posts') ?? ''));
        if (posts.some((p) => !/^\d+$/.test(p))) {
            return fail(400, { message: 'Post ID は整数で指定してください。' });
        }

        let pool: Pool;
        try {
            pool = await locals.api.post<Pool>('/pools', {
                names,
                category: String(form.get('category') ?? 'default'),
                description: String(form.get('description') ?? ''),
                posts: posts.map(Number)
            });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }

        setFlash(cookies, { type: 'success', message: 'プールを作成しました。' });
        redirect(303, `/pool/${pool.id}`);
    }
};