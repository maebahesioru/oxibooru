<script lang="ts">
    import { page } from '$app/state';
    import PostContent from '$lib/components/PostContent.svelte';
    import TagInput from '$lib/components/TagInput.svelte';
    import FileDropper from '$lib/components/FileDropper.svelte';
    import type { Note } from '$lib/types';
    import type { ActionData, PageData } from './$types';

    let { data, form }: { data: PageData; form: ActionData } = $props();

    const post = $derived(data.post);
    let notes = $state<Note[]>(structuredClone(data.post.notes ?? []));
    let notesJson = $derived(JSON.stringify(notes));
</script>

<h1 class="mb-4 text-2xl">Edit post #{post.id}</h1>

{#if form?.message}
    <div role="alert" class="alert alert-error mb-4">{form.message}</div>
{/if}

<form method="POST" action="?/save" enctype="multipart/form-data" class="flex flex-col gap-4 lg:flex-row">
    <input type="hidden" name="version" value={post.version} />

    <div class="min-w-0 flex-1 space-y-4">
        <PostContent
            {post}
            editableNotes={data.can.notes}
            onnoteschange={(n) => (notes = n)}
            transparencyGrid={page.data.settings.transparencyGrid}
        />
        {#if data.can.notes}
            <input type="hidden" name="notes" value={notesJson} />
        {/if}

        {#if data.can.description}
            <label class="form-control">
                <span class="label-text mb-1 block">Description</span>
                <textarea name="description" rows="8" class="textarea textarea-bordered w-full"
                    >{post.description ?? ''}</textarea
                >
            </label>
        {/if}
    </div>

    <aside class="w-full shrink-0 space-y-4 lg:w-96">
        <button class="btn btn-primary w-full">Save</button>

        {#if page.data.safetyEnabled && data.can.safety}
            <fieldset class="fieldset rounded-box border border-base-300 p-3">
                <legend class="fieldset-legend">Safety</legend>
                <div class="join w-full">
                    {#each ['safe', 'sketchy', 'unsafe'] as safety (safety)}
                        <input
                            type="radio"
                            name="safety"
                            value={safety}
                            checked={post.safety === safety}
                            class="btn join-item flex-1"
                            aria-label={safety}
                        />
                    {/each}
                </div>
            </fieldset>
        {/if}

        {#if data.can.tags}
            <fieldset class="fieldset rounded-box border border-base-300 p-3">
                <legend class="fieldset-legend">Tags ({post.tags.length})</legend>
                <TagInput name="tags" initial={post.tags} />
            </fieldset>
        {/if}

        {#if data.can.relations}
            <label class="form-control">
                <span class="label-text mb-1 block">Relations</span>
                <input
                    name="relations"
                    value={post.relations.map((r) => r.id).join(' ')}
                    pattern="^[0-9 ]*$"
                    placeholder="space-separated post IDs"
                    class="input input-bordered w-full"
                />
            </label>
        {/if}

        {#if data.can.flags && post.type === 'video'}
            <fieldset class="fieldset rounded-box border border-base-300 p-3">
                <legend class="fieldset-legend">Flags</legend>
                <label class="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" name="flagLoop" class="checkbox" checked={post.flags.includes('loop')} />
                    Loop video
                </label>
                <label class="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" name="flagSound" class="checkbox" checked={post.flags.includes('sound')} />
                    Has sound
                </label>
            </fieldset>
        {/if}

        {#if data.can.source}
            <label class="form-control">
                <span class="label-text mb-1 block">Source</span>
                <textarea name="source" rows="3" class="textarea textarea-bordered w-full">{post.source ?? ''}</textarea>
            </label>
        {/if}

        {#if data.can.content}
            <fieldset class="fieldset rounded-box border border-base-300 p-3">
                <legend class="fieldset-legend">Replace content</legend>
                <FileDropper name="content" urlName="contentUrl" allowUrls />
            </fieldset>
        {/if}

        {#if data.can.thumbnail}
            <fieldset class="fieldset rounded-box border border-base-300 p-3">
                <legend class="fieldset-legend">Custom thumbnail</legend>
                <FileDropper name="thumbnail" />
            </fieldset>
        {/if}

        <div class="rounded-box border border-base-300 p-3">
            <p class="mb-2 text-sm font-medium">Management</p>
            <div class="flex flex-col gap-2">
                {#if data.can.feature}
                    <button class="btn btn-outline btn-sm" formaction="?/feature">Feature on main page</button>
                {/if}
                {#if data.can.merge}
                    <a class="btn btn-outline btn-sm" href={`/post/${post.id}/merge`}>Merge with another post</a>
                {/if}
                {#if data.can.delete}
                    <button
                        class="btn btn-error btn-outline btn-sm"
                        formaction="?/delete"
                        onclick={(e) => !confirm('この投稿を削除しますか？') && e.preventDefault()}
                    >
                        Delete this post
                    </button>
                {/if}
            </div>
        </div>
    </aside>
</form>