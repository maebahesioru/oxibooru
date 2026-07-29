<script lang="ts">
    import { renderInlineMarkdown } from '$lib/markdown';
    import type { Note } from '$lib/types';

    let {
        notes = [],
        editable = false,
        onnoteschange
    }: {
        notes: Note[];
        editable?: boolean;
        onnoteschange?: (notes: Note[]) => void;
    } = $props();

    let hovered = $state<number | null>(null);
    let selected = $state<number | null>(null);
    let draft = $state<Note[]>([...notes]);
    let svg: SVGSVGElement | undefined = $state();
    let dragging = $state<{ note: number; point: number } | null>(null);

    const points = (note: Note) => note.polygon.map(([x, y]) => `${x},${y}`).join(' ');

    function toLocal(e: PointerEvent): [number, number] {
        const rect = svg!.getBoundingClientRect();
        return [(e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height];
    }

    function addRect() {
        draft = [...draft, { polygon: [[0.4, 0.4], [0.6, 0.4], [0.6, 0.6], [0.4, 0.6]], text: '…' }];
        selected = draft.length - 1;
        onnoteschange?.(draft);
    }

    function removeSelected() {
        if (selected === null) return;
        draft = draft.filter((_, i) => i !== selected);
        selected = null;
        onnoteschange?.(draft);
    }

    function onpointermove(e: PointerEvent) {
        if (!dragging) return;
        const [x, y] = toLocal(e);
        draft[dragging.note].polygon[dragging.point] = [
            Math.min(1, Math.max(0, x)),
            Math.min(1, Math.max(0, y))
        ];
        draft = [...draft];
    }
</script>

<svg
    bind:this={svg}
    viewBox="0 0 1 1"
    preserveAspectRatio="none"
    class="absolute inset-0 size-full"
    class:pointer-events-none={!editable && !notes.length}
    {onpointermove}
    onpointerup={() => {
        if (dragging) onnoteschange?.(draft);
        dragging = null;
    }}
>
    {#each (editable ? draft : notes) as note, i (i)}
        <g>
            <polygon
                points={points(note)}
                vector-effect="non-scaling-stroke"
                class="cursor-pointer stroke-1"
                class:fill-warning={i !== selected}
                class:fill-success={i === selected}
                fill-opacity="0.25"
                stroke="currentColor"
                onpointerenter={() => (hovered = i)}
                onpointerleave={() => (hovered = null)}
                onclick={() => editable && (selected = i)}
                role="presentation"
            />
            {#if editable && i === selected}
                {#each note.polygon as [x, y], p (p)}
                    <circle
                        cx={x}
                        cy={y}
                        r="0.008"
                        class="cursor-move fill-success"
                        onpointerdown={() => (dragging = { note: i, point: p })}
                        role="presentation"
                    />
                {/each}
            {/if}
        </g>
    {/each}
</svg>

{#if hovered !== null && !editable}
    {@const note = notes[hovered]}
    <div class="pointer-events-none absolute left-1/2 top-2 z-10 max-w-sm -translate-x-1/2 rounded-box bg-warning px-3 py-2 text-sm text-warning-content shadow-lg md">
        {@html renderInlineMarkdown(note.text)}
    </div>
{/if}

{#if editable}
    <div class="absolute right-2 top-2 z-10 flex gap-1">
        <button type="button" class="btn btn-xs" onclick={addRect}>+ note</button>
        <button type="button" class="btn btn-error btn-xs" disabled={selected === null} onclick={removeSelected}>
            delete
        </button>
        <input type="hidden name-placeholder" />
    </div>
    {#if selected !== null}
        <textarea
            class="textarea textarea-bordered absolute inset-x-2 bottom-2 z-10"
            rows="3"
            bind:value={draft[selected].text}
            oninput={() => onnoteschange?.(draft)}
        ></textarea>
    {/if}
{/if}