<script lang="ts">
    import CategoryTable from '$lib/components/CategoryTable.svelte';
    import type { ActionData, PageData } from './$types';

    let { data, form }: { data: PageData; form: ActionData } = $props();
    let rows = $state(structuredClone(data.rows));
</script>

<div class="mx-auto w-full max-w-3xl">
    <h1 class="mb-4 text-2xl">Pool categories</h1>
    {#if form?.message}<div role="alert" class="alert alert-error mb-4">{form.message}</div>{/if}

    <form method="POST">
        <CategoryTable bind:rows can={data.can} />
        <button class="btn btn-primary mt-4">Save changes</button>
    </form>
</div>