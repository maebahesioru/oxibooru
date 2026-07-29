<script lang="ts">
    import { page } from '$app/state';
    import Pagination from '$lib/components/Pagination.svelte';
    import SearchForm from '$lib/components/SearchForm.svelte';
    import { cssCategory, escapeTagName, formatRelativeTime, prettyTagName } from '$lib/format';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    const pretty = (n: string) => prettyTagName(n, page.data.settings.tagUnderscoresAsSpaces);

    const makeHref = (offset: number) => {
        const params = new URLSearchParams(page.url.searchParams);
        params.set('offset', String(Math.max(0, offset)));
        return `/tags?${params}`;
    };
</script>

<div class="flex flex-wrap items-center gap-2">
    <div class="min-w-64 grow">
        <SearchForm action="/tags" query={data.query} helpHref="/help/search/tags" />
    </div>
    {#if data.canEditCategories}
        <a class="btn btn-outline btn-sm" href="/tag-categories">Tag categories</a>
    {/if}
</div>

<div class="mt-4 overflow-x-auto rounded-box border border-base-300">
    <table class="table-zebra table table-sm">
        <thead>
            <tr>
                <th><a class="link" href="/tags?query=sort:name">Tag name(s)</a></th>
                <th>Implications</th>
                <th>Suggestions</th>
                <th class="text-center"><a class="link" href="/tags?query=sort:usages">Usages</a></th>
                <th class="text-center">Created</th>
            </tr>
        </thead>
        <tbody>
            {#each data.page.results as tag (tag.names[0])}
                <tr>
                    <td>
                        {#each tag.names as name, i (name)}
                            {#if i > 0},{/if}
                            <a class={`link link-hover ${cssCategory(tag.category, 'tag')}`} href={`/tag/${encodeURIComponent(name)}`}>
                                {pretty(name)}
                            </a>
                        {/each}
                    </td>
                    <td class="text-xs opacity-80">{tag.implications.map((t) => pretty(t.names[0])).join(', ') || '-'}</td>
                    <td class="text-xs opacity-80">{tag.suggestions.map((t) => pretty(t.names[0])).join(', ') || '-'}</td>
                    <td class="text-center">
                        <a class="link" href={`/posts?query=${encodeURIComponent(escapeTagName(tag.names[0]))}`}>{tag.usages}</a>
                    </td>
                    <td class="text-center whitespace-nowrap text-xs opacity-70">{formatRelativeTime(tag.creationTime)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<Pagination offset={data.page.offset} limit={data.page.limit} total={data.page.total} {makeHref} />