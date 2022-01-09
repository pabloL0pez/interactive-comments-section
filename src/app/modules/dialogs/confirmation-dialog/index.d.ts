export interface ConfirmationDialogData {
    title: string;
    message: string;
    buttonConfigurations: ConfirmationDialogButtonConfiguration[];
}

export interface ConfirmationDialogButtonConfiguration {
    text: string;
    color?: string;
    backgroundColor?: string;
    hoverBackgroundColor?: string;
}