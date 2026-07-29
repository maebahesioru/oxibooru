<script lang="ts">
    import { cssCategory } from '$lib/format';

    type Suggestion = { value: string; label: string; count: number; category: string };

    let {
        target,
        kind = 'tag',
        negation = false,
        onconfirm
    }: {
        target: HTMLInputElement;
        kind?: 'tag' | 'pool';
        negation?: boolean;
        onconfirm?: (value: string) => void;
    } = $props();

    let results = $state<Suggestion[]>([]);
    let active = $state(-1);
    let open = $state(false);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;

    function currentWord(): string {
        const start = target.selectionStart ?? target.value.length;
        return target.value.slice(0, start).replace(/.*[\s,]+/, '');
    }

    function replaceWord(value: string) {
        const start = target.selectionStart ?? target.value.length;
        const head = target.value.slice(0, start).replace(/[^\s,]*$/, '');
        const tail = target.value.slice(start).replace(/^[^\s,]*/, '');
        target.value = `${head}${value}${tail.startsWith(' ') ? '' : ' '}${tail.trimStart()}`;
        const caret = head.length + value.length + 1;
        target.setSelectionRange(caret, caret);
        target.focus();
        target.dispatchEvent(new Event('input', { bubbles: true }));
    }

    async function search() {
        const text = currentWord();
        if (!text || (negation && text === '-')) {
            open = false;
            return;
        }
        controller?.abort();
        controller = new AbortController();
        try {
            const res = await fetch(
                `/api/complete?kind=${kind}&text=${encodeURIComponent(text)}`,
                { signal: controller.signal }
            );
            const data = (await res.json()) as { results: Suggestion[] };
            results = data.results;
            active = -1;
            open = results.length > 0;
        } catch {
            /* aborted */
        }
    }

    function confirm(index: number) {
        const item = results[index];
        if (!item) return;
        if (onconfirm) onconfirm(item.value);
        else replaceWord(item.value);
        open = false;
    }

    function onkeydown(e: KeyboardEvent) {
        if (!open) return;
        if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
            e.preventDefault();
            active = (active + 1) % results.length;
        } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
            e.preventDefault();
            active = (active - 1 + results.length) % results.length;
        } else if (e.key === 'Enter' && active >= 0) {
            e.preventDefault();
            confirm(active);
        } else if (e.key === 'Escape') {
            open = false;
        }
    }

    $effect(() => {
        const oninput = () => {
            clearTimeout(timer);
            timer = setTimeout(search, 200);
        };
        const onblur = () => setTimeout(() => (open = false), 120);

        target.setAttribute('autocomplete', 'off');
        target.addEventListener('input', oninput);
        target.addEventListener('keydown', onkeydown);
        target.addEventListener('blur', onblur);
        return () => {
            clearTimeout(timer);
            target.removeEventListener('input', oninput);
            target.removeEventListener('keydown', onkeydown);
            target.removeEventListener('blur', onblur);
        };
    });
</script>

{#if open}
    <ul class="menu absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-box border border-primary bg-base-100 p-1 shadow-xl">
        {#each results as item, i (item.value)}
            <li>
                <button
                    type="button"
                    class="justify-between"
                    class:menu-active={i === active}
                    onmouseenter={() => (active = i)}
                    onmousedown={(e) => {
                        e.preventDefault();
                        confirm(i);
                    }}
                >
                    <span class={cssCategory(item.category, kind)}>{item.label}</span>
                    <span class="opacity-60">{item.count}</span>
                </button>
            </li>
        {/each}
    </ul>
{/if}