<script lang="ts">
    import HelpTable from '$lib/components/HelpTable.svelte';
    import * as help from '$lib/help';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    const sub = $derived(data.section === 'search' ? data.subsection : null);
</script>

<div class="mx-auto w-full max-w-3xl">
    <nav role="tablist" class="tabs tabs-lift">
        {#each help.SECTIONS as s (s.key)}
            <a role="tab" class="tab" class:tab-active={data.section === s.key} href={`/help/${s.key}`}>
                {s.label}
            </a>
        {/each}
    </nav>

    <div class="rounded-b-box border border-t-0 border-base-300 p-4 md">
        {#if data.section === 'about'}
            <p>
                {data.siteName} は Danbooru・Gelbooru・Moebooru に着想を得た画像ボードエンジン
                （oxibooru / szurubooru 系）のフロントエンドです。
            </p>
            <h2>登録方法</h2>
            <p>
                登録時の E-mail は Gravatar の取得とパスワード再発行にのみ使用され、他のユーザーには公開されません。
                アカウントはいつでも削除できますが、アップロードした投稿は残ります。
            </p>
        {:else if data.section === 'keyboard'}
            <p>キーボードで素早く操作できます。</p>
            <HelpTable head={['ショートカット', '説明']} rows={help.KEYBOARD} mono />
            <p class="text-sm opacity-70">
                ショートカットは設定画面でオン／オフを切り替えられます。
            </p>
        {:else if data.section === 'comments'}
            <p>コメントは Markdown に加えて次の拡張記法が使えます。</p>
            <HelpTable head={['構文', '説明']} rows={help.COMMENT_SYNTAX} mono />
            <h2>画像サイズ指定</h2>
            <ul>
                <li><code>![alt](href =WIDTHx "title")</code></li>
                <li><code>![alt](href =xHEIGHT "title")</code></li>
                <li><code>![alt](href =WIDTHxHEIGHT "title")</code></li>
            </ul>
        {:else if data.section === 'tos'}
            <p>
                {data.siteName}（以下「本サイト」）を利用することで、以下の利用規約に同意したものとみなされます。
            </p>
            <ul>
                <li>本サイトは現状有姿で提供され、明示・黙示のいかなる保証も伴いません。</li>
                <li>運営はアカウントおよび投稿内容を削除・変更する権利を有します。</li>
                <li>運営は予告なく本規約を変更する権利を有します。</li>
                <li>未成年者は本サイトを利用できません。</li>
                <li>本サイトは個人的利用の範囲でのみ使用してください。</li>
                <li>スパム・荒らし・他者への攻撃を行わないでください。</li>
            </ul>
            <h2 id="section-prohibited-content">禁止コンテンツ</h2>
            <ul>
                {#each help.PROHIBITED as item (item)}<li>{item}</li>{/each}
            </ul>
            <h2 id="section-privacy-policy">プライバシーポリシー</h2>
            <p>
                IP アドレスおよび E-mail アドレスは運営以外に開示されません。投稿・コメント・お気に入り・評価は
                データベースに保存されます。「匿名でアップロード」を選ぶと投稿とアカウントの紐付けは保存されません。
                Cookie はセッション維持と表示設定のために使用します。
            </p>
        {:else}
            <!-- search -->
            <nav role="tablist" class="tabs tabs-box mb-4">
                {#each help.SEARCH_SUBSECTIONS as s (s.key)}
                    <a
                        role="tab"
                        class="tab"
                        class:tab-active={sub === s.key}
                        href={s.key === 'default' ? '/help/search' : `/help/search/${s.key}`}
                    >
                        {s.label}
                    </a>
                {/each}
            </nav>

            {#if sub === 'posts'}
                <h2>Anonymous tokens</h2>
                <p><code>tag</code> と同じ扱いです。</p>
                <h2>Named tokens</h2>
                <HelpTable rows={help.POST_NAMED} mono />
                <h2>Sort style tokens</h2>
                <HelpTable rows={help.POST_SORT} mono />
                <h2>Special tokens</h2>
                <HelpTable rows={help.POST_SPECIAL} mono />
            {:else if sub === 'tags'}
                <h2>Anonymous tokens</h2>
                <p><code>name</code> と同じ扱いです。</p>
                <h2>Named tokens</h2>
                <HelpTable rows={help.TAG_NAMED} mono />
                <h2>Sort style tokens</h2>
                <HelpTable rows={help.TAG_SORT} mono />
                <h2>Special tokens</h2>
                <p>なし。</p>
            {:else if sub === 'pools'}
                <h2>Anonymous tokens</h2>
                <p><code>name</code> と同じ扱いです。</p>
                <h2>Named tokens</h2>
                <HelpTable rows={help.POOL_NAMED} mono />
                <h2>Sort style tokens</h2>
                <HelpTable rows={help.POOL_SORT} mono />
                <h2>Special tokens</h2>
                <p>なし。</p>
            {:else if sub === 'users'}
                <h2>Anonymous tokens</h2>
                <p><code>name</code> と同じ扱いです。</p>
                <h2>Named tokens</h2>
                <HelpTable rows={help.USER_NAMED} mono />
                <h2>Sort style tokens</h2>
                <HelpTable rows={help.USER_SORT} mono />
                <h2>Special tokens</h2>
                <p>なし。</p>
            {:else}
                <p>検索クエリは空白区切りのトークンで構成されます。</p>
                <HelpTable head={['構文', 'トークン種別']} rows={help.TOKEN_TYPES} mono />
                <h2>範囲・複合値</h2>
                <HelpTable rows={help.RANGES} mono />
                <h2>日付</h2>
                <ul>
                    <li><code>today</code></li>
                    <li><code>yesterday</code></li>
                    <li><code>&lt;year&gt;</code></li>
                    <li><code>&lt;year&gt;-&lt;month&gt;</code></li>
                    <li><code>&lt;year&gt;-&lt;month&gt;-&lt;day&gt;</code></li>
                </ul>
                <p>
                    ユーザー名などの一部フィールドはワイルドカード（<code>*</code>）を受け付けます。
                    すべてのトークンは <code>-</code> を先頭に付けて否定できます。
                    sort トークンには <code>,asc</code> / <code>,desc</code> を付けられます。
                    <code>:</code> や <code>-</code> はバックスラッシュ（<code>\</code>）でエスケープします。
                    二重引用符（<code>"</code>）で文字列リテラルを表現できます。
                </p>
                <h2>例</h2>
                <pre><code>sea -fav-count:8.. type:swf uploader:Pirate</code></pre>
                <p>
                    sea タグ付きの Flash で、お気に入り数が 7 以下、Pirate がアップロードしたものを表示します。
                    <code>re:zero</code> は未知の名前付きトークンとしてエラーになり、<code>re\:zero</code> は
                    <code>re:zero</code> タグ検索になります。
                </p>
            {/if}
        {/if}
    </div>
</div>