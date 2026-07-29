<script lang="ts">
    let {
        name,
        urlName,
        allowUrls = false,
        multiple = false,
        accept = 'image/*,video/*,application/x-shockwave-flash',
        hint = ''
    }: {
        name: string;
        urlName?: string;
        allowUrls?: boolean;
        multiple?: boolean;
        accept?: string;
        hint?: string;
    } = $props();

    let active = $state(false);
    let files = $state<File[]>([]);
    let node: HTMLInputElement | undefined = $state();

    function onchange(e: Event) {
        files = Array.from((e.currentTarget as HTMLInputElement).files ?? []);
    }

    function ondrop(e: DragEvent) {
        e.preventDefault();
        active = false;
        if (!node || !e.dataTransfer?.files.length) return;
        const dt = new DataTransfer();
        for (const file of Array.from(e.dataTransfer.files).slice(0, multiple ? Infinity : 1)) {
            dt.items.add(file);
        }
        node.files = dt.files;
        files = Array.from(dt.files);
    }
</script>

<label
    class={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-box border-2 border-dashed p-6 text-center transition ${!active ? 'border-base-300' : ''} ${active ? 'border-primary bg-primary/5' : ''}`}
    ondragenter={() => (active = true)}
    ondragleave={() => (active = false)}
    ondragover={(e) => e.preventDefault()}
    {ondrop}
>
    <input bind:this={node} type="file" {name} {accept} {multiple} class="hidden" {onchange} />
    <span class="font-medium">
        {files.length ? files.map((f) => f.name).join(', ') : multiple ? 'ファイルをドロップ' : 'ファイルをドロップ'}
    </span>
    <span class="text-xs opacity-70">クリックして選択{hint ? ` · ${hint}` : ''}</span>
</label>

{#if allowUrls && urlName}
    <input type="url" name={urlName} placeholder="または URL を貼り付け" class="input input-bordered mt-2 w-full" />
{/if}