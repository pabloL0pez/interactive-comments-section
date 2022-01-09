import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InteractiveComment } from './modules/comments';
import { CommentsService } from './modules/comments/services/comments.service';
import { User } from './modules/users';
import { UsersService } from './modules/users/services/users.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    /** The list of comments. */
    comments$: Observable<InteractiveComment[]> = this.commentsService.getComments();

    constructor(
        private commentsService: CommentsService,
    ) {}
    
    /**
     * Saves a new comment in the comment list.
     */
    saveComment(comment: string): void {
        this.commentsService.saveComment(comment).subscribe();
    }
}
