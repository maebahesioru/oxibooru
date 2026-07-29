<script lang="ts">
    import type { ActionData, PageData } from './$types';
    let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="mx-auto w-full max-w-md">
    <h1 class="mb-4 text-2xl">パスワードリセット</h1>

    {#if form?.message}
        <div role="alert" class="alert mb-4" class:alert-success={form.success} class:alert-error={!form.success}>
            {form.message}
        </div>
    {/if}

    {#if data.canSendMails}
        <form method="POST" autocomplete="off" class="card card-border bg-base-200">
            <div class="card-body gap-4">
                <label class="form-control">
                    <span class="label-text mb-1 block">User name or e-mail address</span>
                    <input name="userNameOrEmail" required class="input input-bordered w-full" />
                </label>
                <p class="text-xs opacity-70">
                    パスワードリセット用のリンクを含む E-mail を送信します。リンクを開くと新しいパスワードが発行されます。
                </p>
                <button class="btn btn-primary">次へ</button>
            </div>
        </form>
    {:else}
        <p>自動パスワードリセットには対応していません。</p>
        {#if data.contactEmail}
            <p class="mt-2">
                <a class="link" href={`mailto:${data.contactEmail}`}>{data.contactEmail}</a> まで連絡してください。
            </p>
        {/if}
    {/if}
</div>