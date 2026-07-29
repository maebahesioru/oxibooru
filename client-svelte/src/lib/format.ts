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

const STEPS: [number, string, number | null][] = [
    [60, 'a few seconds', null],
    [120, 'a minute', null],
    [3600, '% minutes', 60],
    [7200, 'an hour', null],
    [86400, '% hours', 3600],
    [172800, 'a day', null],
    [2628288, '% days', 86400],
    [5256576, 'a month', null],
    [31539456, '% months', 2628288],
    [63078912, 'a year', null],
    [Number.MAX_SAFE_INTEGER, '% years', 31539456]
];

export function formatRelativeTime(time: string | null | undefined): string {
    if (!time) return 'never';
    const then = Date.parse(time);
    const now = Date.now();
    const diff = Math.abs(now - then) / 1000;
    const future = now < then;
    let text = 'a long time';
    for (const [limit, template, divider] of STEPS) {
        if (diff < limit) {
            text = divider ? template.replace('%', String(Math.round(diff / divider))) : template;
            break;
        }
    }
    if (text === 'a day') return future ? 'tomorrow' : 'yesterday';
    return future ? `in ${text}` : `${text} ago`;
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