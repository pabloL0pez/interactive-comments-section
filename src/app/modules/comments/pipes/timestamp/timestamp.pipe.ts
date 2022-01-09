import { Pipe, PipeTransform } from '@angular/core';

const checkValues: number[] = [60, 60, 24, 7, 4, 12];
const displayValues: (string | null)[] = [null, "minute", "hour", "day", "week", "month"];

@Pipe({
    name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {

    constructor() {}

    transform(value: string): string {
        let newValue: number = Math.floor((new Date().getTime() - new Date(value).getTime()) / 1000);

        for (let i = 0 ; i < checkValues.length ; i++) {
            if (newValue >= checkValues[i]) {
                newValue = Math.floor(newValue / checkValues[i]);
            } else {
                return displayValues[i] != null ? `${newValue} ${displayValues[i]}${newValue == 1 ? '' : 's'} ago` : "just now";
            }
        }

        return `${newValue} year${newValue == 1 ? '' : 's'} ago`;
    }
}
