<script lang="ts">
    import { page } from '$app/state';
    import PostGrid from '$lib/components/PostGrid.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import SearchForm from '$lib/components/SearchForm.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    const makeHref = (offset: number) => {
        const params = new URLSearchParams(page.url.searchParams);
        params.set('offset', String(Math.max(0, offset)));
        return `/posts?${params}`;
    };
</script>

{#if data.forbidden}
    <div role="alert" class="alert alert-error">You don't have privileges to view posts.</div>
{:else}
    <SearchForm
        action="/posts"
        query={data.query}
        helpHref="/help/search/posts"
        placeholder="enter some tags"
        kind="tag"
    />

    <div class="mt-4 flex flex-wrap items-center gap-2 text-sm opacity-70">
        <span>{data.page.total} posts</span>
        {#if data.can.bulkEditTags}
            <a class="btn btn-ghost btn-xs" href={makeHref(0) + '&tag='}>Mass tag</a>
        {/if}
        {#if data.can.bulkEditSafety}
            <a class="btn btn-ghost btn-xs" href={makeHref(0) + '&safety=1'}>Mass safety</a>
        {/if}
        {#if data.can.bulkDelete}
            <a class="btn btn-ghost btn-xs" href={makeHref(0) + '&delete=1'}>Mass delete</a>
        {/if}
    </div>

    <PostGrid
        posts={data.page.results}
        flow={page.data.settings.postFlow}
        linkable={data.can.view}
        query={data.query}
        bulk={{
            tags: data.bulkTags,
            safety: data.bulkSafety,
            delete: data.bulkDelete
        }}
    />

    <Pagination
        offset={data.page.offset}
        limit={data.page.limit}
        total={data.page.total}
        {makeHref}
    />
{/if}