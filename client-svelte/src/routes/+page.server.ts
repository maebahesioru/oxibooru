import type { PageServerLoad } from './$types';
import { renderMarkdown } from '$lib/markdown';

export const load: PageServerLoad = ({ locals }) => {
    const { info, can } = locals;
    return {
        stats: {
            postCount: info.postCount,
            diskUsage: info.diskUsage,
            serverTime: info.serverTime
        },
        featured: info.featuredPost
            ? {
                  post: info.featuredPost,
                  user: info.featuringUser,
                  time: info.featuringTime,
                  descriptionHtml: renderMarkdown(info.featuredPost.description)
              }
            : null,
        canListPosts: can('post_list'),
        canListSnapshots: can('snapshot_list')
    };
};