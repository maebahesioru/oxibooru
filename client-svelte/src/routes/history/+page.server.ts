import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Paged } from '$lib/types';

interface Snapshot {
    operation: 'created' | 'modified' | 'deleted' | 'merged';
    type: string;
    id: string;
    user: { name: string; avatarUrl: string } | null;
    data: unknown;
    time: string;
}

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.can('snapshot_list')) error(403, "You don't have privileges to view history.");
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 25);
    return {
        page: await locals.api.get<Paged<Snapshot>>('/snapshots', { query: '', offset, limit })
    };
};