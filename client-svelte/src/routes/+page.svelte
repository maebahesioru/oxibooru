<script lang="ts">
    import { page } from '$app/state';
    import PostContent from '$lib/components/PostContent.svelte';
    import SearchForm from '$lib/components/SearchForm.svelte';
    import { formatFileSize, formatRelativeTime } from '$lib/format';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<section class="hero py-10">
    <div class="hero-content w-full flex-col text-center">
        <h1 class="text-4xl font-semibold">{page.data.siteName}</h1>

        {#if data.canListPosts}
            <div class="w-full max-w-2xl">
                <SearchForm action="/posts" helpHref="/help/search/posts" placeholder="enter some tags" />
                <a class="link link-hover mt-2 inline-block text-sm" href="/posts">browse all posts</a>
            </div>
        {/if}
    </div>
</section>

{#if data.featured}
    <section class="mx-auto max-w-5xl space-y-2 text-center">
        <PostContent
            post={data.featured.post}
            fitMode="fit-both"
            transparencyGrid={page.data.settings.transparencyGrid}
            autoplay={page.data.settings.autoplayVideos}
        />
        <p class="text-sm opacity-70">
            Featured post:
            <a class="link" href={`/post/${data.featured.post.id}`}>@{data.featured.post.id}</a>,
            posted {formatRelativeTime(data.featured.post.creationTime)}
            {#if data.featured.user}
                by <a class="link" href={`/user/${data.featured.user.name}`}>{data.featured.user.name}</a>
            {/if}
        </p>
    </section>
{/if}

<footer class="mt-10 text-center text-xs opacity-70">
    <ul class="flex flex-wrap justify-center gap-x-4 gap-y-1">
        <li>{data.stats.postCount} posts</li>
        <li>{formatFileSize(data.stats.diskUsage)}</li>
        {#if data.canListSnapshots}<li><a class="link" href="/history">History</a></li>{/if}
    </ul>
</footer>