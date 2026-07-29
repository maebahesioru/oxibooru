<script lang="ts">
    import '../app.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import Toasts from '$lib/components/Toasts.svelte';
    import { cssCategory } from '$lib/format';
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';

    let { data, children }: { data: LayoutData; children: Snippet } = $props();

    // カテゴリ色は DB 由来なので動的 <style> で注入（旧 tags.js / pools.js の代替）
    const categoryStyles = $derived(
        [
            ...data.tagCategories.map((c) => `.${cssCategory(c.name, 'tag')}{color:${c.color}}`),
            ...data.poolCategories.map((c) => `.${cssCategory(c.name, 'pool')}{color:${c.color}}`)
        ].join('\n')
    );
</script>

<svelte:head>
    <title>{data.siteName}</title>
    {@html `<style>${categoryStyles}</style>`}
</svelte:head>

<div class="flex min-h-dvh flex-col">
    <Navbar
        siteName={data.siteName}
        user={data.user}
        nav={data.nav}
        pathname={data.pathname}
    />

    <main class="mx-auto w-full max-w-[100rem] flex-1 px-4 py-6 sm:px-6">
        {@render children()}
    </main>

    <footer class="border-t border-base-300 bg-base-200 p-4 text-center text-xs">
        {data.siteName} &middot;
        <a class="link" href="/help">ヘルプ</a> &middot;
        <a class="link" href="/history">履歴</a>
    </footer>
</div>

<Toasts flash={data.flash} />