import type { Api } from './api';
import type { CategoryPayload } from '$lib/categories';

/** タグ／プール共通のカテゴリ一括保存。 */
export async function saveCategories(
    api: Api,
    kind: 'tag' | 'pool',
    payload: CategoryPayload,
    withOrder: boolean
) {
    const single = `${kind}-category`;
    const plural = `${kind}-categories`;

    for (const row of payload.rows) {
        if (row.deleted) {
            if (row.origName) {
                await api.del(`/${single}/${encodeURIComponent(row.origName)}`, { version: row.version });
            }
            continue;
        }

        if (!row.origName) {
            await api.post(`/${plural}`, {
                name: row.name,
                color: row.color,
                ...(withOrder ? { order: row.order ?? 1 } : {})
            });
            continue;
        }

        const diff: Record<string, unknown> = { version: row.version };
        let dirty = false;
        if (row.name !== row.origName) {
            diff.name = row.name;
            dirty = true;
        }
        if (row.colorChanged) {
            diff.color = row.color;
            dirty = true;
        }
        if (withOrder && row.orderChanged) {
            diff.order = row.order;
            dirty = true;
        }
        if (dirty) await api.put(`/${single}/${encodeURIComponent(row.origName)}`, diff);
    }

    if (payload.defaultName) {
        await api.put(`/${single}/${encodeURIComponent(payload.defaultName)}/default`);
    }
}