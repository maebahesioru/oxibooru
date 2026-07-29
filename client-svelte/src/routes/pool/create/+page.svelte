<script lang="ts">
    import type { ActionData, PageData } from './$types';
    let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="mx-auto w-full max-w-xl">
    <h1 class="mb-4 text-2xl">プールを作成</h1>
    {#if form?.message}<div role="alert" class="alert alert-error mb-4">{form.message}</div>{/if}

    <form method="POST" class="space-y-4">
        <label class="form-control">
            <span class="label-text mb-1 block">名前</span>
            <input name="names" required class="input input-bordered w-full" placeholder="space-separated" />
        </label>
        <label class="form-control">
            <span class="label-text mb-1 block">カテゴリ</span>
            <select name="category" class="select select-bordered w-full">
                {#each data.categories as c (c)}<option value={c}>{c}</option>{/each}
            </select>
        </label>
        <label class="form-control">
            <span class="label-text mb-1 block">説明</span>
            <textarea name="description" rows="8" class="textarea textarea-bordered w-full"></textarea>
        </label>
        <label class="form-control">
            <span class="label-text mb-1 block">Posts</span>
            <input name="posts" placeholder="space-separated post IDs" class="input input-bordered w-full" />
        </label>
        <button class="btn btn-primary">プールを作成</button>
    </form>
</div>