import type { PageServerLoad } from './$types';
import { RANK_NAMES } from '$lib/privileges';

export const load: PageServerLoad = async ({ parent }) => {
    const { profile } = await parent();
    return { rankName: RANK_NAMES[profile.rank] };
};