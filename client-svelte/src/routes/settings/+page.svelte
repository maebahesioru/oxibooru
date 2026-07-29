<script lang="ts">
    import type { PageData } from './$types';
    let { data }: { data: PageData } = $props();
    const s = data.current;

    const toggles: [keyof typeof s, string, string][] = [
        ['keyboardShortcuts', 'キーボードショートカットを有効化', ''],
        ['transparencyGrid', '透明グリッドを表示', '背景が透明な投稿に市松模様を敷きます。'],
        ['upscaleSmallPosts', '小さい投稿を拡大', ''],
        ['endlessScroll', '無限スクロール', 'ページ送りの代わりに連続読み込みします。'],
        ['postFlow', 'ポストフロー表示', 'サムネイルを可変幅で並べます。'],
        ['tagSuggestions', 'タグ候補を表示', ''],
        ['autoplayVideos', '動画を自動再生', ''],
        ['tagUnderscoresAsSpaces', 'アンダースコアを空白として表示', '表示のみに影響します。']
    ];
</script>

<div class="mx-auto w-full max-w-2xl">
    <h1 class="mb-4 text-2xl">Browsing settings</h1>
    <p class="mb-4 text-sm opacity-70">
        設定はブラウザの Cookie に保存され、サーバー側レンダリングにも反映されます。
    </p>

    <form method="POST" class="space-y-6">
        <fieldset class="fieldset rounded-box border border-base-300 p-4">
            <legend class="fieldset-legend">テーマ</legend>
            <select name="theme" class="select select-bordered w-full">
                <option value="system" selected={s.theme === 'system'}>システムに従う</option>
                <option value="booru" selected={s.theme === 'booru'}>ライト</option>
                <option value="booru-dark" selected={s.theme === 'booru-dark'}>ダーク</option>
            </select>
        </fieldset>

        <fieldset class="fieldset rounded-box border border-base-300 p-4">
            <legend class="fieldset-legend">表示する安全度</legend>
            {#each [['listSafe', 'Safe'], ['listSketchy', 'Sketchy'], ['listUnsafe', 'Unsafe']] as [key, label] (key)}
                <label class="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" name={key} class="toggle toggle-primary" checked={s[key]} />
                    {label}
                </label>
            {/each}
        </fieldset>

        <fieldset class="fieldset rounded-box border border-base-300 p-4">
            <legend class="fieldset-legend">一覧</legend>
            <label class="form-control">
                <span class="label-text mb-1 block">1ページあたりの投稿数</span>
                <input
                    type="number"
                    name="postsPerPage"
                    min="10"
                    max="100"
                    value={s.postsPerPage}
                    class="input input-bordered w-32"
                />
            </label>
            <label class="form-control mt-3">
                <span class="label-text mb-1 block">既定のフィットモード</span>
                <select name="fitMode" class="select select-bordered w-full">
                    {#each ['fit-both', 'fit-width', 'fit-height', 'fit-original'] as mode (mode)}
                        <option value={mode} selected={s.fitMode === mode}>{mode}</option>
                    {/each}
                </select>
            </label>
        </fieldset>

        <fieldset class="fieldset rounded-box border border-base-300 p-4">
            <legend class="fieldset-legend">動作</legend>
            {#each toggles as [key, label, hint] (key)}
                <label class="label cursor-pointer flex-col items-start gap-1">
                    <span class="flex items-center gap-2">
                        <input type="checkbox" name={key} class="toggle toggle-primary" checked={s[key]} />
                        {label}
                    </span>
                    {#if hint}<span class="text-xs opacity-60">{hint}</span>{/if}
                </label>
            {/each}
        </fieldset>

        <button class="btn btn-primary">Save settings</button>
    </form>
</div>