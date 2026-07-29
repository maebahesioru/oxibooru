<script lang="ts">
    import { page } from '$app/state';
    import Pagination from '$lib/components/Pagination.svelte';
    import SearchForm from '$lib/components/SearchForm.svelte';
    import { cssCategory, formatRelativeTime, prettyTagName } from '$lib/format';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    const pretty = (n: string) => prettyTagName(n, page.data.settings.tagUnderscoresAsSpaces);
    const searchable = (pool: { id: number; names: string[] }) =>
        pool.names[0] && !/^\d+$/.test(pool.names[0]) ? pool.names[0] : String(pool.id);

    const makeHref = (offset: number) => {
        const params = new URLSearchParams(page.url.searchParams);
        params.set('offset', String(Math.max(0, offset)));
        return `/pools?${params}`;
    };
</script>

<div class="flex flex-wrap items-center gap-2">
    <div class="min-w-64 grow">
        <SearchForm action="/pools" query={data.query} helpHref="/help/search/pools" kind="pool" />
    </div>
    {#if data.canCreate}<a class="btn btn-primary btn-sm" href="/pool/create">プールを新規作成</a>{/if}
    {#if data.canEditCategories}<a class="btn btn-outline btn-sm" href="/pool-categories">Pool categories</a>{/if}
</div>

<div class="mt-4 overflow-x-auto rounded-box border border-base-300">
    <table class="table-zebra table table-sm">
        <thead>
            <tr>
                <th><a class="link" href="/pools?query=sort:name">Pool name(s)</a></th>
                <th class="text-center"><a class="link" href="/pools?query=sort:post-count">投稿数</a></th>
                <th class="text-center"><a class="link" href="/pools?query=sort:creation-time">作成日</a></th>
            </tr>
        </thead>
        <tbody>
            {#each data.page.results as pool (pool.id)}
                <tr>
                    <td>
                        {#each pool.names as name, i (name)}
                            {#if i > 0},{/if}
                            <a class={`link link-hover ${cssCategory(pool.category, 'pool')}`} href={`/pool/${pool.id}`}>
                                {pretty(name)}
                            </a>
                        {/each}
                    </td>
                    <td class="text-center">
                        <a class="link" href={`/posts?query=pool:${encodeURIComponent(searchable(pool))}`}>
                            {pool.postCount}
                        </a>
                    </td>
                    <td class="text-center whitespace-nowrap text-xs opacity-70">
                        {formatRelativeTime(pool.creationTime)}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<Pagination offset={data.page.offset} limit={data.page.limit} total={data.page.total} {makeHref} />