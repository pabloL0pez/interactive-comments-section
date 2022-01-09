import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InteractiveComment } from '..';
import { User } from '../../users';
import { UsersService } from '../../users/services/users.service';
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
     * The client should not use this property.
     */
    _replyBoxIsOpen: boolean = false;

    /**
     * The current user.
     */
    readonly currentUser$: Observable<User | null> = this.usersService.getCurrentUser();

    constructor(
        private usersService: UsersService,
        private commentsService: CommentsService,
        private changeDetectorRef: ChangeDetectorRef,
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
        this.commentsService.saveReply(reply, <number>this.comment?.id).subscribe(
            result => {
                this._replyBoxIsOpen = false;
                this.changeDetectorRef.detectChanges();
            }
        );
    }
}
