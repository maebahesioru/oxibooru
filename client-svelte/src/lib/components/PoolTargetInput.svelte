<script lang="ts">
    import { cssCategory } from '$lib/format';

    let { name }: { name: string } = $props();

    type Hit = { id: number; label: string; count: number; category: string };

    let text = $state('');
    let hits = $state<Hit[]>([]);
    let chosen = $state<Hit | null>(null);
    let timer: ReturnType<typeof setTimeout>;

    async function search() {
        if (!text.trim()) {
            hits = [];
            return;
        }
        const res = await fetch(`/api/complete?kind=pool&text=${encodeURIComponent(text)}&withId=1`);
        hits = (await res.json()).results as Hit[];
    }
</script>

<input type="hidden" {name} value={chosen?.id ?? ''} />

<div class="relative">
    <label class="form-control">
        <span class="label-text mb-1 block">Target pool</span>
        <input
            bind:value={text}
            required={!chosen}
            autocomplete="off"
            class="input input-bordered w-full"
            oninput={() => {
                chosen = null;
                clearTimeout(timer);
                timer = setTimeout(search, 200);
            }}
        />
    </label>

    {#if hits.length && !chosen}
        <ul class="menu absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-box border border-primary bg-base-100 p-1 shadow-xl">
            {#each hits as hit (hit.id)}
                <li>
                    <button
                        type="button"
                        class="justify-between"
                        onclick={() => {
                            chosen = hit;
                            text = hit.label;
                            hits = [];
                        }}
                    >
                        <span class={cssCategory(hit.category, 'pool')}>{hit.label}</span>
                        <span class="opacity-60">{hit.count}</span>
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
</div>

{#if !chosen && text}
    <p class="mt-1 text-xs text-warning">候補から選択してください。</p>
{/if}