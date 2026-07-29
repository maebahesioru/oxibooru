import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
    const [name, token] = params.descriptor.split(':', 2);
    cookies.delete('auth', { path: '/' });

    try {
        const res = await locals.api.post<{ password: string }>(
            `/password-reset/${encodeURIComponent(name)}`,
            { token }
        );
        return { ok: true as const, name, password: res.password };
    } catch (e) {
        return { ok: false as const, name, message: (e as Error).message };
    }
};