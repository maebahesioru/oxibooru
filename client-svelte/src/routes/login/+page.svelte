<script lang="ts">
    import type { ActionData, PageData } from './$types';
    let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="mx-auto w-full max-w-md">
    <h1 class="mb-4 text-2xl">Log in</h1>

    {#if form?.message}
        <div role="alert" class="alert alert-error mb-4">{form.message}</div>
    {/if}

    <form method="POST" class="card card-border bg-base-200">
        <div class="card-body gap-4">
            <label class="form-control">
                <span class="label-text mb-1 block">User name</span>
                <input
                    name="name"
                    required
                    pattern={data.userNamePattern}
                    value={form?.name ?? ''}
                    class="input input-bordered w-full"
                    autocomplete="username"
                />
            </label>
            <label class="form-control">
                <span class="label-text mb-1 block">Password</span>
                <input
                    name="password"
                    type="password"
                    required
                    pattern={data.passwordPattern}
                    class="input input-bordered w-full"
                    autocomplete="current-password"
                />
            </label>
            <label class="label cursor-pointer justify-start gap-2">
                <input type="checkbox" name="remember" class="checkbox" />
                Remember me
            </label>
            <div class="card-actions items-center gap-3">
                <button class="btn btn-primary">Log in</button>
                {#if data.canSendMails}
                    <a class="link link-hover text-sm" href="/password-reset">Forgot the password?</a>
                {/if}
            </div>
        </div>
    </form>
</div>