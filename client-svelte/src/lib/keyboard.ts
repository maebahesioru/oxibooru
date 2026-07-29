export type Binding = { keys: string[]; run: (e: KeyboardEvent) => void };

const TEXT_NODES = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

function normalize(e: KeyboardEvent): string[] {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const out = [key];
    if (key === 'ArrowLeft') out.push('left');
    if (key === 'ArrowRight') out.push('right');
    if (key === 'ArrowUp') out.push('up');
    if (key === 'ArrowDown') out.push('down');
    if (key === 'Delete') out.push('del');
    if ((e.metaKey || e.ctrlKey) && key === 's') out.push('mod+s');
    return out;
}

/** グローバルショートカットを登録。入力欄フォーカス中は mod+s 以外を無効化。 */
export function shortcuts(enabled: boolean, bindings: Binding[]): () => void {
    if (!enabled) return () => {};

    const handler = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        const typing = !!target && (TEXT_NODES.has(target.tagName) || target.isContentEditable);
        const pressed = normalize(e);

        for (const binding of bindings) {
            if (!binding.keys.some((k) => pressed.includes(k))) continue;
            const isModS = binding.keys.includes('mod+s');
            if (typing && !isModS) continue;
            e.preventDefault();
            binding.run(e);
            return;
        }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
}