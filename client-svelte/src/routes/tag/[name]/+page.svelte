<script lang="ts">
    import { page } from '$app/state';
    import TagInput from '$lib/components/TagInput.svelte';
    import { cssCategory, escapeTagName, prettyTagName } from '$lib/format';
    import type { ActionData, PageData } from './$types';

    let { data, form }: { data: PageData; form: ActionData } = $props();
    const tag = $derived(data.tag);
    let section = $state<'summary' | 'edit' | 'merge' | 'delete'>('summary');
    const pretty = (n: string) => prettyTagName(n, page.data.settings.tagUnderscoresAsSpaces);
</script>

<div class="mx-auto w-full max-w-3xl">
    <h1 class="mb-4 text-2xl break-all">{pretty(tag.names[0])}</h1>

    <div role="tablist" class="tabs tabs-lift">
        <button role="tab" class="tab" class:tab-active={section === 'summary'} onclick={() => (section = 'summary')}>Summary</button>
        {#if data.can.edit}
            <button role="tab" class="tab" class:tab-active={section === 'edit'} onclick={() => (section = 'edit')}>Edit</button>
        {/if}
        {#if data.can.merge}
            <button role="tab" class="tab" class:tab-active={section === 'merge'} onclick={() => (section = 'merge')}>Merge</button>
        {/if}
        {#if data.can.delete}
            <button role="tab" class="tab text-error" class:tab-active={section === 'delete'} onclick={() => (section = 'delete')}>Delete</button>
        {/if}
    </div>

    <div class="rounded-b-box border border-t-0 border-base-300 p-4">
        {#if form?.message}
            <div role="alert" class="alert alert-error mb-4">{form.message}</div>
        {/if}

        {#if section === 'summary'}
            <dl class="space-y-2 text-sm">
                <div>
                    <dt class="inline opacity-70">Category:</dt>
                    <dd class={`inline ${cssCategory(tag.category, 'tag')}`}>{tag.category}</dd>
                </div>
                <div>
                    <dt class="opacity-70">Aliases:</dt>
                    <dd>{tag.names.slice(1).map(pretty).join(', ') || '(none)'}</dd>
                </div>
                <div>
                    <dt class="opacity-70">Implications:</dt>
                    <dd>{tag.implications.map((t) => pretty(t.names[0])).join(', ') || '(none)'}</dd>
                </div>
                <div>
                    <dt class="opacity-70">Suggestions:</dt>
                    <dd>{tag.suggestions.map((t) => pretty(t.names[0])).join(', ') || '(none)'}</dd>
                </div>
            </dl>
            <div class="divider"></div>
            <div class="md">{@html data.descriptionHtml || '<p>This tag has no description yet.</p>'}</div>
            <p class="mt-4">
                <a class="link" href={`/posts?query=${encodeURIComponent(escapeTagName(tag.names[0]))}`}>
                    {tag.usages} usage(s)
                </a>
            </p>
        {:else if section === 'edit'}
            <form method="POST" action="?/save" class="space-y-4">
                <input type="hidden" name="version" value={tag.version} />
                {#if data.can.names}
                    <label class="form-control">
                        <span class="label-text mb-1 block">Names</span>
                        <input name="names" required value={tag.names.join(' ')} class="input input-bordered w-full" />
                    </label>
                {/if}
                {#if data.can.category}
                    <label class="form-control">
                        <span class="label-text mb-1 block">Category</span>
                        <select name="category" class="select select-bordered w-full">
                            {#each data.categories as c (c)}
                                <option value={c} selected={c === tag.category}>{c}</option>
                            {/each}
                        </select>
                    </label>
                {/if}
                {#if data.can.implications}
                    <fieldset class="fieldset rounded-box border border-base-300 p-3">
                        <legend class="fieldset-legend">Implications</legend>
                        <TagInput name="implications" initial={tag.implications} />
                    </fieldset>
                {/if}
                {#if data.can.suggestions}
                    <fieldset class="fieldset rounded-box border border-base-300 p-3">
                        <legend class="fieldset-legend">Suggestions</legend>
                        <TagInput name="suggestions" initial={tag.suggestions} />
                    </fieldset>
                {/if}
                {#if data.can.description}
                    <label class="form-control">
                        <span class="label-text mb-1 block">Description</span>
                        <textarea name="description" rows="8" class="textarea textarea-bordered w-full">{tag.description ?? ''}</textarea>
                    </label>
                {/if}
                <button class="btn btn-primary">Save changes</button>
            </form>
        {:else if section === 'merge'}
            <form method="POST" action="?/merge" class="space-y-4">
                <p class="text-sm opacity-70">
                    使用箇所・示唆・含意が統合されます。カテゴリは手動で調整してください。
                </p>
                <label class="form-control">
                    <span class="label-text mb-1 block">Target tag</span>
                    <input name="target" required class="input input-bordered w-full" />
                </label>
                <label class="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" required class="checkbox" /> 統合を実行することを確認しました。
                </label>
                <button class="btn btn-warning">Merge tag</button>
            </form>
        {:else}
            <form method="POST" action="?/delete" class="space-y-4">
                <input type="hidden" name="version" value={tag.version} />
                <p>このタグは {tag.usages} 件の投稿で使用されています。</p>
                <label class="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" required class="checkbox" /> 削除することを確認しました。
                </label>
                <button class="btn btn-error">Delete tag</button>
            </form>
        {/if}
    </div>
</div>