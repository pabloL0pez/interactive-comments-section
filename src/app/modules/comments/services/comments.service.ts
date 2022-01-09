import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable } from "rxjs";
import { map, max, switchMap, tap } from "rxjs/operators";
import { InteractiveComment } from "..";
import { UsersService } from "../../users/services/users.service";

/** Key name of the localstorage's comments object. */
const LOCALSTORAGE_COMMENTS_KEY: string = "comments";

@Injectable()
export class CommentsService {

    /** `Subject` that saves the current state of the comments list. */
    private _commentsSource: BehaviorSubject<InteractiveComment[]> = new BehaviorSubject<InteractiveComment[]>([]);

    constructor(
        private http: HttpClient,
        private usersService: UsersService,
    ) {
        const localStorageComments: string | null = localStorage.getItem(LOCALSTORAGE_COMMENTS_KEY);

        // Checks if the comments are already saved in the localstorage
        // If they are not, then the source comments file is fetched and the data is saved to the localstorage in the LOCALSTORAGE_COMMENTS_KEY
        // Otherwise, the data is loaded in memory
        if (!localStorage.getItem(LOCALSTORAGE_COMMENTS_KEY)) {
            this._getComments().pipe(
                tap(comments => {
                    this._saveComments(comments);
                    this._commentsSource.next(comments);
                }),
            ).subscribe();
        } else {
            this._commentsSource.next(JSON.parse(localStorageComments!));
        }
    }

    /**
     * Obtains the list of comments
     * @returns an `Observable` with an array of `InteractiveComment` objects
     */
    getComments(): Observable<InteractiveComment[]> {
        return this._commentsSource.asObservable();
    }

    /**
     * Saves a new comment in the comments list.
     * @param comment the comment
     */
    saveComment(comment: string): Observable<any> {
        const comments: InteractiveComment[] = this._commentsSource.value;

        return this.usersService.getCurrentUser().pipe(
            tap(user => {
                comments.push({
                    id: this._getMaxCommentId(comments) + 1,
                    content: comment,
                    createdAt: "Wed 20",
                    score: 0,
                    user: user!,
                    replyingTo: null,
                    replies: [],
                });

                this._commentsSource.next(comments);
                // this._saveComments(comments);
            }),
        );
    }

    /**
     * Saves a new reply to the replies list of the corresponding user.
     * @param reply the reply to save
     * @param commentId the id of the comment to which reply
     */
    saveReply(reply: string, commentId: number): Observable<any> {
        const comments: InteractiveComment[] = this._commentsSource.value;

        return this.usersService.getCurrentUser().pipe(
            tap(user => {
                const receiverComment: InteractiveComment | null = this._findByCommentById(commentId, comments);
                
                console.log(receiverComment, commentId);

                if (receiverComment && !receiverComment?.replies) {
                    receiverComment!.replies = [];
                }

                receiverComment?.replies.push({
                    id: this._getMaxCommentId(comments) + 1,
                    content: reply,
                    createdAt: "Wed 20",
                    score: 0,
                    user: user!,
                    replyingTo: receiverComment.user.username,
                    replies: [],
                });

                console.log(comments);

                this._commentsSource.next(comments);
                // this._saveComments(comments);
            }),
        );
            
    }

    /**
     * Obtains the list of comments from the source data file.
     * @returns an `Observable` with an array of `InteractiveComment` objects
     */
    private _getComments(): Observable<InteractiveComment[]> {
        return from(fetch("/assets/data.json")).pipe(
            switchMap(response => from(response.json())),
            map(responseJson => responseJson["comments"]),
        );
    }

    /**
     * Obtains the max id in the comments list.
     * @param comments the comments list
     * @param currentMaxId the current max id
     * @returns the max id
     */
    private _getMaxCommentId(comments: InteractiveComment[], currentMaxId: number = -1): number {
        let maxId: number = currentMaxId;

        // Make sure comments is iterable
        if (comments) {
            for (let comment of comments) {
                if (comment.id > maxId) {
                    maxId = comment.id;
                }
            }
    
            for (let comment of comments) {
                const internalId: number = this._getMaxCommentId(comment.replies, maxId);
    
                if (internalId > maxId) {
                    maxId = internalId;
                }
            }
        }
        
        return maxId;
    }

    /**
     * Finds a comment by it's id
     * @param id the comment's id
     * @param comments the list of comments where to search for
     * @returns the found comment, otherwise it returns `null`
     */
    private _findByCommentById(id: number, comments: InteractiveComment[]): InteractiveComment | null {
        // Make sure comments is iterable
        if (comments) {
            for (let comment of comments) {
                if (comment.id == id) {
                    return comment;
                }
            }
    
            for (let comment of comments) {
                const foundComment: InteractiveComment | null = this._findByCommentById(id, comment.replies);

                if (foundComment) {
                    return foundComment;
                }
            }
        }
        
        return null;
    }

    /**
     * Saves the comments to the localstorage.
     * @param comments the comments
     */
    private _saveComments(comments: InteractiveComment[]): void {
        localStorage.setItem(LOCALSTORAGE_COMMENTS_KEY, JSON.stringify(comments));
    }
}