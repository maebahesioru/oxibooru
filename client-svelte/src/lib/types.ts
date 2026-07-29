export type Rank =
    | 'anonymous'
    | 'restricted'
    | 'regular'
    | 'power'
    | 'moderator'
    | 'administrator'
    | 'nobody';

export interface User {
    name: string;
    rank: Rank;
    email?: string | null;
    avatarUrl: string;
    avatarStyle: 'gravatar' | 'manual';
    creationTime: string;
    lastLoginTime: string;
    commentCount: number;
    favoritePostCount: number;
    uploadedPostCount: number;
    likedPostCount: number;
    dislikedPostCount: number;
    version: number;
}

export interface MicroTag {
    names: string[];
    category: string;
    usages: number;
}

export interface Tag extends MicroTag {
    description: string | null;
    suggestions: MicroTag[];
    implications: MicroTag[];
    creationTime: string;
    lastEditTime: string | null;
    version: number;
}

export interface MicroPost {
    id: number;
    thumbnailUrl: string;
}

export interface Post extends MicroPost {
    type: 'image' | 'animation' | 'video' | 'flash';
    mimeType: string;
    contentUrl: string;
    safety: 'safe' | 'sketchy' | 'unsafe';
    canvasWidth: number;
    canvasHeight: number;
    fileSize: number;
    checksumMD5: string;
    tags: MicroTag[];
    relations: MicroPost[];
    pools: MicroPool[];
    notes: Note[];
    comments: Comment[];
    flags: string[];
    source: string | null;
    description: string | null;
    score: number;
    ownScore: number;
    favoriteCount: number;
    ownFavorite: boolean;
    commentCount: number;
    hasCustomThumbnail: boolean;
    user: User | null;
    creationTime: string;
    version: number;
}

export interface Note {
    polygon: [number, number][];
    text: string;
}

export interface MicroPool {
    id: number;
    names: string[];
    category: string;
    postCount: number;
}

export interface Pool extends MicroPool {
    description: string | null;
    posts: MicroPost[];
    creationTime: string;
    version: number;
}

export interface Comment {
    id: number;
    postId: number;
    user: User | null;
    text: string;
    creationTime: string;
    lastEditTime: string | null;
    score: number;
    ownScore: number;
    version: number;
}

export interface Category {
    name: string;
    color: string;
    usages: number;
    order?: number;
    default: boolean;
    version: number;
}

export interface Paged<T> {
    query: string;
    offset: number;
    limit: number;
    total: number;
    results: T[];
}

export interface Info {
    postCount: number;
    diskUsage: number;
    serverTime: string;
    featuredPost: Post | null;
    featuringTime: string | null;
    featuringUser: User | null;
    config: {
        name: string;
        userNameRegex: string;
        passwordRegex: string;
        tagNameRegex: string;
        poolNameRegex: string;
        contactEmail: string | null;
        canSendMails: boolean;
        enableSafety: boolean;
        privileges: Record<string, Rank>;
    };
}