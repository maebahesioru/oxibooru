import type { Cookies } from '@sveltejs/kit';

export type Flash = { type: 'success' | 'error' | 'info'; message: string };

export function setFlash(cookies: Cookies, flash: Flash) {
    cookies.set('flash', JSON.stringify(flash), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30
    });
}

export function takeFlash(cookies: Cookies): Flash | null {
    const raw = cookies.get('flash');
    if (!raw) return null;
    cookies.delete('flash', { path: '/' });
    try {
        return JSON.parse(raw) as Flash;
    } catch {
        return null;
    }
}