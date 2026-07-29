import type { LayoutServerLoad } from './$types';
import { cached } from '$lib/server/cache';
import { takeFlash } from '$lib/server/flash';
import type { Category } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
    const { api, can } = locals;

    const [tagCategories, poolCategories] = await Promise.all([
        can('tag_category_list')
            ? cached('tag-categories', 60_000, () =>
                  api.get<{ results: Category[] }>('/tag-categories').then((r) => r.results)
              )
            : Promise.resolve([] as Category[]),
        can('pool_category_list')
            ? cached('pool-categories', 60_000, () =>
                  api.get<{ results: Category[] }>('/pool-categories').then((r) => r.results)
              )
            : Promise.resolve([] as Category[])
    ]);

    return {
        siteName: locals.info.config.name,
        safetyEnabled: locals.info.config.enableSafety,
        user: locals.user,
        settings: locals.settings,
        tagCategories,
        poolCategories,
        flash: takeFlash(cookies),
        pathname: url.pathname,
        nav: {
            posts: can('post_list'),
            upload: can('post_create'),
            comments: can('comment_list'),
            tags: can('tag_list'),
            pools: can('pool_list'),
            users: can('user_list'),
            register: locals.user ? can('user_create_any') : can('user_create_self')
        }
    };
};