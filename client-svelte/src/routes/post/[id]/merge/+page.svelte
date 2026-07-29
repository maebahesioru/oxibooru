<script lang="ts">
    import { formatFileSize, formatRelativeTime, mimeLabel } from '$lib/format';
    import type { Post } from '$lib/types';
    import type { ActionData, PageData } from './$types';

    let { data, form }: { data: PageData; form: ActionData } = $props();

    const sides = $derived([
        { name: 'left', post: data.left as Post | null, editable: false },
        { name: 'right', post: data.right, editable: true }
    ]);
</script>

<div class="mx-auto w-full max-w-3xl">
    <h1 class="mb-4 text-2xl">Merge post #{data.left.id}</h1>

    {#if form?.message}<div role="alert" class="alert alert-error mb-4">{form.message}</div>{/if}
    {#if data.lookupError}<div role="alert" class="alert alert-warning mb-4">{data.lookupError}</div>{/if}

    <form method="POST" action="?/merge" class="space-y-4">
        <input type="hidden" name="leftId" value={data.left.id} />
        <input type="hidden" name="leftVersion" value={data.left.version} />
        {#if data.right}
            <input type="hidden" name="rightId" value={data.right.id} />
            <input type="hidden" name="rightVersion" value={data.right.version} />
        {/if}

        <div class="grid gap-4 sm:grid-cols-2">
            {#each sides as side (side.name)}
                <div class="card card-border bg-base-200">
                    <div class="card-body gap-3 p-4">
                        {#if side.editable}
                            <form method="GET" class="join">
                                <input
                                    name="target"
                                    value={side.post?.id ?? ''}
                                    pattern="^[0-9]+$"
                                    placeholder="Post #"
                                    class="input input-bordered join-item input-sm w-full"
                                />
                                <button class="btn join-item btn-sm">Search</button>
                            </form>
                        {:else}
                            <p class="font-mono text-sm">Post #{side.post?.id}</p>
                        {/if}

                        {#if side.post}
                            <a href={side.post.contentUrl} rel="external">
                                <img src={side.post.thumbnailUrl} alt="" class="h-40 w-full rounded object-cover" />
                            </a>

                            <label class="label cursor-pointer items-start justify-start gap-2">
                                <input type="radio" name="target" value={side.name} required class="radio radio-primary" />
                                <span class="text-sm">
                                    Merge to this post<br />
                                    <span class="opacity-60">
                                        {side.post.user?.name ?? 'Anonymous'},
                                        {formatRelativeTime(side.post.creationTime)}
                                    </span>
                                </span>
                            </label>

                            <label class="label cursor-pointer items-start justify-start gap-2">
                                <input type="radio" name="content" value={side.name} required class="radio radio-secondary" />
                                <span class="text-sm">
                                    Use this file<br />
                                    <span class="opacity-60">
                                        {formatFileSize(side.post.fileSize)} {mimeLabel(side.post.mimeType)}
                                        ({side.post.canvasWidth}×{side.post.canvasHeight})
                                    </span>
                                </span>
                            </label>
                        {:else}
                            <p class="py-10 text-center text-sm opacity-50">投稿を検索してください</p>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>

        <p class="text-sm opacity-70">
            タグ・関連・スコア・お気に入り・コメントが統合されます。その他の属性は手動で調整してください。
        </p>

        <label class="label cursor-pointer justify-start gap-2">
            <input type="checkbox" required class="checkbox" /> 統合することを確認しました。
        </label>

        <button class="btn btn-warning" disabled={!data.right}>Merge posts</button>
    </form>
</div>