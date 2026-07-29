<script lang="ts">
    import { page } from '$app/state';
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';

    let { data, children }: { data: LayoutData; children: Snippet } = $props();

    const base = $derived(`/user/${encodeURIComponent(data.profile.name)}`);
    const tabs = $derived(
        [
            { href: base, label: '概要', show: true },
            { href: `${base}/edit`, label: '設定', show: data.can.editAnything },
            { href: `${base}/list-tokens`, label: 'ログイントークン', show: data.can.listTokens },
            { href: `${base}/delete`, label: '削除', show: data.can.delete }
        ].filter((t) => t.show)
    );
</script>

<div class="mx-auto w-full max-w-2xl">
    <h1 class="mb-4 text-2xl break-all">{data.profile.name}</h1>

    <div role="tablist" class="tabs tabs-lift">
        {#each tabs as tab (tab.href)}
            <a role="tab" class="tab" class:tab-active={page.url.pathname === tab.href} href={tab.href}>
                {tab.label}
            </a>
        {/each}
    </div>

    <div class="rounded-b-box border border-t-0 border-base-300 p-4">
        {@render children()}
    </div>
</div>