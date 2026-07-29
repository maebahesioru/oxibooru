import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { decorateQuery } from '$lib/settings';
import type { Paged, Post } from '$lib/types';

const FIELDS = [
    'id',
    'thumbnailUrl',
    'contentUrl',
    'type',
    'safety',
    'score',
    'favoriteCount',
    'commentCount',
    'tags',
    'version'
];

export const GET: RequestHandler = async ({ url, locals }) => {
    if (!locals.can('post_list')) error(403, 'forbidden');
    const page = await locals.api.get<Paged<Post>>('/posts', {
        query: decorateQuery(
            url.searchParams.get('query') ?? '',
            locals.settings,
            locals.info.config.enableSafety
        ),
        offset: Number(url.searchParams.get('offset') ?? 0),
        limit: Number(url.searchParams.get('limit') ?? locals.settings.postsPerPage),
        fields: FIELDS
    });
    return json(page);
};