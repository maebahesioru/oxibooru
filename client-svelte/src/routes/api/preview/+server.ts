import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { renderMarkdown } from '$lib/markdown';

export const POST: RequestHandler = async ({ request }) => {
    const { text } = (await request.json()) as { text?: string };
    return json({ html: renderMarkdown(text ?? '') });
};