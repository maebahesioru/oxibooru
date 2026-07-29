type Entry<T> = { value: T; expires: number };
const store = new Map<string, Entry<unknown>>();

export async function cached<T>(key: string, ttlMs: number, factory: () => Promise<T>): Promise<T> {
    const hit = store.get(key) as Entry<T> | undefined;
    if (hit && hit.expires > Date.now()) return hit.value;
    const value = await factory();
    store.set(key, { value, expires: Date.now() + ttlMs });
    return value;
}

export function invalidate(prefix: string) {
    for (const key of store.keys()) if (key.startsWith(prefix)) store.delete(key);
}