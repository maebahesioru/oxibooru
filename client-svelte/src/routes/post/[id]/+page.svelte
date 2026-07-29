<script lang="ts">
    import { enhance } from '$app/forms';
    import { page } from '$app/state';
    import PostContent from '$lib/components/PostContent.svelte';
    import CommentList from '$lib/components/CommentList.svelte';
    import CommentEditor from '$lib/components/CommentEditor.svelte';
    import { cssCategory, formatFileSize, formatRelativeTime, mimeLabel, prettyTagName, rootDomain, escapeTagName } from '$lib/format';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    const post = $derived(data.post);
    const settings = $derived(page.data.settings);
    const qs = $derived(data.query ? `?query=${encodeURIComponent(data.query)}` : '');
    const safetyColor = $derived(
        { safe: 'text-success', sketchy: 'text-warning', unsafe: 'text-error' }[post.safety]
    );
</script>

<svelte:head><title>{`Post #${post.id} – ${page.data.siteName}`}</title></svelte:head>

<div class="flex flex-col gap-4 lg:flex-row">
    <!-- サイドバー -->
    <aside class="w-full shrink-0 space-y-4 lg:order-2 lg:w-80">
        <nav class="join w-full">
            <a
                class="btn join-item flex-1"
                class:btn-disabled={!data.prevPostId}
                href={data.prevPostId ? `/post/${data.prevPostId}${qs}` : undefined}
                rel="prev">‹ Prev</a
            >
            {#if data.can.edit}
                <a class="btn join-item flex-1" href={`/post/${post.id}/edit${qs}`}>Edit</a>
            {/if}
            <a
                class="btn join-item flex-1"
                class:btn-disabled={!data.nextPostId}
                href={data.nextPostId ? `/post/${data.nextPostId}${qs}` : undefined}
                rel="next">Next ›</a
            >
        </nav>

        <section class="card card-border bg-base-200">
            <div class="card-body gap-3 p-4 text-sm">
                <a class="link link-hover font-medium" href={post.contentUrl} download>
                    ⬇ {formatFileSize(post.fileSize)} {mimeLabel(post.mimeType)}
                    ({post.canvasWidth}×{post.canvasHeight})
                </a>

                <p class="flex items-center gap-2">
                    {#if post.user}
                        <img src={post.user.avatarUrl} alt="" class="size-5 rounded-full" />
                        <a class="link" href={`/user/${post.user.name}`}>{post.user.name}</a>
                    {:else}
                        <span class="opacity-70">Anonymous</span>
                    {/if}
                    <span class="opacity-70">{formatRelativeTime(post.creationTime)}</span>
                </p>

                {#if page.data.safetyEnabled}
                    <p class={safetyColor}>● {post.safety}</p>
                {/if}

                {#if post.source}
                    <p class="flex flex-wrap gap-2">
                        <span class="opacity-70">Source:</span>
                        {#each post.source.split('\n').filter(Boolean) as src (src)}
                            <a class="link" href={src} rel="external noreferrer" title={src}>{rootDomain(src)}</a>
                        {/each}
                    </p>
                {/if}

                <div class="flex items-center gap-4">
                    {#if data.can.score}
                        <form method="POST" action="?/score" use:enhance class="join">
                            <input type="hidden" name="score" value={post.ownScore === 1 ? 0 : 1} />
                            <button class="btn join-item btn-sm" class:btn-primary={post.ownScore === 1}>▲</button>
                        </form>
                        <span class="font-mono">{post.score}</span>
                        <form method="POST" action="?/score" use:enhance class="join">
                            <input type="hidden" name="score" value={post.ownScore === -1 ? 0 : -1} />
                            <button class="btn join-item btn-sm" class:btn-primary={post.ownScore === -1}>▼</button>
                        </form>
                    {:else}
                        <span class="font-mono">▲ {post.score}</span>
                    {/if}

                    {#if data.can.favorite}
                        <form method="POST" action="?/favorite" use:enhance class="flex items-center gap-1">
                            <input type="hidden" name="on" value={post.ownFavorite ? '0' : '1'} />
                            <button class="btn btn-ghost btn-sm" class:text-error={post.ownFavorite}>
                                {post.ownFavorite ? '♥' : '♡'}
                            </button>
                            <span class="font-mono">{post.favoriteCount}</span>
                        </form>
                    {/if}
                </div>

                <p class="text-xs opacity-70">
                    Search:
                    <a class="link" href={`http://iqdb.org/?url=${encodeURIComponent(post.contentUrl)}`}>IQDB</a> ·
                    <a class="link" href={`https://danbooru.donmai.us/posts?tags=md5:${post.checksumMD5}`}>Danbooru</a> ·
                    <a class="link" href={`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(post.contentUrl)}`}>Lens</a>
                </p>
            </div>
        </section>

        {#if post.relations.length}
            <section>
                <h2 class="mb-2 font-medium">Relations ({post.relations.length})</h2>
                <ul class="flex flex-wrap gap-2">
                    {#each post.relations as rel (rel.id)}
                        <li>
                            <a href={`/post/${rel.id}${qs}`}>
                                <img src={rel.thumbnailUrl} alt="" class="h-16 w-20 rounded object-cover" />
                            </a>
                        </li>
                    {/each}
                </ul>
            </section>
        {/if}

        <section>
            <h2 class="mb-2 font-medium">Tags ({post.tags.length})</h2>
            {#if post.tags.length}
                <ul class="space-y-0.5 text-sm">
                    {#each post.tags as tag (tag.names[0])}
                        <li class="flex items-baseline justify-between gap-2">
                            <span class="truncate">
                                {#if data.can.viewTags}
                                    <a class="opacity-60 hover:opacity-100" href={`/tag/${encodeURIComponent(tag.names[0])}`}>#</a>
                                {/if}
                                <a
                                    class={`link link-hover ${cssCategory(tag.category, 'tag')}`}
                                    href={`/posts?query=${encodeURIComponent(escapeTagName(tag.names[0]))}`}
                                >
                                    {prettyTagName(tag.names[0], settings.tagUnderscoresAsSpaces)}
                                </a>
                            </span>
                            <span class="shrink-0 font-mono text-xs opacity-60">{tag.usages}</span>
                        </li>
                    {/each}
                </ul>
            {:else}
                <p class="text-sm opacity-70">
                    No tags yet!
                    {#if data.can.edit}<a class="link" href={`/post/${post.id}/edit`}>Add some.</a>{/if}
                </p>
            {/if}
        </section>
    </aside>

    <!-- 本体 -->
    <div class="min-w-0 flex-1 space-y-4 lg:order-1">
        <PostContent
            {post}
            fitMode={settings.fitMode}
            transparencyGrid={settings.transparencyGrid}
            autoplay={settings.autoplayVideos}
            upscale={settings.upscaleSmallPosts}
        />

        {#if data.descriptionHtml}
            <details open class="collapse-arrow collapse bg-base-200">
                <summary class="collapse-title font-medium">Description</summary>
                <div class="collapse-content md">{@html data.descriptionHtml}</div>
            </details>
        {/if}

        {#if data.can.createComments}
            <section>
                <h2 class="mb-2 text-lg">Add comment</h2>
                <CommentEditor action="?/addComment" />
            </section>
        {/if}

        {#if data.can.listComments}
            <CommentList
                comments={post.comments}
                rendered={data.commentsHtml}
                currentUser={page.data.user}
                canScore={data.can.scoreComments}
            />
        {/if}
    </div>
</div>