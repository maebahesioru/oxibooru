<script lang="ts">
    import { enhance } from '$app/forms';

    let {
        action,
        value = '',
        version,
        id,
        oncancel
    }: {
        action: string;
        value?: string;
        version?: number;
        id?: number;
        oncancel?: () => void;
    } = $props();

    let text = $state(value);
    let tab = $state<'write' | 'preview'>('write');
    let previewHtml = $state('');

    async function preview() {
        tab = 'preview';
        const res = await fetch('/api/preview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        previewHtml = (await res.json()).html;
    }
</script>

<form method="POST" {action} use:enhance={() => async ({ update }) => { await update(); text = ''; tab = 'write'; }}>
    {#if id !== undefined}<input type="hidden" name="id" value={id} />{/if}
    {#if version !== undefined}<input type="hidden" name="version" value={version} />{/if}

    <div role="tablist" class="tabs tabs-lift">
        <button type="button" role="tab" class="tab" class:tab-active={tab === 'write'} onclick={() => (tab = 'write')}>
            Write
        </button>
        <button type="button" role="tab" class="tab" class:tab-active={tab === 'preview'} onclick={preview}>
            Preview
        </button>
    </div>

    <div class="rounded-b-box border border-t-0 border-base-300 p-3">
        {#if tab === 'write'}
            <textarea
                name="text"
                bind:value={text}
                required
                minlength="1"
                rows="5"
                class="textarea textarea-bordered w-full"
                placeholder="Markdown が使えます"
            ></textarea>
        {:else}
            <div class="md min-h-24">{@html previewHtml}</div>
            <input type="hidden" name="text" value={text} />
        {/if}
        <div class="mt-2 flex gap-2">
            <button class="btn btn-primary btn-sm">保存</button>
            {#if oncancel}
                <button type="button" class="btn btn-ghost btn-sm" onclick={oncancel}>キャンセル</button>
            {/if}
        </div>
    </div>
</form>