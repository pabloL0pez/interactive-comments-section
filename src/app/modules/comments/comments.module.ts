import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ConfirmationDialogModule } from "../dialogs/confirmation-dialog/confirmation-dialog.module";
import { CommentBoxComponent } from "./comment-box/comment-box.component";
import { CommentCardComponent } from "./comment-card/comment-card.component";
import { HighlightUserPipe } from "./pipes/highlight-user/highlight-user.pipe";
import { CommentsService } from "./services/comments.service";

const components: Type<any>[] = [
    CommentCardComponent,
    CommentBoxComponent,
    HighlightUserPipe,
]

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ConfirmationDialogModule,
    ],
    declarations: components,
    providers: [
        CommentsService,
        HighlightUserPipe,
    ],
    exports: components
})
export class CommentsModule {}
