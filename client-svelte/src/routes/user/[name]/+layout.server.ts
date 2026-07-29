import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { RANK_NAMES, ALL_RANKS } from '$lib/privileges';
import type { Rank, User } from '$lib/types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
    const { api, can, user: me } = locals;
    const name = params.name;
    const isSelf = !!me && me.name.toLowerCase() === name.toLowerCase();

    if (!can('user_view') && !isSelf) error(403, "You don't have privileges to view users.");

    const user = await api.get<User>(`/user/${encodeURIComponent(name)}`);
    const infix = isSelf ? 'self' : 'any';

    const myRankIndex = me ? ALL_RANKS.indexOf(me.rank) : 0;
    const ranks = ALL_RANKS.filter((r, i) => r !== 'anonymous' && i <= myRankIndex).map((r) => ({
        value: r as Rank,
        label: RANK_NAMES[r]
    }));

    return {
        profile: user,
        isSelf,
        ranks,
        userNamePattern: locals.info.config.userNameRegex,
        passwordPattern: locals.info.config.passwordRegex,
        can: {
            editAnything: can(`user_edit_${infix}`),
            name: can(`user_edit_${infix}_name`),
            password: can(`user_edit_${infix}_pass`),
            email: can(`user_edit_${infix}_email`),
            rank: can(`user_edit_${infix}_rank`),
            avatar: can(`user_edit_${infix}_avatar`),
            listTokens: can(`user_token_list_${infix}`),
            createToken: can(`user_token_create_${infix}`),
            editToken: can(`user_token_edit_${infix}`),
            deleteToken: can(`user_token_delete_${infix}`),
            delete: can(`user_delete_${infix}`)
        }
    };
};