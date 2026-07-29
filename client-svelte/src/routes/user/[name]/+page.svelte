<script lang="ts">
    import { formatRelativeTime, absUrl } from '$lib/format';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    const u = $derived(data.profile);
    const q = (query: string) => `/posts?query=${encodeURIComponent(query)}`;
</script>

<div class="flex flex-wrap gap-6">
    <img src={absUrl(u.avatarUrl)} alt="" class="size-24 rounded-box object-cover" />

    <ul class="space-y-1 text-sm">
        <li><span class="opacity-70">Registered:</span> {formatRelativeTime(u.creationTime)}</li>
        <li><span class="opacity-70">Last seen:</span> {formatRelativeTime(u.lastLoginTime)}</li>
        <li><span class="opacity-70">Rank:</span> {data.rankName.toLowerCase()}</li>
    </ul>
</div>

<div class="mt-6 grid gap-6 sm:grid-cols-2">
    <nav>
        <p class="mb-2 font-medium">Quick links</p>
        <ul class="space-y-1 text-sm">
            <li><a class="link" href={q(`submit:${u.name}`)}>{u.uploadedPostCount} uploads</a></li>
            <li><a class="link" href={q(`fav:${u.name}`)}>{u.favoritePostCount} favorites</a></li>
            <li><a class="link" href={q(`comment:${u.name}`)}>{u.commentCount} comments</a></li>
        </ul>
    </nav>

    {#if data.isSelf}
        <nav>
            <p class="mb-2 font-medium">Only visible to you</p>
            <ul class="space-y-1 text-sm">
                <li><a class="link" href={q('special:liked')}>{u.likedPostCount} liked posts</a></li>
                <li><a class="link" href={q('special:disliked')}>{u.dislikedPostCount} disliked posts</a></li>
            </ul>
        </nav>
    {/if}
</div>