export interface User {
    username: string;
    image: UserImage;
}

export interface UserImage {
    png: string | null;
    webp: string | null;
}
