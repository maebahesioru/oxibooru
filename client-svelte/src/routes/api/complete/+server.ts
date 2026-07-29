import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { escapeSearchTerm } from '$lib/format';
import type { MicroPool, MicroTag, Paged } from '$lib/types';

const MIN_PARTIAL = 3;

export const GET: RequestHandler = async ({ url, locals }) => {
    const kind = url.searchParams.get('kind') === 'pool' ? 'pool' : 'tag';
    const raw = (url.searchParams.get('text') ?? '').trim();
    if (!raw) return json({ results: [] });

    const negated = raw.startsWith('-');
    const text = negated ? raw.slice(1) : raw;
    if (!text) return json({ results: [] });

    const term = escapeSearchTerm(text);
    const pattern = text.length >= MIN_PARTIAL ? `*${term}*` : `${term}*`;

    if (kind === 'pool') {
        if (!locals.can('pool_list')) return json({ results: [] });
        const res = await locals.api.get<Paged<MicroPool>>('/pools', {
            query: `${pattern} sort:post-count`,
            offset: 0,
            limit: 15,
            fields: ['id', 'names', 'category', 'postCount']
        });
        return json({
            results: res.results.map((pool) => ({
                value: pool.names[0],
                label: pool.names[0],
                count: pool.postCount,
                category: pool.category
            }))
        });
    }

    if (!locals.can('tag_list')) return json({ results: [] });
    const res = await locals.api.get<Paged<MicroTag>>('/tags', {
        query: `${pattern} sort:usages`,
        offset: 0,
        limit: 15,
        fields: ['names', 'category', 'usages']
    });

    return json({
        results: res.results.map((tag) => ({
            value: (negated ? '-' : '') + tag.names[0],
            label: (negated ? '-' : '') + tag.names[0],
            count: tag.usages,
            category: tag.category
        }))
    });
};