<script lang="ts">
    import type { CategoryRow } from '$lib/categories';

    let {
        rows = $bindable([] as CategoryRow[]),
        withOrder = false,
        can
    }: {
        rows: CategoryRow[];
        withOrder?: boolean;
        can: {
            name: boolean;
            color: boolean;
            order: boolean;
            create: boolean;
            delete: boolean;
            setDefault: boolean;
        };
    } = $props();

    let defaultName = $state(rows.find((r) => r.isDefault)?.name ?? null);

    const payload = $derived(JSON.stringify({ rows, defaultName }));

    function add() {
        rows = [
            ...rows,
            {
                origName: null,
                name: '',
                color: '#000000',
                order: (Math.max(0, ...rows.map((r) => r.order ?? 0)) || 0) + 1,
                usages: 0,
                version: 0,
                isDefault: false
            }
        ];
    }
</script>

<input type="hidden" name="payload" value={payload} />

<div class="overflow-x-auto rounded-box border border-base-300">
    <table class="table table-sm">
        <thead>
            <tr>
                <th>カテゴリ名</th>
                <th>色</th>
                {#if withOrder}<th class="w-24">順序</th>{/if}
                <th class="text-center">使用数</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {#each rows as row, i (i)}
                {#if !row.deleted}
                    <tr class={defaultName === row.name ? 'bg-base-300' : ''}>
                        <td>
                            {#if can.name}
                                <input
                                    bind:value={row.name}
                                    required
                                    class="input input-bordered input-sm w-full"
                                />
                            {:else}
                                {row.name}
                            {/if}
                        </td>
                        <td>
                            {#if can.color}
                                <span class="flex items-center gap-2">
                                    <input
                                        type="color"
                                        bind:value={row.color}
                                        oninput={() => (row.colorChanged = true)}
                                        class="h-8 w-10 cursor-pointer rounded border border-base-300 bg-transparent"
                                    />
                                    <input
                                        bind:value={row.color}
                                        oninput={() => (row.colorChanged = true)}
                                        class="input input-bordered input-sm w-28 font-mono"
                                    />
                                    <span style={`color:${row.color}`} class="font-bold">A</span>
                                </span>
                            {:else}
                                <span class="font-mono" style={`color:${row.color}`}>{row.color}</span>
                            {/if}
                        </td>
                        {#if withOrder}
                            <td>
                                {#if can.order}
                                    <input
                                        type="number"
                                        bind:value={row.order}
                                        oninput={() => (row.orderChanged = true)}
                                        class="input input-bordered input-sm w-20"
                                    />
                                {:else}
                                    {row.order}
                                {/if}
                            </td>
                        {/if}
                        <td class="text-center">{row.usages}</td>
                        <td class="whitespace-nowrap text-right">
                            {#if can.setDefault}
                                <button
                                    type="button"
                                    class="btn btn-ghost btn-xs"
                                    disabled={defaultName === row.name}
                                    onclick={() => (defaultName = row.name)}
                                >
                                    Make default
                                </button>
                            {/if}
                            {#if can.delete}
                                <button
                                    type="button"
                                    class="btn btn-ghost btn-xs text-error"
                                    disabled={row.usages > 0}
                                    title={row.usages > 0 ? "Can't delete category in use" : ''}
                                    onclick={() => (row.deleted = true)}
                                >
                                    Remove
                                </button>
                            {/if}
                        </td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>
</div>

{#if can.create}
    <button type="button" class="btn btn-ghost btn-sm mt-2" onclick={add}>カテゴリを追加</button>
{/if}