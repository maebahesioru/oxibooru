<script lang="ts">
    import { page } from '$app/state';
    import CommentList from '$lib/components/CommentList.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    const makeHref = (offset: number) => `/comments?offset=${Math.max(0, offset)}`;
</script>

<h1 class="mb-4 text-2xl">Comments</h1>

<ul class="space-y-8">
    {#each data.page.results as post (post.id)}
        <li class="flex flex-col gap-4 border-t border-base-300 pt-6 first:border-0 first:pt-0 sm:flex-row">
            <div class="shrink-0">
                {#if data.can.viewPosts}
                    <a href={`/post/${post.id}`}>
                        <img src={post.thumbnailUrl} alt="" class="h-32 w-full rounded-box object-cover sm:w-48" />
                    </a>
                {:else}
                    <img src={post.thumbnailUrl} alt="" class="h-32 w-full rounded-box object-cover sm:w-48" />
                {/if}
            </div>
            <div class="min-w-0 grow">
                <CommentList
                    comments={[...post.comments].reverse()}
                    rendered={data.rendered}
                    currentUser={page.data.user}
                    canScore={data.can.score}
                />
            </div>
        </li>
    {/each}
</ul>

<Pagination offset={data.page.offset} limit={data.page.limit} total={data.page.total} {makeHref} />