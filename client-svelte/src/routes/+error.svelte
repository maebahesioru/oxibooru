<script lang="ts">
    import { page } from '$app/state';
</script>

<div class="hero min-h-[50dvh]">
    <div class="hero-content text-center">
        <div>
            <h1 class="text-6xl font-bold opacity-20">{page.status}</h1>
            <p class="mt-4 text-lg">{page.error?.message ?? '予期せぬエラー'}</p>
            <a class="btn btn-primary mt-6" href="/">トップに戻る</a>
        </div>
    </div>
</div>