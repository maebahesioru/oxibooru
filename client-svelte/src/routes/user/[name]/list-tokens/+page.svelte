<script lang="ts">
    import { formatRelativeTime } from '$lib/format';
    import type { ActionData, PageData } from './$types';

    let { data, form }: { data: PageData; form: ActionData } = $props();
    let editing = $state<string | null>(null);
</script>

{#if form?.message}<div role="alert" class="alert alert-error mb-4">{form.message}</div>{/if}

{#if data.tokens.length}
    <ul class="space-y-3">
        {#each data.tokens as token (token.token)}
            <li class="card card-border bg-base-200">
                <div class="card-body gap-2 p-4 text-sm">
                    <p class="font-mono break-all">{token.token}</p>

                    <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                        <dt class="opacity-70">Note:</dt>
                        <dd class="flex flex-wrap items-center gap-2">
                            {token.note ?? 'No note'}
                            {#if data.can.editToken}
                                <button class="btn btn-ghost btn-xs" onclick={() => (editing = token.token)}>
                                    (change)
                                </button>
                            {/if}
                        </dd>
                        <dt class="opacity-70">Created:</dt>
                        <dd>{formatRelativeTime(token.creationTime)}</dd>
                        <dt class="opacity-70">Expires:</dt>
                        <dd>{token.expirationTime ? formatRelativeTime(token.expirationTime) : 'No expiration'}</dd>
                        <dt class="opacity-70">Last used:</dt>
                        <dd>{formatRelativeTime(token.lastUsageTime)}</dd>
                    </dl>

                    {#if editing === token.token}
                        <form method="POST" action="?/updateNote" class="join mt-2">
                            <input type="hidden" name="token" value={token.token} />
                            <input type="hidden" name="version" value={token.version} />
                            <input
                                name="note"
                                value={token.note ?? ''}
                                class="input input-bordered join-item input-sm w-full"
                            />
                            <button class="btn btn-primary join-item btn-sm">Save</button>
                        </form>
                    {/if}

                    {#if data.can.deleteToken}
                        <form method="POST" action="?/delete" class="card-actions">
                            <input type="hidden" name="token" value={token.token} />
                            <input type="hidden" name="version" value={token.version} />
                            <input type="hidden" name="isCurrent" value={token.isCurrent ? '1' : '0'} />
                            <button
                                class="btn btn-error btn-outline btn-xs"
                                title={token.isCurrent ? 'このトークンで認証中のためログアウトされます' : ''}
                            >
                                {token.isCurrent ? 'Delete and logout' : 'Delete'}
                            </button>
                        </form>
                    {/if}
                </div>
            </li>
        {/each}
    </ul>
{:else}
    <p class="opacity-70">No registered tokens.</p>
{/if}

{#if data.can.createToken}
    <form method="POST" action="?/create" class="mt-6 space-y-3">
        <div class="divider">Create token</div>
        <label class="form-control">
            <span class="label-text mb-1 block">Note</span>
            <input name="note" class="input input-bordered w-full" />
        </label>
        <label class="form-control">
            <span class="label-text mb-1 block">Expires</span>
            <input type="date" name="expirationTime" class="input input-bordered w-full" />
        </label>
        <button class="btn btn-primary">Create token</button>
    </form>
{/if}