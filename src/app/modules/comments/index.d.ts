import { User } from "../users";

export interface InteractiveComment {
    id: number;
    content: string | null;
    createdAt: string;
    score: number;
    user: User;
    replyingTo: string | null;
    replies: InteractiveComment[];
}