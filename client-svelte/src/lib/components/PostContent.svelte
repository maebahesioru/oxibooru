<script lang="ts">
    import NotesOverlay from './NotesOverlay.svelte';
    import type { Post } from '$lib/types';

    let {
        post,
        fitMode = 'fit-both',
        transparencyGrid = true,
        autoplay = false,
        upscale = false,
        editableNotes = false,
        onnoteschange
    }: {
        post: Post;
        fitMode?: string;
        transparencyGrid?: boolean;
        autoplay?: boolean;
        upscale?: boolean;
        editableNotes?: boolean;
        onnoteschange?: (notes: Post['notes']) => void;
    } = $props();

    let mode = $state(fitMode);

    const contentSrc = $derived(
        post.contentUrl.startsWith('/') || post.contentUrl.startsWith('http')
            ? post.contentUrl
            : `/${post.contentUrl}`
    );

    const fitClass = $derived(
        {
            'fit-both': 'max-h-[80dvh] max-w-full',
            'fit-width': 'w-full',
            'fit-height': 'max-h-[80dvh]',
            'fit-original': 'max-w-none'
        }[mode] ?? 'max-h-[80dvh] max-w-full'
    );
</script>

<figure
    class="relative mx-auto flex w-fit max-w-full items-center justify-center overflow-auto rounded-box"
    class:transparency-grid={transparencyGrid}
>
    {#if post.type === 'image' || post.type === 'animation'}
        <img
            src={contentSrc}
            alt=""
            draggable="false"
            width={post.canvasWidth}
            height={post.canvasHeight}
            class={`h-auto ${fitClass}`}
            class:max-w-full={!upscale && mode !== 'fit-original'}
        />
    {:else if post.type === 'video'}
        <!-- svelte-ignore a11y_media_has_caption -->
        <video
            controls
            playsinline
            {autoplay}
            loop={post.flags?.includes('loop')}
            muted={autoplay}
            class={`h-auto ${fitClass}`}
        >
            <source src={contentSrc} type={post.mimeType} />
        </video>
    {:else}
        <object
            data={contentSrc}
            width={post.canvasWidth}
            height={post.canvasHeight}
            title={`post ${post.id}`}
            class="bg-base-300"
        >
            <div role="alert" class="alert alert-warning">Flashはサポートされていません</div>
        </object>
    {/if}

    {#if post.type !== 'video' && post.type !== 'flash'}
        <NotesOverlay notes={post.notes ?? []} editable={editableNotes} {onnoteschange} />
    {/if}
</figure>

<div class="mt-2 flex flex-wrap justify-center gap-1 text-xs">
    {#each [['fit-original', 'オリジナル'], ['fit-width', '幅に合わせる'], ['fit-height', '高さに合わせる'], ['fit-both', '両方に合わせる']] as [value, label] (value)}
        <button class="btn btn-ghost btn-xs" class:btn-active={mode === value} onclick={() => (mode = value)}>
            {label}
        </button>
    {/each}
</div>