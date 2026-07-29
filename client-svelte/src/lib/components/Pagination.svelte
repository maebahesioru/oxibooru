<script lang="ts">
    let {
        offset,
        limit,
        total,
        makeHref
    }: {
        offset: number;
        limit: number;
        total: number;
        makeHref: (offset: number) => string;
    } = $props();

    const current = $derived(Math.floor(offset / limit) + 1);
    const pages = $derived(Math.max(1, Math.ceil(total / limit)));

    const visible = $derived.by(() => {
        const set = new Set<number>();
        for (let i = 1; i <= 2; i++) set.add(i);
        for (let i = pages - 1; i <= pages; i++) set.add(i);
        for (let i = current - 2; i <= current + 2; i++) set.add(i);
        return [...set].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
    });
</script>

{#if pages > 1}
    <nav class="mt-6 flex justify-center">
        <div class="join">
            <a
                class="btn join-item btn-sm"
                class:btn-disabled={current === 1}
                href={makeHref((current - 2) * limit)}
                rel="prev">«</a
            >
            {#each visible as page, i (page)}
                {#if i > 0 && page !== visible[i - 1] + 1}
                    <span class="btn btn-disabled join-item btn-sm">…</span>
                {/if}
                <a
                    class="btn join-item btn-sm"
                    class:btn-active={page === current}
                    href={makeHref((page - 1) * limit)}>{page}</a
                >
            {/each}
            <a
                class="btn join-item btn-sm"
                class:btn-disabled={current === pages}
                href={makeHref(current * limit)}
                rel="next">»</a
            >
        </div>
    </nav>
{/if}