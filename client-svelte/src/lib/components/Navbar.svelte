<script lang="ts">
    import type { User } from '$lib/types';

    let {
        siteName,
        user,
        nav,
        pathname
    }: {
        siteName: string;
        user: User | null;
        nav: Record<string, boolean>;
        pathname: string;
    } = $props();

    const items = $derived(
        [
            { href: '/', label: 'Home', show: true },
            { href: '/posts', label: 'Posts', show: nav.posts },
            { href: '/upload', label: 'Upload', show: nav.upload },
            { href: '/comments', label: 'Comments', show: nav.comments },
            { href: '/tags', label: 'Tags', show: nav.tags },
            { href: '/pools', label: 'Pools', show: nav.pools },
            { href: '/users', label: 'Users', show: nav.users }
        ].filter((i) => i.show)
    );

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);
</script>

<header class="navbar sticky top-0 z-40 gap-2 border-b border-base-300 bg-base-200/95 px-4 backdrop-blur">
    <div class="navbar-start gap-2">
        <div class="dropdown lg:hidden">
            <button class="btn btn-ghost btn-square" aria-label="menu" popovertarget="nav-menu">☰</button>
            <ul id="nav-menu" popover class="dropdown-content menu z-50 w-56 rounded-box bg-base-200 p-2 shadow">
                {#each items as item (item.href)}
                    <li><a href={item.href} class={isActive(item.href) ? 'active' : ''}>{item.label}</a></li>
                {/each}
            </ul>
        </div>
        <a href="/" class="btn btn-ghost text-lg font-semibold">{siteName}</a>
    </div>

    <nav class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal gap-1 px-1">
            {#each items as item (item.href)}
                <li>
                    <a href={item.href} class={isActive(item.href) ? 'menu-active' : ''}>{item.label}</a>
                </li>
            {/each}
        </ul>
    </nav>

    <div class="navbar-end gap-1">
        <a href="/settings" class="btn btn-ghost btn-sm" aria-label="settings">⚙</a>
        {#if user}
            <div class="dropdown dropdown-end">
                <button class="btn btn-ghost btn-sm gap-2" popovertarget="user-menu">
                    <img src={user.avatarUrl} alt="" class="size-6 rounded-full object-cover" />
                    <span class="hidden sm:inline">{user.name}</span>
                </button>
                <ul id="user-menu" popover class="dropdown-content menu z-50 w-52 rounded-box bg-base-200 p-2 shadow">
                    <li><a href={`/user/${user.name}`}>Account</a></li>
                    <li><a href={`/user/${user.name}/edit`}>Settings</a></li>
                    <li>
                        <form method="POST" action="/logout">
                            <button class="w-full text-left" type="submit">Log out</button>
                        </form>
                    </li>
                </ul>
            </div>
        {:else}
            {#if nav.register}
                <a href="/register" class="btn btn-ghost btn-sm">Register</a>
            {/if}
            <a href="/login" class="btn btn-primary btn-sm">Log in</a>
        {/if}
    </div>
</header>