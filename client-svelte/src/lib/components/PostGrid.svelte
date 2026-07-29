<script lang="ts">
    import { enhance } from '$app/forms';
    import type { Post } from '$lib/types';

    let {
        posts,
        flow = false,
        linkable = true,
        query = '',
        bulk = { tags: [] as string[], safety: false, delete: false }
    }: {
        posts: Post[];
        flow?: boolean;
        linkable?: boolean;
        query?: string;
        bulk?: { tags: string[]; safety: boolean; delete: boolean };
    } = $props();

    const href = (post: Post) =>
        linkable ? `/post/${post.id}${query ? `?query=${encodeURIComponent(query)}` : ''}` : '';

    const isTagged = (post: Post) =>
        bulk.tags.length > 0 &&
        bulk.tags.every((t) => post.tags.some((pt) => pt.names.some((n) => n.toLowerCase() === t.toLowerCase())));
</script>

<ul
    class="mt-4 grid gap-2"
    class:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]={!flow}
    class:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]={flow}
>
    {#each posts as post (post.id)}
        <li class="group relative overflow-hidden rounded-box bg-base-200 ring-offset-0">
            <a
                href={href(post)}
                title={`@${post.id} (${post.type})\n\n${post.tags.map((t) => '#' + t.names[0]).join(' ') || 'no tags'}`}
                class="block aspect-4/3 outline-offset-[-3px] transition
                       hover:outline-3 hover:outline-primary
                       focus-visible:outline-3 focus-visible:outline-primary"
                class:outline-3={post.tags.length === 0}
                class:outline-error={post.tags.length === 0}
            >
                <img
                    src={post.thumbnailUrl}
                    alt=""
                    loading="lazy"
                    class="size-full object-cover transition group-hover:opacity-90"
                />
            </a>

            <div class="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-1 text-[0.7rem]">
                {#if post.type !== 'image'}
                    <span class="badge badge-neutral badge-sm">{post.type}</span>
                {:else}
                    <span></span>
                {/if}
                <span class="flex gap-1">
                    {#if post.score}<span class="badge badge-neutral badge-sm">▲{post.score}</span>{/if}
                    {#if post.favoriteCount}<span class="badge badge-neutral badge-sm">♥{post.favoriteCount}</span>{/if}
                    {#if post.commentCount}<span class="badge badge-neutral badge-sm">💬{post.commentCount}</span>{/if}
                </span>
            </div>

            {#if bulk.tags.length}
                <form method="POST" action="?/bulkTag" use:enhance class="absolute left-1 top-1">
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="version" value={post.version} />
                    <input type="hidden" name="tags" value={bulk.tags.join(' ')} />
                    <input type="hidden" name="mode" value={isTagged(post) ? 'remove' : 'add'} />
                    <button class="btn btn-circle btn-xs" class:btn-success={!isTagged(post)} class:btn-error={isTagged(post)}>
                        {isTagged(post) ? '−' : '+'}
                    </button>
                </form>
            {/if}

            {#if bulk.safety}
                <div class="absolute left-1 top-1 flex gap-1">
                    {#each ['safe', 'sketchy', 'unsafe'] as safety (safety)}
                        <form method="POST" action="?/bulkSafety" use:enhance>
                            <input type="hidden" name="id" value={post.id} />
                            <input type="hidden" name="version" value={post.version} />
                            <input type="hidden" name="safety" value={safety} />
                            <button
                                aria-label={safety}
                                class="size-4 rounded-sm ring-2"
                                class:opacity-40={post.safety !== safety}
                                class:bg-success={safety === 'safe'}
                                class:bg-warning={safety === 'sketchy'}
                                class:bg-error={safety === 'unsafe'}
                            ></button>
                        </form>
                    {/each}
                </div>
            {/if}

            {#if bulk.delete}
                <label class="absolute left-1 top-1">
                    <input form="bulk-delete" type="checkbox" name="selected" value={post.id} class="checkbox checkbox-error checkbox-sm" />
                    <input form="bulk-delete" type="hidden" name="version" value={`${post.id}:${post.version}`} />
                </label>
            {/if}
        </li>
    {/each}
</ul>

{#if bulk.delete}
    <form id="bulk-delete" method="POST" action="?/bulkDelete" use:enhance class="mt-4">
        <button class="btn btn-error btn-sm" onclick={(e) => !confirm('選択した投稿を削除しますか？') && e.preventDefault()}>
            Delete selected posts
        </button>
    </form>
{/if}