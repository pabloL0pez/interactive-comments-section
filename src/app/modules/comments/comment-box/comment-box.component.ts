import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ButtonPosition } from '..';
import { User } from '../../users';
import { UsersService } from '../../users/services/users.service';

@Component({
    selector: 'app-comment-box',
    templateUrl: './comment-box.component.html',
    styleUrls: ['./comment-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentBoxComponent implements OnInit, AfterViewInit {

    /**
     * The text of the button.
     */
    @Input()
    buttonText: string = "SEND";

    /**
     * The initial text of the text area.
     */
    @Input()
    initialText: string = "";

    /**
     * Flag that indicates if the box should display the current user's picture.
     */
    @Input()
    showUser: boolean = true;

    /**
     * The position of the button.
     * 
     * - `aside` positions the button to the right of the text area, aligned to the top of the container
     * - `bellow` positions the button bellow the text area, aligned to the right of the container
     */
    @Input()
    buttonPosition: ButtonPosition = "aside";

    /**
     * The padding of the container
     */
    @Input()
    padding: string | null = null;

    /**
     * Event that emits the user's comment when the button is pressed.
     */
    @Output()
    commentEvent: EventEmitter<string> = new EventEmitter<string>();

    /**
     * The current user.
     */
    readonly currentUser$: Observable<User | null> = this.usersService.getCurrentUser();

    /**
     * `FormControl` that binds to the comment's reply.
     */
    readonly commentControl: FormControl = new FormControl();

    /**
     * Reference to the comment's textarea element.
     */
    @ViewChild("comment")
    readonly commentTextArea: ElementRef | null = null;

    constructor(
        private usersService: UsersService,
    ) {}

    ngOnInit(): void {
        this.commentControl.setValue(this.initialText);
    }

    ngAfterViewInit(): void {
        (<HTMLTextAreaElement>this.commentTextArea?.nativeElement).focus();
    }

    saveComment(): void {
        if (this.commentControl.value != null && this.commentControl.value.length > 0) {
            this.commentEvent.emit(this.commentControl.value);
            this.commentControl.setValue(null);
        }
    }
}
