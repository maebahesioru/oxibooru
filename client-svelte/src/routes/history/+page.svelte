<script lang="ts">
    import { page } from '$app/state';
    import Pagination from '$lib/components/Pagination.svelte';
    import { formatRelativeTime } from '$lib/format';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    const badge = (op: string) =>
        ({
            created: 'badge-success',
            modified: 'badge-info',
            deleted: 'badge-error',
            merged: 'badge-warning'
        })[op] ?? 'badge-neutral';

    const makeHref = (offset: number) => `/history?offset=${Math.max(0, offset)}`;
</script>

<h1 class="mb-4 text-2xl">History</h1>

<ul class="space-y-2">
    {#each data.page.results as item (item.time + item.id + item.type)}
        <li class="card card-border bg-base-200">
            <div class="card-body flex-row items-center gap-3 p-3 text-sm">
                <span class="badge {badge(item.operation)}">{item.operation}</span>
                <span class="font-mono">{item.type} {item.id}</span>
                {#if item.user}
                    <a class="link" href={`/user/${item.user.name}`}>{item.user.name}</a>
                {/if}
                <span class="ml-auto opacity-60">{formatRelativeTime(item.time)}</span>
            </div>
        </li>
    {/each}
</ul>

<Pagination offset={data.page.offset} limit={data.page.limit} total={data.page.total} {makeHref} />