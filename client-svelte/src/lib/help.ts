export type Row = [string, string] | [string, string, string];

export const SECTIONS = [
    { key: 'about', label: '概要' },
    { key: 'keyboard', label: 'キーボード' },
    { key: 'search', label: '検索構文' },
    { key: 'comments', label: 'コメント' },
    { key: 'tos', label: '利用規約' }
] as const;

export const SEARCH_SUBSECTIONS = [
    { key: 'default', label: '全般' },
    { key: 'posts', label: '投稿' },
    { key: 'users', label: 'ユーザー' },
    { key: 'tags', label: 'タグ' },
    { key: 'pools', label: 'プール' }
] as const;

export const KEYBOARD: Row[] = [
    ['Q', '検索欄にフォーカス（利用可能な場合）'],
    ['A / D, ← / →', '前後のページまたは投稿に移動'],
    ['F', '表示モード切替'],
    ['E', '投稿を編集'],
    ['P', '先頭の投稿にフォーカス'],
    ['T', '（編集モード時）タグ入力欄にフォーカス'],
    ['Ctrl/Cmd+S', '（編集モード時）投稿を保存'],
    ['削除', '（編集モード時）投稿を削除']
];

export const COMMENT_SYNTAX: Row[] = [
    ['@426', '投稿番号426へのリンク'],
    ['#Dragon_Ball', 'タグ「Dragon_Ball」へのリンク'],
    ['+Pirate', 'ユーザー「Pirate」へのリンク'],
    ['~~new~~', '打ち消し線を追加'],
    ['[spoiler]…[/spoiler]', 'ネタバレとして隠す'],
    ['[sjis](´･ω･`)[/sjis]', 'SJISアートを表示'],
    ['[small]…[/small]', '小さな文字で表示'],
    ['[search]tag[/search]', '投稿検索へのリンク'],
    ['[icon]https://…[/icon]', 'リンクの横にサイトアイコンを表示']
];

export const TOKEN_TYPES: Row[] = [
    ['<value>', '匿名トークン — 基本的なフィルタに使用'],
    ['<key>:<value>', '名前付きトークン — 高度なフィルタに使用'],
    ['sort:<style>', 'ソート指定 — 結果の並び順を指定'],
    ['special:<value>', '特殊トークン — ログインユーザー固有のフィルタ']
];

export const RANGES: Row[] = [
    ['a,b,c', 'a、b、またはcのいずれかに一致'],
    ['1..', '1以上'],
    ['..4', '4以下'],
    ['1..4', '1〜4の範囲']
];

export const POST_NAMED: Row[] = [
    ['id', '指定した投稿番号'],
    ['tag', '指定したタグ（ワイルドカード可）'],
    ['tag-category', '指定したタグカテゴリのタグを持つ'],
    ['score', '指定したスコア'],
    ['uploader / upload / submit', '指定したユーザーがアップロード'],
    ['comment', '指定したユーザーがコメント'],
    ['fav', '指定したユーザーがお気に入り'],
    ['pool', '指定した名前/IDのプールに所属'],
    ['pool-category', '指定したプールカテゴリのプールに所属'],
    ['tag-count', '指定した数のタグを持つ'],
    ['comment-count', '指定した数のコメントがある'],
    ['fav-count', '指定した人数がお気に入り'],
    ['note-count', '指定した数の注釈がある'],
    ['note-text', '指定した注釈テキストを含む'],
    ['relation-count', '指定した数の関連投稿がある'],
    ['feature-count', '指定した回数ピックアップされた'],
    ['type', 'image / animation / flash / video'],
    ['content-checksum', '指定したBLAKE3チェックサム'],
    ['flag', 'loop / sound'],
    ['source', '指定したソース'],
    ['file-size', '指定したファイルサイズ（バイト）'],
    ['image-width / width', '指定した画像の幅'],
    ['image-height / height', '指定した画像の高さ'],
    ['image-area / area', '指定したピクセル数'],
    ['image-aspect-ratio / ar', '指定したアスペクト比'],
    ['creation-date / date / time', '指定した日時に投稿'],
    ['last-edit-date / edit-time', '指定した日時に編集'],
    ['comment-date / comment-time', '指定した日時にコメント'],
    ['fav-date / fav-time', '指定した日時にお気に入り登録'],
    ['feature-date / feature-time', '指定した日時にピックアップ'],
    ['safety / rating', 'safe / sketchy / unsafe']
];

export const POST_SORT: Row[] = [
    ['random', 'ランダム'],
    ['id', '投稿番号の降順'],
    ['score', 'スコアが高い順'],
    ['uploader / upload / submit', 'アップロード者名のアルファベット順'],
    ['pool-count / pool', '所属プール数が多い順'],
    ['tag-count / tag', 'タグ数が多い順'],
    ['comment-count / comment', 'コメント数が多い順'],
    ['fav-count / fav', 'お気に入り数が多い順'],
    ['note-count', '注釈数が多い順'],
    ['relation-count', '関連投稿数が多い順'],
    ['feature-count', 'ピックアップ回数が多い順'],
    ['type', 'コンテンツタイプ別'],
    ['flag', 'フラグ別'],
    ['source', 'ソース順'],
    ['file-size', 'ファイルサイズが大きい順'],
    ['image-width / width', '幅が広い順'],
    ['image-height / height', '高さが高い順'],
    ['image-area / area', '面積が大きい順'],
    ['image-aspect-ratio / ar', 'アスペクト比が高い順'],
    ['creation-date / date / time', '新着順'],
    ['last-edit-date / edit-time', '最近編集された順'],
    ['comment-date / comment-time', '最近コメントされた順'],
    ['fav-date / fav-time', '最近お気に入りされた順'],
    ['feature-date / feature-time', '最近ピックアップされた順'],
    ['safety / rating', '危険度が高い順']
];

export const POST_SPECIAL: Row[] = [
    ['liked', '現在ログイン中のユーザーが高評価した投稿'],
    ['disliked', '現在ログイン中のユーザーが低評価した投稿'],
    ['fav', '現在ログイン中のユーザーがお気に入り登録した投稿'],
    ['tumbleweed', '評価・コメント・お気に入りが全くない投稿']
];

export const TAG_NAMED: Row[] = [
    ['name', '指定した名前（ワイルドカード可）'],
    ['category', '指定したカテゴリ'],
    ['description', '指定した説明文'],
    ['creation-date / creation-time', '指定した日時に作成'],
    ['last-edit-date / edit-time', '指定した日時に編集'],
    ['usages / usage-count / post-count', '指定した数の投稿で使用'],
    ['suggestion-count', '指定した数の提案がある'],
    ['implication-count', '指定した数の含意がある'],
    ['implies', '指定した名前の含意を持つ'],
    ['suggests', '指定した名前の提案を持つ']
];

export const TAG_SORT: Row[] = [
    ['random', 'ランダム'],
    ['name', '名前順（A→Z）'],
    ['category', 'カテゴリ順（A→Z）'],
    ['description', '説明文順（A→Z）'],
    ['creation-date / creation-time', '最近作成された順'],
    ['last-edit-date / edit-time', '最近編集された順'],
    ['usages / post-count', '使用投稿数が多い順'],
    ['implication-count / implies', '含意数が多い順'],
    ['suggestion-count / suggests', '提案数が多い順']
];

export const POOL_NAMED: Row[] = [
    ['name', '指定した名前（ワイルドカード可）'],
    ['category', '指定したカテゴリ'],
    ['creation-date / creation-time', '指定した日時に作成'],
    ['last-edit-date / edit-time', '指定した日時に編集'],
    ['post-count', '指定した数の投稿を含む']
];

export const POOL_SORT: Row[] = [
    ['random', 'ランダム'],
    ['name', '名前順（A→Z）'],
    ['category', 'カテゴリ順（A→Z）'],
    ['creation-date / creation-time', '最近作成された順'],
    ['last-edit-date / edit-time', '最近編集された順'],
    ['post-count', '投稿数が多い順']
];

export const USER_NAMED: Row[] = [
    ['name', '指定した名前（ワイルドカード可）'],
    ['creation-date / creation-time', '指定した日時に登録'],
    ['last-login-date / login-time', '指定した日時に最終ログイン']
];

export const USER_SORT: Row[] = [
    ['random', 'ランダム'],
    ['name', '名前順（A→Z）'],
    ['creation-date / creation-time', '新着順'],
    ['last-login-date / login-time', '最近アクティブ順']
];

export const PROHIBITED = [
    '児童ポルノ: 児童を性的に描写する写真・写実的な絵・動画。',
    '獣姦: 人間と非人間動物の性的描写。',
    '極端な損壊・身体膨張・排泄物の描写。',
    '個人画像: アバターや署名など私的利用目的の画像。'
];