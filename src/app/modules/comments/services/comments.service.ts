import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable, ObservableInput, of } from "rxjs";
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
                    createdAt: new Date().toString(),
                    score: 0,
                    user: user!,
                    replyingTo: null,
                    replies: [],
                    scoredBy: {},
                });

                this._commentsSource.next(comments);
                this._saveComments(comments);
            }),
        );
    }

    /**
     * Saves a new reply to the replies list of the corresponding user.
     * @param reply the reply to save
     * @param commentId the comment's id to which reply
     */
    saveReply(reply: string, commentId: number): Observable<any> {
        const comments: InteractiveComment[] = this._commentsSource.value;

        return this.usersService.getCurrentUser().pipe(
            tap(user => {
                const receiverComment: InteractiveComment | null = this._findCommentById(commentId, comments);
                
                if (receiverComment && !receiverComment?.replies) {
                    receiverComment!.replies = [];
                }

                receiverComment?.replies.push({
                    id: this._getMaxCommentId(comments) + 1,
                    content: reply,
                    createdAt: new Date().toString(),
                    score: 0,
                    user: user!,
                    replyingTo: receiverComment.user.username,
                    replies: [],
                    scoredBy: {},
                });

                this._commentsSource.next(comments);
                this._saveComments(comments);
            }),
        ); 
    }

    /**
     * Updates the score of a comment.
     * @param score the score
     * @param commentId the comment's id
     */
    updateCommentsScore(score: number, commentId: number): Observable<any> {
        const comments: InteractiveComment[] = this._commentsSource.value;

        return this.usersService.getCurrentUser().pipe(
            tap(user => {
                const commentToUpdate: InteractiveComment | null = this._findCommentById(commentId, comments);
                
                if (commentToUpdate) {
                    if (!commentToUpdate?.scoredBy) {
                        commentToUpdate!.scoredBy = {};
                    }

                    if (commentToUpdate?.scoredBy[user!.username] !== undefined) {
                        commentToUpdate!.scoredBy[user!.username] += score;
                    } else {
                        commentToUpdate!.scoredBy[user!.username] = score;
                    }

                    commentToUpdate!.score += score;
                }
                
                this._commentsSource.next(comments);
                this._saveComments(comments);
            }),
        ); 
    }

    /**
     * Updates a comment.
     * @param newComment the new comment
     * @param commentId the comment's id
     */
    updateComment(newComment: string, commentId: number): Observable<boolean> {
        const comments: InteractiveComment[] = this._commentsSource.value;
        const commentToUpdate: InteractiveComment | null = this._findCommentById(commentId, comments);
        
        if (commentToUpdate) {
            commentToUpdate.content = newComment;
            commentToUpdate.createdAt = new Date().toString();
        }
        
        this._commentsSource.next(comments);
        this._saveComments(comments);

        return of(true);
    }

    /**
     * Deletes a comment.
     * @param commentId the comment's id
     */
    deleteComment(commentId: number): Observable<boolean> {
        const comments: InteractiveComment[] = this._commentsSource.value;
        const commentFoundIn: InteractiveComment[] | null = this._findCommentsContainingCommentId(commentId, comments);
        
        if (commentFoundIn) {
            commentFoundIn.splice(commentFoundIn.findIndex(comment => comment.id == commentId), 1);
        }
        
        this._commentsSource.next(comments);
        this._saveComments(comments);

        return of(true);
    }

    /**
     * Obtains the list of comments from the source data file.
     * @returns an `Observable` with an array of `InteractiveComment` objects
     */
    private _getComments(): Observable<InteractiveComment[]> {
        return from(fetch("./assets/data.json")).pipe(
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
     * Finds a comment by it's id.
     * @param id the comment's id
     * @param comments the list of comments where to search for
     * @returns the found comment, otherwise it returns `null`
     */
    private _findCommentById(id: number, comments: InteractiveComment[] | null): InteractiveComment | null {
        // Make sure comments is iterable
        if (comments) {
            for (let comment of comments) {
                if (comment.id == id) {
                    return comment;
                }
            }
    
            for (let comment of comments) {
                const foundComment: InteractiveComment | null = this._findCommentById(id, comment.replies);

                if (foundComment) {
                    return foundComment;
                }
            }
        }
        
        return null;
    }

    /**
     * Finds an array of comments containing a comment's id.
     * @param id the comment's id
     * @param comments the list of comments where to search for
     * @returns the array of comments which contain the comment for the provided id
     */
    private _findCommentsContainingCommentId(id: number, comments: InteractiveComment[] | null): InteractiveComment[] | null {
        // Make sure comments is iterable
        if (comments) {
            for (let comment of comments) {
                if (comment.id == id) {
                    return comments;
                }
            }

            for (let comment of comments) {
                const foundComments: InteractiveComment[] | null = this._findCommentsContainingCommentId(id, comment.replies);

                if (foundComments && foundComments.length > 0) {
                    return foundComments;
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