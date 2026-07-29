<script lang="ts">
    import { page } from '$app/state';
    import PoolTargetInput from '$lib/components/PoolTargetInput.svelte';
    import { cssCategory, prettyTagName } from '$lib/format';
    import type { ActionData, PageData } from './$types';

    let { data, form }: { data: PageData; form: ActionData } = $props();
    const pool = $derived(data.pool);
    let section = $state<'summary' | 'edit' | 'merge' | 'delete'>('summary');
    const pretty = (n: string) => prettyTagName(n, page.data.settings.tagUnderscoresAsSpaces);
    const searchable = $derived(
        pool.names[0] && !/^\d+$/.test(pool.names[0]) ? pool.names[0] : String(pool.id)
    );
</script>

<div class="mx-auto w-full max-w-3xl">
    <h1 class="mb-4 text-2xl break-all">{pretty(pool.names[0])}</h1>

    <div role="tablist" class="tabs tabs-lift">
        <button role="tab" class="tab" class:tab-active={section === 'summary'} onclick={() => (section = 'summary')}>Summary</button>
        {#if data.can.edit}<button role="tab" class="tab" class:tab-active={section === 'edit'} onclick={() => (section = 'edit')}>Edit</button>{/if}
        {#if data.can.merge}<button role="tab" class="tab" class:tab-active={section === 'merge'} onclick={() => (section = 'merge')}>Merge</button>{/if}
        {#if data.can.delete}<button role="tab" class="tab text-error" class:tab-active={section === 'delete'} onclick={() => (section = 'delete')}>Delete</button>{/if}
    </div>

    <div class="rounded-b-box border border-t-0 border-base-300 p-4">
        {#if form?.message}<div role="alert" class="alert alert-error mb-4">{form.message}</div>{/if}

        {#if section === 'summary'}
            <p class="text-sm">
                <span class="opacity-70">Category:</span>
                <span class={cssCategory(pool.category, 'pool')}>{pool.category}</span>
            </p>
            <p class="mt-2 text-sm">
                <span class="opacity-70">Aliases:</span>
                {pool.names.slice(1).map(pretty).join(', ') || '(none)'}
            </p>
            <div class="divider"></div>
            <div class="md">{@html data.descriptionHtml || '<p>This pool has no description yet.</p>'}</div>
            <p class="mt-4">
                <a class="link" href={`/posts?query=pool:${encodeURIComponent(searchable)}`}>
                    {pool.postCount} post(s)
                </a>
            </p>
            {#if pool.posts?.length}
                <ul class="mt-4 grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
                    {#each pool.posts as post (post.id)}
                        <li>
                            <a href={`/post/${post.id}`}>
                                <img src={post.thumbnailUrl} alt="" class="aspect-4/3 w-full rounded object-cover" />
                            </a>
                        </li>
                    {/each}
                </ul>
            {/if}
        {:else if section === 'edit'}
            <form method="POST" action="?/save" class="space-y-4">
                <input type="hidden" name="version" value={pool.version} />
                {#if data.can.names}
                    <label class="form-control">
                        <span class="label-text mb-1 block">Names</span>
                        <input name="names" required value={pool.names.join(' ')} class="input input-bordered w-full" />
                    </label>
                {/if}
                {#if data.can.category}
                    <label class="form-control">
                        <span class="label-text mb-1 block">Category</span>
                        <select name="category" class="select select-bordered w-full">
                            {#each data.categories as c (c)}
                                <option value={c} selected={c === pool.category}>{c}</option>
                            {/each}
                        </select>
                    </label>
                {/if}
                {#if data.can.description}
                    <label class="form-control">
                        <span class="label-text mb-1 block">Description</span>
                        <textarea name="description" rows="8" class="textarea textarea-bordered w-full">{pool.description ?? ''}</textarea>
                    </label>
                {/if}
                {#if data.can.posts}
                    <label class="form-control">
                        <span class="label-text mb-1 block">Posts</span>
                        <input
                            name="posts"
                            value={(pool.posts ?? []).map((p) => p.id).join(' ')}
                            placeholder="space-separated post IDs"
                            class="input input-bordered w-full"
                        />
                    </label>
                {/if}
                <button class="btn btn-primary">Save changes</button>
            </form>
        {:else if section === 'merge'}
            <form method="POST" action="?/merge" class="space-y-4">
                <p class="text-sm opacity-70">2 つのプールの投稿が統合されます。カテゴリは手動で調整してください。</p>
                <PoolTargetInput name="target" />
                <label class="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" required class="checkbox" /> 統合することを確認しました。
                </label>
                <button class="btn btn-warning">Merge pool</button>
            </form>
        {:else}
            <form method="POST" action="?/delete" class="space-y-4">
                <input type="hidden" name="version" value={pool.version} />
                <p>このプールには {pool.postCount} 件の投稿があります。</p>
                <label class="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" required class="checkbox" /> 削除することを確認しました。
                </label>
                <button class="btn btn-error">Delete pool</button>
            </form>
        {/if}
    </div>
</div>