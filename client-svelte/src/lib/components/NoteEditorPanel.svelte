<script lang="ts">
    import type { Note } from '$lib/types';

    let {
        notes = $bindable([] as Note[])
    }: { notes: Note[] } = $props();

    let selected = $state<number | null>(null);

    function addRect() {
        notes = [
            ...notes,
            {
                polygon: [
                    [0.4, 0.4],
                    [0.6, 0.4],
                    [0.6, 0.6],
                    [0.4, 0.6]
                ],
                text: '…'
            }
        ];
        selected = notes.length - 1;
    }

    function removeSelected() {
        if (selected === null) return;
        notes = notes.filter((_, i) => i !== selected);
        selected = null;
    }

    async function copyAll() {
        await navigator.clipboard.writeText(JSON.stringify(notes));
        alert('Notes copied to clipboard.');
    }

    function pasteAll() {
        const text = window.prompt('Please enter the exported notes snapshot:');
        if (!text) return;
        try {
            notes = JSON.parse(text) as Note[];
            selected = null;
        } catch {
            alert('JSON が不正です。');
        }
    }
</script>

<div class="space-y-2">
    <div class="flex flex-wrap gap-1">
        <button type="button" class="btn btn-sm" onclick={addRect}>注釈を追加</button>
        <button type="button" class="btn btn-error btn-sm" disabled={selected === null} onclick={removeSelected}>
            Delete
        </button>
        <button type="button" class="btn btn-ghost btn-sm" onclick={copyAll}>エクスポート</button>
        <button type="button" class="btn btn-ghost btn-sm" onclick={pasteAll}>インポート</button>
    </div>

    <ul class="max-h-40 space-y-1 overflow-y-auto text-sm">
        {#each notes as note, i (i)}
            <li>
                <button
                    type="button"
                    class="btn btn-ghost btn-xs w-full justify-start truncate"
                    class:btn-active={selected === i}
                    onclick={() => (selected = i)}
                >
                    #{i + 1} {note.text}
                </button>
            </li>
        {/each}
    </ul>

    {#if selected !== null}
        <textarea
            class="textarea textarea-bordered w-full"
            rows="5"
            placeholder="Content (supports Markdown)"
            bind:value={notes[selected].text}
        ></textarea>
    {/if}
</div>