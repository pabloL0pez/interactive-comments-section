import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
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
        this.commentEvent.emit(this.commentControl.value);
        this.commentControl.setValue(null);
    }
}
