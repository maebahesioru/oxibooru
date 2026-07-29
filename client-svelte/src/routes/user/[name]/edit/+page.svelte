<script lang="ts">
    import FileDropper from '$lib/components/FileDropper.svelte';
    import type { ActionData, PageData } from './$types';

    let { data, form }: { data: PageData; form: ActionData } = $props();
    const u = $derived(data.profile);
    let avatarStyle = $state(u.avatarStyle);
</script>

{#if form?.message}<div role="alert" class="alert alert-error mb-4">{form.message}</div>{/if}

<form method="POST" enctype="multipart/form-data" class="space-y-4">
    <input type="hidden" name="version" value={u.version} />

    {#if data.can.name}
        <label class="form-control">
            <span class="label-text mb-1 block">ユーザー名</span>
            <input
                name="name"
                value={u.name}
                pattern={data.userNamePattern}
                class="input input-bordered w-full"
                autocomplete="username"
            />
        </label>
    {/if}

    {#if data.can.password}
        <label class="form-control">
            <span class="label-text mb-1 block">パスワード</span>
            <input
                name="password"
                type="password"
                placeholder="leave blank if not changing"
                pattern={`${data.passwordPattern}|^$`}
                class="input input-bordered w-full"
                autocomplete="new-password"
            />
        </label>
    {/if}

    {#if data.can.email}
        <label class="form-control">
            <span class="label-text mb-1 block">メールアドレス</span>
            <input name="email" type="email" value={u.email ?? ''} class="input input-bordered w-full" />
        </label>
    {/if}

    {#if data.can.rank}
        <label class="form-control">
            <span class="label-text mb-1 block">Rank</span>
            <select name="rank" class="select select-bordered w-full">
                {#each data.ranks as rank (rank.value)}
                    <option value={rank.value} selected={rank.value === u.rank}>{rank.label}</option>
                {/each}
            </select>
        </label>
    {/if}

    {#if data.can.avatar}
        <fieldset class="fieldset rounded-box border border-base-300 p-3">
            <legend class="fieldset-legend">アバター</legend>
            <div class="flex flex-wrap gap-4">
                <img src={absUrl(u.avatarUrl)} alt="" class="size-16 rounded-box object-cover" />
                <div class="grow space-y-2">
                    <label class="label cursor-pointer justify-start gap-2">
                        <input
                            type="radio"
                            name="avatarStyle"
                            value="gravatar"
                            bind:group={avatarStyle}
                            class="radio"
                        />
                        Gravatar
                    </label>
                    <label class="label cursor-pointer justify-start gap-2">
                        <input
                            type="radio"
                            name="avatarStyle"
                            value="manual"
                            bind:group={avatarStyle}
                            class="radio"
                        />
                        Manual avatar
                    </label>
                    {#if avatarStyle === 'manual'}
                        <FileDropper name="avatar" accept="image/*" />
                    {/if}
                </div>
            </div>
        </fieldset>
    {/if}

    <button class="btn btn-primary">設定を保存</button>
</form>