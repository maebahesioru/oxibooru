<script lang="ts">
    import type { ActionData, PageData } from './$types';
    let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

{#if form?.message}<div role="alert" class="alert alert-error mb-4">{form.message}</div>{/if}

<form method="POST" class="space-y-4">
    <input type="hidden" name="version" value={data.profile.version} />
    <p>アップロードした投稿は残りますが、アカウントは復元できません。</p>
    <label class="label cursor-pointer justify-start gap-2">
        <input type="checkbox" required class="checkbox" /> このアカウントを削除することを確認しました。
    </label>
    <button class="btn btn-error">Delete account</button>
</form>