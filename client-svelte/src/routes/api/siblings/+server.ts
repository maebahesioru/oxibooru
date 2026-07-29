import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { MicroTag } from '$lib/types';

export const GET: RequestHandler = async ({ url, locals }) => {
    const tag = url.searchParams.get('tag');
    if (!tag || !locals.can('tag_view')) return json({ results: [] });

    try {
        const res = await locals.api.get<{
            results: { tag: MicroTag; occurrences: number }[];
        }>(`/tag-siblings/${encodeURIComponent(tag)}`);

        const max = Math.max(1, ...res.results.map((s) => s.occurrences));
        return json({
            results: res.results.map((s) => ({
                name: s.tag.names[0],
                category: s.tag.category,
                weight: ((s.occurrences * 4.9) / max).toFixed(1)
            }))
        });
    } catch {
        return json({ results: [] });
    }
};