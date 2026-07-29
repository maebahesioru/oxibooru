<script lang="ts">
    import Autocomplete from './Autocomplete.svelte';
    import { cssCategory } from '$lib/format';
    import type { MicroTag } from '$lib/types';

    let {
        name,
        initial = [],
        kind = 'tag'
    }: { name: string; initial?: MicroTag[]; kind?: 'tag' | 'pool' } = $props();

    let tags = $state(
        initial.map((t) => ({ name: t.names[0], category: t.category, usages: t.usages }))
    );
    let draft = $state('');
    let input: HTMLInputElement | undefined = $state();

    const value = $derived(tags.map((t) => t.name).join(' '));

    function add(raw: string) {
        for (const token of raw.split(/[\s,]+/).filter(Boolean)) {
            if (tags.some((t) => t.name.toLowerCase() === token.toLowerCase())) continue;
            tags = [{ name: token, category: 'default', usages: 0 }, ...tags];
        }
        draft = '';
    }

    function remove(name: string) {
        tags = tags.filter((t) => t.name !== name);
    }
</script>

<input type="hidden" {name} {value} />

<div class="relative">
    <div class="join w-full">
        <input
            bind:this={input}
            bind:value={draft}
            placeholder="type to add…"
            autocomplete="off"
            class="input input-bordered join-item w-full"
            onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    add(draft);
                }
            }}
        />
        <button type="button" class="btn btn-neutral join-item" onclick={() => add(draft)}>Add</button>
    </div>
    {#if input}
        <Autocomplete
            target={input}
            {kind}
            onconfirm={(v) => {
                add(v);
                draft = '';
            }}
        />
    {/if}
</div>

<ul class="mt-2 max-h-72 space-y-0.5 overflow-y-auto text-sm">
    {#each tags as tag (tag.name)}
        <li class="flex items-baseline gap-2">
            <button type="button" class="btn btn-ghost btn-xs text-error" onclick={() => remove(tag.name)}>×</button>
            <span class={`truncate ${cssCategory(tag.category, kind)}`}>{tag.name}</span>
            {#if tag.usages}<span class="ml-auto font-mono text-xs opacity-60">{tag.usages}</span>{/if}
        </li>
    {/each}
</ul>