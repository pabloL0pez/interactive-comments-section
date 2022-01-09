import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { InteractiveComment } from '..';
import { ConfirmationDialogData } from '../../dialogs/confirmation-dialog';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import { User } from '../../users';
import { UsersService } from '../../users/services/users.service';
import { HighlightUserPipe } from '../pipes/highlight-user/highlight-user.pipe';
import { TimestampPipe } from '../pipes/timestamp/timestamp.pipe';
import { CommentsService } from '../services/comments.service';

@Component({
    selector: 'app-comment-card',
    templateUrl: './comment-card.component.html',
    styleUrls: ['./comment-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentCardComponent {

    /**
     * The comment's data.
     */
    @Input()
    comment: InteractiveComment | null = null;

    /**
     * Indicates the nesting level of the comment.
     * 
     * A nesting level indicates how deep is the comment in a comment reply chain.
     * 
     * A comment with a nesting level of 0 is a comment which is not a reply of any comment.
     */
    @Input()
    nestingLevel: number = 0;

    /**
     * Flag that indicates if the reply box is open.
     * 
     * NOTE: The client should not use this property.
     */
    _replyBoxIsOpen: boolean = false;

    /**
     * Flag that indicates if the user is editing the comment.
     * 
     * The user can only edit his own comments.
     * 
     * NOTE: The client should not use this property.
     */
    _editingComment: boolean = false;

    /**
     * The current user.
     */
    readonly currentUser$: Observable<User | null> = this.usersService.getCurrentUser();

    constructor(
        private usersService: UsersService,
        private commentsService: CommentsService,
        private changeDetectorRef: ChangeDetectorRef,
        private matDialog: MatDialog,
        public highlightUserPipe: HighlightUserPipe,
        public timestampPipe: TimestampPipe,
    ) {}

    /**
     * Opens the comment's reply box.
     */
    openReplyBox(): void {
        this._replyBoxIsOpen = true;
    }

    /**
     * Saves a new reply in the corresponding user's reply list.
     */
    saveReply(reply: string): void {
        this.commentsService.saveReply(reply, this.comment!.id).subscribe(
            result => {
                this._replyBoxIsOpen = false;
                this.changeDetectorRef.detectChanges();
            }
        );
    }

    /**
     * Updates the score of the comment.
     */
    updateScore(score: number): void {
        this.commentsService.updateCommentsScore(score, this.comment!.id).subscribe(
            result => {
                this.changeDetectorRef.detectChanges();
            }
        );
    }

    /**
     * Updates the contet of the comment.
     */
    updateComment(newComment: string): void {
        this.commentsService.updateComment(newComment, this.comment!.id).subscribe(
            result => {
                this._editingComment = false;
                this.changeDetectorRef.detectChanges();
            }
        );
    }

    /**
     * Opens a confirmation pop-up to delete a comment.
     */
    deleteComment(): void {
        const confirmationDialogData: ConfirmationDialogData = {
            title: "Delete comment",
            message: "Are you sure you want to delete this comment? This will remove the comment and can't be undone.",
            buttonConfigurations: [
                {
                    text: "NO, CANCEL",
                    color: "var(--white)",
                    backgroundColor: "var(--grayish-blue)",
                    hoverBackgroundColor: "var(--intermediate-gray)",
                },
                {
                    text: "YES, DELETE",
                    color: "var(--white)",
                    backgroundColor: "var(--soft-red)",
                    hoverBackgroundColor: "var(--pale-red)",
                }
            ],
        }

        this.matDialog.open(ConfirmationDialogComponent, {
            data: confirmationDialogData,
            width: "400px",
            panelClass: "default-dialog-panel",
        }).afterClosed().pipe(
            tap(result => {
                // If confirmed, the comment will be deleted and therefore the instance of this component, destroyed
                // So we need to mark the component to run change detection on the next cycle, otherwhise the comment will not disspear
                if (result) {
                    this.changeDetectorRef.markForCheck();
                }
            }),
            switchMap((result: boolean) => result ? this.commentsService.deleteComment(this.comment!.id) : of(null)),
        ).subscribe();
    }
}
