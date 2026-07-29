import type { Api } from '$lib/server/api';
import type { Can } from '$lib/privileges';
import type { Settings } from '$lib/settings';
import type { Info, User } from '$lib/types';

declare global {
    namespace App {
        interface Locals {
            api: Api;
            info: Info;
            user: User | null;
            can: Can;
            settings: Settings;
        }
        interface Error {
            message: string;
        }
    }
}

export {};