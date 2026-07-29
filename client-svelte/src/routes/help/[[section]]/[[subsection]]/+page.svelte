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
            <h2>1. 投稿できるコンテンツ</h2>
            <p>
                ヒカキン、セイキン、マスオなど、ヒカマニまたはヒカキンに関連する人物・文字・要素が
                含まれているコンテンツは、原則として投稿できます。
            </p>
            <p>
                ただし、本ルールで禁止されているコンテンツや、管理者が不適切と判断したコンテンツは
                削除の対象となります。
            </p>

            <h2>2. 画像に関するルール</h2>

            <h3>うんこ画像</h3>
            <p>
                「エッチキンのうんこ」など、ヒカマニとしての特殊性や明確な関連性が認められるものを除き、
                うんこ画像は削除します。
            </p>

            <h3>ヒカマーズアルカイダ関連画像</h3>
            <p>
                ググガガ虐、リストカットなど、ヒカマニとの関連性が薄いヒカマーズアルカイダ関連画像は削除します。
            </p>
            <p>
                ヒカキンなどが写っている、またはヒカマニに関連する人物・文字・要素が含まれている場合は、
                原則として投稿できます。ただし、刺激の強いコンテンツには、可能な限り「Unsafe」「Sketchy」などの
                適切なレーティングを付けてください。
            </p>

            <h3>グロテスク・猟奇的な画像</h3>
            <p>
                ヒカマニとの関連性がある場合でも、あまりにもグロテスクまたは猟奇的な画像は削除します。
            </p>

            <h3>違法・有害なコンテンツ</h3>
            <p>
                以下に該当する画像やコンテンツは、ヒカマニとの関連性の有無にかかわらず投稿禁止です。
            </p>
            <ul>
                <li>児童性的虐待コンテンツ</li>
                <li>獣姦を扱う性的コンテンツ</li>
                <li>違法薬物の売買・使用を促進するコンテンツ</li>
                <li>その他、法令または国際的な規制に明確に違反するコンテンツ</li>
            </ul>

            <h2>3. コメントおよび利用者間のルール</h2>
            <p>以下の行為を禁止します。</p>
            <ul>
                <li>コメント欄で他人になりすます行為</li>
                <li>他の利用者に対する嫌がらせ、誹謗中傷、脅迫</li>
                <li>特定の利用者に対する継続的な粘着行為</li>
                <li>場所・日時・方法などを具体的に指定した犯罪予告</li>
                <li>その他、利用者の安全や正常な交流を著しく損なう行為</li>
            </ul>

            <h2>4. 多重アカウントについて</h2>
            <p>多重アカウントの使用は原則として禁止します。</p>
            <p>
                ただし、次のような不正な目的で使用していない場合は、例外として認めることがあります。
            </p>
            <ul>
                <li>同一人物が複数人を装い、多数から支持されているように見せかける行為</li>
                <li>別人を装って、同じ投票に複数回参加する行為</li>
                <li>処分や利用制限を回避する行為</li>
                <li>他の利用者を欺いたり、議論や評価を不正に操作したりする行為</li>
            </ul>

            <h2>5. 削除および対応方針</h2>
            <p>
                投稿が以下のいずれかに該当すると判断した場合、管理者は予告なく削除または
                必要な措置を行うことがあります。
            </p>
            <ul>
                <li>本ルールで禁止されているコンテンツ</li>
                <li>ヒカマニ関連コンテンツと完全に無関係なもの</li>
                <li>違法性または重大な権利侵害が認められるもの</li>
                <li>サービスや利用者の安全を損なうもの</li>
            </ul>
            <p>
                削除要請は、客観的な証拠または具体的な理由が提示された場合に受け付けます。
                また、対象の投稿がヒカマニ関連コンテンツと完全に無関係であることが確認できた場合も対応します。
            </p>
            <p>
                最終的な削除・対応の判断は、投稿内容、関連性、危険性および提示された証拠を
                確認したうえで管理者が行います。
            </p>

            <h2>6. お問い合わせ</h2>
            <p>
                お問い合わせおよび削除要請は、
                <a href="https://x.com/maebahesioru2" class="link">管理者のXアカウント</a>
                までご連絡ください。
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
                <h2>匿名トークン</h2>
                <p><code>tag</code> と同じ扱いです。</p>
                <h2>名前付きトークン</h2>
                <HelpTable rows={help.POST_NAMED} mono />
                <h2>ソート指定</h2>
                <HelpTable rows={help.POST_SORT} mono />
                <h2>特殊トークン</h2>
                <HelpTable rows={help.POST_SPECIAL} mono />
            {:else if sub === 'tags'}
                <h2>匿名トークン</h2>
                <p><code>name</code> と同じ扱いです。</p>
                <h2>名前付きトークン</h2>
                <HelpTable rows={help.TAG_NAMED} mono />
                <h2>ソート指定</h2>
                <HelpTable rows={help.TAG_SORT} mono />
                <h2>特殊トークン</h2>
                <p>なし。</p>
            {:else if sub === 'pools'}
                <h2>匿名トークン</h2>
                <p><code>name</code> と同じ扱いです。</p>
                <h2>名前付きトークン</h2>
                <HelpTable rows={help.POOL_NAMED} mono />
                <h2>ソート指定</h2>
                <HelpTable rows={help.POOL_SORT} mono />
                <h2>特殊トークン</h2>
                <p>なし。</p>
            {:else if sub === 'users'}
                <h2>匿名トークン</h2>
                <p><code>name</code> と同じ扱いです。</p>
                <h2>名前付きトークン</h2>
                <HelpTable rows={help.USER_NAMED} mono />
                <h2>ソート指定</h2>
                <HelpTable rows={help.USER_SORT} mono />
                <h2>特殊トークン</h2>
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