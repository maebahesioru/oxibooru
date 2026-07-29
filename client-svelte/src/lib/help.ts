export type Row = [string, string] | [string, string, string];

export const SECTIONS = [
    { key: 'about', label: 'About' },
    { key: 'keyboard', label: 'Keyboard' },
    { key: 'search', label: 'Search syntax' },
    { key: 'comments', label: 'Comments' },
    { key: 'tos', label: 'Terms of service' }
] as const;

export const SEARCH_SUBSECTIONS = [
    { key: 'default', label: 'General' },
    { key: 'posts', label: 'Posts' },
    { key: 'users', label: 'Users' },
    { key: 'tags', label: 'Tags' },
    { key: 'pools', label: 'Pools' }
] as const;

export const KEYBOARD: Row[] = [
    ['Q', 'Focus search field, if available'],
    ['A / D, ← / →', 'Go to newer/older page or post'],
    ['F', 'Cycle post fit mode'],
    ['E', 'Edit post'],
    ['P', 'Focus first post in post list'],
    ['T', '(In edit mode) Focus tag input'],
    ['Ctrl/Cmd+S', '(In edit mode) Save post'],
    ['Delete', '(In edit mode) Delete post']
];

export const COMMENT_SYNTAX: Row[] = [
    ['@426', 'links to post number 426'],
    ['#Dragon_Ball', 'links to tag "Dragon_Ball"'],
    ['+Pirate', 'links to user "Pirate"'],
    ['~~new~~', 'adds strike-through'],
    ['[spoiler]…[/spoiler]', 'marks text as spoiler and hides it'],
    ['[sjis](´･ω･`)[/sjis]', 'adds SJIS art'],
    ['[small]…[/small]', 'renders smaller text'],
    ['[search]tag[/search]', 'links to a post search'],
    ['[icon]https://…[/icon]', 'adds the site icon next to the link']
];

export const TOKEN_TYPES: Row[] = [
    ['<value>', 'anonymous tokens — used for basic filters'],
    ['<key>:<value>', 'named tokens — used for advanced filters'],
    ['sort:<style>', 'sort style tokens — used to sort the results'],
    ['special:<value>', 'special tokens — filters usually tied to the logged in user']
];

export const RANGES: Row[] = [
    ['a,b,c', 'satisfies either a, b or c'],
    ['1..', 'equal to or greater than 1'],
    ['..4', 'equal to at most 4'],
    ['1..4', 'equal to 1, 2, 3 or 4']
];

export const POST_NAMED: Row[] = [
    ['id', 'having given post number'],
    ['tag', 'having given tag (accepts wildcards)'],
    ['tag-category', 'having tags from given tag category'],
    ['score', 'having given score'],
    ['uploader / upload / submit', 'uploaded by given user'],
    ['comment', 'commented by given user'],
    ['fav', 'favorited by given user'],
    ['pool', 'belonging to the pool with the given name or ID'],
    ['pool-category', 'belonging to pools in the given pool category'],
    ['tag-count', 'having given number of tags'],
    ['comment-count', 'having given number of comments'],
    ['fav-count', 'favorited by given number of users'],
    ['note-count', 'having given number of annotations'],
    ['note-text', 'having given note text'],
    ['relation-count', 'having given number of relations'],
    ['feature-count', 'having been featured given number of times'],
    ['type', 'image / animation / flash / video'],
    ['content-checksum', 'having given BLAKE3 checksum'],
    ['flag', 'loop / sound'],
    ['source', 'having given source'],
    ['file-size', 'having given file size (bytes)'],
    ['image-width / width', 'having given image width'],
    ['image-height / height', 'having given image height'],
    ['image-area / area', 'having given number of pixels'],
    ['image-aspect-ratio / ar', 'having given aspect ratio'],
    ['creation-date / date / time', 'posted at given date'],
    ['last-edit-date / edit-time', 'edited at given date'],
    ['comment-date / comment-time', 'commented at given date'],
    ['fav-date / fav-time', 'last favorited at given date'],
    ['feature-date / feature-time', 'featured at given date'],
    ['safety / rating', 'safe / sketchy / unsafe']
];

export const POST_SORT: Row[] = [
    ['random', 'as random as it can get'],
    ['id', 'highest to lowest post number'],
    ['score', 'highest scored'],
    ['uploader / upload / submit', 'uploader name alphabetically'],
    ['pool-count / pool', 'in most pools'],
    ['tag-count / tag', 'with most tags'],
    ['comment-count / comment', 'most commented first'],
    ['fav-count / fav', 'loved by most'],
    ['note-count', 'with most annotations'],
    ['relation-count', 'with most relations'],
    ['feature-count', 'most often featured'],
    ['type', 'grouped by content type'],
    ['flag', 'grouped by flags'],
    ['source', 'sorted by source'],
    ['file-size', 'largest files first'],
    ['image-width / width', 'widest images first'],
    ['image-height / height', 'tallest images first'],
    ['image-area / area', 'largest images first'],
    ['image-aspect-ratio / ar', 'highest aspect ratio first'],
    ['creation-date / date / time', 'newest to oldest'],
    ['last-edit-date / edit-time', 'recently edited first'],
    ['comment-date / comment-time', 'recently commented'],
    ['fav-date / fav-time', 'recently favorited'],
    ['feature-date / feature-time', 'recently featured'],
    ['safety / rating', 'most unsafe first']
];

export const POST_SPECIAL: Row[] = [
    ['liked', 'posts liked by currently logged in user'],
    ['disliked', 'posts disliked by currently logged in user'],
    ['fav', 'posts added to favorites by currently logged in user'],
    ['tumbleweed', 'posts without ratings, comments, or favorites']
];

export const TAG_NAMED: Row[] = [
    ['name', 'having given name (accepts wildcards)'],
    ['category', 'having given category'],
    ['description', 'having given description'],
    ['creation-date / creation-time', 'created at given date'],
    ['last-edit-date / edit-time', 'edited at given date'],
    ['usages / usage-count / post-count', 'used in given number of posts'],
    ['suggestion-count', 'with given number of suggestions'],
    ['implication-count', 'with given number of implications'],
    ['implies', 'having an implication with the given name'],
    ['suggests', 'having a suggestion with the given name']
];

export const TAG_SORT: Row[] = [
    ['random', 'as random as it can get'],
    ['name', 'A to Z'],
    ['category', 'category (A to Z)'],
    ['description', 'description (A to Z)'],
    ['creation-date / creation-time', 'recently created first'],
    ['last-edit-date / edit-time', 'recently edited first'],
    ['usages / post-count', 'used in most posts first'],
    ['implication-count / implies', 'with most implications first'],
    ['suggestion-count / suggests', 'with most suggestions first']
];

export const POOL_NAMED: Row[] = [
    ['name', 'having given name (accepts wildcards)'],
    ['category', 'having given category'],
    ['creation-date / creation-time', 'created at given date'],
    ['last-edit-date / edit-time', 'edited at given date'],
    ['post-count', 'used in given number of posts']
];

export const POOL_SORT: Row[] = [
    ['random', 'as random as it can get'],
    ['name', 'A to Z'],
    ['category', 'category (A to Z)'],
    ['creation-date / creation-time', 'recently created first'],
    ['last-edit-date / edit-time', 'recently edited first'],
    ['post-count', 'used in most posts first']
];

export const USER_NAMED: Row[] = [
    ['name', 'having given name (accepts wildcards)'],
    ['creation-date / creation-time', 'registered at given date'],
    ['last-login-date / login-time', 'whose most recent login matches given date']
];

export const USER_SORT: Row[] = [
    ['random', 'as random as it can get'],
    ['name', 'A to Z'],
    ['creation-date / creation-time', 'newest to oldest'],
    ['last-login-date / login-time', 'recently active first']
];

export const PROHIBITED = [
    'Child pornography: 児童を性的に描写する写真・写実的な絵・動画。',
    'Bestiality: 人間と非人間動物の性的描写。',
    '極端な損壊・身体膨張・排泄物の描写。',
    'Personal images: アバターや署名など私的利用目的の画像。'
];