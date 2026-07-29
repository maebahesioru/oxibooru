export interface CategoryRow {
    origName: string | null;
    name: string;
    color: string;
    order?: number;
    usages: number;
    version: number;
    isDefault: boolean;
    deleted?: boolean;
}

export interface CategoryPayload {
    rows: CategoryRow[];
    defaultName: string | null;
}