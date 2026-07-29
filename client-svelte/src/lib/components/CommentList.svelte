<script lang="ts">
    import { enhance } from '$app/forms';
    import CommentEditor from './CommentEditor.svelte';
    import { formatRelativeTime, absUrl } from '$lib/format';
    import type { Comment, User } from '$lib/types';

    let {
        comments,
        rendered,
        currentUser,
        canScore = false
    }: {
        comments: Comment[];
        rendered: { id: number; html: string }[];
        currentUser: User | null;
        canScore?: boolean;
    } = $props();

    let editing = $state<number | null>(null);
    const htmlOf = (id: number) => rendered.find((r) => r.id === id)?.html ?? '';
    const isOwn = (c: Comment) => !!currentUser && c.user?.name === currentUser.name;
</script>

<section class="mt-6 space-y-4">
    <h2 class="text-lg">コメント ({comments.length})</h2>
    {#each comments as comment (comment.id)}
        <article class="card card-border bg-base-200">
            <div class="card-body gap-2 p-4">
                <header class="flex flex-wrap items-center gap-2 text-sm">
                    {#if comment.user}
                        <img src={absUrl(comment.user.avatarUrl)} alt="" class="size-6 rounded-full" />
                        <a class="link font-medium" href={`/user/${comment.user.name}`}>{comment.user.name}</a>
                    {:else}
                        <span class="font-medium opacity-70">匿名</span>
                    {/if}
                    <span class="opacity-60">がコメント {formatRelativeTime(comment.creationTime)}</span>

                    <span class="ml-auto flex items-center gap-1">
                        {#if canScore}
                            <form method="POST" action="?/scoreComment" use:enhance>
                                <input type="hidden" name="id" value={comment.id} />
                                <input type="hidden" name="score" value={comment.ownScore === 1 ? 0 : 1} />
                                <button class="btn btn-ghost btn-xs" class:text-primary={comment.ownScore === 1}>▲</button>
                            </form>
                            <span class="font-mono text-xs">{comment.score}</span>
                            <form method="POST" action="?/scoreComment" use:enhance>
                                <input type="hidden" name="id" value={comment.id} />
                                <input type="hidden" name="score" value={comment.ownScore === -1 ? 0 : -1} />
                                <button class="btn btn-ghost btn-xs" class:text-primary={comment.ownScore === -1}>▼</button>
                            </form>
                        {:else}
                            <span class="font-mono text-xs">▲ {comment.score}</span>
                        {/if}

                        {#if isOwn(comment)}
                            <button class="btn btn-ghost btn-xs" onclick={() => (editing = comment.id)}>edit</button>
                            <form method="POST" action="?/deleteComment" use:enhance>
                                <input type="hidden" name="id" value={comment.id} />
                                <input type="hidden" name="version" value={comment.version} />
                                <button
                                    class="btn btn-ghost btn-xs text-error"
                                    onclick={(e) => !confirm('このコメントを削除しますか？') && e.preventDefault()}
                                >
                                    delete
                                </button>
                            </form>
                        {/if}
                    </span>
                </header>

                {#if editing === comment.id}
                    <CommentEditor
                        action="?/editComment"
                        id={comment.id}
                        version={comment.version}
                        value={comment.text}
                        oncancel={() => (editing = null)}
                    />
                {:else}
                    <div class="md">{@html htmlOf(comment.id)}</div>
                {/if}
            </div>
        </article>
    {/each}
</section>