import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommentBoxComponent } from "./comment-box/comment-box.component";
import { CommentCardComponent } from "./comment-card/comment-card.component";
import { CommentsService } from "./services/comments.service";

const components: Type<any>[] = [
    CommentCardComponent,
    CommentBoxComponent,
]

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    declarations: components,
    providers: [
        CommentsService,
    ],
    exports: components
})
export class CommentsModule {}