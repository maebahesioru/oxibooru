import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { DEFAULT_SETTINGS, SETTINGS_COOKIE, type Settings } from '$lib/settings';
import { setFlash } from '$lib/server/flash';

export const load: PageServerLoad = ({ locals }) => ({ current: locals.settings });

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const bool = (key: keyof Settings) => form.get(key) === 'on';

        const next: Settings = {
            ...DEFAULT_SETTINGS,
            theme: (form.get('theme') as Settings['theme']) ?? 'system',
            fitMode: (form.get('fitMode') as Settings['fitMode']) ?? 'fit-both',
            postsPerPage: Math.min(100, Math.max(10, Number(form.get('postsPerPage') ?? 42))),
            listSafe: bool('listSafe'),
            listSketchy: bool('listSketchy'),
            listUnsafe: bool('listUnsafe'),
            upscaleSmallPosts: bool('upscaleSmallPosts'),
            endlessScroll: bool('endlessScroll'),
            keyboardShortcuts: bool('keyboardShortcuts'),
            transparencyGrid: bool('transparencyGrid'),
            tagSuggestions: bool('tagSuggestions'),
            autoplayVideos: bool('autoplayVideos'),
            tagUnderscoresAsSpaces: bool('tagUnderscoresAsSpaces'),
            postFlow: bool('postFlow')
        };

        cookies.set(SETTINGS_COOKIE, JSON.stringify(next), {
            path: '/',
            httpOnly: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365
        });

        setFlash(cookies, { type: 'success', message: '設定を保存しました。' });
        redirect(303, '/settings');
    }
};