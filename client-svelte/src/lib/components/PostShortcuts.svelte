<script lang="ts">
    import { goto } from '$app/navigation';
    import Shortcuts from './Shortcuts.svelte';

    let {
        postId,
        prevPostId,
        nextPostId,
        query = '',
        editMode = false,
        onsave,
        ondelete
    }: {
        postId: number;
        prevPostId: number | null;
        nextPostId: number | null;
        query?: string;
        editMode?: boolean;
        onsave?: () => void;
        ondelete?: () => void;
    } = $props();

    const qs = $derived(query ? `?query=${encodeURIComponent(query)}` : '');
    const to = (id: number) => `/post/${id}${editMode ? '/edit' : ''}${qs}`;

    const bindings = $derived([
        { keys: ['a', 'left'], run: () => prevPostId && goto(to(prevPostId)) },
        { keys: ['d', 'right'], run: () => nextPostId && goto(to(nextPostId)) },
        {
            keys: ['e'],
            run: () => goto(editMode ? `/post/${postId}${qs}` : `/post/${postId}/edit${qs}`)
        },
        { keys: ['mod+s'], run: () => editMode && onsave?.() },
        { keys: ['del'], run: () => editMode && ondelete?.() },
        {
            keys: ['t'],
            run: () =>
                editMode &&
                document.querySelector<HTMLInputElement>('form input[placeholder="type to add…"]')?.focus()
        },
        {
            keys: ['f'],
            run: () => {
                const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-fit]')];
                const active = buttons.findIndex((b) => b.classList.contains('btn-active'));
                buttons[(active + 1) % buttons.length]?.click();
            }
        }
    ]);
</script>

<Shortcuts {bindings} />