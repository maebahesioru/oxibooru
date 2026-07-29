import type { Info, Rank, User } from './types';

export const ALL_RANKS: Rank[] = [
    'anonymous',
    'restricted',
    'regular',
    'power',
    'moderator',
    'administrator',
    'nobody'
];

export const RANK_NAMES: Record<Rank, string> = {
    anonymous: 'Anonymous',
    restricted: 'Restricted user',
    regular: 'Regular user',
    power: 'Power user',
    moderator: 'Moderator',
    administrator: 'Administrator',
    nobody: 'Nobody'
};

/** 旧 api.hasPrivilege() の移植。プレフィックス一致で最小必要ランクを求める。 */
export function makeCan(info: Info, user: User | null) {
    const myRank = user ? ALL_RANKS.indexOf(user.rank) : 0;
    return (lookup: string): boolean => {
        let min: number | null = null;
        for (const [key, rank] of Object.entries(info.config.privileges)) {
            if (!key.startsWith(lookup)) continue;
            const idx = ALL_RANKS.indexOf(rank);
            if (min === null || idx < min) min = idx;
        }
        if (min === null) return false;
        return myRank >= min;
    };
}

export type Can = ReturnType<typeof makeCan>;