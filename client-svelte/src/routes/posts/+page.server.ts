import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { decorateQuery } from '$lib/settings';
import { setFlash } from '$lib/server/flash';
import { splitWhitespace } from '$lib/format';
import type { Paged, Post } from '$lib/types';

const FIELDS = [
    'id',
    'thumbnailUrl',
    'type',
    'safety',
    'score',
    'favoriteCount',
    'commentCount',
    'tags',
    'version'
];

export const load: PageServerLoad = async ({ locals, url }) => {
    const { api, can, settings, info } = locals;
    if (!can('post_list')) return { forbidden: true as const };

    const query = url.searchParams.get('query') ?? '';
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? settings.postsPerPage);

    const page = await api.get<Paged<Post>>('/posts', {
        query: decorateQuery(query, settings, info.config.enableSafety),
        offset,
        limit,
        fields: FIELDS
    });

    return {
        forbidden: false as const,
        page,
        query,
        bulkTags: splitWhitespace(url.searchParams.get('tag') ?? ''),
        bulkSafety: url.searchParams.get('safety') === '1',
        bulkDelete: url.searchParams.get('delete') === '1',
        can: {
            bulkEditTags: can('post_bulk_edit_tag'),
            bulkEditSafety: can('post_bulk_edit_safety'),
            bulkDelete: can('post_bulk_edit_delete'),
            view: can('post_view')
        }
    };
};

export const actions: Actions = {
    /** 一括タグ付け／解除 */
    bulkTag: async ({ request, locals, cookies }) => {
        const form = await request.formData();
        const id = Number(form.get('id'));
        const version = Number(form.get('version'));
        const tags = splitWhitespace(String(form.get('tags') ?? ''));
        const mode = String(form.get('mode'));

        try {
            const post = await locals.api.get<Post>(`/post/${id}`, { fields: 'tags,version' });
            const current = post.tags.flatMap((t) => t.names[0]);
            const next =
                mode === 'add'
                    ? [...new Set([...current, ...tags])]
                    : current.filter((t) => !tags.some((x) => x.toLowerCase() === t.toLowerCase()));
            await locals.api.put(`/post/${id}`, { version: post.version ?? version, tags: next });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        return { success: true };
    },

    bulkSafety: async ({ request, locals }) => {
        const form = await request.formData();
        const id = Number(form.get('id'));
        const version = Number(form.get('version'));
        const safety = String(form.get('safety'));
        try {
            await locals.api.put(`/post/${id}`, { version, safety });
        } catch (e) {
            return fail(400, { message: (e as Error).message });
        }
        return { success: true };
    },

    bulkDelete: async ({ request, locals, cookies }) => {
        const form = await request.formData();
        const ids = form.getAll('selected').map(Number);
        const versions = new Map(
            form.getAll('version').map((v) => {
                const [id, version] = String(v).split(':').map(Number);
                return [id, version];
            })
        );
        let deleted = 0;
        for (const id of ids) {
            try {
                await locals.api.del(`/post/${id}`, { version: versions.get(id) });
                deleted++;
            } catch {
                /* 続行 */
            }
        }
        setFlash(cookies, { type: 'success', message: `${deleted} 件の投稿を削除しました。` });
        return { success: true };
    }
};