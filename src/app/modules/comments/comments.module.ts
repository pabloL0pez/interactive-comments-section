import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ConfirmationDialogModule } from "../dialogs/confirmation-dialog/confirmation-dialog.module";
import { CommentBoxComponent } from "./comment-box/comment-box.component";
import { CommentCardComponent } from "./comment-card/comment-card.component";
import { HighlightUserPipe } from "./pipes/highlight-user/highlight-user.pipe";
import { TimestampPipe } from "./pipes/timestamp/timestamp.pipe";
import { CommentsService } from "./services/comments.service";

const components: Type<any>[] = [
    CommentCardComponent,
    CommentBoxComponent,
]

const pipes: Type<any>[] = [
    HighlightUserPipe,
    TimestampPipe,
]

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ConfirmationDialogModule,
    ],
    declarations: [...components, ...pipes],
    providers: [
        CommentsService,
        ...pipes,
    ],
    exports: components
})
export class CommentsModule {}
