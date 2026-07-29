<script lang="ts">
    import Autocomplete from './Autocomplete.svelte';

    let {
        action,
        query = '',
        placeholder = 'search…',
        helpHref = '/help/search',
        kind = 'tag'
    }: {
        action: string;
        query?: string;
        placeholder?: string;
        helpHref?: string;
        kind?: 'tag' | 'pool';
    } = $props();

    let input: HTMLInputElement | undefined = $state();
</script>

<form method="GET" {action} class="flex flex-wrap items-center gap-2" data-sveltekit-keepfocus>
    <div class="relative grow">
        <input
            bind:this={input}
            name="query"
            value={query}
            {placeholder}
            autocomplete="off"
            class="input input-bordered w-full"
        />
        {#if input}
            <Autocomplete target={input} {kind} negation={kind === 'tag'} />
        {/if}
    </div>
    <button class="btn btn-primary">検索</button>
    <a class="btn btn-ghost" href={helpHref}>検索ヘルプ</a>
</form>