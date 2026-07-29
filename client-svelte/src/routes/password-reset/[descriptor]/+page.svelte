<script lang="ts">
    import type { PageData } from './$types';
    let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto w-full max-w-md text-center">
    {#if data.ok}
        <div role="alert" class="alert alert-success mb-4 flex-col">
            <p>新しいパスワードが発行されました。</p>
            <code class="rounded bg-base-100 px-3 py-1 font-mono text-lg">{data.password}</code>
        </div>
        <p class="text-sm opacity-70">ログイン後、設定画面でパスワードを変更することを推奨します。</p>
        <a class="btn btn-primary mt-4" href="/login">ログイン</a>
    {:else}
        <div role="alert" class="alert alert-error">{data.message}</div>
        <a class="btn mt-4" href="/password-reset">やり直す</a>
    {/if}
</div>