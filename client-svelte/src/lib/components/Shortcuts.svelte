<script lang="ts">
    import { page } from '$app/state';
    import { shortcuts, type Binding } from '$lib/keyboard';

    let { bindings }: { bindings: Binding[] } = $props();

    $effect(() => shortcuts(page.data.settings?.keyboardShortcuts ?? true, bindings));
</script>