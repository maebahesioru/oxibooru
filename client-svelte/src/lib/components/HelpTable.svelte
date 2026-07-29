<script lang="ts">
    import type { Row } from '$lib/help';

    let {
        head,
        rows,
        mono = false
    }: { head?: string[]; rows: Row[]; mono?: boolean } = $props();
</script>

<div class="overflow-x-auto rounded-box border border-base-300">
    <table class="table table-sm">
        {#if head}
            <thead>
                <tr>{#each head as h (h)}<th>{h}</th>{/each}</tr>
            </thead>
        {/if}
        <tbody>
            {#each rows as row (row[0])}
                <tr>
                    <td class={mono ? 'font-mono whitespace-nowrap align-top' : 'align-top'}>{row[0]}</td>
                    <td>{row[1]}</td>
                    {#if row[2]}<td>{row[2]}</td>{/if}
                </tr>
            {/each}
        </tbody>
    </table>
</div>