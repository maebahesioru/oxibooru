import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, locals }) => ({
    section: params.section ?? 'about',
    subsection: params.subsection ?? 'default',
    siteName: locals.info.config.name
});