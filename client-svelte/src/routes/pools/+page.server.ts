import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Paged, Pool } from '$lib/types';

const FIELDS = ['id', 'names', 'posts', 'creationTime', 'postCount', 'category'];

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.can('pool_list')) error(403, "閲覧権限がありません:  pools.");
    const query = url.searchParams.get('query') ?? '';
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 50);
    return {
        query,
        page: await locals.api.get<Paged<Pool>>('/pools', { query, offset, limit, fields: FIELDS }),
        canCreate: locals.can('pool_create'),
        canEditCategories: locals.can('pool_category_edit')
    };
};