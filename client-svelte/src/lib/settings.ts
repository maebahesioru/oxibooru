export interface Settings {
    theme: 'booru' | 'booru-dark' | 'system';
    listSafe: boolean;
    listSketchy: boolean;
    listUnsafe: boolean;
    upscaleSmallPosts: boolean;
    endlessScroll: boolean;
    keyboardShortcuts: boolean;
    transparencyGrid: boolean;
    fitMode: 'fit-both' | 'fit-original' | 'fit-width' | 'fit-height';
    tagSuggestions: boolean;
    autoplayVideos: boolean;
    postsPerPage: number;
    tagUnderscoresAsSpaces: boolean;
    postFlow: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
    theme: 'system',
    listSafe: true,
    listSketchy: true,
    listUnsafe: false,
    upscaleSmallPosts: false,
    endlessScroll: false,
    keyboardShortcuts: true,
    transparencyGrid: true,
    fitMode: 'fit-both',
    tagSuggestions: true,
    autoplayVideos: false,
    postsPerPage: 42,
    tagUnderscoresAsSpaces: false,
    postFlow: false
};

export const SETTINGS_COOKIE = 'settings';

export function parseSettings(raw: string | undefined): Settings {
    if (!raw) return { ...DEFAULT_SETTINGS };
    try {
        return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

/** rating フィルタを検索クエリに合成（旧 PostList._decorateSearchQuery） */
export function decorateQuery(text: string, settings: Settings, safetyEnabled: boolean): string {
    if (!safetyEnabled) return text.trim();
    const disabled: string[] = [];
    if (!settings.listSafe) disabled.push('safe');
    if (!settings.listSketchy) disabled.push('sketchy');
    if (!settings.listUnsafe) disabled.push('unsafe');
    const prefix = disabled.length ? `-rating:${disabled.join(',')} ` : '';
    return `${prefix}${text}`.trim();
}