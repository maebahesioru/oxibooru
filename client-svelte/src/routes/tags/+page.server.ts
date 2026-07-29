import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Paged, Tag } from '$lib/types';

const FIELDS = ['names', 'suggestions', 'implications', 'creationTime', 'usages', 'category'];

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.can('tag_list')) error(403, "You don't have privileges to view tags.");

    const query = url.searchParams.get('query') ?? '';
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 50);

    return {
        query,
        page: await locals.api.get<Paged<Tag>>('/tags', { query, offset, limit, fields: FIELDS }),
        canEditCategories: locals.can('tag_category_edit')
    };
};