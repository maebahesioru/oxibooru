<script lang="ts">
    import FileDropper from '$lib/components/FileDropper.svelte';
    import TagInput from '$lib/components/TagInput.svelte';
    import type { ActionData, PageData } from './$types';

    let { data, form }: { data: PageData; form: ActionData } = $props();
    let submitting = $state(false);
</script>

<div class="mx-auto w-full max-w-2xl">
    <h1 class="mb-4 text-2xl">Upload</h1>

    {#if form?.message}
        <div role="alert" class="alert alert-error mb-4 whitespace-pre-line">{form.message}</div>
    {/if}

    <form
        method="POST"
        enctype="multipart/form-data"
        class="space-y-4"
        onsubmit={() => (submitting = true)}
    >
        <FileDropper
            name="content"
            multiple
            hint=".jpg .png .gif .webm .mp4 .swf .avif .heif"
        />

        <label class="form-control">
            <span class="label-text mb-1 block">URL（改行区切り）</span>
            <textarea name="urls" rows="3" class="textarea textarea-bordered w-full" placeholder="https://…"></textarea>
        </label>

        {#if data.safetyEnabled}
            <fieldset class="fieldset rounded-box border border-base-300 p-3">
                <legend class="fieldset-legend">Safety</legend>
                <div class="join w-full">
                    {#each ['safe', 'sketchy', 'unsafe'] as safety (safety)}
                        <input
                            type="radio"
                            name="safety"
                            value={safety}
                            checked={safety === 'safe'}
                            class="btn join-item flex-1"
                            aria-label={safety}
                        />
                    {/each}
                </div>
            </fieldset>
        {/if}

        <fieldset class="fieldset rounded-box border border-base-300 p-3">
            <legend class="fieldset-legend">共通タグ</legend>
            <TagInput name="tags" />
        </fieldset>

        <label class="label cursor-pointer justify-start gap-2">
            <input type="checkbox" name="skipDuplicates" class="checkbox" checked /> 重複はスキップ
        </label>

        {#if data.canUploadAnonymously}
            <label class="label cursor-pointer justify-start gap-2">
                <input type="checkbox" name="anonymous" class="checkbox" /> 匿名でアップロード
            </label>
        {/if}

        <button class="btn btn-primary" disabled={submitting}>
            {#if submitting}<span class="loading loading-spinner loading-sm"></span>{/if}
            Upload
        </button>
    </form>
</div>