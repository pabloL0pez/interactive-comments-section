import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { MaterialModule } from "../../material.module";
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";

const components: Type<any>[] = [
    ConfirmationDialogComponent,
];

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: components,
    declarations: components,
})
export class ConfirmationDialogModule {}
