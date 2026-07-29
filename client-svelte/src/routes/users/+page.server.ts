import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Paged, User } from '$lib/types';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.can('user_list')) error(403, "You don't have privileges to view users.");
    const query = url.searchParams.get('query') ?? '';
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 30);
    return {
        query,
        page: await locals.api.get<Paged<User>>('/users', { query, offset, limit })
    };
};