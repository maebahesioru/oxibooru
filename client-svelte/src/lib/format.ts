export function formatFileSize(bytes: number): string {
    const units = ['B', 'K', 'M', 'G'];
    let value = bytes;
    let unit = units.shift()!;
    while (value >= 1024 && units.length) {
        unit = units.shift()!;
        value /= 1024;
    }
    const digits = value < 20 && unit !== 'B' ? 1 : 0;
    return `${value.toFixed(digits)}${unit}`;
}

/** API returns relative URLs (e.g. "data/avatars/...") — ensure they have leading / */
export function absUrl(url: string): string {
    return url.startsWith('/') || url.startsWith('http') ? url : `/${url}`;
}

const STEPS: [number, string, number | null][] = [
    [60, '数秒', null],
    [120, '1分', null],
    [3600, '%分', 60],
    [7200, '1時間', null],
    [86400, '%時間', 3600],
    [172800, '1日', null],
    [2628288, '%日', 86400],
    [5256576, '1ヶ月', null],
    [31539456, '%ヶ月', 2628288],
    [63078912, '1年', null],
    [Number.MAX_SAFE_INTEGER, '%年', 31539456]
];

export function formatRelativeTime(time: string | null | undefined): string {
    if (!time) return 'なし';
    const then = Date.parse(time);
    const now = Date.now();
    const diff = Math.abs(now - then) / 1000;
    const future = now < then;
    let text = 'かなり前';
    for (const [limit, template, divider] of STEPS) {
        if (diff < limit) {
            text = divider ? template.replace('%', String(Math.round(diff / divider))) : template;
            break;
        }
    }
    if (text === '1日') return future ? '明日' : '昨日';
    return future ? `${text}後` : `${text}前`;
}

export function cssCategory(name: string | null | undefined, prefix: 'tag' | 'pool'): string {
    return `${prefix}-cat-${(name ?? 'default').replace(/[^a-z0-9]/gi, '_')}`;
}

export function prettyTagName(name: string, underscoresAsSpaces: boolean): string {
    return underscoresAsSpaces ? name.replace(/_/g, ' ') : name;
}

export function escapeSearchTerm(text: string): string {
    return text.replace(/([a-z_-]):/g, '$1\:').replace(/\./g, '\.');
}

export function escapeTagName(text: string): string {
    return text.replace(/:/g, '\:').replace(/\./g, '\.');
}

export function splitWhitespace(text: string): string[] {
    return text.split(/\s+/).filter(Boolean);
}

export function rootDomain(url: string): string {
    try {
        const host = new URL(url).hostname.split('.');
        return host.slice(-2).join('.');
    } catch {
        return url;
    }
}

export function mimeLabel(mime: string): string {
    return (
        {
            'image/gif': 'GIF',
            'image/jpeg': 'JPEG',
            'image/png': 'PNG',
            'image/webp': 'WEBP',
            'image/bmp': 'BMP',
            'image/avif': 'AVIF',
            'image/heif': 'HEIF',
            'image/heic': 'HEIC',
            'video/webm': 'WEBM',
            'video/mp4': 'MPEG-4',
            'video/quicktime': 'MOV',
            'application/x-shockwave-flash': 'SWF'
        }[mime] ?? mime
    );
}