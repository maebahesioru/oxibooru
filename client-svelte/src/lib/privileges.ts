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
    anonymous: '匿名',
    restricted: '制限ユーザー',
    regular: '一般ユーザー',
    power: 'パワーユーザー',
    moderator: 'モデレーター',
    administrator: '管理者',
    nobody: 'なし'
};

/** 旧 api.hasPrivilege() の移植。プレフィックス一致で最小必要ランクを求める。 */
export function makeCan(info: Info, user: User | null) {
    const myRank = user ? ALL_RANKS.indexOf(user.rank) : 0;
    return (lookup: string): boolean => {
        const required = info.config.privileges[lookup];
        if (!required) return false;
        return myRank >= ALL_RANKS.indexOf(required);
    };
}

export type Can = ReturnType<typeof makeCan>;