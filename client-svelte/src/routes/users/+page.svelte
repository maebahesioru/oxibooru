<script lang="ts">
    import { page } from '$app/state';
    import Pagination from '$lib/components/Pagination.svelte';
    import SearchForm from '$lib/components/SearchForm.svelte';
    import { formatRelativeTime } from '$lib/format';
import { absUrl } from '$lib/format';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    const makeHref = (offset: number) => {
        const params = new URLSearchParams(page.url.searchParams);
        params.set('offset', String(Math.max(0, offset)));
        return `/users?${params}`;
    };
</script>

<SearchForm action="/users" query={data.query} helpHref="/help/search/users" />

<ul class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {#each data.page.results as user (user.name)}
        <li class="card card-border bg-base-200">
            <div class="card-body flex-row items-center gap-3 p-4">
                <a href={`/user/${user.name}`}>
                    <img src={absUrl(user.avatarUrl)} alt="" class="size-12 rounded-box object-cover" />
                </a>
                <div class="min-w-0 text-sm">
                    <a class="link link-hover font-medium" href={`/user/${user.name}`}>{user.name}</a>
                    <p class="opacity-70">Registered {formatRelativeTime(user.creationTime)}</p>
                    <p class="opacity-70">Last seen {formatRelativeTime(user.lastLoginTime)}</p>
                </div>
            </div>
        </li>
    {/each}
</ul>

<Pagination offset={data.page.offset} limit={data.page.limit} total={data.page.total} {makeHref} />