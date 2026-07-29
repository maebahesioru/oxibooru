import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

function preprocess(text: string): string {
    return text
        .replace(/(^|[\\s<>[\]()])([+#@][a-zA-Z0-9_-]+)/g, '$1[$2]($2)')
        .replace(/\]\(@(\d+)\)/g, '](/post/$1)')
        .replace(/\]\(\+([a-zA-Z0-9_-]+)\)/g, '](/user/$1)')
        .replace(/\]\(#([a-zA-Z0-9_-]+)\)/g, '](/posts?query=$1)');
}

function postprocess(html: string): string {
    html = html.replace(/\[spoiler\]((?:[^[]|\[(?!\/?spoiler\]))+)\[\/spoiler\]/gi,
        '<span class="spoiler transition-colors">$1</span>');
    html = html.replace(/\[small\]((?:[^[]|\[(?!\/?small\]))+)\[\/small\]/gi,
        '<small>$1</small>');
    html = html.replace(/\[search\]((?:[^[]|\[(?!\/?search\]))+)\[\/search\]/gi,
        '<a href="/posts?query=$1"><code>$1</code></a>');
    html = html.replace(/\[sjis\]((?:[^[]|\[(?!\/?sjis\]))+)\[\/sjis\]/gi,
        '<div class="sjis">$1</div>');
    
    return html;
}

const OPTIONS = { breaks: true, gfm: true } as const;

export function renderMarkdown(text: string | null | undefined): string {
    if (!text) return '';
    const html = marked.parse(preprocess(text), OPTIONS) as string;
    return DOMPurify.sanitize(postprocess(html), { ADD_ATTR: ['target'] });
}

export function renderInlineMarkdown(text: string | null | undefined): string {
    if (!text) return '';
    const html = marked.parseInline(preprocess(text), OPTIONS) as string;
    return DOMPurify.sanitize(postprocess(html));
}
