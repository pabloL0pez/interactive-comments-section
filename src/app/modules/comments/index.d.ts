import { User } from "../users";

export interface InteractiveComment {
    id: number;
    content: string | null;
    createdAt: string;
    score: number;
    user: User;
    replyingTo: string | null;
    replies: InteractiveComment[];
    scoredBy: {[key: string]: number};
}

export type ButtonPosition = "aside" | "bellow";