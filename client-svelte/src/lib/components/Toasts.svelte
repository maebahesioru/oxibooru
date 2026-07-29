<script lang="ts">
    import { fly } from 'svelte/transition';
    import type { Flash } from '$lib/server/flash';

    let { flash }: { flash: Flash | null } = $props();
    let visible = $state(true);

    $effect(() => {
        if (!flash) return;
        visible = true;
        const timer = setTimeout(() => (visible = false), 6000);
        return () => clearTimeout(timer);
    });

    const cls = $derived(
        flash?.type === 'error' ? 'alert-error' : flash?.type === 'info' ? 'alert-info' : 'alert-success'
    );
</script>

{#if flash && visible}
    <div class="toast toast-end z-50" transition:fly={{ y: 20 }}>
        <div class="alert {cls} max-w-md shadow-lg">
            <span>{flash.message}</span>
            <button class="btn btn-ghost btn-xs" onclick={() => (visible = false)}>✕</button>
        </div>
    </div>
{/if}